import pandas as pd
from prophet import Prophet
import joblib

def train_prophet(df, save_path):
    hour_dummies = pd.get_dummies(df['hour_num'], prefix='hour')
    df_prophet = pd.concat([df[['datetime', 'energy']], hour_dummies], axis=1)
    df_prophet.rename(columns={'datetime': 'ds', 'energy': 'y'}, inplace=True)

    model = Prophet(daily_seasonality=False, weekly_seasonality=False, changepoint_prior_scale=0.3)
    for col in hour_dummies.columns:
        model.add_regressor(col)

    model.fit(df_prophet)
    joblib.dump((model, hour_dummies.columns), save_path)
    return model, hour_dummies.columns

def forecast_with_prophet(model, hour_columns, start_date, periods):
    future = model.make_future_dataframe(periods=periods, freq='h')
    future = future[future['ds'] > start_date]
    future['hour_num'] = future['ds'].dt.hour

    future_hour_dummies = pd.get_dummies(future['hour_num'], prefix='hour')
    for col in hour_columns:
        if col not in future_hour_dummies:
            future_hour_dummies[col] = 0
    future_hour_dummies = future_hour_dummies[hour_columns]

    future = pd.concat([future, future_hour_dummies], axis=1)
    forecast = model.predict(future)
    forecast = forecast[['ds', 'yhat']].copy()
    forecast.rename(columns={'ds': 'datetime', 'yhat': 'predicted_energy'}, inplace=True)
    forecast['hour'] = forecast['datetime'].dt.strftime('%H:%M:%S')
    return forecast
