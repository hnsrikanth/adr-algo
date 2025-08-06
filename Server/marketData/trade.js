const axios = require('axios');
const strategyManager = require('../models/strategyManager');
const symbolManager = require('../models/symbolsManager');
const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');
const OptionStrategy = require('../config/OptionStrategy');
const kiteConfig = require("../config/kiteConfig");
const riskManager = require('../config/riskManager');

const trade = {
    trade: async function (predictionData, token, event) {
        const riskPassed = await riskManager.isRiskAllowed();
        console.log("Risk check result:", riskPassed);
        if (!riskPassed) {
            console.log("Risk check failed. Aborting trade.");
            return;
        }

        const highProbabilityPredictions = predictionData.predictions.filter(
            prediction => prediction.probability >= 0.8 && prediction.tagName !== 'Negative'
        );

        console.log("High probability predictions:", highProbabilityPredictions);

        if (highProbabilityPredictions.length === 0) {
            console.log("No strong predictions.");
            return;
        }

        const prediction = highProbabilityPredictions[0];
        console.log("Selected prediction:", prediction);

        // if strategy.gainDirection is 'Long', we will buy the call option
        // if strategy.gainDirection is 'Short', we will buy the put option
        const strategyId = this.getStrategyIdByStrategyName(prediction.tagName);
        console.log("Strategy ID:", strategyId);

        const symbolData = this.getSymbolByToken(token);
        console.log("Symbol data:", symbolData);

        if (!strategyId || !symbolData) {
            console.error("Missing strategy or symbol data");
            return;
        }

        const funds = await this.getAvailableFunds();
        console.log("Available funds:", funds);
        if (funds < 1000) {
            console.error("Insufficient funds");
            return;
        }

        const optionStrategy = new OptionStrategy('ATM');
        console.log("Using option strategy:", optionStrategy.strategy);

        const optionSymbol = this.getOptionBasedOnStrategy(symbolData.tradingsymbol, optionStrategy.strategy);
        console.log("Option symbol to trade:", optionSymbol);

        const orderResult = await this.placeOrder(optionSymbol);
        console.log("Order result:", orderResult);

        if (!orderResult.success) {
            console.error("Order failed");
            return;
        }

        if (!event) {
            console.error("No event provided to trade function.");
            return;
        }

        const insertQuery = `
            INSERT INTO "UserOrders"
                ("userId", "eventId", "entry_value", "target_value", "sl_value", 
                "actual_entry_value", "actual_target_value", "actual_sl_value", "isActive", "createdAt", "updatedAt")
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        `;

        const bindValues = [
            1,                // Replace with actual userId
            event.id,
            100.00,           // entry_value
            120.00,           // target_value
            90.00,            // sl_value
            102.00,           // actual_entry_value
            118.00,           // actual_target_value
            88.00,            // actual_sl_value
            '1'               // isActive
        ];

        await sequelize.query(insertQuery, {
            bind: bindValues,
            type: QueryTypes.INSERT
        });

        console.log("✅ Order inserted into UserOrders");
    },

    getSymbolByToken: function (token) {
        return symbolManager.symbols.find(s => String(s.token) === String(token));
    },

    getStrategyIdByStrategyName: function (tagName) {
        const strategy = strategyManager.strategies.find(s => s.name === tagName);
        return strategy ? strategy.strategyId : null;
    },

    getAvailableFunds: async function () {
        try {
            const config = await kiteConfig.getConfig();
            const apiKey = config.apiKey;
            const accessToken = config.accessToken;

            const res = await axios.get('https://api.kite.trade/user/margins/equity', {
                headers: {
                    Authorization: `token ${apiKey}:${accessToken}`
                }
            });

            return res.data.data.available.cash || 0;
        } catch (err) {
            console.error("Error fetching funds:", err.message);
            return 0;
        }
    },

    getOptionBasedOnStrategy: function (baseSymbol, strategyType) {
        switch (strategyType) {
            case 'ATM': return `${baseSymbol}24JUN23000CE`;
            case 'ITM': return `${baseSymbol}24JUN22500CE`;
            case 'OTM': return `${baseSymbol}24JUN23500CE`;
            default: return '';
        }
    },

    placeOrder: async function (optionSymbol) {
        console.log("Simulating order for", optionSymbol);
        return { success: true, orderId: 'ORDER123456' };
    }
};

module.exports = trade;