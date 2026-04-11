import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib

def train_model():
    file_path = "csv/jayakwadi_step2_features.csv"
    print(f"Loading engineered dataset for training: {file_path}")
    df = pd.read_csv(file_path)
    
    # Define our features (X) and target (y)
    # Since we must predict 2026 completely without actual weather inputs, 
    # we ONLY train the model on the seasonal historical features we just built.
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
    
    # Split the data chronologically or randomly (we do random 80/20 for generalized learning)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print(f"Training Data Elements: {X_train.shape[0]} days")
    print(f"Testing Data Elements: {X_test.shape[0]} days")
    
    # Initialize and Train the Random Forest Classifier
    print("\nTraining Random Forest model (this takes a few seconds)...")
    clf = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
    clf.fit(X_train, y_train)
    
    # Test the model on the 20% unseen historical data
    y_pred = clf.predict(X_test)
    
    print("\n--- Model Evaluation Results ---")
    print(f"Accuracy: {accuracy_score(y_test, y_pred) * 100:.2f}%")
    print("\nDetailed Report:\n", classification_report(y_test, y_pred, target_names=["No Risk (0)", "Overflow Risk (1)"]))
    
    # Save the trained model to disk so we can use it for 2026 forecasting in the final step!
    model_path = "overflow_rf_model.pkl"
    joblib.dump(clf, model_path)
    print(f"Model successfully trained and saved to: {model_path}")

if __name__ == "__main__":
    train_model()
