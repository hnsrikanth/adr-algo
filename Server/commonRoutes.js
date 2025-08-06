// routes.js
const kiteConnectRoutes = require('./routes/kiteConnectRoutes');
const masterBrokerTokensRoutes = require('./routes/masterBrokerTokensRoutes');
const kiteRoutes = require('./routes/kiteRoutes'); // adjust path as needed
const testTradeRoute = require('./routes/testTrade');

const registerRoutes = (app) => {
  app.use('/api', kiteConnectRoutes);
  app.use('/api', masterBrokerTokensRoutes);
  app.use('/api', kiteRoutes);
  app.use('/api', testTradeRoute);
};

module.exports = registerRoutes;