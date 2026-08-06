const router = require('express').Router();
const upload = require('../middleware/uploadMiddleware');
const { authenticate } = require('../middleware/authMiddleware');
const { analyzeImage } = require('../controllers/aiController');

router.post('/analyze', authenticate, upload.single('image'), analyzeImage);

module.exports = router;
