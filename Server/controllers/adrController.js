// adrController.js
const { startAlgo, exitAllAlgo } = require("../marketData/algorunner");

//Start Bull / Bear run
exports.start = async (req, res) => {
    try {
        const { strategy } = req.body; // "BearCallSpread" or "BullPutSpread"
        console.log(`▶️ Starting ${strategy}...`);

        const result = await startAlgo(strategy);
        res.json({ status: "success", result });
    } catch (err) {
        console.error("❌ ADR Start error:", err.message);
        res.status(500).json({ status: "error", message: err.message });
    }
};

//Start Bull / Bear run
exports.exitAll = async (req, res) => {
    try {
        console.log("🛑 Exiting all trades...");
        const result = await exitAllAlgo();
        res.json({ status: "success", result });
    } catch (err) {
        console.error("❌ ExitAll error:", err.message);
        res.status(500).json({ status: "error", message: err.message });
    }
};