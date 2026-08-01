const express = require('express');
const router = express.Router();

const { chatWithAI } = require('../controllers/chatController');

// Gửi tin nhắn đến chatbot
router.post('/', chatWithAI);

module.exports = router;