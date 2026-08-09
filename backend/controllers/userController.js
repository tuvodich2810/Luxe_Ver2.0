const expressAsyncHandler = require('express-async-handler');
const User = require('../models/User');
const { ok, notFound, badRequest } = require('../utils/apiResponse');

// ===================================
// GET /api/users [Admin & Staff]
// ===================================
const getUsers = expressAsyncHandler(async (req, res) => {
  const { page = 1, limit = 50, role, isActive, search } = req.query;

  const filter = {};

  if (role) {
    filter.role = role;
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 50;
  const skip = (pageNum - 1) * limitNum;

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum),
    User.countDocuments(filter),
  ]);

  return ok(res, 'Lấy danh sách người dùng thành công', users, {
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
  });
});

// ===================================
// PUT /api/users/:id/role [Admin]
// Gán vai trò cho user: admin, giam_doc, quan_ly, sales, cskh, user
// ===================================
const updateUserRole = expressAsyncHandler(async (req, res) => {
  const { role } = req.body;
  const validRoles = ['admin', 'giam_doc', 'quan_ly', 'sales', 'cskh', 'user'];

  if (!validRoles.includes(role)) {
    return badRequest(res, `Quyền người dùng không hợp lệ. Các vai trò được phép: ${validRoles.join(', ')}`);
  }

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
  if (!user) {
    return notFound(res, 'Không tìm thấy người dùng');
  }

  return ok(res, `Cập nhật vai trò sang ${role} thành công`, user);
});

// ===================================
// PUT /api/users/:id/status [Admin]
// ===================================
const updateUserStatus = expressAsyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true }).select('-password');
  if (!user) {
    return notFound(res, 'Không tìm thấy người dùng');
  }

  return ok(res, 'Cập nhật trạng thái tài khoản thành công', user);
});

// ===================================
// DELETE /api/users/:id [Admin]
// ===================================
const deleteUser = expressAsyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return notFound(res, 'Không tìm thấy người dùng');
  }

  return ok(res, 'Xóa người dùng thành công');
});

module.exports = {
  getUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
};
