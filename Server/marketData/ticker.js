// ticker.js
const { KiteTicker } = require("kiteconnect");
const WebSocket = require("ws");
const kiteConfig = require("../config/kiteConfig");

// Define the instrument tokens here
const instrumentTokens = [
    265, 256265, 260105, 6401, 40193, 60417, 81153, 119553, 134657, 140033, 177665, 225537, 232961,
    315393, 341249, 345089, 356865, 408065, 424961, 492033, 519937, 633601, 738561, 779521, 857857,
    884737, 895745, 897537, 912129, 969473, 1270529, 1346049, 1510401, 1850625, 2714625, 2800641, 2815745,
    2939649, 2952193, 2953217, 2977281, 3001089, 3465729, 3834113, 3861249, 4268801, 4598529, 5215745, 5582849,
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
