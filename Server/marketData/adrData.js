const { getLast14WorkingDaysData } = require("./kite-historic-data");

let refreshDate = null;
let adrValues = {
    refreshDate: null,
    marketOpen: 0,
    adrHigh: 0,
    adrLow: 0,
    adrRange: 0,
    adrPlus_25: 0,
    adrPlus_50: 0,
    adrPlus_75: 0,
    adrPlus_1: 0,
    adrMinus_25: 0,
    adrMinus_50: 0,
    adrMinus_75: 0,
    adrMinus_1: 0
};

// Calculate ADR from last 14 candles
async function calculateAdrFromHistoric() {
    const result = await getLast14WorkingDaysData();
    if (!result?.data?.candles || result.data.candles.length < 14) {
        throw new Error("Not enough candles to calculate ADR");
    }

    const candles = result.data.candles.slice(-14); // last 14
    const highs = candles.map(c => c[2]); // index 2 = high
    const lows = candles.map(c => c[3]);  // index 3 = low

    const avgHigh = highs.reduce((a, b) => a + b, 0) / highs.length;
    const avgLow = lows.reduce((a, b) => a + b, 0) / lows.length;
    const adrRange = avgHigh - avgLow;

    // Take today’s open (last candle’s open)
    const marketOpen = candles[candles.length - 1][1];

    // ADR levels
    const step = adrRange / 4;

    adrValues = {
        refreshDate: new Date().toISOString().slice(0, 10),
        marketOpen,
        adrHigh: avgHigh,
        adrLow: avgLow,
        adrRange,
        adrPlus_25: step,
        adrPlus_50: step * 2,
        adrPlus_75: step * 3,
        adrPlus_1: step * 4,
        adrMinus_25: step,
        adrMinus_50: step * 2,
        adrMinus_75: step * 3,
        adrMinus_1: step * 4
    };

    return adrValues;
}

function getAdrValues() {
    return adrValues;
}

module.exports = { calculateAdrFromHistoric, getAdrValues };
