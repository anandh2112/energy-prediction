import subprocess
import pandas as pd
from prophet import Prophet
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import execute_values
from xgboost import XGBRegressor
import numpy as np
import warnings
import os

warnings.filterwarnings("ignore", category=UserWarning)

# ---------------- CONFIG ---------------- #
DB_CONFIG = {
    "host": "localhost",
    "dbname": "energydb",
    "user": "postgres",
    "password": "123",
    "port": 5432
}

# Caps for logistic growth & final clipping (tune if needed)
PRED_FLOOR = 0.0
PRED_CAP = 650.0  # typical peak upper bound for your site

# ---------------- STEP 1: Run data-fetch ---------------- #
# print("Running data-fetch.py ...")
# subprocess.run(["python", "data-fetch.py"], check=True)

script_dir = os.path.dirname(os.path.abspath(__file__))
data_fetch_path = os.path.join(script_dir, "data-fetch.py")
subprocess.run(["python", data_fetch_path], check=True)

# ---------------- STEP 2: Load Data from PostgreSQL ---------------- #
conn = psycopg2.connect(**DB_CONFIG)
cursor = conn.cursor()

cursor.execute("SELECT date, hour, kvah FROM consumption_data ORDER BY date, hour;")
rows = cursor.fetchall()
df = pd.DataFrame(rows, columns=["date", "hour", "y"])

# Ensure proper datetime index
df["hour"] = df["hour"].astype(str).str.slice(0, 5)  # e.g. '08:00'
df["ds"] = pd.to_datetime(df["date"].astype(str) + " " + df["hour"])
df = df[["ds", "y"]].sort_values("ds").reset_index(drop=True)

# Robustness: drop duplicates, keep first (rare, but safe)
df = df.drop_duplicates(subset="ds", keep="first")

# ---------------- STEP 3: Calendar features (Holidays + Sunday Off) ---------------- #
# Fetch holidays from PostgreSQL
cursor.execute("SELECT date, description FROM holidays;")
holiday_rows = cursor.fetchall()
holidays_df = pd.DataFrame(holiday_rows, columns=["ds", "holiday"])
holidays_df["ds"] = pd.to_datetime(holidays_df["ds"])  # ensure datetime format

# Build Sunday 8:00 → Monday 8:00 off-hours
sundays_off = []
if len(df) > 0:
    start_hist = df["ds"].min().floor("D")
    end_hist = (df["ds"].max() + pd.Timedelta(days=7)).ceil("D")
    for d in pd.date_range(start_hist, end_hist, freq="W-SUN"):
        start = d + pd.Timedelta(hours=8)          # Sunday 08:00
        end = d + pd.Timedelta(days=1, hours=8)    # Monday 08:00
        hours_range = pd.date_range(start, end, freq="H", inclusive="left")
        for hr in hours_range:
            sundays_off.append({"ds": hr, "holiday": "sunday_off"})

sunday_df = pd.DataFrame(sundays_off)
holidays_all = pd.concat(
    [holidays_df, sunday_df],
    ignore_index=True
).drop_duplicates(subset=["ds", "holiday"])

# ---------------- STEP 4: Operational features ---------------- #
# Hour, day of week, Sunday flag
df["hour"] = df["ds"].dt.hour
df["day_of_week"] = df["ds"].dt.weekday  # Monday=0, Sunday=6
df["is_sunday"] = (df["day_of_week"] == 6).astype(int)

# Shift allocation
def get_shift(row):
    if row["is_sunday"] == 1 and row["hour"] >= 8:
        return 0   # off
    if row["is_sunday"] == 1 and row["hour"] < 8:
        return 2   # night-shift tail end
    if 8 <= row["hour"] < 20:
        return 1
    return 2

df["shift_flag"] = df.apply(get_shift, axis=1)

