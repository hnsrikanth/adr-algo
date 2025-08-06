const kcProxy = require("../marketData/kiteConnectProxy");
const symbolsManager = require('../symbolsManager');
const patternChecker = require('../marketData/patternChecker');
const patternViz = require('../marketData/patternviz');
const events = require('../marketData/events');
const trader = require('../marketData/trade');
const fs = require('fs');

// Function to process each symbol
async function processSymbol(instrument) {
    try {
        // 2. Get historical data for each symbol

        const symbol = instrument.tradingsymbol;
        const token = instrument.token;
        const data = await kcProxy.fetchHistoricalData(token);

        // 1. Generate chart in memory (without saving) for prediction
        const predictionData = await patternViz.generateChartAndPredict(symbol, token, data);

        // 2. Check for matched pattern
        console.log(`🔍 Predictions for ${symbol}:`, predictionData?.predictions);
        const matched = predictionData?.predictions?.find(p => p.probability >= 0.65 && p.tagName !== 'Negative');

        if (matched) {
            const tagName = matched.tagName;

            // 3. Save final chart with tagName only if it's a valid match
            const finalPath = await patternViz.generateChart(symbol, token, data, tagName);

            // 4. Save the event and do anything else needed
            await events.updateEvents(predictionData, token, finalPath);

            console.log(`✅ Pattern "${tagName}" matched and chart saved for ${symbol}`);
        } else {
            console.log(`❌ No valid pattern match for ${symbol}`);
        }

        // // 2. Generate temp chart without tag (for prediction purpose only)
        // const tempPath = await patternViz.generateChart(symbol, token, data, 'TEMP');

        // // 3. Call Custom Vision API to get pattern prediction
        // const predictionData = await patternChecker.makeCustomVisionAPICall(tempPath);

        // // Optional: delete the temp chart image after prediction
        // if (fs.existsSync(tempPath)) {
        //     fs.unlinkSync(tempPath);
        // }

        // 4. Check for matched pattern
        // const matched = predictionData.predictions.find(p => p.probability >= 0.65); // Adjust threshold as needed

        // if (matched) {
        //     console.log(`✅ Pattern "${matched.tagName}" matched for ${symbol}`);
        //     const tagName = matched.tagName;

        //     // 5. Generate actual chart with matched tagName in filename
        //     const finalPath = await patternViz.generateChart(symbol, token, data, tagName);

        //     // 6. Save event
        //     // const event = await events.updateEvents(predictionData, token, finalPath);
        //     await events.updateEvents(predictionData, token, finalPath);

        //     // 7. Trade if needed
        //     // if (event) {
        //     //     await trader.trade(predictionData, token, event);
        //     // }
        // } else {
        //     console.log(`❌ No pattern match found for ${symbol}`);
        // }




        // // 3. Generate image chart for each symbol
        // const path = await patternViz.generateChart(symbol, token, data, tagName);

        // // 4. Check if the pattern is validated against available patterns
        // const predictionData = await patternChecker.makeCustomVisionAPICall(path);

        // // 5. Add data to events table
        // // await events.updateEvents(predictionData, token);

        // const event = await events.updateEvents(predictionData, token, path);
        // // console.log("Event created:", event);

        // // if (event) {
        // //     // 6. For the added events, check if you can take a trade
        // //     // Pass event.id or full event object to trade module
        // //     await trader.trade(predictionData, token, event);
        // // } else {
        // //     console.log("No new event created.");
        // // }

    } catch (error) {
        console.error(`Error processing symbol ${instrument.token}:`, error);
    }
}

// Main function to run the process
async function start() {

    const instruments = symbolsManager.symbols;

    // Function to process symbols sequentially with a delay
    async function processSymbolsSequentially() {
        for (let i = 0; i < instruments.length; i++) {
            await processSymbol(instruments[i]);
            if (i < instruments.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 4000)); // 4 seconds delay between each symbol
            }
        }
    }

    // Call the function once every 5 minutes (300,000 milliseconds)
    setInterval(processSymbolsSequentially, 30000);

    // Optionally, call the function immediately if you want it to run right away
    processSymbolsSequentially();
}

module.exports = { start };