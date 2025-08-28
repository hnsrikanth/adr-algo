// Function to fetch market open and calculate ADR values
async function calculateAndStoreADR() {
    try {
        const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

        // Check if data for today already exists in the database
        db.get("SELECT * FROM adr_data WHERE date = ?", [today], async (err, row) => {
            if (err) {
                console.error("Error querying database:", err.message);
                return;
            }

            if (row) {
                // Data for today already exists, use it
                console.log("ADR data for today already exists:", row);
                writeADRDataToFile(row, today);
            } else {
                // Fetch market data
                const instrumentToken = "NSE:NIFTY 50"; // Replace with the correct instrument token for Nifty
                const marketData = await kc.getLTP([instrumentToken]);
                const data = marketData[instrumentToken];
                const marketOpen = data.ohlc.open;
                const high = data.high;
                const low = data.low;

                // Calculate ADR range
                const adrRange = high - low;

                // Calculate ADR values
                const adrPlus0_25 = marketOpen + 0.25 * adrRange;
                const adrPlus0_50 = marketOpen + 0.50 * adrRange;
                const adrPlus0_75 = marketOpen + 0.75 * adrRange;
                const adrPlus1_00 = marketOpen + 1.00 * adrRange;

                const adrMinus0_25 = marketOpen - 0.25 * adrRange;
                const adrMinus0_50 = marketOpen - 0.50 * adrRange;
                const adrMinus0_75 = marketOpen - 0.75 * adrRange;
                const adrMinus1_00 = marketOpen - 1.00 * adrRange;

                // Insert or replace today's data in the database
                db.run(
                    `
                    INSERT OR REPLACE INTO adr_data (
                        date, market_open, adr_plus_0_25, adr_plus_0_50, adr_plus_0_75, adr_plus_1_00,
                        adr_minus_0_25, adr_minus_0_50, adr_minus_0_75, adr_minus_1_00
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `,
                    [
                        today,
                        marketOpen,
                        adrPlus0_25,
                        adrPlus0_50,
                        adrPlus0_75,
                        adrPlus1_00,
                        adrMinus0_25,
                        adrMinus0_50,
                        adrMinus0_75,
                        adrMinus1_00,
                    ],
                    (err) => {
                        if (err) {
                            console.error("Error inserting data into database:", err.message);
                        } else {
                            console.log("ADR data for today successfully stored in the database.");
                            // Write the calculated data to ADRData.js
                            writeADRDataToFile(
                                {
                                    market_open: marketOpen,
                                    adr_plus_0_25: adrPlus0_25,
                                    adr_plus_0_50: adrPlus0_50,
                                    adr_plus_0_75: adrPlus0_75,
                                    adr_plus_1_00: adrPlus1_00,
                                    adr_minus_0_25: adrMinus0_25,
                                    adr_minus_0_50: adrMinus0_50,
                                    adr_minus_0_75: adrMinus0_75,
                                    adr_minus_1_00: adrMinus1_00,
                                },
                                today
                            );
                        }
                    }
                );
            }
        });
    } catch (error) {
        console.error("Error calculating or storing ADR data:", error.message);
    }
}

// Function to write ADR data to ADRData.js
function writeADRDataToFile(data, refreshDate) {
    const adrDataContent = `
const adrData = {
    refreshDate: "${refreshDate}",
    marketOpen: ${data.market_open},
    adrPlus0_25: ${data.adr_plus_0_25},
    adrPlus0_50: ${data.adr_plus_0_50},
    adrPlus0_75: ${data.adr_plus_0_75},
    adrPlus1_00: ${data.adr_plus_1_00},
    adrMinus0_25: ${data.adr_minus_0_25},
    adrMinus0_50: ${data.adr_minus_0_50},
    adrMinus0_75: ${data.adr_minus_0_75},
    adrMinus1_00: ${data.adr_minus_1_00}
};

module.exports = adrData;
`;

    // Write the ADR data to ADRData.js
    fs.writeFileSync("ADRData.js", adrDataContent.trim());
    console.log("ADR data successfully written to ADRData.js");
}