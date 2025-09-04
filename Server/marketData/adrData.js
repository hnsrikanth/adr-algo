const { getLast14WorkingDaysData, getTodayOpen } = require("./kite-historic-data");
const AdrData = require("../models/adrData");

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

    // Today’s open = last candle’s open
    // const marketOpen = candles[candles.length - 1][1];
    
    const instrumentToken = "256265"; // NIFTY token
    const todayOpen = await getTodayOpen(instrumentToken);
    if (!todayOpen) {
        throw new Error("Could not fetch today's open price");
    }
    
    const today = new Date().toISOString().slice(0, 10);

    // ADR levels
    const step = adrRange / 4;

    const adrValues = {
        date: today,
        // market_open: marketOpen,
        market_open: todayOpen,
        adr_high: avgHigh,
        adr_low: avgLow,
        adr_range: adrRange,
        positive_0_25: todayOpen + step * 1,
        positive_0_50: todayOpen + step * 2,
        positive_0_75: todayOpen + step * 3,
        positive_1_00: todayOpen + step * 4,
        nagative_0_25: todayOpen - step * 1,
        nagative_0_50: todayOpen - step * 2,
        nagative_0_75: todayOpen - step * 3,
        nagative_1_00: todayOpen - step * 4
    };

    const existing = await AdrData.findByPk(today);

    if (existing) {
        await AdrData.update(adrValues, { where: { date: today } });
    } else {
        await AdrData.create(adrValues);
    }

    // await AdrData.upsert(adrValues); // ✅ insert or replace
    return adrValues;
}

async function getAdrFromDb(today) {
    return AdrData.findByPk(today);
}

module.exports = { calculateAdrFromHistoric, getAdrFromDb };