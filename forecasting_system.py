import os
import pandas as pd
import joblib
from xgboost import XGBRegressor
from scripts.preprocess import load_and_preprocess_multiple_files, load_actual_data
from scripts.train_base_model import train_prophet, forecast_with_prophet
from scripts.train_error_model import train_error_model
from scripts.evaluate import evaluate

# === CONFIG ===
PREDICTION_DAYS = 7  # Change to 7 if needed
data_dir = "data"
historical_folder = os.path.join(data_dir, "historical")
actual_file = os.path.join(data_dir, "actual_energy.xlsx")
models_dir = "models"
os.makedirs(data_dir, exist_ok=True)
os.makedirs(historical_folder, exist_ok=True)
os.makedirs(models_dir, exist_ok=True)

prophet_model_path = os.path.join(models_dir, "prophet_model.pkl")
xgb_model_path = os.path.join(models_dir, "xgb_model.json")

# === File Existence Checks ===
if not os.path.isdir(historical_folder) or not os.listdir(historical_folder):
    raise FileNotFoundError(f"❌ No historical files found in: {historical_folder}")
if not os.path.exists(actual_file):
    raise FileNotFoundError(f"❌ Missing file: {actual_file}")

# === MAIN EXECUTION ===
if __name__ == '__main__':
    df_hist = load_and_preprocess_multiple_files(historical_folder)
    base_model, hour_cols = train_prophet(df_hist, prophet_model_path)

    last_date = df_hist['datetime'].max()
    forecast_hours = 24 * PREDICTION_DAYS
    forecast_df = forecast_with_prophet(base_model, hour_cols, last_date, forecast_hours)

    actual_df = load_actual_data(actual_file)
    final_df, xgb_model = train_error_model(forecast_df, actual_df, xgb_model_path)
    evaluate(final_df)
