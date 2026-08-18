const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 5000;


// ==========================================
// Middleware
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// File Paths
// ==========================================

const resultsPath = path.join(
    __dirname,
    "..",
    "ml",
    "data",
    "ml_results.csv"
);

const transactionsPath = path.join(
    __dirname,
    "..",
    "data",
    "transactions.csv"
);


// ==========================================
// Load ML Results
// ==========================================

function loadMLResults() {

    const file = fs.readFileSync(
        resultsPath,
        "utf-8"
    );

    const lines = file
        .trim()
        .split(/\r?\n/);

    const headers = lines[0]
        .split(",")
        .map(header => header.trim());

    const results = lines
        .slice(1)
        .map(line => {

            const values = line
                .split(",")
                .map(value => value.trim());

            const wallet = {};

            headers.forEach((header, index) => {

                wallet[header] = values[index];

            });

            return wallet;

        });

    return results;
}


// ==========================================
// Load Transactions
// ==========================================

function loadTransactions() {

    const file = fs.readFileSync(
        transactionsPath,
        "utf-8"
    );

    const lines = file
        .trim()
        .split(/\r?\n/);

    const headers = lines[0]
        .split(",")
        .map(header => header.trim());

    const transactions = lines
        .slice(1)
        .map(line => {

            const values = line
                .split(",")
                .map(value => value.trim());

            const transaction = {};

            headers.forEach((header, index) => {

                transaction[header] = values[index];

            });

            return transaction;

        });

    return transactions;
}


// ==========================================
// Home Route
// ==========================================

app.get("/", (req, res) => {

    res.json({

        name: "ChainSentry API",

        version: "1.0.0",

        status: "running"

    });

});


// ==========================================
// Health Route
// ==========================================

app.get("/api/health", (req, res) => {

    res.json({

        status: "OK",

        message: "ChainSentry backend is running"

    });

});


// ==========================================
// Get All Wallets
// ==========================================

app.get("/api/wallets", (req, res) => {

    try {

        const wallets = loadMLResults();

        res.json({

            count: wallets.length,

            wallets: wallets

        });

    }

    catch (error) {

        console.error(
            "Error loading wallet data:",
            error
        );

        res.status(500).json({

            error: "Unable to load wallet data"

        });

    }

});


// ==========================================
// Get Wallet By ID
// ==========================================

app.get("/api/wallet/:id", (req, res) => {

    try {

        const wallets = loadMLResults();

        const wallet = wallets.find(

            item =>
                item.wallet === req.params.id

        );

        if (!wallet) {

            return res.status(404).json({

                error: "Wallet not found"

            });

        }

        res.json(wallet);

    }

    catch (error) {

        console.error(
            "Error loading wallet data:",
            error
        );

        res.status(500).json({

            error: "Unable to load wallet data"

        });

    }

});


// ==========================================
// Get All Transactions
// ==========================================

app.get("/api/transactions", (req, res) => {

    try {

        const transactions =
            loadTransactions();

        res.json({

            count: transactions.length,

            transactions: transactions

        });

    }

    catch (error) {

        console.error(
            "Error loading transaction data:",
            error
        );

        res.status(500).json({

            error: "Unable to load transaction data"

        });

    }

});


// ==========================================
// Get Transactions For A Wallet
// ==========================================

app.get(
    "/api/wallet/:id/transactions",
    (req, res) => {

        try {

            const transactions =
                loadTransactions();

            const walletId =
                req.params.id;

            const walletTransactions =
                transactions.filter(

                    transaction =>

                        transaction.sender ===
                            walletId ||

                        transaction.receiver ===
                            walletId

                );

            res.json({

                wallet: walletId,

                count:
                    walletTransactions.length,

                transactions:
                    walletTransactions

            });

        }

        catch (error) {

            console.error(
                "Error loading wallet transactions:",
                error
            );

            res.status(500).json({

                error:
                    "Unable to load wallet transactions"

            });

        }

    }
);


// ==========================================
// Suspicious Wallet Detection
// ==========================================

