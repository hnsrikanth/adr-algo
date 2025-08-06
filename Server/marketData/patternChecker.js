const axios = require('axios');
// Function to check for patternsconst axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const config = require('../config/predictionConfig');


const patternChecker = {
	// Function to make a Custom Vision API call
	makeCustomVisionAPICall: async function (filePath) {
		const url =  config.predictionUrl;
		const predictionKey = config.key;

		const form = new FormData();
		form.append('file', fs.createReadStream(filePath));

		try {
			const response = await axios.post(url, form, {
				headers: {
					...form.getHeaders(),
					'Prediction-Key': predictionKey
				}
			});			
			return response.data;

		} catch (error) {
			console.error('Error making prediction API call:', error);
		}
	}
};
module.exports = patternChecker;