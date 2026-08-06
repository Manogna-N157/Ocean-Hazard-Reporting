const router = require('express').Router();
const upload = require('../middleware/uploadMiddleware');
const { authenticate, requireApprovedAuthority } = require('../middleware/authMiddleware');
const { analyzeImage } = require('../controllers/aiController');

router.post('/analyze', authenticate, requireApprovedAuthority, upload.single('image'), analyzeImage);

module.exports = router;
