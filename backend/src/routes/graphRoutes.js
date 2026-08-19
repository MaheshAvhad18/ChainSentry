const express = require("express");
const {
	getGraphAnalysis,
	getSuspiciousWallets
} = require("../controllers/graphController");

const router = express.Router();

router.get("/", getGraphAnalysis);
router.get("/suspicious", getSuspiciousWallets);

module.exports = router;