const express = require('express');
const router = express.Router();
const masterBrokerTokensController = require('../controllers/masterBrokerTokensController');

router.post('/master-broker-tokens', masterBrokerTokensController.createMasterBrokerToken);
router.get('/master-broker-token-from-url', masterBrokerTokensController.generateTokenFromUrl);

module.exports = router;