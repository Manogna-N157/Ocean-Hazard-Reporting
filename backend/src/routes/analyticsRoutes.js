const router = require('express').Router();
const { authenticate, authorize, requireApprovedAuthority } = require('../middleware/authMiddleware');
const { getSocialAnalytics } = require('../controllers/analyticsController');
router.get('/social', authenticate, requireApprovedAuthority, authorize('Authority', 'Admin'), getSocialAnalytics);
module.exports = router;
