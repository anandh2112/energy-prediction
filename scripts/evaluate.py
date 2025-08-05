import matplotlib.pyplot as plt
from sklearn.metrics import mean_absolute_error
import numpy as np

def safe_mape(y_true, y_pred):
    y_true = np.array(y_true)
    y_pred = np.array(y_pred)
    
    # Avoid division by zero: only calculate MAPE where actual values are not zero
    mask = y_true != 0
    if not np.any(mask):
        return float('inf')  # All actuals are zero, can't compute MAPE

    return np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])) * 100

def evaluate(df):
    mae = mean_absolute_error(df['actual_energy'], df['corrected_prediction'])
    mape = safe_mape(df['actual_energy'], df['corrected_prediction'])

    print(f"MAE: {mae:.2f} kVAh")
    if np.isinf(mape):
        print("MAPE: Undefined (All actual values are zero)")
        print("Accuracy: Undefined")
    else:
        print(f"MAPE: {mape:.2f}%")
        print(f"Accuracy: {100 - mape:.2f}%")

    # Plotting
    plt.figure(figsize=(14, 6))
    plt.plot(df['datetime'], df['actual_energy'], label='Actual', marker='o')
    plt.plot(df['datetime'], df['corrected_prediction'], label='Corrected Forecast', marker='x')
    plt.title("Actual vs Corrected Forecast")
    plt.xlabel("Datetime")
    plt.ylabel("Energy (kVAh)")
    plt.legend()
    plt.grid(True, linestyle='--', alpha=0.5)
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()
