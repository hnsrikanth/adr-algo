const UserADRLogsList = require('../models/adrLogs');

// Create a new ADRLogs entry
exports.createADRLogsList = async (req, res) => {
	try {
		const { startTime, type } = req.body;

		const adrLogsListEntry = await UserADRLogsList.create({ startTime, type });
		res.status(201).json(adrLogsListEntry);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Get all ADRLogs
exports.getAllADRLogslist = async (req, res) => {
	try {
		const userADRLogslist = await UserADRLogsList.findAll({ attributes: ['id', 'startTime', 'type'] });
		res.json(userADRLogslist);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Get a ADRLogs entry by ID
exports.getADRLogsById = async (req, res) => {
	try {
		const { id } = req.params;
		const adrLogsListEntry = await UserADRLogsList.findByPk(id);
		if (!adrLogsListEntry) return res.status(404).json({ message: 'ADRLogs entry not found' });
		res.json(adrLogsListEntry);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Update a ADRLogs entry
exports.updateADRLogsList = async (req, res) => {
	try {
		const { id } = req.params;
		const { startTime, type } = req.body;
		const updated = await UserADRLogsList.update({ startTime, type }, { where: { id } });
		if (updated[0] === 0) return res.status(404).json({ message: 'ADRLogs entry not found' });
		const updatedEntry = await UserADRLogsList.findByPk(id);
		res.json(updatedEntry);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Delete a ADRLogs entry
exports.deleteADRLogsList = async (req, res) => {
	try {
		const { id } = req.params;
		const adrLogsListEntry = await UserADRLogsList.findByPk(id);
		if (!adrLogsListEntry) {
			return res.status(404).json({ message: 'ADRLogs entry not found' });
		}

		await UserADRLogsList.destroy({ where: { id } });
		res.status(200).json({ message: 'ADRLogs entry deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
