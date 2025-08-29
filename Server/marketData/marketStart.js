const fs = require("fs");
const path = require("path");
const db = require("../config/db"); // sqlite3 connection
const kiteConfig = require("../config/kiteConfig"); // your config
const KiteConnect = require("kiteconnect").KiteConnect;

// Main function to calculate & store ADR (only once per day)
async function calculateAndStoreADR() {
    try {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        // ✅ Check if ADR for today already exists
        db.get("SELECT * FROM adr_data WHERE date = ?", [today], async (err, row) => {
            if (err) {
                console.error("❌ Error querying database:", err.message);
                return;
            }

            if (row) {
                console.log("✅ ADR data for today already exists in DB.");
                writeADRDataToFile(row, today);
                return;
            }

            // ✅ If not present → fetch from Kite
            const config = await kiteConfig.getConfig();
            const kc = new KiteConnect({ api_key: config.apiKey });
            kc.setAccessToken(config.accessToken);

            const instrumentToken = "NSE:NIFTY 50"; // Nifty spot symbol
            const marketData = await kc.getLTP([instrumentToken]);
            const data = marketData[instrumentToken];

            const marketOpen = data.ohlc.open;
            const high = data.high;
            const low = data.low;
            const adrRange = high - low;

            // ✅ ADR Levels
            const positive0_25 = marketOpen + 0.25 * adrRange;
            const positive0_50 = marketOpen + 0.50 * adrRange;
            const positive0_75 = marketOpen + 0.75 * adrRange;
            const positive1_00 = marketOpen + 1.00 * adrRange;

            const nagative0_25 = marketOpen - 0.25 * adrRange;
            const nagative0_50 = marketOpen - 0.50 * adrRange;
            const nagative0_75 = marketOpen - 0.75 * adrRange;
            const nagative1_00 = marketOpen - 1.00 * adrRange;

            // ✅ Insert today’s data
            db.run(
                `
        INSERT INTO adr_data (
          date, market_open, positive_0_25, positive_0_50, positive_0_75, positive_1_00,
          nagative_0_25, nagative_0_50, nagative_0_75, nagative_1_00
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
                [
                    today,
                    marketOpen,
                    positive0_25,
                    positive0_50,
                    positive0_75,
                    positive1_00,
                    nagative0_25,
                    nagative0_50,
                    nagative0_75,
                    nagative1_00,
                ],
                (err) => {
                    if (err) {
                        console.error("❌ Error inserting ADR data:", err.message);
                    } else {
                        console.log("✅ ADR data for today stored in DB.");
                        writeADRDataToFile(
                            {
                                market_open: marketOpen,
                                positive_0_25: positive0_25,
                                positive_0_50: positive0_50,
                                positive_0_75: positive0_75,
                                positive_1_00: positive1_00,
                                nagative_0_25: nagative0_25,
                                nagative_0_50: nagative0_50,
                                nagative_0_75: nagative0_75,
                                nagative_1_00: nagative1_00,
                            },
                            today
                        );
                    }
                }
            );
        });
    } catch (error) {
        console.error("❌ Error calculating ADR:", error.message);
    }
}

// ✅ Write ADR to ADRData.js (for frontend import)
function writeADRDataToFile(data, refreshDate) {
    const adrDataContent = `
const adrData = {
  refreshDate: "${refreshDate}",
  marketOpen: ${data.market_open},
  positive0_25: ${data.adr_plus_0_25},
  positive0_50: ${data.adr_plus_0_50},
  positive0_75: ${data.adr_plus_0_75},
  positive1_00: ${data.adr_plus_1_00},
  nagative0_25: ${data.adr_minus_0_25},
  nagative0_50: ${data.adr_minus_0_50},
  nagative0_75: ${data.adr_minus_0_75},
  nagative1_00: ${data.adr_minus_1_00}
};

module.exports = adrData;
`;

    const filePath = path.join(__dirname, "ADRData.js");
    fs.writeFileSync(filePath, adrDataContent.trim());
    console.log("✅ ADR data written to ADRData.js");
}

module.exports = { calculateAndStoreADR };
