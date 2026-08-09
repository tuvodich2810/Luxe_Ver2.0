const { forbidden } = require('../utils/apiResponse');

// Middleware kiểm tra quyền admin tối cao
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return forbidden(res, 'Bạn cần quyền Admin tối cao để thực hiện hành động này.');
};

// Middleware kiểm tra vai trò được phép (RBAC Matrix)
const hasRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (req.user && allowedRoles.includes(req.user.role)) {
      return next();
    }
    return forbidden(
      res,
      `Tài khoản của bạn (${req.user?.role || 'Khách'}) không có quyền thực hiện chức năng này.`
    );
  };
};

// Middleware dành cho tất cả nhân sự nội bộ (Admin, Giám đốc, Quản lý, Sales, CSKH)
const staffOnly = (req, res, next) => {
  const staffRoles = ['admin', 'giam_doc', 'quan_ly', 'sales', 'cskh'];
  if (req.user && staffRoles.includes(req.user.role)) {
    return next();
  }
  return forbidden(res, 'Trang này dành riêng cho nhân sự quản trị Luxe Motors.');
};

module.exports = { adminOnly, hasRole, staffOnly };