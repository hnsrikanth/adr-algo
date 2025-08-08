// routes/kiteRoutes.js
const express = require("express");
const router = express.Router();
const { getLast14WorkingDaysData } = require("../marketData/kite-historic-data");

router.get("/kite-historic-data", async (req, res) => {
  try {
    const result = await getLast14WorkingDaysData();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
