const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env');

// ===================================
// Tạo JWT token từ user ID
// ===================================
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },  // Payload: chỉ lưu userId, không lưu thông tin nhạy cảm
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

// ===================================
// Verify JWT token
// ===================================
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };