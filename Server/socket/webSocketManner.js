// socketManager.js
const WebSocket = require("ws");
const { calculateAdrFromHistoric, getAdrFromDb } = require("../marketData/adrData");
const { KiteTicker } = require("kiteconnect");
const kiteConfig = require("../config/kiteConfig");

// Define the instrument tokens here
const instrumentTokens = [265, 256265, 260105];

const setupSockets = async (server) => {
    const wss = new WebSocket.Server({ noServer: true });

    // ✅ Upgrade handler to filter by path
    server.on("upgrade", (req, socket, head) => {
        if (req.url === "/ws/ticker" || req.url === "/ws/adr") {
            wss.handleUpgrade(req, socket, head, (ws) => {
                ws.path = req.url; // save which path
                wss.emit("connection", ws, req);
            });
        } else {
            socket.destroy(); // reject unknown
        }
    });

    // ✅ On connection, decide which socket to serve
    wss.on("connection", async (ws) => {
        if (ws.path === "/ws/ticker") {
            console.log("✅ Angular connected to ticker");

            try {
                const config = await kiteConfig.getConfig();
                const apiKey = config.apiKey;
                const accessToken = config.accessToken;

                // ✅ Start WebSocket server for Angular always
                const wss = new WebSocket.Server({ server, path: "/ws/ticker" });

                // If token missing → don't crash, just inform client
                if (!apiKey || !accessToken) {
                    console.warn("No access token. Ticker not started.");
                    wss.on("connection", (ws) => {
                        ws.send(JSON.stringify({ error: "Access token not generated" }));
                    });
                    return; // stop here
                }

                // ✅ Create Kite Ticker only if we have valid token
                const ticker = new KiteTicker({
                    api_key: apiKey,
                    access_token: accessToken,
                });

                wss.on("connection", (ws) => {
                    console.log("✅ Angular ticker client connected");
                });

                ticker.connect();

                ticker.on("connect", () => {
                    console.log("📡 Ticker connected. Subscribing...");
                    ticker.subscribe(instrumentTokens);
                    ticker.setMode(ticker.modeFull, instrumentTokens);
                });

                ticker.on("ticks", (ticks) => {
                    wss.clients.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify(ticks));
                        }
                    });
                });

                ticker.on("close", () => {
                    console.log("Ticker connection closed. Will retry...");
                    setTimeout(() => ticker.connect(), 5000); // small delay to avoid crash loops
                });

                ticker.on("error", (err) => {
                    console.error("Ticker error:", err.message || err);
                });
            } catch (err) {
                console.error("setupTicker failed:", err.message || err);
            }
        }

        if (ws.path === "/ws/adr") {
            console.log("📡 Angular connected to ADR socket");

            try {
                const today = new Date().toISOString().slice(0, 10);

                // 1. Try to get ADR from DB
                let adrData = await getAdrFromDb(today);

                // 2. If not in DB, calculate and store
                if (!adrData) {
                    console.log("⚠️ No ADR in DB, calculating...");
                    adrData = await calculateAdrFromHistoric();
                }

                // 3. Send ADR to Angular
                ws.send(JSON.stringify(adrData));
                console.log("📤 Sent ADR data:", adrData);

            } catch (err) {
                console.error("❌ Error in ADR socket:", err.message);
                ws.send(JSON.stringify({ error: err.message }));
            }
        }
    });
};

module.exports = { setupSockets };
