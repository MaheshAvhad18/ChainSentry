const path = require("path");

const projectRoot = path.join(__dirname, "..", "..", "..");

module.exports = {
    resultsPath: path.join(projectRoot, "ml", "data", "ml_results.csv"),
    transactionsPath: path.join(projectRoot, "data", "transactions.csv")
};