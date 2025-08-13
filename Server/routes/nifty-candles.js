// routes/nifty-candles.js
const express = require('express');
const router = express.Router();
const { KiteConnect } = require('kiteconnect');
const kiteConfig = require('../config/kiteConfig');

router.get('/nifty-2days-candles', async (req, res) => {
  const config = await kiteConfig.getConfig();
  const kc = new KiteConnect({ api_key: config.apiKey, access_token: config.accessToken });

  try {
    // API range covering last 2 trading days
    const fromDate = '2025-08-11 09:15:00';
    const toDate = '2025-08-12 15:30:00';

    // Single API call for full range
    const historicalData = await kc.getHistoricalData(
      2939649,            // NIFTY token
      '5minute',          // Interval
      fromDate,
      toDate,
      false               // Continuous false (for indices)
    );

    // Kite returns array of objects: { date, open, high, low, close, volume }
    const candles = historicalData.map(c => [
      c.date,  // ISO date
      c.open,
      c.high,
      c.low,
      c.close,
      c.volume
    ]);

    res.json({
      status: "success",
      data: { candles }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
