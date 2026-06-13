const express = require('express');
const { getAnalytics, getPublicStats } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/public', getPublicStats);
router.get('/', protect, getAnalytics);

module.exports = router;
