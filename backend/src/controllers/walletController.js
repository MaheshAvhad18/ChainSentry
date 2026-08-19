const { resultsPath, transactionsPath } = require("../config/paths");
const { loadCsv } = require("../utils/csvLoader");
const { analyzeGraph } = require("../services/graphAnalysisService");

function loadWallets() {
    return loadCsv(resultsPath);
}

function loadTransactions() {
    return loadCsv(transactionsPath);
}

function getAllWallets(req, res) {
    try {
        const wallets = loadWallets();
        res.json({ count: wallets.length, wallets });
    } catch (error) {
        console.error("Error loading wallet data:", error);
        res.status(500).json({ error: "Unable to load wallet data" });
    }
}

function getWalletById(req, res) {
    try {
        const wallet = loadWallets().find(item => item.wallet === req.params.id);

        if (!wallet) {
            return res.status(404).json({ error: "Wallet not found" });
        }

        res.json(wallet);
    } catch (error) {
        console.error("Error loading wallet data:", error);
        res.status(500).json({ error: "Unable to load wallet data" });
    }
}

function getWalletInvestigation(req, res) {
    try {
        const wallets = loadWallets();
        const transactions = loadTransactions();
        const analysis = analyzeGraph(wallets, transactions)
            .find(item => item.wallet === req.params.id);

        if (!analysis) {
            return res.status(404).json({ error: "Wallet not found" });
        }

        const walletTransactions = transactions.filter(transaction =>
            transaction.sender === req.params.id ||
            transaction.receiver === req.params.id
        );

        res.json({
            wallet: analysis.wallet,
            risk: {
                ml_score: analysis.ml_risk_score,
                graph_score: analysis.graph_suspicion_score,
                combined_score: analysis.combined_risk_score,
                level: analysis.risk_level
            },
            network: {
                incoming_transactions: analysis.incoming_transactions,
                outgoing_transactions: analysis.outgoing_transactions,
                connections: analysis.connections,
                connected_wallets: analysis.connected_wallets,
                reciprocal_wallets: analysis.reciprocal_wallets
            },
            activity: {
                total_volume: analysis.total_volume,
                large_transactions: analysis.large_transactions
            },
            suspicion_reasons: analysis.suspicion_reasons,
            transactions: walletTransactions
        });
    } catch (error) {
        console.error("Error loading wallet investigation:", error);
        res.status(500).json({ error: "Unable to load wallet investigation" });
    }
}

function getWalletTransactions(req, res) {
    try {
        const walletTransactions = loadTransactions().filter(transaction =>
            transaction.sender === req.params.id ||
            transaction.receiver === req.params.id
        );

        res.json({
            wallet: req.params.id,
            count: walletTransactions.length,
            transactions: walletTransactions
        });
    } catch (error) {
        console.error("Error loading wallet transactions:", error);
        res.status(500).json({ error: "Unable to load wallet transactions" });
    }
}

module.exports = {
    getAllWallets,
    getWalletById,
    getWalletInvestigation,
    getWalletTransactions
};