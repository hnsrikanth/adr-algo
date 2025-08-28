// routes/kiteRoutes.js
const express = require("express");
const router = express.Router();
const { getLast2DaysData } = require("../marketData/historicTwoDaysData");

router.get("/two-days-historic-data", async(req, res) => {
    try {
        const result = await getLast2DaysData();
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;