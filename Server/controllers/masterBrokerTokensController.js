const UserBrokerCredentials = require('../models/userBrokerCredentials');
const { KiteConnect } = require("kiteconnect");
const kiteConfig = require('../config/kiteConfig');
// const kc = new KiteConnect({ api_key: kiteConfig.apiKey });

// Create UserBrokerCredentials
exports.createMasterBrokerToken = async(req, res) => {
    // Fetch Kite configuration asynchronously
    const config = await kiteConfig.getConfig();

    // Initialize KiteConnect with the fetched API key
    const kc = new KiteConnect({ api_key: config.apiKey });
    const { user, broker, requestToken } = req.body;

    // Validate input
    if (!requestToken || !user || !broker) {
        return res.status(400).json({
            message: "Missing required fields: requestToken, user, broker",
            received: req.body,
        });
    }

    try {
        // Generate session using Kite Connect
        const response = await kc.generateSession(requestToken, config.apiSecret);
        // const response = await kc.generateSession(requestToken, kiteConfig.apiSecret);
        kc.setAccessToken(response.access_token);

        // Upsert (Insert or Update) the credentials in the database
        const [credentials, created] = await UserBrokerCredentials.upsert({
            User: user,
            Broker: broker,
            RequestToken: requestToken,
            AccessToken: response.access_token,
        });

        res.json({
            message: created ?
                "Session generated and access token stored successfully" :
                "Access token updated successfully",
            data: credentials,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error generating session or storing access token",
            error: error.message,
        });
    }
};

// New API endpoint for extracting URL parameters and generating access tokens
exports.generateTokenFromUrl = async(req, res) => {
    const { action, type, status, request_token } = req.query;
    const broker = req.query.broker; // Broker parameter can be sent as part of the query or set in the frontend.

    // Check the required conditions
    if (action === 'login' && type === 'login' && status === 'success' && request_token) {
        try {
            // Call createMasterBrokerToken function to handle token generation
            req.body = { broker, requestToken: request_token };
            await exports.createMasterBrokerToken(req, res);
        } catch (error) {
            res.status(500).json({
                message: "Error generating access token from URL",
                error: error.message,
            });
        }
    } else {
        res.status(400).json({ message: "Invalid or missing parameters in URL" });
    }
};

// ✅ Get all tokens (or latest one)
exports.getMasterBrokerTokens = async(req, res) => {
    try {
        const tokens = await UserBrokerCredentials.findAll({
            order: [
                    ['updatedAt', 'ASC']
                ] // or 'DESC' if you want latest first
        });
        res.json(tokens);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching tokens",
            error: error.message
        });
    }
};