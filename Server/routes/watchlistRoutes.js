const express = require('express');
const router = express.Router();
const userWatchListController = require('../controllers/watchlistController');

router.post('/user-watchlist', userWatchListController.createWatchList);
router.get('/user-watchlists', userWatchListController.getAllWatchlist);
router.get('/user-watchlist/:id', userWatchListController.getWatchListById);
router.put('/user-watchlist/:id', userWatchListController.updateWatchList);
router.delete('/user-watchlist/:id', userWatchListController.deleteWatchList);

module.exports = router;
