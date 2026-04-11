import pandas as pd
import numpy as np

def prep_data():
    file_path = "csv/jayakwadi_cleaned.csv"
    print(f"Loading dataset: {file_path}")
    df = pd.read_csv(file_path)
    
    # Check current shape
    print(f"Initial shape: {df.shape}")
    
    # Handle Dates
    # Specify the format or let pandas infer, but typical Indian dates might be dd-mm-yyyy or mm-dd-yyyy
    df['Date'] = pd.to_datetime(df['Date'], dayfirst=True)
    
    # Extract Month and Day for seasonality
    df['Month'] = df['Date'].dt.month
    df['Day'] = df['Date'].dt.day
    df['Year'] = df['Date'].dt.year
    df['DayOfYear'] = df['Date'].dt.dayofyear
    
    # Define Threshold
    # Using specific high water mark 463.90m
    if 'FRL_m' in df.columns:
        threshold = 463.90
        print(f"Using fixed threshold for Overflow Risk: {threshold} m")
        
        # Create Target Variable
        df['Is_Overflow_Risk'] = (df['Water_Level_m'] >= threshold).astype(int)
        
        risk_count = df['Is_Overflow_Risk'].sum()
        print(f"Total historical days with overflow risk (>= 98% FRL): {risk_count} days")
    else:
        print("Error: 'FRL_m' not found in columns!")
        
    # Save the intermediate processed data
    output_path = "csv/jayakwadi_step1_prepped.csv"
    df.to_csv(output_path, index=False)
    print(f"Saved step 1 processed data to {output_path}")

if __name__ == "__main__":
    prep_data()
