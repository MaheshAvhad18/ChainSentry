const { resultsPath, transactionsPath } = require("../config/paths");
const { loadCsv } = require("../utils/csvLoader");
const { analyzeGraph } = require("../services/graphAnalysisService");

function getGraphAnalysis(req, res) {
    try {
        const wallets = loadCsv(resultsPath);
        const transactions = loadCsv(transactionsPath);
        const analysis = analyzeGraph(wallets, transactions);

        res.json({ count: analysis.length, wallets: analysis });
    } catch (error) {
        console.error("Error performing graph analysis:", error);
        res.status(500).json({ error: "Unable to perform graph analysis" });
    }
}

function getSuspiciousWallets(req, res) {
    try {
        const wallets = loadCsv(resultsPath);
        const transactions = loadCsv(transactionsPath);
        const analysis = analyzeGraph(wallets, transactions)
            .filter(wallet => wallet.combined_risk_score >= 40)
            .map(wallet => ({
                ...wallet,
                risk_score: wallet.combined_risk_score
            }));

        res.json({ count: analysis.length, wallets: analysis });
    } catch (error) {
        console.error("Error loading suspicious wallets:", error);
        res.status(500).json({ error: "Unable to load suspicious wallets" });
    }
}

module.exports = { getGraphAnalysis, getSuspiciousWallets };