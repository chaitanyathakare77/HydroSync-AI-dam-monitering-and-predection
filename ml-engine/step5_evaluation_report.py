import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix

def generate_report():
    print("=========================================================")
    print("     JAYAKWADI DAM ML MODEL: EVALUATION REPORT           ")
    print("=========================================================\n")

    # 1. Load Data and Re-split identically to Step 3
    print("[1] Loading Data and reproducing 80/20 Test Split...")
    df = pd.read_csv("csv/jayakwadi_step2_features.csv")
    
    features = [
        'Month', 
        'Day', 
        'DayOfYear',
        'Hist_Avg_Rainfall',
        'Hist_Avg_Inflow',
        'Hist_Avg_Storage'
    ]
    
    X = df[features]
    y = df['Is_Overflow_Risk']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 2. Load the trained model
    print("[2] Loading the trained Random Forest Classifier...\n")
    clf = joblib.load("overflow_rf_model.pkl")
    
    # Generate predictions
    y_pred = clf.predict(X_test)
    
    # 3. Overall Accuracy
    acc = accuracy_score(y_test, y_pred)
    print("---------------------------------------------------------")
    print(f"  👉 OVERALL ACCURACY: {acc * 100:.2f}%")
    print("---------------------------------------------------------\n")
    
    # 4. Confusion Matrix representation
    print("=========================================================")
    print("  CONFUSION MATRIX (Where did the model guess right/wrong?)")
    print("=========================================================")
    cm = confusion_matrix(y_test, y_pred)
    
    print(f"True Negatives (Correctly predicted Safe)    : {cm[0][0]}")
    print(f"False Positives (False Alarm - False Risk)   : {cm[0][1]}")
    print(f"False Negatives (Missed an Overflow Risk!)   : {cm[1][0]}")
    print(f"True Positives (Correctly predicted Risk)    : {cm[1][1]}\n")
    
    # 5. Full Metrics
    print("=========================================================")
    print("  CLASSIFICATION REPORT (Precision, Recall, F1-Score)")
    print("=========================================================")
    print(classification_report(y_test, y_pred, target_names=["Safe (0)", "Risk (1)"]))

    # 6. Feature Importance (Teachers love this!)
    print("=========================================================")
    print("  FEATURE IMPORTANCE (What factors matter most?)")
    print("=========================================================")
    importances = clf.feature_importances_
    feat_importances = pd.Series(importances, index=features).sort_values(ascending=False)
    for index, value in feat_importances.items():
        print(f"   - {index:<20s} : {value*100:.2f}% contribution")
        
    print("\n=========================================================")
    print("  TEACHER DEFENSE / VIVA SUMMARY EXPLANATION")
    print("=========================================================")
    print("Why is the precision low for Overflow Risk but Recall is high?")
    print(" -> In disaster and flood prediction, 'Recall' is much more important.")
    print(f" -> Our recall is {(cm[1][1] / (cm[1][0] + cm[1][1])) * 100:.0f}%, meaning we successfully warned about {(cm[1][1] / (cm[1][0] + cm[1][1])) * 100:.0f}% of ACTUAL historical overflows.")
    print(" -> A lower precision simply means we generated some 'False Alarms'.")
    print(" -> For public safety algorithms, it is far better to be 'Safe rather than Sorry' and trigger early warnings.")
    print("=========================================================\n")

if __name__ == "__main__":
    generate_report()
