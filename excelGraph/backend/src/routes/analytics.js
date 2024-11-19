const express = require('express');
const router = express.Router();
const {analyticsController} = require('../controllers/analyticsController');

const auth = require('../middleware/auth');

router.get('/features', auth, analyticsController.getFeatureMetrics);
router.get('/time-trend', auth, analyticsController.getFeatureTimeTrend);
router.get('/filters', auth, analyticsController.getFilterOptions);

module.exports = router;