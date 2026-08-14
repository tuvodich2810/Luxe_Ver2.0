const expressAsyncHandler = require('express-async-handler');
const authService = require('../services/authService');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/generateToken');
const { created, ok, badRequest, unauthorized } = require('../utils/apiResponse');
const { NODE_ENV } = require('../config/env');

// Helper gửi Dual Token (Access Token + Refresh Token HttpOnly Cookie)
const sendTokenResponse = (user, statusCode, res, message) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'lax',
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  return res.status(statusCode).json({
    success: true,
    message,
    token: accessToken,
    user,
  });
};

// ===================================
// POST /api/auth/register
// ===================================
const register = expressAsyncHandler(async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  if (!fullName || !email || !password) {
    return badRequest(res, 'Vui lòng điền đầy đủ thông tin bắt buộc');
  }

  if (password.length < 6) {
    return badRequest(res, 'Mật khẩu phải có ít nhất 6 ký tự');
  }

  const result = await authService.register({ fullName, email, phone, password });

  return sendTokenResponse(result.user, 201, res, 'Đăng ký tài khoản thành công');
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

  return sendTokenResponse(result.user, 200, res, 'Đăng nhập thành công');
});

// ===================================
// POST /api/auth/refresh
// Cấp lại Access Token từ Refresh Token (HttpOnly Cookie hoặc Body)
// ===================================
const refreshToken = expressAsyncHandler(async (req, res) => {
  const tokenFromCookie = req.cookies?.refreshToken;
  const tokenFromBody = req.body?.refreshToken;
  const token = tokenFromCookie || tokenFromBody;

  if (!token) {
    return unauthorized(res, 'Không tìm thấy Refresh Token. Vui lòng đăng nhập lại');
  }

  const decoded = verifyToken(token);
  if (!decoded || !decoded.id) {
    return unauthorized(res, 'Refresh Token không hợp lệ hoặc đã hết hạn');
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    return unauthorized(res, 'Tài khoản không tồn tại hoặc đã bị vô hiệu hóa');
  }

  const newAccessToken = generateAccessToken(user._id);

  return ok(res, 'Cấp Access Token thành công', {
    token: newAccessToken,
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
    },
  });
});

// ===================================
// GET /api/auth/me (Yêu cầu đăng nhập)
// ===================================
const getMe = expressAsyncHandler(async (req, res) => {
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
// PUT /api/auth/change-password (Yêu cầu đăng nhập)
// ===================================
const changePassword = expressAsyncHandler(async (req, res) => {
  const result = await authService.changePassword(req.user._id, req.body);
  return ok(res, result.message);
});

// ===================================
// POST /api/auth/logout
// ===================================
const logout = expressAsyncHandler(async (req, res) => {
  res.cookie('refreshToken', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  return ok(res, 'Đăng xuất thành công');
});

module.exports = { register, login, refreshToken, getMe, updateProfile, changePassword, logout };