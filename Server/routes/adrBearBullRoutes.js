const express = require('express');
const router = express.Router();
const adrController = require('../controllers/adrController');

router.post('/adr/start', adrController.start);
router.post('/adr/exitAll', adrController.exitAll);

module.exports = router;
