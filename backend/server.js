const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 5000;


// -----------------------------
// Middleware
// -----------------------------

app.use(cors());

app.use(express.json());


// -----------------------------
// Home route
// -----------------------------

app.get("/", (req, res) => {

    res.json({
        name: "ChainSentry API",
        version: "1.0.0",
        status: "running"
    });

});


// -----------------------------
// Health route
// -----------------------------

app.get("/api/health", (req, res) => {

    res.json({
        status: "OK",
        message: "ChainSentry backend is running"
    });

});


// -----------------------------
// Start server
// -----------------------------

app.listen(PORT, () => {

    console.log(
        `ChainSentry API running on port ${PORT}`
    );

});