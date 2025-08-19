const UserWatchList = require('../models/userWatchList');

// Create a new watchlist entry
exports.createWatchList = async (req, res) => {
	try {
		const { instrumentToken, symbol, name } = req.body;

		// Check if a strategy with the same name already exists
		const existingUserWatchlist = await UserWatchList.findOne({ where: { symbol } });

		if (existingUserWatchlist) {
			return res.status(400).json({ message: 'Symbol already exists!' });
		}

		const watchListEntry = await UserWatchList.create({ instrumentToken, symbol, name });
		res.status(201).json(watchListEntry);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Get all watchlist
exports.getAllWatchlist = async (req, res) => {
	try {
		const userWatchlist = await UserWatchList.findAll({ attributes: ['id', 'instrumentToken', 'symbol', 'name'] });
		res.json(userWatchlist);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Get a watchlist entry by ID
exports.getWatchListById = async (req, res) => {
	try {
		const { id } = req.params;
		const watchListEntry = await UserWatchList.findByPk(id);
		if (!watchListEntry) return res.status(404).json({ message: 'WatchList entry not found' });
		res.json(watchListEntry);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Update a watchlist entry
exports.updateWatchList = async (req, res) => {
	try {
		const { id } = req.params;
		const { instrumentToken, symbol, name } = req.body;
		const updated = await UserWatchList.update({ instrumentToken, symbol, name }, { where: { id } });
		if (updated[0] === 0) return res.status(404).json({ message: 'WatchList entry not found' });
		const updatedEntry = await UserWatchList.findByPk(id);
		res.json(updatedEntry);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Delete a watchlist entry
exports.deleteWatchList = async (req, res) => {
	try {
		const { id } = req.params;
		const watchListEntry = await UserWatchList.findByPk(id);
		if (!watchListEntry) {
			return res.status(404).json({ message: 'WatchList entry not found' });
		}

		await UserWatchList.destroy({ where: { id } });
		res.status(200).json({ message: 'WatchList entry deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
