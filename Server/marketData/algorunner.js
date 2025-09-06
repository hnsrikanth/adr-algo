// algorunner.js
const fs = require("fs");
const path = require("path");
const { calculateAdrFromHistoric, getAdrFromDb } = require("../marketData/adrData");
const { placeTradeWithHedge } = require("./kiteConnectProxy");

const { getPositions, squareOffOrder } = require("./kiteConnectProxy");
const { subscribeTicks } = require("../marketData/ticker"); // new helper for ticks

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
        // Run monitoring loop only if main trade is placed
        if (orderResult.main) {
            await monitorTrades(orderResult, adrData);
        }

        //Step 4 : Monitor the trades and if target or stop loss hits, square off the trades
        //Step 5 : If the trades are still open at the end of the day, square off all trades



    } catch (err) {
        console.error("AlgoRunner error:", err.message);
    }
}

/** Load strategy.json */
function loadStrategyConfig() {
    const strategyPath = path.join(__dirname, "../strategy.json");
    const rawData = fs.readFileSync(strategyPath);
    return JSON.parse(rawData);
}

async function monitorTrades(orderResult, adrData) {
    console.log("🔍 Starting trade monitoring loop...");

    const targetPoints = adrData.adr_range * 0.5;  // Example: target = 50% ADR range
    const stopLossPoints = adrData.adr_range * 0.25;

    // Keep running until both trades closed
    let running = true;
    while (running) {
        await new Promise(r => setTimeout(r, 3000)); // poll every 3s

        const positions = await getPositions();
        const openPositions = positions.filter(p => p.quantity !== 0);

        if (openPositions.length === 0) {
            console.log("✅ All positions closed. Exiting loop.");
            running = false;
            break;
        }

        // Check ticks for current price
        const ticks = await subscribeTicks(openPositions.map(p => p.instrument_token));

        for (const pos of openPositions) {
            const ltp = ticks[pos.instrument_token]?.last_price;

            if (!ltp) continue;

            // Example condition: place target / SL
            const entry = pos.average_price;
            if (pos.transaction_type === "SELL") {
                if (ltp <= entry - targetPoints) {
                    console.log(`🎯 Target hit for ${pos.tradingsymbol}, exiting...`);
                    await squareOffOrder(pos);
                } else if (ltp >= entry + stopLossPoints) {
                    console.log(`⛔ StopLoss hit for ${pos.tradingsymbol}, exiting...`);
                    await squareOffOrder(pos);
                }
            }
        }
    }
}

// // algorunner.js
// async function startAlgo(selectedStrategy) {
//     const today = new Date().toISOString().slice(0, 10);
//     let adrData = await getAdrFromDb(today);
//     if (!adrData) adrData = await calculateAdrFromHistoric();

//     const strategyConfig = loadStrategyConfig();
//     const trade1 = strategyConfig.strategies[selectedStrategy].trade1;

//     const orderResult = await placeTradeWithHedge(trade1);
//     return { adrData, orderResult };
// }

// async function exitAllAlgo() {
//     // simple square-off all positions
//     const { getPositions, squareOffOrder } = require("./kiteConnectProxy");
//     const positions = await getPositions();
//     const exits = [];
//     for (const pos of positions.filter(p => p.quantity !== 0)) {
//         exits.push(await squareOffOrder(pos));
//     }
//     return exits;
// }

// Run
start();

module.exports = { startAlgo, exitAllAlgo };