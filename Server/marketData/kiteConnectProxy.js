const axios = require("axios");
const { buildNiftyWeeklySymbol } = require("../utils/symbolHelper");

function buildSymbol(position, globalSettings = {}) {
    const strike = position.Strike;
    const optionType = position["CE/PE"]; // CE or PE
    const nth = parseInt(position.Expiry.replace(/[^0-9]/g, ""), 10); // e.g. "9th w" → 9

    const now = new Date();
    const year = now.getFullYear();
    const month = 8; // Sept = 8 (0-based index)

    return buildNiftyWeeklySymbol(strike, optionType, year, month, nth);
}

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

/**
 * TEMP resolution: build a symbolic "tradingsymbol" string from specs.
 * Later, replace with real resolver that converts ITM/OTM + expiry to actual NFO tradingsymbol.
 */
function buildSymbol(position, globalSettings = {}) {
    const instrument = globalSettings.instrument || "NIFTY";   // e.g., NIFTY/BANKNIFTY/FINNIFTY
    const optionType = position["CE/PE"];                      // "CE" | "PE"
    const strikeSpec = String(position.Strike).replace(/\s+/g, ""); // e.g., "ITM+4"
    const expirySpec = String(position.Expiry).replace(/\s+/g, ""); // e.g., "currentweek", "Week+1"
    // Example: NIFTY:ITM+4:PE:Week+1 -> your proxy should accept this or you swap later with a real symbol
    return `${instrument}:${strikeSpec}:${optionType}:${expirySpec}`;
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
        product: "MIS",          // ✅ Use MIS not CNC
        orderType: "MARKET"      // ✅ Use Market
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

/** Get current positions */
async function getPositions() {
    try {
        const response = await axios.get("http://localhost:8080/api/positions");
        return response.data || [];
    } catch (err) {
        console.error("❌ Error fetching positions:", err.message);
        return [];
    }
}

/** Square off order (simple market exit) */
async function squareOffOrder(position) {
    try {
        const exitOrder = {
            symbol: position.tradingsymbol,
            transactionType: position.transaction_type === "BUY" ? "SELL" : "BUY",
            quantity: Math.abs(position.quantity),
            product: position.product,
            orderType: "MARKET"
        };
        return await placeOrder(exitOrder);
    } catch (err) {
        console.error("❌ Error squaring off:", err.message);
    }
}

async function getInstrumentToken(kc, tradingsymbol) {
  const instruments = await kc.getInstruments("NFO"); // all F&O instruments
  const inst = instruments.find(i => i.tradingsymbol === tradingsymbol);
  if (!inst) throw new Error(`Instrument not found for ${tradingsymbol}`);
  return inst.instrument_token;
}

module.exports = { placeOrder, placeTradeWithHedge, buildSymbol, getPositions, squareOffOrder, getInstrumentToken };
