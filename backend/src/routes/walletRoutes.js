const express = require("express");
const {
    getWalletById,
    getWalletInvestigation,
    getWalletTransactions
} = require("../controllers/walletController");

const router = express.Router();

router.get("/:id/transactions", getWalletTransactions);
router.get("/:id/investigation", getWalletInvestigation);
router.get("/:id", getWalletById);

module.exports = router;