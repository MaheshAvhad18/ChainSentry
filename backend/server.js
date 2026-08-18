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
// Load ML results
// ==========================================

const resultsPath = path.join(
    __dirname,
    "..",
    "ml",
    "data",
    "ml_results.csv"
);


function loadMLResults() {

    const file = fs.readFileSync(
        resultsPath,
        "utf-8"
    );

    const lines = file
        .trim()
        .split(/\r?\n/);


    // Clean CSV headers
    const headers = lines[0]
        .split(",")
        .map(header => header.trim());


    const results = lines
        .slice(1)
        .map(line => {

            // Clean CSV values
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
// Home route
// ==========================================

app.get("/", (req, res) => {

    res.json({
        name: "ChainSentry API",
        version: "1.0.0",
        status: "running"
    });

});


// ==========================================
// Health route
// ==========================================

app.get("/api/health", (req, res) => {

    res.json({
        status: "OK",
        message: "ChainSentry backend is running"
    });

});


// ==========================================
// Get all wallets
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
// Get wallet by ID
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
// Start server
// ==========================================

app.listen(PORT, () => {

    console.log(
        `ChainSentry API running on port ${PORT}`
    );

});