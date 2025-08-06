const sql = require('../config/db');
const { KiteConnect, KiteTicker } = require("kiteconnect");
const kiteConfig = require('../config/kiteConfig');
const WebSocket = require('ws'); // Assuming WebSocket library is installed
// const kc = new KiteConnect({ api_key: kiteConfig.apiKey });

// Redirect user to the Kite login page
exports.redirectToLogin = async (req, res) => {
    // Fetch Kite configuration asynchronously
    const config = await kiteConfig.getConfig();

    // Initialize KiteConnect with the fetched API key
    const kc = new KiteConnect({ api_key: config.apiKey });

    const loginUrl = kc.getLoginURL();
    res.redirect(loginUrl);
};

// Handle callback after Kite login
exports.handleCallback = (req, res) => {
    const { request_token } = req.query;

    if (!request_token) {
        return res.status(400).json({ message: "Missing request token" });
    }

    res.json({ message: "Login successful", requestToken: request_token });
};