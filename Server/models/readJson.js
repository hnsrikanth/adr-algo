const Session = require('../models/Session');
const fs = require('fs');

// Read strategy.json
const strategyJson = JSON.parse(fs.readFileSync('f:/Srikanth_Projects/adr-algo/Server/strategy.json', 'utf8'));

// Save to DB
Session.create({
  name: 'StrategySession1',
  data: strategyJson
});