const { KiteTicker } = require("kiteconnect");
const WebSocket = require("ws");
const kiteConfig = require("../config/kiteConfig");

// Define the instrument tokens here
const instrumentTokens = [265, 256265, 260105];
let tickerInstance = null;
let tickCallbacks = [];

async function setupTicker(server) {
    const config = await kiteConfig.getConfig();
    const apiKey = config.apiKey;
    const accessToken = config.accessToken;
    
    // Start WebSocket server for Angular
    const wss = new WebSocket.Server({ server, path: "/ws/ticker" });
    
    // If token missing → don't crash, just inform client
    if (!apiKey || !accessToken) {
        console.warn("No access token. Ticker not started.");
        return; // stop here
    }

    tickerInstance = new KiteTicker({
        api_key: apiKey,
        access_token: accessToken,
    });

    let errorShown = false;

    wss.on("connection", (ws) => {
        console.log("Angular ticker client connected");
    });

    tickerInstance.connect();

    tickerInstance.on("connect", () => {
        console.log("Ticker connected. Subscribing to instruments...");
        tickerInstance.subscribe(instrumentTokens);
        tickerInstance.setMode(tickerInstance.modeFull, instrumentTokens); // Mode: Full, Quote, or LTP
    });

    tickerInstance.on("ticks", (ticks) => {
        // send to Angular clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(ticks));
            }
        });
       
        // also send to algo subscribers
        tickCallbacks.forEach(cb => cb(ticks));
    });

    tickerInstance.on("close", () => {
        console.log("Ticker connection closed. Reconnecting...");
        if (!errorShown) {
            setTimeout(() => tickerInstance.connect(), 5000); // small delay to avoid crash loops
        }
    });

    tickerInstance.on("error", (err) => {
        const msg = err.message || err.toString();
        console.error("Ticker error:", msg);

        // Stop retry loop if access is forbidden
        if (msg.includes("403")) {
            if (!errorShown) {
                console.error("Invalid/Expired access token. Stopping ticker retries.");
                errorShown = true;

                // Notify Angular clients once
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ error: "Invalid or expired access token" }));
                    }
                });
            }
            tickerInstance.disconnect(); // stop ticker completely
        }
    });
}

/**
 * Subscribe to live ticks inside Node (algorunner.js)
 * @param {function} callback - function(ticks)
 */
function onTicks(callback) {
    tickCallbacks.push(callback);
}

module.exports = { setupTicker, onTicks };