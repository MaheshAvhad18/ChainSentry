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
// Graph-Based Suspicion Analysis
// ==========================================

app.get(
    "/api/graph-analysis",
    (req, res) => {

        try {

            const wallets =
                loadMLResults();

            const transactions =
                loadTransactions();


            // ==================================
            // Initialize wallet graph data
            // ==================================

            const graphData =
                new Map();


            wallets.forEach(wallet => {

                graphData.set(

                    wallet.wallet,

                    {

                        wallet:
                            wallet.wallet,

                        mlRiskScore:
                            Number(
                                wallet.risk_score
                            ),

                        mlRiskLevel:
                            wallet.risk_level,

                        incomingTransactions: 0,

                        outgoingTransactions: 0,

                        incomingVolume: 0,

                        outgoingVolume: 0,

                        connectedWallets: new Set(),

                        incomingWallets: new Set(),

                        outgoingWallets: new Set(),

                        largeTransactions: 0,

                        reciprocalTransactions: 0,

                        reciprocalWallets: new Set()

                    }

                );

            });


            // ==================================
            // Analyze transaction graph
            // ==================================

            transactions.forEach(transaction => {

                const sender =
                    transaction.sender;

                const receiver =
                    transaction.receiver;

                const amount =
                    Number(
                        transaction.amount
                    );


                if (
                    !graphData.has(sender) ||
                    !graphData.has(receiver)
                ) {

                    return;

                }


                const senderData =
                    graphData.get(sender);

                const receiverData =
                    graphData.get(receiver);


                // --------------------------------
                // Transaction counts
                // --------------------------------

                senderData.outgoingTransactions++;

                receiverData.incomingTransactions++;


                // --------------------------------
                // Transaction volume
                // --------------------------------

                senderData.outgoingVolume +=
                    amount;

                receiverData.incomingVolume +=
                    amount;


                // --------------------------------
                // Connections
                // --------------------------------

                senderData.connectedWallets.add(
                    receiver
                );

                receiverData.connectedWallets.add(
                    sender
                );


                senderData.outgoingWallets.add(
                    receiver
                );

                receiverData.incomingWallets.add(
                    sender
                );


                // --------------------------------
                // Large transaction
                // --------------------------------

                if (
                    amount >= 10000
                ) {

                    senderData.largeTransactions++;

                    receiverData.largeTransactions++;

                }

            });


            // ==================================
            // Detect reciprocal transactions
            // ==================================

            graphData.forEach(walletData => {

                walletData.outgoingWallets
                    .forEach(otherWallet => {

                        const otherData =
                            graphData.get(
                                otherWallet
                            );


                        if (
                            otherData &&
                            otherData.outgoingWallets
                                .has(
                                    walletData.wallet
                                )
                        ) {

                            walletData
                                .reciprocalWallets
                                .add(
                                    otherWallet
                                );

                        }

                    });


                walletData.reciprocalTransactions =
                    walletData
                        .reciprocalWallets
                        .size;

            });


            // ==================================
            // Calculate Graph Suspicion Score
            // ==================================

            const analysis = [];


            graphData.forEach(walletData => {

                const mlScore =
                    walletData.mlRiskScore;


                // --------------------------------
                // Large transaction signal
                // --------------------------------

                const largeTxScore =
                    Math.min(
                        100,
                        walletData
                            .largeTransactions * 25
                    );


                // --------------------------------
                // Connection signal
                // --------------------------------

                const connectionScore =
                    Math.min(
                        100,
                        walletData
                            .connectedWallets
                            .size * 15
                    );


                // --------------------------------
                // Reciprocal transfer signal
                // --------------------------------

                const reciprocalScore =
                    Math.min(
                        100,
                        walletData
                            .reciprocalTransactions * 30
                    );


                // --------------------------------
                // Volume signal
                // --------------------------------

                const totalVolume =
                    walletData.incomingVolume +
                    walletData.outgoingVolume;


                const volumeScore =
                    Math.min(
                        100,
                        (totalVolume / 50000) * 100
                    );


                // --------------------------------
                // Graph score
                // --------------------------------

                const graphScore =

                    (
                        largeTxScore * 0.30
                    ) +

                    (
                        connectionScore * 0.20
                    ) +

                    (
                        reciprocalScore * 0.30
                    ) +

                    (
                        volumeScore * 0.20
                    );


                // --------------------------------
                // Combined score
                // --------------------------------

                const combinedScore =

                    (
                        mlScore * 0.60
                    ) +

                    (
                        graphScore * 0.40
                    );


                let riskLevel = "LOW";


                if (
                    combinedScore >= 70
                ) {

                    riskLevel = "HIGH";

                }

                else if (
                    combinedScore >= 40
                ) {

                    riskLevel = "MEDIUM";

                }


                // --------------------------------
                // Suspicion reasons
                // --------------------------------

                const reasons = [];


                if (
                    mlScore >= 70
                ) {

                    reasons.push(
                        "High ML anomaly score"
                    );

                }


                if (
                    walletData
                        .largeTransactions > 0
                ) {

                    reasons.push(

                        `${walletData.largeTransactions} large transaction(s)`

                    );

                }


                if (
                    walletData
                        .reciprocalTransactions > 0
                ) {

                    reasons.push(

                        `Reciprocal transfers with ${walletData.reciprocalTransactions} wallet(s)`

                    );

                }


                if (
                    walletData
                        .connectedWallets
                        .size >= 3
                ) {

                    reasons.push(

                        "Highly connected wallet"

                    );

                }


                if (
                    totalVolume >= 30000
                ) {

                    reasons.push(

                        "High transaction volume"

                    );

                }


                analysis.push({

                    wallet:
                        walletData.wallet,

                    ml_risk_score:
                        Number(
                            mlScore.toFixed(2)
                        ),

                    graph_suspicion_score:
                        Number(
                            graphScore.toFixed(2)
                        ),

                    combined_risk_score:
                        Number(
                            combinedScore.toFixed(2)
                        ),

                    risk_level:
                        riskLevel,

                    incoming_transactions:
                        walletData
                            .incomingTransactions,

                    outgoing_transactions:
                        walletData
                            .outgoingTransactions,

                    incoming_volume:
                        Number(
                            walletData
                                .incomingVolume
                                .toFixed(2)
                        ),

                    outgoing_volume:
                        Number(
                            walletData
                                .outgoingVolume
                                .toFixed(2)
                        ),

                    connections:
                        walletData
                            .connectedWallets
                            .size,

                    large_transactions:
                        walletData
                            .largeTransactions,

                    reciprocal_wallets:
                        walletData
                            .reciprocalWallets
                            .size,

                    suspicion_reasons:
                        reasons

                });

            });


            // ==================================
            // Sort by combined risk
            // ==================================

            analysis.sort(

                (a, b) =>

                    b.combined_risk_score -
                    a.combined_risk_score

            );


            res.json({

                count:
                    analysis.length,

                wallets:
                    analysis

            });

        }

        catch (error) {

            console.error(
                "Error performing graph analysis:",
                error
            );

            res.status(500).json({

                error:
                    "Unable to perform graph analysis"

            });

        }

    }
);


// ==========================================
// Start Server
// ==========================================

app.listen(PORT, () => {

    console.log(
        `ChainSentry API running on port ${PORT}`
    );

});