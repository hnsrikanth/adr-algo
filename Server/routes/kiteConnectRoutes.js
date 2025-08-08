const express = require('express');
const kiteConnectController = require('../controllers/kiteConnectController');
const router = express.Router();

// Define routes
router.get('/login', kiteConnectController.redirectToLogin);
router.get('/callback', kiteConnectController.handleCallback);

module.exports = router;
