# 🔐 ChainSentry

### AI-Powered Blockchain Transaction Risk Analyzer

ChainSentry is a blockchain transaction analysis system that uses **machine learning, graph analysis, and behavioral patterns** to identify potentially suspicious wallet activity.

The project aims to analyze transaction relationships between wallets and generate a **risk score** that helps identify unusual or potentially fraudulent behavior.

> 🚧 **Project Status:** Under Development

---

## 🎯 Problem

Blockchain transactions are transparent, but analyzing large numbers of transactions manually is difficult.

Suspicious activity can involve patterns such as:

* Unusually high transaction frequency
* Sudden changes in transaction behavior
* Large abnormal transfers
* Highly connected wallets
* Circular transaction patterns
* Unusual incoming/outgoing transaction ratios

ChainSentry attempts to detect these patterns automatically and present them in an understandable way.

---

## 💡 Proposed Solution

ChainSentry combines **graph-based analysis** with **machine learning** to analyze blockchain transaction behavior.

```text
Transaction Data
       ↓
Data Processing
       ↓
Feature Extraction
       ↓
Wallet Transaction Graph
       ↓
Graph Analysis + ML
       ↓
Risk Score
       ↓
Web Dashboard
```

The system will analyze wallet behavior and classify transactions or wallets based on their estimated risk level.

---

## 🚀 Planned Features

* 📊 Transaction data analysis
* 🔗 Wallet-to-wallet transaction graph
* 🕸️ Graph-based wallet relationship analysis
* 🤖 ML-based anomaly detection
* 📈 Wallet behavior analysis
* ⚠️ Risk score generation
* 🔴 High / 🟡 Medium / 🟢 Low risk classification
* 📊 Interactive transaction visualization
* 🌐 REST API for transaction analysis
* 📁 CSV transaction dataset support

---

## 🧠 Machine Learning

The initial version will explore **unsupervised anomaly detection**.

The model will analyze behavioral features such as:

```text
Transaction frequency
Total transaction volume
Average transaction amount
Incoming transactions
Outgoing transactions
Wallet connections
Transaction time patterns
```

Anomaly detection techniques such as **Isolation Forest** will be explored for identifying unusual wallet behavior.

---

## 🕸️ Graph Analysis

Blockchain transactions can naturally be represented as a graph.

```text
        ┌──────→ Wallet B
        │
Wallet A ─────→ Wallet C
        │            │
        │            ↓
        └──────→ Wallet D
                     │
                     ↓
                  Wallet A
```

Where:

* **Nodes** represent wallets
* **Edges** represent transactions
* **Edge weights** represent transaction amounts

Graph analysis will be used to identify relationships, highly connected wallets, transaction paths, and potentially suspicious patterns.

---

## 🏗️ Architecture

```text
                    ┌─────────────────┐
                    │ Transaction Data│
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Data Processing │
                    └────────┬────────┘
                             ↓
              ┌──────────────┴──────────────┐
              ↓                             ↓
      ┌───────────────┐             ┌───────────────┐
      │ Graph Analysis│             │ ML Detection  │
      └───────┬───────┘             └───────┬───────┘
              │                             │
              └──────────────┬──────────────┘
                             ↓
                    ┌─────────────────┐
                    │   Risk Engine   │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │   Node.js API   │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Web Dashboard   │
                    └─────────────────┘
```

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js

### Machine Learning

* Python
* Scikit-learn
* Pandas
* NumPy

### Graph Analysis

* Python
* NetworkX
* Graph Algorithms

### Frontend

* HTML
* CSS
* JavaScript
* Chart.js

### Data

* CSV
* SQLite / MongoDB *(planned)*

### Development

* Git
* GitHub
* VS Code
* Linux / Windows

---

## 📁 Project Structure

```text
ChainSentry/
│
├── backend/
│   ├── src/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   └── server.js
│
├── ml/
│   ├── data/
│   ├── models/
│   ├── notebooks/
│   ├── train.py
│   └── predict.py
│
├── graph/
│   ├── graph_builder.py
│   └── analyzer.py
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── data/
│   └── transactions.csv
│
├── .gitignore
└── README.md
```

---

## 📊 Example Output

A future version of ChainSentry will provide results similar to:

```text
Wallet: 0xA91...

Risk Score: 87 / 100

Risk Level: HIGH

Detected Patterns:
✓ High transaction frequency
✓ Unusual transaction volume
✓ Strong wallet connectivity
✓ Circular transaction pattern
```

---

## 🔮 Future Improvements

* Real blockchain data integration
* Ethereum transaction support
* Web3 integration
* Real-time transaction monitoring
* Advanced graph algorithms
* Graph Neural Networks (GNN)
* Explainable AI for risk predictions
* Wallet relationship visualization
* Real-time alerts
* Blockchain explorer integration

---

## 📌 Project Goals

The main goals of ChainSentry are to:

1. Understand blockchain transaction behavior.
2. Represent transaction activity using graphs.
3. Detect abnormal wallet behavior using ML.
4. Combine graph and ML-based analysis.
5. Generate interpretable wallet risk scores.
6. Build a practical full-stack blockchain analytics system.

---

## ⚠️ Disclaimer

ChainSentry is an educational and research-oriented project.

A high risk score indicates **anomalous behavior**, not proof of illegal or fraudulent activity.

---

## 👨‍💻 Author

**Mahesh Avhad**

Computer Engineering Student at PCCoE, Pune.

GitHub: [MaheshAvhad18](https://github.com/MaheshAvhad18)

---

⭐ If you find this project interesting, consider giving it a star!
