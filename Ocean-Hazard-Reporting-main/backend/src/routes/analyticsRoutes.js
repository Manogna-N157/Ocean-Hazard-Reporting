const router = require('express').Router();
const { getSocialAnalytics } = require('../controllers/analyticsController');
router.get('/social', getSocialAnalytics);
module.exports = router;
