const router = require('express').Router();
const { authenticate, authorize, requireApprovedAuthority } = require('../middleware/authMiddleware');
const controller = require('../controllers/alertController');
router.get('/', authenticate, requireApprovedAuthority, authorize('Authority', 'Admin'), controller.getAlerts);
router.post('/', authenticate, requireApprovedAuthority, authorize('Admin', 'Authority'), controller.createAlert);
module.exports = router;
