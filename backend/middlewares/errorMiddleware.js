const { NODE_ENV } = require('../config/env');

// ===================================
// Handler cho route không tồn tại (404)
// ===================================
const notFound = (req, res, next) => {
  const error = new Error(`Không tìm thấy đường dẫn: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// ===================================
// Handler lỗi toàn cục
// Express nhận biết error handler vì có 4 tham số (err, req, res, next)
// ===================================
const errorHandler = (err, req, res, next) => {
  // Nếu status code vẫn là 200 (Express chưa set status khi lỗi) → đổi thành 500
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Lỗi máy chủ không xác định';

  // Xử lý lỗi Mongoose: CastError (ID không hợp lệ)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Không tìm thấy tài nguyên (ID không hợp lệ)';
  }

  // Xử lý lỗi Mongoose: Duplicate key (email, slug trùng)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Giá trị '${err.keyValue[field]}' đã tồn tại trong trường '${field}'`;
  }

  // Xử lý lỗi Mongoose: Validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // Xử lý JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token không hợp lệ';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token đã hết hạn';
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Chỉ trả stack trace trong môi trường development
    stack: NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = { notFound, errorHandler };