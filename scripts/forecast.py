import pandas as pd

def generate_forecast(model, hour_columns, start_date, periods):
    future = model.make_future_dataframe(periods=periods, freq='H')
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