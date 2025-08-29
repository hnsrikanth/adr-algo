// kite-historic-data.js
const axios = require("axios");
const kiteConfig = require("../config/kiteConfig"); // your config loader
const moment = require("moment-business-days");

// Configure NSE holidays (update yearly)
const NSE_HOLIDAYS = [
  "2025-01-26", "2025-03-14", "2025-03-31", "2025-04-14", "2025-05-01",
  "2025-08-15", "2025-10-02", "2025-11-04", "2025-12-25"
];

moment.updateLocale("en", {
  holidays: NSE_HOLIDAYS,
  holidayFormat: "YYYY-MM-DD",
});

async function getLast14WorkingDaysData() {
  const config = await kiteConfig.getConfig();

  // Find the last 14 working days (excluding weekends & holidays)
  let workingDays = [];
  let date = moment().subtract(1, "day");

  while (workingDays.length < 15) {
    if (date.isBusinessDay()) {
      workingDays.unshift(date.format("YYYY-MM-DD"));
    }
    date = date.subtract(1, "days");
  }

  const fromDate = `${workingDays[0]}+09:15:00`;
  const toDate = `${workingDays[workingDays.length - 1]}+15:30:00`;

  // Replace with your actual instrument token
  const instrumentToken = "256265"; // example token

  // Build URL exactly like Postman test
  const url = `https://api.kite.trade/instruments/historical/${instrumentToken}/day?from=${fromDate}&to=${toDate}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "X-Kite-Version": "3",
        "Authorization": `token ${config.apiKey}:${config.accessToken}`
      }
    });

    return {
      status: "success",
      data: {
        candles: response.data.data.candles
      }
    };
  } catch (err) {
    throw new Error(`Error fetching historical data: ${err.response?.data?.message || err.message}`);
  }
}

module.exports = { getLast14WorkingDaysData };
