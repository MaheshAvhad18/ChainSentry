function getHealth(req, res) {
    res.json({
        status: "OK",
        message: "ChainSentry backend is running"
    });
}

module.exports = { getHealth };