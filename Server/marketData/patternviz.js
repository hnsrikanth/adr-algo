const fs = require('fs');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const patternChecker = require('./patternChecker'); // ✅ add this

const patternViz = {
	// Function to generate and save line chart
	generateChart: async function (symbol, token, data, tagName) {
		const width = 800; // width of the chart
		const height = 600; // height of the chart
		const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour: 'white' });

		const configuration = {
			type: 'line',
			data: {
				labels: Array.from({ length: 31 }, (_, i) => i + 1), // X-axis from 1 to 31
				datasets: [{
					label: `${symbol} Close Prices`,
					data: data.map(entry => entry.close), // Use close values from data array
					fill: false,
					borderColor: 'rgba(0, 0, 0, 1)', // Set line color to black
					borderWidth: 2
				}]
			},
			options: {
				scales: {
					x: {
						display: false // Hide x-axis labels and values
					},
					y: {
						display: false // Hide y-axis labels and values
					}
				},
				plugins: {
					legend: {
						display: false // Hide legend
					}
				},
				elements: {
					point: {
						radius: 0 // Hide points on the line
					}
				},
				layout: {
					padding: 20 // Add padding around the chart
				}
			}
		};

		const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);
		
		// ✅ Generate a truly unique timestamp using milliseconds
		// const now = new Date();
		const istDate = new Date().toLocaleString("en-IN", {
			timeZone: "Asia/Kolkata",
			hour12: false
		});
		const formattedTimestamp = istDate.replace(/[/,:\s]/g, '-'); // Replace / , : and space with -
		
		const filePath = `./charts/${symbol}_${token}_${tagName}_${formattedTimestamp}.png`;
		
		// const filePath = `./charts/${symbol}_${token}_chart_${timestamp}.png`;
		
		fs.writeFileSync(filePath, imageBuffer); // Save with timestamp
		return filePath
	},

	generateChartAndPredict: async function (symbol, token, data) {
        // Create a temporary image in memory for prediction only
        const width = 800;
        const height = 600;
        const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour: 'white' });

        const configuration = {
            type: 'line',
            data: {
                labels: Array.from({ length: 31 }, (_, i) => i + 1),
                datasets: [{
                    label: `${symbol} Close Prices`,
                    data: data.map(entry => entry.close),
                    fill: false,
                    borderColor: 'rgba(0, 0, 0, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                scales: { x: { display: false }, y: { display: false } },
                plugins: { legend: { display: false } },
                elements: { point: { radius: 0 } },
                layout: { padding: 20 }
            }
        };

        const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);

        // Save to a temp file only in memory
        const tempPath = `./temp_${symbol}_${token}.png`;
        fs.writeFileSync(tempPath, buffer);

        // Make prediction
        const predictionData = await patternChecker.makeCustomVisionAPICall(tempPath);

        // Delete temp image
        if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
        }

        return predictionData;
    }
	
};

module.exports = patternViz;