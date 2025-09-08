// placeRegularOrder.js
const fs = require("fs");
const path = require("path");
const { KiteConnect } = require("kiteconnect");

// ✅ Load keys
const apiKey = process.env.KITE_API_KEY;
const accessToken = process.env.KITE_ACCESS_TOKEN;

const kc = new KiteConnect({ api_key: apiKey });
kc.setAccessToken(accessToken);

/** Load strategy.json */
function loadStrategyConfig() {
    const strategyPath = path.join(__dirname, "../strategy.json");
    const rawData = fs.readFileSync(strategyPath);
    return JSON.parse(rawData);
}

/** Build symbol (convert strategy leg → tradingsymbol) */
function buildSymbol(position, globalSettings = {}) {
    const instrument = globalSettings.instrument || "NIFTY";   // e.g., NIFTY/BANKNIFTY/FINNIFTY
    const optionType = position["CE/PE"];                      // "CE" | "PE"
    const strikeSpec = String(position.Strike).replace(/\s+/g, ""); // "ITM+4"
    const expirySpec = String(position.Expiry).replace(/\s+/g, ""); // "currentweek"

    // Example placeholder symbol (replace with actual NSE/NFO lookup later)
    return `${instrument}:${strikeSpec}:${optionType}:${expirySpec}`;
}

/** Place one order */
async function placeSingleOrder(position, globalSettings = {}) {
    const symbol = buildSymbol(position, globalSettings);

    try {
        const order = await kc.placeOrder(kc.VARIETY_REGULAR, {
            exchange: kc.EXCHANGE_NFO,
            tradingsymbol: symbol,                           // ✅ built dynamically
            transaction_type: position["Buy/Sell"].toUpperCase(),
            quantity: position.Qty,
            product: kc.PRODUCT_MIS,                         // intraday
            order_type: kc.ORDER_TYPE_MARKET,
        });
        console.log(`✅ Order Placed: ${symbol} (${position["Buy/Sell"]})`, order);
        return order.order_id;
    } catch (err) {
        console.error(`❌ Error placing order for ${symbol}:`, err.message);
        return null;
    }
}

/** Place Hedge first, then Main trade */
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