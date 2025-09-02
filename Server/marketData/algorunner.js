// algorunner.js
const fs = require("fs");
const path = require("path");
const { calculateAdrFromHistoric, getAdrFromDb } = require("../marketData/adrData");
const { placeTradeWithHedge } = require("./kiteConnectProxy");

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

        //Step 1 : Get setting data from config. For Trade 1, Both main and hedge trade.
        const strategyConfig = loadStrategyConfig();

        // Example: Choose BearCallSpread -> Trade1
        const selectedStrategy = "BearCallSpread"; //we can make this dynamic
        const trade1 = strategyConfig.strategies[selectedStrategy].trade1;

        console.log(`\nSelected Strategy: ${selectedStrategy}`);
        console.log("Main Position:", trade1.mainPosition);
        console.log("Hedge Position:", trade1.hedgePosition);

        //Step 2 : Call Kite connect proxy and place the Hedge Trade first and then the main trade
        //If Hedge Trade fails, do not place the main trade

        const orderResult = await placeTradeWithHedge(trade1);
        console.log("Order Results:", orderResult);

        //The below 3 steps need to run in a loop till the trades are open
        //Keep getting the Tick data from kite and keep checking the positions
        //This loop will run only when trades are placed successfully

        //Step 3 : Monitor the trades and place the target and stop loss orders
        //Step 4 : Monitor the trades and if target or stop loss hits, square off the trades
        //Step 5 : If the trades are still open at the end of the day, square off all trades



    } catch (err) {
        console.error("AlgoRunner error:", err.message);
    }
}

/** Load strategy.json */
function loadStrategyConfig() {
    const strategyPath = path.join(__dirname, "strategy.json");
    const rawData = fs.readFileSync(strategyPath);
    return JSON.parse(rawData);
}


// Run
start();
