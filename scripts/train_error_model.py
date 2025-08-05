import os
import pandas as pd
from xgboost import XGBRegressor

# Path for the training log CSV
log_file_path = os.path.join("data", "error_training_log.csv")

def train_error_model(forecast_df, actual_df, model_save_path):
    # Merge forecast and actual
    df = pd.merge(forecast_df, actual_df, on='datetime')
    df['error'] = df['actual_energy'] - df['predicted_energy']
    df['hour'] = df['datetime'].dt.hour

    # Prepare features and target
    df['target_error'] = df['error']
    new_log = df[['datetime', 'predicted_energy', 'hour', 'target_error']]

    # === Persistent logging ===
    if os.path.exists(log_file_path):
        old_log = pd.read_csv(log_file_path, parse_dates=['datetime'])
        combined_log = pd.concat([old_log, new_log], ignore_index=True)
        combined_log.drop_duplicates(subset=['datetime'], inplace=True)
    else:
        combined_log = new_log

    # Save updated log
    combined_log.to_csv(log_file_path, index=False)

    # Train error model
    X_train = combined_log[['predicted_energy', 'hour']]
    y_train = combined_log['target_error']

    model = XGBRegressor(n_estimators=100, max_depth=3)
    model.fit(X_train, y_train)
    model.save_model(model_save_path)

    # Make corrected predictions for current data
    df['corrected_prediction'] = df['predicted_energy'] + model.predict(df[['predicted_energy', 'hour']])
    return df, model
