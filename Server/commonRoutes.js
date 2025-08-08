// routes.js
const kiteConnectRoutes = require('./routes/kiteConnectRoutes');
const masterBrokerTokensRoutes = require('./routes/masterBrokerTokensRoutes');
const kiteRoutes = require("./routes/kiteRoutes");

const registerRoutes = (app) => {
  app.use('/api', kiteConnectRoutes);
  app.use('/api', masterBrokerTokensRoutes);
  app.use("/api", kiteRoutes);

};

module.exports = registerRoutes;