# Known pattern flags
df["is_lunch_hour"] = (df["hour"] == 13).astype(int)
df["is_morning_dip"] = df["hour"].isin([5, 6, 7]).astype(int)
df["is_shift_change"] = df["hour"].isin([8, 20]).astype(int)

# Extra cyclical encodings for XGB
df["hour_sin"] = np.sin(2 * np.pi * df["hour"] / 24.0)
df["hour_cos"] = np.cos(2 * np.pi * df["hour"] / 24.0)

# Prophet regressors
df["hour_of_day"] = df["hour"]
df["cap"] = PRED_CAP
df["floor"] = PRED_FLOOR

# ---------------- STEP 5: Train Prophet (with 12h seasonality + regressors) ---------------- #
m = Prophet(
    growth="logistic",
    weekly_seasonality=True,
    daily_seasonality=False,
    yearly_seasonality=False,
    holidays=holidays_all,
    seasonality_mode="additive"
)

# Sub-daily seasonality
m.add_seasonality(name="daily_24h", period=24, fourier_order=8)
m.add_seasonality(name="shift_12h", period=12, fourier_order=5)
m.add_seasonality(name="shift_cycle", period=12, fourier_order=6)

# Add operational regressors
m.add_regressor("hour_of_day")
m.add_regressor("is_lunch_hour")
m.add_regressor("is_morning_dip")
m.add_regressor("is_shift_change")

prophet_train_cols = ["ds", "y", "cap", "floor",
                      "hour_of_day", "is_lunch_hour", "is_morning_dip", "is_shift_change"]
m.fit(df[prophet_train_cols])

# ---------------- STEP 6: Residuals for XGBoost ---------------- #
forecast_history = m.predict(df[["ds", "cap", "floor", "hour_of_day",
                                 "is_lunch_hour", "is_morning_dip", "is_shift_change"]])
df["prophet_pred"] = forecast_history["yhat"].values
df["residual"] = df["y"] - df["prophet_pred"]

# Lag features
df["lag_1h"] = df["y"].shift(1)
df["lag_24h"] = df["y"].shift(24)

df_ml = df.dropna().copy()

xgb_features = [
    "hour", "day_of_week", "shift_flag", "is_sunday",
    "lag_1h", "lag_24h",
    "hour_sin", "hour_cos",
    "is_lunch_hour", "is_morning_dip", "is_shift_change"
]
X = df_ml[xgb_features]
y_resid = df_ml["residual"]

xgb_model = XGBRegressor(
    n_estimators=300,
    learning_rate=0.05,
    max_depth=4,
    subsample=0.8,
    colsample_bytree=0.8,
    reg_lambda=1.0,
    reg_alpha=0.0,
    random_state=42
)
xgb_model.fit(X, y_resid)

# ---------------- STEP 7: Predict Next Day ---------------- #
last_date = df["ds"].max().date()
next_date = last_date + timedelta(days=1)

future_dates = pd.date_range(
    start=datetime.combine(next_date, datetime.min.time()),
    periods=24,
    freq="H"
)
future_df = pd.DataFrame({"ds": future_dates})
future_df["hour"] = future_df["ds"].dt.hour
future_df["day_of_week"] = future_df["ds"].dt.weekday
future_df["is_sunday"] = (future_df["day_of_week"] == 6).astype(int)
future_df["shift_flag"] = future_df.apply(get_shift, axis=1)

# Pattern flags for future
future_df["is_lunch_hour"] = (future_df["hour"] == 13).astype(int)
future_df["is_morning_dip"] = future_df["hour"].isin([5, 6, 7]).astype(int)
future_df["is_shift_change"] = future_df["hour"].isin([8, 20]).astype(int)

future_df["hour_sin"] = np.sin(2 * np.pi * future_df["hour"] / 24.0)
future_df["hour_cos"] = np.cos(2 * np.pi * future_df["hour"] / 24.0)
future_df["hour_of_day"] = future_df["hour"]

