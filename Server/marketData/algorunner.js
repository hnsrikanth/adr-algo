// algorunner.js
const { calculateAdrFromHistoric, getAdrFromDb } = require("./marketData/adrData");

async function start() {
    try {
        // 1. Get today's date
        const today = new Date().toISOString().slice(0, 10);

        // 2. Try from DB first
        let adrData = await getAdrFromDb(today);

        // 3. If not found, calculate from historic
        if (!adrData) {
            console.log("ADR not in DB, calculating...");
            adrData = await calculateAdrFromHistoric();
        }

        // 4. Now you can access like object properties
        console.log("ADR Data:");
        console.log("High:", adrData.adr_high);
        console.log("Low:", adrData.adr_low);
        console.log("Range:", adrData.adr_range);

        // Example: Use values in your algo
        if (adrData.adr_range > 20) {
            console.log("ADR range > 20 → possible breakout strategy trigger");
        } else {
            console.log("ADR range small → avoid trade");
        }

    } catch (err) {
        console.error("AlgoRunner error:", err.message);
    }
}

// Run
start();
