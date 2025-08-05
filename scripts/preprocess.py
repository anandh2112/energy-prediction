import pandas as pd
import os

def load_and_preprocess_data(historical_file):
    raw_df = pd.read_excel(historical_file, skiprows=1)
    raw_df.columns = ['date', 'hour', 'energy']
    raw_df['datetime'] = pd.to_datetime(raw_df['date'].astype(str) + ' ' + raw_df['hour'].astype(str), errors='coerce')
    raw_df['energy'] = pd.to_numeric(raw_df['energy'], errors='coerce')
    raw_df.dropna(subset=['datetime'], inplace=True)
    raw_df = raw_df[['datetime', 'energy']]

    start_time = raw_df['datetime'].min()
    end_time = raw_df['datetime'].max()
    full_range = pd.date_range(start=start_time, end=end_time, freq='h')
    full_df = pd.DataFrame({'datetime': full_range})

    merged_df = pd.merge(full_df, raw_df, on='datetime', how='left')
    merged_df['hour_num'] = merged_df['datetime'].dt.hour
    merged_df['energy'] = merged_df.groupby('hour_num')['energy'].transform(lambda x: x.fillna(x.median()))
    merged_df.dropna(subset=['energy'], inplace=True)

    merged_df['date'] = merged_df['datetime'].dt.date
    merged_df['hour'] = merged_df['datetime'].dt.strftime('%H:%M:%S')
    return merged_df


def load_and_preprocess_multiple_files(folder_path):
    combined_df = []

    for filename in os.listdir(folder_path):
        if filename.endswith(".xlsx"):
            file_path = os.path.join(folder_path, filename)
            df = pd.read_excel(file_path, skiprows=1)
            df.columns = ['date', 'hour', 'energy']
            df['datetime'] = pd.to_datetime(df['date'].astype(str) + ' ' + df['hour'].astype(str), errors='coerce')
            df['energy'] = pd.to_numeric(df['energy'], errors='coerce')
            df.dropna(subset=['datetime'], inplace=True)
            df = df[['datetime', 'energy']]
            combined_df.append(df)

    merged = pd.concat(combined_df).sort_values('datetime').reset_index(drop=True)

    start_time = merged['datetime'].min()
    end_time = merged['datetime'].max()
    full_range = pd.date_range(start=start_time, end=end_time, freq='h')
    full_df = pd.DataFrame({'datetime': full_range})

    merged_df = pd.merge(full_df, merged, on='datetime', how='left')
    merged_df['hour_num'] = merged_df['datetime'].dt.hour
    merged_df['energy'] = merged_df.groupby('hour_num')['energy'].transform(lambda x: x.fillna(x.median()))
    merged_df.dropna(subset=['energy'], inplace=True)

    merged_df['date'] = merged_df['datetime'].dt.date
    merged_df['hour'] = merged_df['datetime'].dt.strftime('%H:%M:%S')
    return merged_df


def load_actual_data(actual_file):
    actual_df = pd.read_excel(actual_file, skiprows=1)
    actual_df.columns = ['date', 'hour', 'actual_energy']
    actual_df['datetime'] = pd.to_datetime(actual_df['date'].astype(str) + ' ' + actual_df['hour'].astype(str), errors='coerce')
    actual_df['actual_energy'] = pd.to_numeric(actual_df['actual_energy'], errors='coerce')
    actual_df.dropna(subset=['datetime', 'actual_energy'], inplace=True)
    return actual_df[['datetime', 'actual_energy']]
