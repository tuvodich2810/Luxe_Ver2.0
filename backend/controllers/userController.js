const expressAsyncHandler = require('express-async-handler');
const User = require('../models/User');
const { ok } = require('../utils/apiResponse');

// ===================================
// GET /api/users [Admin]
// ===================================
const getUsers = expressAsyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, isActive, search } = req.query;

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
  const limitNum = parseInt(limit, 10) || 20;
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

module.exports = { getUsers };
