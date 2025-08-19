const express = require('express');
const router = express.Router();
const adrLogsListController = require('../controllers/adrLogsController');

router.post('/adrLogs', adrLogsListController.createADRLogsList);
router.get('/adrLogs', adrLogsListController.getAllADRLogslist);
router.get('/adrLogs/:id', adrLogsListController.getADRLogsById);
router.put('/adrLogs/:id', adrLogsListController.updateADRLogsList);
router.delete('/adrLogs/:id', adrLogsListController.deleteADRLogsList);

module.exports = router;
