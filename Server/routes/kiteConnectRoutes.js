const express = require('express');
const kiteConnectController = require('../controllers/kiteConnectController');
const router = express.Router();

// Define routes
router.get('/login', kiteConnectController.redirectToLogin);
router.get('/callback', kiteConnectController.handleCallback);
// router.post('/generate-session', kiteConnectController.generateSession);
// router.get('/profile', kiteConnectController.getProfile);

module.exports = router;
