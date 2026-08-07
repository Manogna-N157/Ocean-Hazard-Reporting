const router = require('express').Router();
const upload = require('../middleware/uploadMiddleware');
const { authenticate, authorize, requireApprovedAuthority } = require('../middleware/authMiddleware');
const controller = require('../controllers/reportController');
const adminController = require('../controllers/adminController');

router.use(authenticate, requireApprovedAuthority);
// Any authenticated role may view the public verified-hazard map.
router.get('/map', controller.getMapReports);
router.get('/operational', authenticate, requireApprovedAuthority, authorize('Authority', 'Admin'), controller.getReports);
router.put('/operational/:id/verify', authenticate, requireApprovedAuthority, authorize('Authority', 'Admin'), adminController.verifyReport);
router.put('/operational/:id/reject', authenticate, requireApprovedAuthority, authorize('Authority', 'Admin'), adminController.rejectReport);
router.get('/', controller.getReports);
router.get('/:id', controller.getReport);
router.post('/', authorize('Citizen'), upload.single('image'), controller.createReport);
router.put('/:id', upload.single('image'), controller.updateReport);
router.delete('/:id', controller.deleteReport);
module.exports = router;
