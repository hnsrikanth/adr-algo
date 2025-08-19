// routes.js
const kiteConnectRoutes = require('./routes/kiteConnectRoutes');
const masterBrokerTokensRoutes = require('./routes/masterBrokerTokensRoutes');
const kiteRoutes = require("./routes/kiteRoutes");
const niftyCandlesRoutes = require('./routes/nifty-candles');
const watchlistRoutes = require('./routes/watchlistRoutes');
const adrLogsRoutes = require('./routes/adrLogsRoutes');

const registerRoutes = (app) => {
  app.use('/api', kiteConnectRoutes);
  app.use('/api', masterBrokerTokensRoutes);
  app.use("/api", kiteRoutes);
  app.use('/api', niftyCandlesRoutes);
  app.use('/api', watchlistRoutes);
  app.use('/api', adrLogsRoutes);
};

module.exports = registerRoutes;