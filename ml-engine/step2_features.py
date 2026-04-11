import pandas as pd

def engineer_features():
    file_path = "csv/jayakwadi_step1_prepped.csv"
    print(f"Loading prepped dataset: {file_path}")
    df = pd.read_csv(file_path)
    
    # Check current shape
    print(f"Initial shape: {df.shape}")
    
    # We want to use historical trends to predict the chance of overflow.
    # We calculate the "Historical Average" for each DayOfYear (1 to 365/366).
    historical_avgs = df.groupby('DayOfYear').agg({
        'avg_rainfall': 'mean',
        'Inflow (m3/day)': 'mean',
        'Storage_Mm3': 'mean'
    }).rename(columns={
        'avg_rainfall': 'Hist_Avg_Rainfall',
        'Inflow (m3/day)': 'Hist_Avg_Inflow',
        'Storage_Mm3': 'Hist_Avg_Storage'
    }).reset_index()

    # Merge these historical averages back into our dataset
    df = pd.merge(df, historical_avgs, on='DayOfYear', how='left')

    # Now let's calculate rolling averages for the last 5 days
    # (Since our data is sorted by date chronologically)
    df = df.sort_values(by='Date')
    df['Rolling_Rainfall_5d'] = df['avg_rainfall'].rolling(window=5, min_periods=1).mean()
    df['Rolling_Inflow_5d'] = df['Inflow (m3/day)'].rolling(window=5, min_periods=1).mean()

    # Save the engineered features
    output_path = "csv/jayakwadi_step2_features.csv"
    df.to_csv(output_path, index=False)
    print(f"Engineered features successfully! Saved to: {output_path}")

    # Also, we save the historical_avgs for when we create our simulated 2026 dataset
    historical_path = "csv/historical_daily_avgs.csv"
    historical_avgs.to_csv(historical_path, index=False)
    print(f"Saved historical daily averages for the 2026 simulation to: {historical_path}")

if __name__ == "__main__":
    engineer_features()
