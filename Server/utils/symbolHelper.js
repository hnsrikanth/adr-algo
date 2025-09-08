// utils/symbolHelper.js

/** Get nth Tuesday of a month */
function getTuesdayDateOfMonth(year, month, nth = 1) {
  const firstDay = new Date(year, month, 1);
  let count = 0;
  for (let d = 1; d <= 31; d++) {
    const date = new Date(year, month, d);
    if (date.getMonth() !== month) break;
    if (date.getDay() === 2) { // 2 = Tuesday
      count++;
      if (count === nth) return date;
    }
  }
  return null;
}

/** Build NIFTY weekly symbol */
function buildNiftyWeeklySymbol(strike, optionType, year, month, nth) {
  const expiry = getTuesdayDateOfMonth(year, month, nth);
  if (!expiry) throw new Error("Expiry not found");

  const yy = String(expiry.getFullYear()).slice(-2);
  const mm = String(expiry.getMonth() + 1).padStart(2, "0");
  const dd = String(expiry.getDate()).padStart(2, "0");

  return `NIFTY${yy}${mm}${dd}${strike}${optionType}`;
}

module.exports = { getTuesdayDateOfMonth, buildNiftyWeeklySymbol };
