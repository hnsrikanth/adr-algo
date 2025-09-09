// placeRegularOrder.js
const fs = require("fs");
const path = require("path");
const kiteConfig = require("../config/kiteConfig"); // ✅ use same as ticker.js
const { buildHumanReadableSymbol } = require("../utils/symbolHelper");
const { placeOrder } = require("./kiteConnectProxy");

/** Load strategy.json */
function loadStrategyConfig() {
    const strategyPath = path.join(__dirname, "../strategy.json");
    const rawData = fs.readFileSync(strategyPath);
    return JSON.parse(rawData);
}

/** Place one order (dry-run for now) */
// async function placeSingleOrder(position, kc, globalSettings = {}, ltp) {
//     const symbol = buildHumanReadableSymbol(position, ltp);

//     const order = await kc.placeOrder(kc.VARIETY_REGULAR, {
//         exchange: kc.EXCHANGE_NFO,
//         tradingsymbol: symbol,
//         transaction_type: position["Buy/Sell"].toUpperCase(),
//         quantity: position.Qty,
//         product: kc.PRODUCT_MIS,
//         order_type: kc.ORDER_TYPE_MARKET,
//     });

//     console.log(`✅ Order Placed: ${symbol} (${position["Buy/Sell"]})`, order);
//     return order.order_id;
// }
async function placeSingleOrder(position, ltp) {
    const symbol = buildHumanReadableSymbol(position, ltp);

    const order = await placeOrder({
        exchange: "NFO",
        tradingsymbol: symbol,
        transaction_type: position["Buy/Sell"].toUpperCase(),
        quantity: position.Qty,
        product: "MIS",
        order_type: "MARKET",
    });

    console.log(`✅ Order Placed: ${symbol} (${position["Buy/Sell"]})`, order);
    return order.order_id || "TEST_ORDER_ID";
}


/** Place Hedge first, then Main */
async function placeRegularOrder(selectedStrategy = "BearCallSpread") {
    try {
        const config = loadStrategyConfig();
        const strategy = config.strategies[selectedStrategy];
        if (!strategy) throw new Error(`Strategy ${selectedStrategy} not found`);

        const trade1 = strategy.trade1;
        console.log(`▶️ Starting strategy: ${selectedStrategy}`);
        console.log("Main Position:", trade1.mainPosition);
        console.log("Hedge Position:", trade1.hedgePosition);

        // ✅ Place Hedge
        console.log("📌 Placing Hedge first...");
        const hedgeOrderId = await placeSingleOrder(trade1.hedgePosition, config.globalSettings);
        if (!hedgeOrderId) {
            console.log("❌ Hedge failed. Aborting main order.");
            return { hedge: null, main: null };
        }

        // ✅ Place Main
        console.log("📌 Hedge done. Placing Main order...");
        const mainOrderId = await placeSingleOrder(trade1.mainPosition, config.globalSettings);

        return { hedge: hedgeOrderId, main: mainOrderId };

    } catch (err) {
        console.error("❌ placeRegularOrder error:", err.message);
    }
}

// Run if called directly
if (require.main === module) {
    placeRegularOrder("BearCallSpread").then((res) => {
        console.log("Final Result:", res);
    });
}

module.exports = { placeRegularOrder };
