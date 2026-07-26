const { forbidden } = require('../utils/apiResponse');

// ===================================
// Middleware kiểm tra quyền admin
// Phải dùng sau middleware protect
// ===================================
const adminOnly = (req, res, next) => {
  // req.user được gắn bởi protect middleware
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  return forbidden(res, 'Bạn cần quyền Admin để thực hiện hành động này');
};

module.exports = { adminOnly };