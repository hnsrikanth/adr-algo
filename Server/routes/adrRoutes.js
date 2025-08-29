// routes/kiteRoutes.js
const express = require("express");
const router = express.Router();
const { calculateAdrFromHistoric, getAdrValues } = require('../marketData/adrData');

// Route to calculate ADR (once per day, or refresh if needed)
router.get('/adr', async (req, res) => {
    try {
        // If already calculated today, return cached
        if (getAdrValues().refreshDate === new Date().toISOString().slice(0, 10)) {
            return res.json(getAdrValues());
        }

        // Otherwise recalc
        const adrValues = await calculateAdrFromHistoric();
        res.json(adrValues);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
