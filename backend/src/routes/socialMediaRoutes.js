const router = require('express').Router();
const upload = require('../middleware/uploadMiddleware');
const { authenticate, authorize, requireApprovedAuthority } = require('../middleware/authMiddleware');
const controller = require('../controllers/socialMediaController');

router.use(authenticate, requireApprovedAuthority, authorize('Authority', 'Admin'));
router.post('/analyze-text', controller.analyzeText);
router.post('/analyze-image', upload.single('image'), controller.analyzeImage);
router.post('/analyze-url', controller.analyzeUrl);
router.post('/create-report', controller.createOfficialReport);
router.get('/history', controller.getHistory);

module.exports = router;
