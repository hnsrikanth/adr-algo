const express = require('express');
const router = express.Router();
const trader = require('../marketData/trade'); // or wherever trade.js is located

router.post('/simulate-trade', async (req, res) => {
    try {
        const predictionData = req.body;
        const token = req.body.token || 123456; // dummy token
        await trader.trade(predictionData, token);
        res.json({ success: true, message: "Trade simulation executed" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
