import pandas as pd

from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler


# Load wallet features
data_path = "ml/data/wallet_features.csv"

data = pd.read_csv(data_path)


# Features used by the ML model
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


# Scale the features
scaler = StandardScaler()

X_scaled = scaler.fit_transform(X)


# Create Isolation Forest model
model = IsolationForest(
    n_estimators=200,
    contamination=0.25,
    random_state=42
)


# Train the model
model.fit(X_scaled)


# Predict anomalies
predictions = model.predict(X_scaled)

scores = model.decision_function(X_scaled)


# Add results
data["anomaly"] = predictions
data["anomaly_score"] = scores


# Convert Isolation Forest output
#  1  = normal
# -1  = anomaly

# Convert anomaly score into a 0-100 risk score
min_score = scores.min()
max_score = scores.max()

data["risk_score"] = (
    100 * (max_score - data["anomaly_score"])
    / (max_score - min_score)
).round(2)


# Classify risk level
def classify_risk(score):

    if score >= 70:
        return "HIGH"

    elif score >= 40:
        return "MEDIUM"

    else:
        return "LOW"


data["risk_level"] = data["risk_score"].apply(classify_risk)


# Display results
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

print(results.to_string(index=False))


# Save results
output_path = "ml/data/ml_results.csv"

data.to_csv(output_path, index=False)

print(f"\nML results saved to: {output_path}")