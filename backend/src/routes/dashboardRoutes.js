const router = require('express').Router();
const { authenticate, requireApprovedAuthority } = require('../middleware/authMiddleware');
const { getStatistics } = require('../controllers/dashboardController');
router.get('/statistics', authenticate, requireApprovedAuthority, getStatistics);
module.exports = router;
