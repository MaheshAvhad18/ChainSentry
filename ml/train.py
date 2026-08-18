import pandas as pd
import joblib

from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler


# ==========================================
# 1. Load wallet features
# ==========================================

data_path = "ml/data/wallet_features.csv"

data = pd.read_csv(data_path)


# ==========================================
# 2. Select ML features
# ==========================================

feature_columns = [
    "in_degree",
    "out_degree",
    "total_transactions",
    "total_incoming",
    "total_outgoing",
    "avg_transaction",
    "unique_connections"
]

X = data[feature_columns]


# ==========================================
# 3. Scale features
# ==========================================

scaler = StandardScaler()

X_scaled = scaler.fit_transform(X)


# ==========================================
# 4. Create Isolation Forest
# ==========================================

model = IsolationForest(
    n_estimators=200,
    contamination=0.25,
    random_state=42
)


# ==========================================
# 5. Train model
# ==========================================

model.fit(X_scaled)


# ==========================================
# 6. Analyze training data
# ==========================================

predictions = model.predict(X_scaled)

scores = model.decision_function(X_scaled)


# ==========================================
# 7. Calculate risk score
# ==========================================

min_score = scores.min()
max_score = scores.max()

data["anomaly"] = predictions
data["anomaly_score"] = scores

data["risk_score"] = (
    100 * (max_score - data["anomaly_score"])
    / (max_score - min_score)
).round(2)


def classify_risk(score):

    if score >= 70:
        return "HIGH"

    elif score >= 40:
        return "MEDIUM"

    else:
        return "LOW"


data["risk_level"] = data["risk_score"].apply(classify_risk)


# ==========================================
# 8. Display results
# ==========================================

results = data[
    [
        "wallet",
        "risk_score",
        "risk_level",
        "anomaly_score"
    ]
].sort_values(
    by="risk_score",
    ascending=False
)

print("\nChainSentry ML Analysis")
print("=======================")

print(results.to_string(index=False))


# ==========================================
# 9. Save ML results
# ==========================================

output_path = "ml/data/ml_results.csv"

data.to_csv(output_path, index=False)


# ==========================================
# 10. Save trained model
# ==========================================

joblib.dump(
    model,
    "ml/models/isolation_forest.pkl"
)


# ==========================================
# 11. Save scaler
# ==========================================

joblib.dump(
    scaler,
    "ml/models/scaler.pkl"
)


# ==========================================
# 12. Save risk-score parameters
# ==========================================

risk_config = {
    "min_score": float(min_score),
    "max_score": float(max_score),
    "feature_columns": feature_columns
}

joblib.dump(
    risk_config,
    "ml/models/risk_config.pkl"
)


print("\nML training completed successfully.")

print("\nSaved files:")
print("✓ ml/data/ml_results.csv")
print("✓ ml/models/isolation_forest.pkl")
print("✓ ml/models/scaler.pkl")
print("✓ ml/models/risk_config.pkl")