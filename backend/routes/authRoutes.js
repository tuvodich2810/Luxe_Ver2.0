const express = require('express');
const router = express.Router();
const { register, login, refreshToken, getMe, updateProfile, logout } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { validateRegisterInput, validateLoginInput } = require('../utils/validators');
const { authRateLimiter } = require('../middlewares/rateLimitMiddleware');

// Routes công khai (kèm validation và rate limiting)
router.post('/register', authRateLimiter, validateRegisterInput, register);
router.post('/login', authRateLimiter, validateLoginInput, login);
router.post('/refresh', refreshToken);

// Routes yêu cầu đăng nhập
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/logout', protect, logout);

module.exports = router;