const router = require('express').Router();
const upload = require('../middleware/uploadMiddleware');
const { authenticate } = require('../middleware/authMiddleware');
const controller = require('../controllers/reportController');

router.get('/map', controller.getMapReports);
router.get('/', authenticate, controller.getReports);
router.get('/:id', authenticate, controller.getReport);
router.post('/', authenticate, upload.single('image'), controller.createReport);
router.put('/:id', authenticate, upload.single('image'), controller.updateReport);
router.delete('/:id', authenticate, controller.deleteReport);
module.exports = router;
