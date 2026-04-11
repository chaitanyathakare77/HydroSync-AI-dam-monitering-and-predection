import pandas as pd
import numpy as np

# We use polynomial features to learn the volume-elevation curve
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression

def clean_dataset():
    file_path = "csv/jayakwadi_with_outflow.csv"
    print(f"Loading raw dataset: {file_path}")
    df = pd.read_csv(file_path)
    
    # 1. Fill constant columns (FRL and Live Capacity)
    print("Fixing missing FRL and Live Capacity values...")
    df['FRL_m'] = df['FRL_m'].fillna(method='ffill').fillna(method='bfill')
    df['Live_Capacity_Mm3'] = df['Live_Capacity_Mm3'].fillna(method='ffill').fillna(method='bfill')
    
    # 2. Handle missing Water Level with Linear Interpolation
    print("Interpolating missing Water_Level_m...")
    df['Water_Level_m'] = df['Water_Level_m'].interpolate(method='linear')
    
    # 3. Model the relationship between Water Level and Storage to fix 0s and Nulls
    print("Learning relationship between Water_Level_m and Storage_Mm3 to replace 0s...")
    
    # Filter rows where Storage is healthy (>0.001) and not null
    valid_storage = df[(df['Storage_Mm3'].notnull()) & (df['Storage_Mm3'] > 0.001)].copy()
    
    # X = Water Level, y = Storage
    X_train = valid_storage[['Water_Level_m']]
    y_train = valid_storage['Storage_Mm3']
    
    # A dam's capacity curve is typically polynomial (Volume relates to Depth^2 or Depth^3)
    poly = PolynomialFeatures(degree=2)
    X_poly = poly.fit_transform(X_train)
    
    lin_reg = LinearRegression()
    lin_reg.fit(X_poly, y_train)
    
    # Predict all Storage_Mm3 values based on Water_Level_m
    X_all = df[['Water_Level_m']]
    X_all_poly = poly.transform(X_all)
    predicted_storage = lin_reg.predict(X_all_poly)
    
    # Prevent negative storage predicting from the regression at extreme bottom levels
    predicted_storage = np.maximum(predicted_storage, 0.0001)
    
    # Identify rows that need fixing: Nulls or 0 values (or near 0)
    needs_fix = df['Storage_Mm3'].isnull() | (df['Storage_Mm3'] <= 0.0)
    fixes_count = needs_fix.sum()
    
    # Apply the predictions only to the rows that are broken
    df.loc[needs_fix, 'Storage_Mm3'] = predicted_storage[needs_fix]
    print(f"Repaired {fixes_count} rows of Storage_Mm3 using Water Level elevation curve.")
    
    # 4. Update the related Storage_m3 column
    df['Storage_m3'] = df['Storage_Mm3'] * 1000000
    
    # 5. Delta_Storage and Outflow Nulls can be safely filled with 0 (assuming no change/no outflow)
    print("Filling remaining Outflow/Delta nulls with 0...")
    df['Delta_Storage'] = df['Delta_Storage'].fillna(0)
    df['Estimated_Outflow_m3_day'] = df['Estimated_Outflow_m3_day'].fillna(0)
    
    # Save the strictly cleaned dataset replacing the old prepped one
    output_path = "csv/jayakwadi_cleaned.csv"
    df.to_csv(output_path, index=False)
    print(f"\nDataset perfectly cleaned and saved to: {output_path}")

if __name__ == "__main__":
    clean_dataset()
