const router = require('express').Router();
const { register, applyForAuthority, login } = require('../controllers/authController');
router.post('/register', register);
router.post('/authority-application', applyForAuthority);
router.post('/login', login);
module.exports = router;
