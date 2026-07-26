const expressAsyncHandler = require('express-async-handler');
const authService = require('../services/authService');
const { created, ok, badRequest } = require('../utils/apiResponse');

// ===================================
// POST /api/auth/register
// ===================================
const register = expressAsyncHandler(async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  // Validate input cơ bản
  if (!fullName || !email || !password) {
    return badRequest(res, 'Vui lòng điền đầy đủ thông tin bắt buộc');
  }

  if (password.length < 6) {
    return badRequest(res, 'Mật khẩu phải có ít nhất 6 ký tự');
  }

  const result = await authService.register({ fullName, email, phone, password });

  return created(res, 'Đăng ký tài khoản thành công', result);
});

// ===================================
// POST /api/auth/login
// ===================================
const login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return badRequest(res, 'Vui lòng nhập email và mật khẩu');
  }

  const result = await authService.login({ email, password });

  return ok(res, 'Đăng nhập thành công', result);
});

// ===================================
// GET /api/auth/me (Yêu cầu đăng nhập)
// ===================================
const getMe = expressAsyncHandler(async (req, res) => {
  // req.user được gắn bởi protect middleware
  const user = await authService.getMe(req.user._id);
  return ok(res, 'Lấy thông tin thành công', user);
});

// ===================================
// PUT /api/auth/profile (Yêu cầu đăng nhập)
// ===================================
const updateProfile = expressAsyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user._id, req.body);
  return ok(res, 'Cập nhật thông tin thành công', user);
});

// ===================================
// POST /api/auth/logout
// Client chỉ cần xóa token ở phía frontend
// ===================================
const logout = expressAsyncHandler(async (req, res) => {
  return ok(res, 'Đăng xuất thành công');
});

module.exports = { register, login, getMe, updateProfile, logout };