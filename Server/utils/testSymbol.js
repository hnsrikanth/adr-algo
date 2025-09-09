// testSymbol.js
const { buildHumanReadableSymbol } = require("./symbolHelper");

const position = {
  "Buy/Sell": "SELL",
  "CE/PE": "CE",
  "Strike": "OTM+3",
  "Expiry": "2025-09-09", // expiry date for NIFTY (Tuesday)
  Qty: 50,
};

const ltp = 24710; // simulate NIFTY spot

console.log("Generated Symbol:", buildHumanReadableSymbol(position, ltp));
