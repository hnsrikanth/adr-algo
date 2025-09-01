const axios = require("axios");
const kiteConfig = require("../config/kiteConfig");
const express = require("express");
const router = express.Router();
const { calculateAdrFromHistoric, getAdrFromDb } = require("../marketData/adrData");

// ✅ POST: Calculate & Store ADR
router.post("/adr", async (req, res) => {
    try {
        const adrValues = await calculateAdrFromHistoric();
        res.json({ success: true, adr: adrValues });
    } catch (err) {
        console.error("ADR calculation failed:", err);
        res.status(500).json({ error: err.message });
    }
});

router.get("/adr", async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10);

        // 1. Try to get from DB
        const dbRow = await getAdrFromDb(today);
        if (dbRow) {
            return res.json(dbRow);
        }

        // 2. If not in DB → calculate and insert
        const adrValues = await calculateAdrFromHistoric();
        res.json(adrValues);

    } catch (err) {
        console.error("Error fetching ADR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;