future_df["cap"] = PRED_CAP
future_df["floor"] = PRED_FLOOR

prophet_future_cols = ["ds", "cap", "floor",
                       "hour_of_day", "is_lunch_hour", "is_morning_dip", "is_shift_change"]
prophet_forecast = m.predict(future_df[prophet_future_cols])
future_df["prophet_pred"] = prophet_forecast["yhat"].values

# Build lookup for yesterday actuals
hist = df.set_index("ds")
def safe_lookup(dt, hours=0, days=0, default=np.nan):
    key = dt - pd.Timedelta(hours=hours) - pd.Timedelta(days=days)
    try:
        return float(hist.loc[key, "y"])
    except Exception:
        return default

# Iterative roll-forward
final_preds = []
lag1_list = []
lag24_list = []

for i, dt in enumerate(future_df["ds"]):
    lag24 = safe_lookup(dt, days=1)
    if i == 0:
        lag1 = safe_lookup(dt, hours=1)
    else:
        lag1 = final_preds[-1]

    row = future_df.iloc[i]
    feats = {
        "hour": row["hour"],
        "day_of_week": row["day_of_week"],
        "shift_flag": row["shift_flag"],
        "is_sunday": row["is_sunday"],
        "lag_1h": lag1,
        "lag_24h": lag24,
        "hour_sin": row["hour_sin"],
        "hour_cos": row["hour_cos"],
        "is_lunch_hour": row["is_lunch_hour"],
        "is_morning_dip": row["is_morning_dip"],
        "is_shift_change": row["is_shift_change"],
    }
    feats_df = pd.DataFrame([feats], columns=xgb_features)

    if np.isnan(lag1) or np.isnan(lag24):
        resid_correction = 0.0
    else:
        resid_correction = float(xgb_model.predict(feats_df)[0])

    pred = future_df.loc[future_df.index[i], "prophet_pred"] + resid_correction
    pred = float(np.clip(pred, PRED_FLOOR, PRED_CAP))

    final_preds.append(pred)
    lag1_list.append(lag1)
    lag24_list.append(lag24)

future_df["lag_1h"] = lag1_list
future_df["lag_24h"] = lag24_list
future_df["predicted_kVAh"] = np.round(final_preds, 2)

# ---------------- STEP 8: Save Predictions to PostgreSQL ---------------- #
future_df["date"] = future_df["ds"].dt.date
future_df["hour_str"] = future_df["ds"].dt.strftime("%H:%M")
pred_result = future_df[["date", "hour_str", "predicted_kVAh"]].rename(columns={"hour_str": "hour"})

# Overwrite today's prediction table
cursor.execute("DROP TABLE IF EXISTS prediction;")
cursor.execute("""
CREATE TABLE prediction (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    hour VARCHAR(5) NOT NULL,
    predicted_kVAh DOUBLE PRECISION NOT NULL
);
""")
conn.commit()

values = list(pred_result.itertuples(index=False, name=None))

# Insert into prediction (latest only)
insert_query = """
INSERT INTO prediction (date, hour, predicted_kVAh)
VALUES %s;
"""
execute_values(cursor, insert_query, values)
conn.commit()

# ---------------- STEP 8B: Append to Prediction History ---------------- #
cursor.execute("""
CREATE TABLE IF NOT EXISTS prediction_history (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    hour VARCHAR(5) NOT NULL,
    predicted_kVAh DOUBLE PRECISION NOT NULL,
    UNIQUE(date, hour)
);
""")
conn.commit()

insert_hist_query = """
INSERT INTO prediction_history (date, hour, predicted_kVAh)
VALUES %s
ON CONFLICT (date, hour) DO NOTHING;
"""
execute_values(cursor, insert_hist_query, values)
conn.commit()

print(f"Inserted {len(values)} rows into 'prediction' table (latest forecast)")
print(f"Appended {len(values)} rows into 'prediction_history' table (history)")

cursor.close()
conn.close()