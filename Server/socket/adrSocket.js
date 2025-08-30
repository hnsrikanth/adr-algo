// adrSocket.js
const WebSocket = require("ws");
const { calculateAdrFromHistoric, getAdrFromDb } = require("../marketData/adrData");

const setupAdrSocket = (server) => {
    // WebSocket server for ADR data
    const wss = new WebSocket.Server({ server, path: "/ws/adr" });

    wss.on("connection", async (ws) => {
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
    });
};

module.exports = { setupAdrSocket };
