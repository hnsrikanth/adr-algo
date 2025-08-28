//Date 

let refreshDate = null//This should always be today's date after calculating ADR values. If this is yesterday's date, then we need to recalculate ADR values

// Variable for market open price
let marketOpen = 0;

// Variables for ADR data in increments of 0.25 above market open
let adrPlus_25 = 0;
let adrPlus_50 = 0;
let adrPlus_75 = 0;
let adrPlus_1 = 0;

// Variables for ADR data in decrements of 0.25 below market open
let adrMinus_25 = 0;
let adrMinus_50 = 0;
let adrMinus_75 = 0;
let adrMinus_1 = 0;
