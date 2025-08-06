const express = require('express');
const router = express.Router();
const kiteConnectProxy = require('../marketData/kiteConnectProxy'); // update the path as needed
const symbolsManager = require('../symbolsManager');
const events = require('../marketData/events');

// Helper: Find tokn by symbol name
function getTokenBySymbol(symbolName) {
    const match = symbolsManager.symbols.find(s => s.tradingsymbol === symbolName);
    return match ? match.token : null;
}

router.get('/kite-candles', async (req, res) => {
    const { symbol, interval = 'minute', from, to } = req.query;

    if (!symbol || !from || !to) {
        return res.status(400).json({ error: 'symbol, from and to are required query params' });
    }

    // Convert trading symbol (e.g., ADANIENT) to instrument token (e.g., 738561)
    const instrument = symbolsManager.symbols.find(s => s.tradingsymbol === symbol);

    if (!instrument) {
        return res.status(404).json({ error: `Instrument token not found for symbol: ${symbol}` });
    }

    try {
        const candles = await kiteConnectProxy.fetchHistoricalData(instrument.token, from, to, interval);
        res.json({ symbol, token: instrument.token, data: candles });
    } catch (error) {
        console.error('Failed to fetch candles:', error.message);
        res.status(500).json({ error: 'Could not fetch candle data' });
    }
});

module.exports = router;