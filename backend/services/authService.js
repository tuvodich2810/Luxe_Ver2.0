const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');

// ===================================
// Đăng ký tài khoản mới
// ===================================
const register = async ({ fullName, email, phone, password }) => {
  // Kiểm tra email đã tồn tại
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('Email này đã được sử dụng');
    error.statusCode = 400;
    throw error;
  }

  // Tạo user mới (password sẽ được hash bởi pre-save hook)
  const user = await User.create({
    fullName,
    email,
    phone,
    password,
  });

  // Tạo JWT token
  const token = generateToken(user._id);

  return {
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
    },
    token,
  };
};

// ===================================
// Đăng nhập
// ===================================
const login = async ({ email, password }) => {
  // Tìm user theo email, chọn thêm password (vì select: false)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    const error = new Error('Email hoặc mật khẩu không chính xác');
    error.statusCode = 401;
    throw error;
  }

  // Kiểm tra tài khoản active
  if (!user.isActive) {
    const error = new Error('Tài khoản của bạn đã bị vô hiệu hóa');
    error.statusCode = 401;
    throw error;
  }

  // So sánh password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Email hoặc mật khẩu không chính xác');
    error.statusCode = 401;
    throw error;
  }

  // Cập nhật thời gian đăng nhập cuối
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Tạo token
  const token = generateToken(user._id);

  return {
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      lastLogin: user.lastLogin,
    },
    token,
  };
};

// ===================================
// Lấy thông tin user hiện tại
// ===================================
const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('Không tìm thấy tài khoản');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

// ===================================
// Cập nhật profile
// ===================================
const updateProfile = async (userId, updateData) => {
  // Chỉ cho phép update các field an toàn
  const allowedFields = ['fullName', 'phone', 'address', 'avatar'];
  const filteredData = {};

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  });

  const user = await User.findByIdAndUpdate(userId, filteredData, {
    new: true,           // Trả về document sau khi update
    runValidators: true, // Chạy validation của schema
  });

  return user;
};

module.exports = { register, login, getMe, updateProfile };