app.get("/api/suspicious-wallets", (req, res) => {

    try {

        const wallets = loadMLResults();

        const transactions = loadTransactions();


        // --------------------------------------
        // Create transaction statistics
        // --------------------------------------

        const transactionStats = new Map();


        wallets.forEach(wallet => {

            transactionStats.set(

                wallet.wallet,

                {

                    largeTransactions: 0,

                    connectedWallets: new Set(),

                    highRiskConnections: new Set(),

                    totalVolume: 0

                }

            );

        });


        // --------------------------------------
        // Analyze transactions
        // --------------------------------------

        transactions.forEach(transaction => {

            const sender =
                transaction.sender;

            const receiver =
                transaction.receiver;

            const amount =
                Number(transaction.amount);


            if (
                !transactionStats.has(sender)
            ) {

                transactionStats.set(
                    sender,
                    {
                        largeTransactions: 0,
                        connectedWallets: new Set(),
                        highRiskConnections: new Set(),
                        totalVolume: 0
                    }
                );

            }


            if (
                !transactionStats.has(receiver)
            ) {

                transactionStats.set(
                    receiver,
                    {
                        largeTransactions: 0,
                        connectedWallets: new Set(),
                        highRiskConnections: new Set(),
                        totalVolume: 0
                    }
                );

            }


            const senderStats =
                transactionStats.get(sender);

            const receiverStats =
                transactionStats.get(receiver);


            // Transaction volume

            senderStats.totalVolume += amount;

            receiverStats.totalVolume += amount;


            // Wallet connections

            senderStats.connectedWallets.add(
                receiver
            );

            receiverStats.connectedWallets.add(
                sender
            );


            // Large transaction

            if (amount >= 10000) {

                senderStats.largeTransactions++;

                receiverStats.largeTransactions++;

            }

        });


        // --------------------------------------
        // Wallet lookup
        // --------------------------------------

        const walletMap = new Map();

        wallets.forEach(wallet => {

            walletMap.set(
                wallet.wallet,
                wallet
            );

        });


        // --------------------------------------
        // Detect suspicious wallets
        // --------------------------------------

        const suspiciousWallets = [];


        wallets.forEach(wallet => {

            const stats =
                transactionStats.get(
                    wallet.wallet
                );


            const riskScore =
                Number(wallet.risk_score);


            const reasons = [];


            // Signal 1: ML risk

            if (
                wallet.risk_level === "HIGH"
            ) {

                reasons.push(
                    "High ML risk level"
                );

            }

            else if (
                riskScore >= 70
            ) {

                reasons.push(
                    "High ML risk score"
                );

            }


            // Signal 2: Large transactions

            if (
                stats &&
                stats.largeTransactions > 0
            ) {

                reasons.push(
                    `${stats.largeTransactions} large transaction(s)`
                );

            }


            // Signal 3: High transaction volume

            if (
                stats &&
                stats.totalVolume >= 30000
            ) {

                reasons.push(
                    "High transaction volume"
                );

            }


            // Signal 4: High-risk connections

            if (stats) {

                stats.connectedWallets.forEach(
                    connectedWallet => {

                        const connected =
                            walletMap.get(
                                connectedWallet
                            );


                        if (
                            connected &&
                            connected.risk_level ===
                                "HIGH"
                        ) {

                            stats.highRiskConnections.add(
                                connectedWallet
                            );

                        }

                    }
                );

            }


            if (
                stats &&
                stats.highRiskConnections.size > 0
            ) {

                reasons.push(
                    `Connected to ${stats.highRiskConnections.size} high-risk wallet(s)`
                );

            }


            // ----------------------------------
            // Add wallet if suspicious
            // ----------------------------------

            if (
                reasons.length > 0
            ) {

                suspiciousWallets.push({

                    wallet:
                        wallet.wallet,

                    risk_score:
                        riskScore,

                    risk_level:
                        wallet.risk_level,

                    total_transactions:
                        Number(
                            wallet.total_transactions
                        ),

                    total_volume:
                        Number(
                            stats?.totalVolume || 0
                        ),

                    large_transactions:
                        stats?.largeTransactions || 0,

                    connections:
                        stats
                            ? stats.connectedWallets.size
                            : 0,

                    suspicion_reasons:
                        reasons

                });

            }

        });


        // --------------------------------------
        // Sort by risk score
        // --------------------------------------

        suspiciousWallets.sort(

            (a, b) =>
                b.risk_score -
                a.risk_score

        );


        res.json({

            count:
                suspiciousWallets.length,

            wallets:
                suspiciousWallets

        });

    }

    catch (error) {

        console.error(
            "Error detecting suspicious wallets:",
            error
        );

        res.status(500).json({

            error:
                "Unable to detect suspicious wallets"

        });

    }

});


// ==========================================
// Start Server
// ==========================================

app.listen(PORT, () => {

    console.log(
        `ChainSentry API running on port ${PORT}`
    );

});