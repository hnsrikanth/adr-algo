const config = require("../config/kiteConfig");
const axios = require('axios');

const kiteConnectProxy = {
	// Function to fetch historical data using REST API
	fetchHistoricalData: async function (symbol, from, to) {
		const kiteConfig = await config.getConfig();
		const apiKey = kiteConfig.apiKey;
		const accessToken = kiteConfig.accessToken;

		// Default to last 20 minutes if not provided
		const now = new Date();
		const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
		const nowIST = new Date(now.getTime() + istOffset);

		const defaultTo = nowIST.toISOString().slice(0, 19);
		const defaultFrom = new Date(now.getTime() - 20 * 60000 + istOffset).toISOString().slice(0, 19);

		const formattedFrom = (from || defaultFrom).replace('T', '+');
		const formattedTo = (to || defaultTo).replace('T', '+');

		const url = `https://api.kite.trade/instruments/historical/${symbol}/minute?from=${formattedFrom}&to=${formattedTo}`;

		const headers = {
			'X-Kite-Version': '3',
			'Authorization': `token ${apiKey}:${accessToken}`
		};

		try {
			const response = await axios.get(url, { headers });
			return response.data.data.candles.map(candle => ({
				time: new Date(candle[0]).getTime(),
				open: candle[1],
				high: candle[2],
				low: candle[3],
				close: candle[4]
			}));
		} catch (error) {
			console.error('Error fetching historical data:', error.message);
			throw error;
		}
	}

};

module.exports = kiteConnectProxy;