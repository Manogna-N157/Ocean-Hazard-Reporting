const router = require('express').Router();
const { authenticate } = require('../middleware/authMiddleware');
const { register, applyForAuthority, login, logout } = require('../controllers/authController');
router.post('/register', register);
router.post('/authority-application', applyForAuthority);
router.post('/login', login);
router.post('/logout', authenticate, logout);
module.exports = router;
