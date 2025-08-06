const MasterBrokerTokens = require('../models/masterBrokerTokens');

async function getTokens() {
    try {
        const result = await MasterBrokerTokens.findAll(); // Returns an array of instances
        if (!result || result.length === 0) {
            console.warn("No tokens found in the database.");
            return null;
        }
        // console.log("Tokens fetched from database:", result[0].dataValues);
        return result[0].dataValues; // Return the dataValues of the first record
    } catch (error) {
        console.error("Error fetching tokens:", error.message);
        throw error;
    }
}

module.exports.getConfig = async function () {
    try {
        const tokens = await getTokens();
        return {
            apiKey: "cbmxcpdmwfgykqdh",
            apiSecret: "w6rh9dup1q15g019c56h7lljiuvg7osn",
            requestToken: tokens?.RequestToken || "default_request_token",
            accessToken: tokens?.AccessToken || "default_access_token",
        };
    } catch (error) {
        console.error("Error in getConfig:", error.message);
        return {
            apiKey: "cbmxcpdmwfgykqdh",
            apiSecret: "w6rh9dup1q15g019c56h7lljiuvg7osn",
            requestToken: "default_request_token",
            accessToken: "default_access_token",
        };
    }
};