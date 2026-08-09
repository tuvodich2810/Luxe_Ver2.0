const express = require('express');
const router = express.Router();

const { chatWithAI } = require('../controllers/chatController');
const { chatRateLimiter } = require('../middlewares/rateLimitMiddleware');

// Gửi tin nhắn đến chatbot (kèm rate limiter)
router.post('/', chatRateLimiter, chatWithAI);

module.exports = router;