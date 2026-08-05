const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');
const controller = require('../controllers/alertController');
router.get('/', controller.getAlerts);
router.post('/', authenticate, authorize('Admin', 'Authority'), controller.createAlert);
module.exports = router;
