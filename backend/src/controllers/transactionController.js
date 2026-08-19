const { transactionsPath } = require("../config/paths");
const { loadCsv } = require("../utils/csvLoader");

function getAllTransactions(req, res) {
    try {
        const transactions = loadCsv(transactionsPath);
        res.json({ count: transactions.length, transactions });
    } catch (error) {
        console.error("Error loading transaction data:", error);
        res.status(500).json({ error: "Unable to load transaction data" });
    }
}

module.exports = { getAllTransactions };