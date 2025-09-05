import requests
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import execute_values

# -------- CONFIG -------- #
BASE_URL = "https://mw.elementsenergies.com/api/hkVAhconsumption"

DB_CONFIG = {
    "host": "localhost",
    "dbname": "energydb",
    "user": "postgres",
    "password": "123",
    "port": 5432
}

IDLE_LOAD = 0   # factory off-load baseline (set to known idle kVAh if not zero)

# -------- CONNECT TO DB -------- #
conn = psycopg2.connect(**DB_CONFIG)
cursor = conn.cursor()

# -------- FIND LATEST SAVED TIMESTAMP -------- #
cursor.execute("SELECT MAX(date + hour::interval) FROM consumption_data;")
latest_ts = cursor.fetchone()[0]

# Always fetch until yesterday 23:59
yesterday = datetime.now() - timedelta(days=1)
end_date_obj = yesterday.replace(hour=23, minute=59, second=0, microsecond=0)

# Check if data is already up-to-date
if latest_ts and latest_ts >= end_date_obj:
    print("Data is already up-to-date ✅")
    cursor.close()
    conn.close()
    exit()

# Determine start date for fetching
if latest_ts:
    start_date_obj = latest_ts + timedelta(hours=1)
else:
    start_date_obj = datetime.strptime("2025-04-01 00:00", "%Y-%m-%d %H:%M")

start_date = start_date_obj.strftime("%Y-%m-%d+%H:%M")
end_date = end_date_obj.strftime("%Y-%m-%d+%H:%M")
print(f"Fetching data from {start_date} to {end_date}")

# -------- FETCH DATA -------- #
url = f"{BASE_URL}?startDateTime={start_date}&endDateTime={end_date}"
response = requests.get(url)
response.raise_for_status()
data = response.json()
consumption_data = data.get("consumptionData", {})

if not consumption_data:
    print("No new data found.")
    cursor.close()
    conn.close()
    exit()

# -------- TRANSFORM DATA -------- #
records = []
for timestamp, value in consumption_data.items():
    date_str, time_str = timestamp.split(" ")
    records.append({
        "datetime": pd.to_datetime(timestamp),
        "date": date_str,
        "hour": time_str,
        "kvah": float(value)
    })

df = pd.DataFrame(records).set_index("datetime").sort_index()

# -------- HANDLE MISSING DATA (Factory Logic) -------- #
def clean_factory_data(df, freq="H", idle_load=IDLE_LOAD):
    # Reindex to continuous hourly timeline
    full_range = pd.date_range(start=df.index.min(), end=df.index.max(), freq=freq)
    df = df.reindex(full_range)

    # Mark Sundays 8am → Mondays 8am as OFF
    mask_off = (
        (df.index.weekday == 6) & (df.index.hour >= 8) |  # Sunday after 8am
        (df.index.weekday == 0) & (df.index.hour < 8)     # Monday before 8am
    )
    df.loc[mask_off, "kvah"] = df.loc[mask_off, "kvah"].fillna(idle_load)

    # Interpolate within shifts
    df["kvah"] = df["kvah"].interpolate(method="time")

    # Handle full shift gaps using shift averages
    df["hour"] = df.index.hour
    df["shift"] = np.where((df["hour"] >= 8) & (df["hour"] < 20), "day", "night")
    df["kvah"] = df.groupby("shift")["kvah"].transform(
        lambda x: x.fillna(x.mean())
    )

    return df.drop(columns=["hour", "shift"])

df = clean_factory_data(df)

# -------- PREPARE FOR DB INSERT -------- #
df["date"] = df.index.strftime("%Y-%m-%d")
df["hour"] = df.index.strftime("%H:%M:%S")

values = [(row["date"], row["hour"], row["kvah"]) for _, row in df.iterrows()]
insert_query = """
    INSERT INTO consumption_data (date, hour, kvah)
    VALUES %s
    ON CONFLICT (date, hour) DO UPDATE SET kvah = EXCLUDED.kvah;
"""
execute_values(cursor, insert_query, values)
conn.commit()

print(f"Inserted/Updated {len(values)} rows into consumption_data ✅")

cursor.close()
conn.close()
