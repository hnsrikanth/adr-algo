// utils/symbolHelper.js

/**
 * Get the nth Tuesday of a given month/year
 */
function getNthTuesday(year, month, nth = 1) {
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

/**
 * Find the next valid expiry Tuesday >= today
 */
function getNextTuesdayExpiry(fromDate = new Date()) {
	const date = new Date(fromDate);
	while (date.getDay() !== 2) {
		date.setDate(date.getDate() + 1);
	}
	return date; // first Tuesday on/after today
}

/**
 * Convert a date to "9th w SEP" format
 */
function formatExpiryHuman(expiryDate) {
	const day = expiryDate.getDate();
	const month = expiryDate.toLocaleString("en-US", { month: "short" }).toUpperCase();
	return `${day}th w ${month}`;
}

/**
 * Round underlying LTP to nearest strike (50 multiples)
 */
function getATM(ltp) {
	const step = 50;
	return Math.round(ltp / step) * step;
}

/**
 * Resolve strike from ATM/OTM/ITM notation
 * @param {string|number} strikeSpec - e.g. "ATM", "OTM+3", "ITM+2", or direct number
 * @param {number} ltp - underlying last price
 * @param {string} optionType - "CE" or "PE"
 */
function resolveStrike(strikeSpec, ltp, optionType) {
	const step = 50;
	const atm = getATM(ltp);

	if (typeof strikeSpec === "number" || /^\d+$/.test(strikeSpec)) {
		return parseInt(strikeSpec, 10);
	}

	if (strikeSpec.toUpperCase() === "ATM") {
		return atm;
	}

	const match = strikeSpec.match(/(OTM|ITM)\+(\d+)/i);
	if (!match) throw new Error(`Invalid strike spec: ${strikeSpec}`);

	const type = match[1].toUpperCase();
	const interval = parseInt(match[2], 10);
	const offset = interval * step;

	if (optionType === "CE") {
		if (type === "OTM") return atm + offset;
		if (type === "ITM") return atm - offset;
	} else if (optionType === "PE") {
		if (type === "OTM") return atm - offset;
		if (type === "ITM") return atm + offset;
	}

	throw new Error(`Could not resolve strike for ${strikeSpec} with ${optionType}`);
}

/**
 * Build human-readable symbol
 * Ex: NIFTY 9th w SEP 24750 CE
 */
function buildHumanReadableSymbol(position, ltp) {
	const optionType = position["CE/PE"];
	const strike = resolveStrike(position.Strike, ltp, optionType);

	// Pick expiry: if given date is in past, roll forward
	let expiryDate = new Date(position.Expiry); // if "2025-09-09" style
	if (isNaN(expiryDate)) {
		// If not ISO date, fallback: find next Tuesday >= today
		expiryDate = getNextTuesdayExpiry();
	}
	if (expiryDate < new Date()) {
		// roll to next Tuesday if already passed
		expiryDate = getNextTuesdayExpiry(new Date(expiryDate.getTime() + 7 * 86400000));
	}

	const expiryHuman = formatExpiryHuman(expiryDate);

	return `NIFTY ${expiryHuman} ${strike} ${optionType}`;
}

module.exports = {
	getNthTuesday,
	getNextTuesdayExpiry,
	formatExpiryHuman,
	getATM,
	resolveStrike,
	buildHumanReadableSymbol,
};
