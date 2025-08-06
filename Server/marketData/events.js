const strategyManager = require('../models/strategyManager');
const symbolManager = require('../models/symbolsManager');
const sequelize = require('../config/db'); // ✅ Sequelize instance
const { QueryTypes } = require('sequelize'); // ✅ For query types
const path = require('path');

const events = {
    updateEvents: async function (predictionData, token, imagePath) {
        const highProbabilityPredictions = predictionData.predictions.filter(
            prediction => prediction.probability >= 0.65 && prediction.tagName !== "Negative"
        );

        if (highProbabilityPredictions.length > 0) {
            const strategyId = events.getStrategyIdByStrategyName(highProbabilityPredictions[0].tagName);

            if (!strategyId) {
                console.error(`Strategy ID not found for tagName: ${highProbabilityPredictions[0].tagName}`);
                return null;
            }

            const symbolData = events.getSymbolByToken(token);
            if (symbolData) {
                const event = {
                    strategyId: strategyId,
                    symbol: symbolData.tradingsymbol,
                    token: symbolData.token,
                    accuracyPercentage: highProbabilityPredictions[0].probability * 100,
                    imgUrl: imagePath ? path.basename(imagePath) : null // Get just the file name
                };

                try {
                    console.log("Adding event to database:", event);

                    // 1. Check if an event exists for this symbol in the last 20 minutes
                    const checkQuery = `
                        SELECT COUNT(*) AS count
                        FROM "Events"
                        WHERE symbol = $1
                          AND "createdAt" >= NOW() - INTERVAL '20 minutes'
                    `;

                    const checkResult = await sequelize.query(checkQuery, {
                        bind: [event.symbol],
                        type: QueryTypes.SELECT
                    });

                    const existingEventCount = parseInt(checkResult[0].count, 10);

                    if (existingEventCount === 0) {
                        // 2. Insert the new event
                        const insertQuery = `
                            INSERT INTO "Events" ("strategyId", "token", "symbol", "accuracyPercentage", "imgUrl", "createdAt", "updatedAt")
                            VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
                            RETURNING *
                        `;

                        const [insertedEvents] = await sequelize.query(insertQuery, {
                            bind: [
                                event.strategyId,
                                event.token,
                                event.symbol,
                                event.accuracyPercentage,
                                event.imgUrl
                            ],
                            type: QueryTypes.INSERT
                        });

                        const insertedEvent = insertedEvents[0];
                        console.log("Event created successfully", insertedEvent);
                        return insertedEvent;

                    } else {
                        console.error("An event for this symbol was already created within the last 20 minutes.");
                        return null;
                    }
                } catch (error) {
                    console.error("Error adding event to database:", error.message);
                    return null;
                }
            } else {
                console.error("Symbol and token not found:", token);
                return null;
            }
        }
    },

    getSymbolByToken: function (token) {
        const symbol = symbolManager.symbols.find(s => s.token === token);
        return symbol
            ? { tradingsymbol: symbol.tradingsymbol, token: symbol.token }
            : null;
    },

    getStrategyIdByStrategyName: function (tagName) {
        const strategy = strategyManager.strategies.find(s => s.name === tagName);
        return strategy ? strategy.strategyId : null;
    }

};

module.exports = events;
