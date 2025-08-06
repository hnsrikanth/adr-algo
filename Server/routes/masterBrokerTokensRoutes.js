const express = require('express');
const router = express.Router();
const masterBrokerTokensController = require('../controllers/masterBrokerTokensController');
const authMiddleware = require('../middlewares/authMiddleware');

// router.post('/master-broker-tokens', authMiddleware, masterBrokerTokensController.createMasterBrokerToken);
// router.get('/master-broker-tokens', authMiddleware, masterBrokerTokensController.getAllMasterBrokerToken);
// router.get('/master-broker-tokens/:id', authMiddleware, masterBrokerTokensController.getMasterBrokerTokenById);
// router.put('/master-broker-tokens/:id', authMiddleware, masterBrokerTokensController.updateMasterBrokerToken);
// router.delete('/master-broker-tokens/:id', authMiddleware, masterBrokerTokensController.deleteMasterBrokerToken);

router.post('/master-broker-tokens', masterBrokerTokensController.createMasterBrokerToken);
router.get('/master-broker-token-from-url', masterBrokerTokensController.generateTokenFromUrl);

module.exports = router;