import sys
import json
import joblib
import pandas as pd


# ==========================================
# Load trained components
# ==========================================

MODEL_PATH = "ml/models/isolation_forest.pkl"
SCALER_PATH = "ml/models/scaler.pkl"
CONFIG_PATH = "ml/models/risk_config.pkl"


model = joblib.load(MODEL_PATH)

scaler = joblib.load(SCALER_PATH)

risk_config = joblib.load(CONFIG_PATH)


# ==========================================
# Feature order
# ==========================================

feature_columns = risk_config["feature_columns"]


# ==========================================
# Risk-score parameters
# ==========================================

min_score = risk_config["min_score"]
max_score = risk_config["max_score"]


# ==========================================
# Predict wallet risk
# ==========================================

def predict_wallet(wallet_data):

    # Create feature vector
    features = pd.DataFrame([{
        "in_degree": wallet_data["in_degree"],
        "out_degree": wallet_data["out_degree"],
        "total_transactions": wallet_data["total_transactions"],
        "total_incoming": wallet_data["total_incoming"],
        "total_outgoing": wallet_data["total_outgoing"],
        "avg_transaction": wallet_data["avg_transaction"],
        "unique_connections": wallet_data["unique_connections"]
    }])

    # Scale using the SAME scaler used during training
    scaled_features = scaler.transform(features)

    # Predict
    prediction = model.predict(scaled_features)[0]

    # Get anomaly score
    anomaly_score = model.decision_function(
        scaled_features
    )[0]

    # Convert anomaly score to 0-100 risk score
    risk_score = (
        100 * (max_score - anomaly_score)
        / (max_score - min_score)
    )

    risk_score = round(
        max(0, min(100, risk_score)),
        2
    )


    # Classify risk
    if risk_score >= 70:

        risk_level = "HIGH"

    elif risk_score >= 40:

        risk_level = "MEDIUM"

    else:

        risk_level = "LOW"


    # Return result
    return {
        "prediction": (
            "ANOMALY"
            if prediction == -1
            else "NORMAL"
        ),

        "anomaly_score": round(
            float(anomaly_score),
            4
        ),

        "risk_score": risk_score,

        "risk_level": risk_level
    }


# ==========================================
# Command-line interface
# ==========================================

if __name__ == "__main__":

    if len(sys.argv) < 2:

        print(
            "Error: wallet data is required."
        )

        sys.exit(1)


    # Read JSON input
    input_data = json.loads(
        sys.argv[1]
    )


    # Generate prediction
    result = predict_wallet(
        input_data
    )


    # Return JSON
    print(
        json.dumps(result)
    )