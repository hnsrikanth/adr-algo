const axios = require("axios");
const kiteConfig = require("../config/kiteConfig");
const moment = require("moment-business-days");

// NSE Holidays (update yearly)
const NSE_HOLIDAYS = [
    "2025-01-26", "2025-03-14", "2025-03-31", "2025-04-14", "2025-05-01",
    "2025-08-15", "2025-10-02", "2025-11-04", "2025-12-25"
];

// Configure business days in moment
moment.updateLocale("en", {
    holidays: NSE_HOLIDAYS,
    holidayFormat: "YYYY-MM-DD",
});

// // Fetch holidays dynamically from NSE
// async function loadNseHolidays() {
//     try {
//         const response = await axios.get(
//             "https://www.nseindia.com/api/holiday-master?type=trading" // NSE holiday API
//         );

//         // Parse holidays (NSE returns an array of objects with date fields)
//         const holidays = response.data?.CM || []; // CM = Capital Market
//         const holidayDates = holidays.map(h => h.tradingDate); // format: "2025-01-26"

//         moment.updateLocale("en", {
//             holidays: holidayDates,
//             holidayFormat: "YYYY-MM-DD"
//         });

//         console.log("✅ NSE Holidays loaded:", holidayDates);
//         return holidayDates;
//     } catch (err) {
//         console.error("❌ Failed to fetch NSE holidays:", err.message);
//         return [];
//     }
// }

async function getLast2DaysData() {
    const config = await kiteConfig.getConfig();

    // // 🔄 Load holidays dynamically
    // await loadNseHolidays();

    // Step 1: Collect last 2 business days
    let days = [];
    let checkDay = moment().subtract(1, "day"); // start with yesterday

    while (days.length < 1) {
        if (checkDay.isBusinessDay()) {
            days.unshift(checkDay.clone()); // add to beginning
        }
        checkDay = checkDay.subtract(1, "day");
    }

    const fromDate = days[0].format("YYYY-MM-DD") + " 09:15:00";
    const toDate = moment().format("YYYY-MM-DD HH:mm:ss");

    // Example instrument token (NIFTY Index)
    const instrumentToken = "256265";

    const url = `https://api.kite.trade/instruments/historical/${instrumentToken}/5minute?from=${encodeURIComponent(fromDate)}&to=${encodeURIComponent(toDate)}`;

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
                candles: response.data.data.candles,
                range: { from: fromDate, to: toDate } // helpful for debugging
            }
        };
    } catch (err) {
        throw new Error(`Error fetching 2-day historical data: ${err.response?.data?.message || err.message}`);
    }
}

module.exports = { getLast2DaysData };