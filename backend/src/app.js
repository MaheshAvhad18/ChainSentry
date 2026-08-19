const express = require("express");
const cors = require("cors");

const { getHealth } = require("./controllers/healthController");
const { getAllWallets } = require("./controllers/walletController");
const walletRoutes = require("./routes/walletRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const graphRoutes = require("./routes/graphRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        name: "ChainSentry API",
        version: "1.0.0",
        status: "running"
    });
});

app.get("/api/health", getHealth);
app.get("/api/wallets", getAllWallets);
app.use("/api/wallet", walletRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/graph-analysis", graphRoutes);
app.get("/api/suspicious-wallets", require("./controllers/graphController").getSuspiciousWallets);

module.exports = app;