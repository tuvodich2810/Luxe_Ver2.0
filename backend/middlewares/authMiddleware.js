const expressAsyncHandler = require('express-async-handler');
const User = require('../models/User');
const { verifyToken } = require('../utils/generateToken');
const { unauthorized } = require('../utils/apiResponse');

// ===================================
// Middleware xác thực JWT
// ===================================
const protect = expressAsyncHandler(async (req, res, next) => {
  let token;

  // Lấy token từ Authorization header (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Không có token
  if (!token) {
    return unauthorized(res, 'Bạn chưa đăng nhập, vui lòng đăng nhập để tiếp tục');
  }

  // Verify token
  const decoded = verifyToken(token);

  if (!decoded) {
    return unauthorized(res, 'Token không hợp lệ hoặc đã hết hạn');
  }

  // Tìm user
  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    return unauthorized(res, 'Tài khoản không tồn tại');
  }

  if (!user.isActive) {
    return unauthorized(res, 'Tài khoản đã bị vô hiệu hóa');
  }

  req.user = user;
  next();
});

module.exports = { protect };