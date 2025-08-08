// kite-historic-data.js
const { KiteConnect } = require("kiteconnect");
const kiteConfig = require("../config/kiteConfig"); // your existing config loader
const moment = require("moment-business-days");

// Configure NSE holidays (update yearly)
const NSE_HOLIDAYS = [
  "2025-01-26", "2025-03-14", "2025-03-31", "2025-04-14", "2025-05-01",
  "2025-08-15", "2025-10-02", "2025-11-04", "2025-12-25"
];

moment.updateLocale('en', {
  holidays: NSE_HOLIDAYS,
  holidayFormat: 'YYYY-MM-DD'
});

async function getLast14WorkingDaysData() {
  const config = await kiteConfig.getConfig();

  const kc = new KiteConnect({
    api_key: config.apiKey,
    access_token: config.accessToken // Must already be valid
  });

  // Find the last 14 working days (excludes weekends & holidays)
  let workingDays = [];
  let date = moment();

  while (workingDays.length < 14) {
    if (date.isBusinessDay()) {
      workingDays.unshift(date.format("YYYY-MM-DD"));
    }
    date = date.subtract(1, "days");
  }

  const fromDate = workingDays[0];
  const toDate = workingDays[workingDays.length - 1];

  // NIFTY 50 Instrument token (Index)
  const instrumentToken = "256265"; // Check if correct for your market segment

  try {
    const historicalData = await kc.getHistoricalData(
      instrumentToken,
      "day",
      fromDate,
      toDate,
      false // continuous
    );

    return {
      from: fromDate,
      to: toDate,
      data: historicalData
    };
  } catch (err) {
    throw new Error(`Error fetching historical data: ${err.message}`);
  }
}

module.exports = { getLast14WorkingDaysData };
