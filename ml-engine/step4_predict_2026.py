import pandas as pd
import joblib

def predict_2026():
    # Load the trained model and historical averages
    print("Loading the trained Machine Learning Model...")
    clf = joblib.load("overflow_rf_model.pkl")
    
    print("Loading the Historical Profile for missing 2026 data...")
    hist_avgs = pd.read_csv("csv/historical_daily_avgs.csv")
    
    # 1. Generate the completely blank 2026 calendar
    print("\nSimulating 2026 Calendar...")
    dates_2026 = pd.date_range(start="2026-01-01", end="2026-12-31")
    df_2026 = pd.DataFrame({'Date': dates_2026})
    df_2026['Month'] = df_2026['Date'].dt.month
    df_2026['Day'] = df_2026['Date'].dt.day
    df_2026['DayOfYear'] = df_2026['Date'].dt.dayofyear
    
    # 2. Merge our Historical averages to power the model features
    df_2026 = pd.merge(df_2026, hist_avgs, on='DayOfYear', how='left')
    
    # 3. Predict the Overflow Probability for each day in 2026!
    # Our features must exactly match Step 3
    features = [
        'Month', 
        'Day', 
        'DayOfYear',
        'Hist_Avg_Rainfall',
        'Hist_Avg_Inflow',
        'Hist_Avg_Storage'
    ]
    
    X_2026 = df_2026[features]
    
    print("\nPredicting Overflow Risk for 2026...")
    # predict() gives 0 or 1. predict_proba() gives % chance. Let's get both!
    df_2026['Overflow_Prediction'] = clf.predict(X_2026)
    df_2026['Overflow_Probability_%'] = clf.predict_proba(X_2026)[:, 1] * 100
    
    # Let's filter only the days where prediction tells us there is overflow!
    overflow_days = df_2026[df_2026['Overflow_Prediction'] == 1].copy()
    
    print("\n==============================================")
    print("      *** 2026 OVERFLOW FORECAST ***")
    print("==============================================\n")
    
    # 4. Extract exactly what the user asked for: Month, Number of Days, and exact Date Range
    months_names = {1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 
                    7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'}
    
    if len(overflow_days) == 0:
        print("Model predicts NO overflow incidents for 2026 based on historical seasons.")
    else:
        for month in range(1, 13):
            month_data = overflow_days[overflow_days['Month'] == month]
            if len(month_data) > 0:
                print(f"[{months_names[month].upper()}] Overflow Chance: {len(month_data)} days")
                
                # To find ranges, we check for consecutive days
                # E.g., returning: "Date Range: Nov 12 to Nov 22"
                month_data = month_data.sort_values(by='Date').reset_index(drop=True)
                
                ranges = []
                start_date = month_data.loc[0, 'Date']
                prev_date = start_date
                
                for i in range(1, len(month_data)):
                    curr_date = month_data.loc[i, 'Date']
                    # If gap is exactly 1 day, it's continuous
                    if (curr_date - prev_date).days == 1:
                        prev_date = curr_date
                    else:
                        # Gap detected, break the range
                        ranges.append(f"{start_date.strftime('%b %d')} to {prev_date.strftime('%b %d')}")
                        start_date = curr_date
                        prev_date = curr_date
                        
                # Add the final range
                ranges.append(f"{start_date.strftime('%b %d')} to {prev_date.strftime('%b %d')}")
                
                print(f" -> Date Ranges: {', '.join(ranges)}\n")

    # Save exactly the predictions to csv so you have the whole calendar
    output_path = "csv/2026_overflow_predictions.csv"
    df_2026.to_csv(output_path, index=False)
    print(f"\nFull day-by-day 2026 prediction file saved to: {output_path}")

if __name__ == "__main__":
    predict_2026()
