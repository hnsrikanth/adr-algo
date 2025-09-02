const axios = require("axios");

const KITE_PROXY_URL = "http://localhost:8080/api/orders";

/** Place a single order via proxy */
async function placeOrder(order) {
    try {
        const response = await axios.post(KITE_PROXY_URL, order);
        if (response.data.status === "success") {
            console.log(`✅ Order placed: ${order.symbol} (${order.transactionType})`);
            return response.data.order_id;
        } else {
            throw new Error(`Order failed: ${JSON.stringify(response.data)}`);
        }
    } catch (err) {
        console.error("❌ Order placement error:", err.message);
        return null;
    }
}

/** Place hedge order first, then main order */
async function placeTradeWithHedge(tradeSettings) {
    const hedge = tradeSettings.hedgePosition;
    const main = tradeSettings.mainPosition;

    // Prepare order payloads
    const hedgeOrder = {
        symbol: buildSymbol(hedge),             // convert ITM+4 etc. → actual symbol
        transactionType: hedge["Buy/Sell"].toUpperCase(),
        quantity: hedge.Qty,
        product: "MIS",                         // from globalSettings
        orderType: "MARKET"
    };

    const mainOrder = {
        symbol: buildSymbol(main),
        transactionType: main["Buy/Sell"].toUpperCase(),
        quantity: main.Qty,
        product: "MIS",
        orderType: "MARKET"
    };

    console.log("📌 Placing Hedge Order first...");
    const hedgeOrderId = await placeOrder(hedgeOrder);

    if (!hedgeOrderId) {
        console.log("❌ Hedge order failed. Skipping main order.");
        return { hedge: null, main: null };
    }

    console.log("📌 Hedge placed. Placing Main Order...");
    const mainOrderId = await placeOrder(mainOrder);

    return { hedge: hedgeOrderId, main: mainOrderId };
}
