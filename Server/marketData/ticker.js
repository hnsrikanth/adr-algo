// ticker.js
const { KiteTicker } = require("kiteconnect");
const WebSocket = require("ws");
const kiteConfig = require("../config/kiteConfig");

// Define the instrument tokens here
const instrumentTokens = [
    265, 256265, 260105
];

const setupTicker = async (server) => {
    const config = await kiteConfig.getConfig();
    const apiKey = config.apiKey;
    const accessToken = config.accessToken;

    const ticker = new KiteTicker({
        api_key: apiKey,
        access_token: accessToken,
    });

    // Start WebSocket server for Angular
    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws) => {
        console.log("Angular client connected");
    });

    ticker.connect();

    ticker.on("connect", () => {
        console.log("Ticker connected. Subscribing to instruments...");
        ticker.subscribe(instrumentTokens);
        ticker.setMode(ticker.modeFull, instrumentTokens); // Mode: Full, Quote, or LTP
    });

    ticker.on("ticks", (ticks) => {
        // console.log("Ticks Data", ticks);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(ticks));
            }
        });
    });

    ticker.on("close", () => {
        console.log("Ticker connection closed. Reconnecting...");
        ticker.connect();
    });

    ticker.on("error", (err) => {
        console.error("Error in ticker:", err);
    });
};

module.exports = { setupTicker };
