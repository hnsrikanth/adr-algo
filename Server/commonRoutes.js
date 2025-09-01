// routes.js
const kiteConnectRoutes = require('./routes/kiteConnectRoutes');
const masterBrokerTokensRoutes = require('./routes/masterBrokerTokensRoutes');
const kiteRoutes = require("./routes/kiteRoutes");
const niftyCandlesRoutes = require('./routes/nifty-candles');
const watchlistRoutes = require('./routes/watchlistRoutes');
const adrLogsRoutes = require('./routes/adrLogsRoutes');
const sessionRoutes = require('./routes/settingRoutes');
const twoDaysHistoricData = require("./routes/twoDaysDataRoutes");
const adrRoutes = require("./routes/adrRoutes");

const registerRoutes = (app) => {
    app.use('/api', kiteConnectRoutes);
    app.use('/api', masterBrokerTokensRoutes);
    app.use("/api", kiteRoutes);
    app.use('/api', niftyCandlesRoutes);
    app.use('/api', watchlistRoutes);
    app.use('/api', adrLogsRoutes);
    app.use('/api', sessionRoutes);
    app.use('/api', twoDaysHistoricData);
    app.use('/api', adrRoutes);
};

module.exports = registerRoutes;