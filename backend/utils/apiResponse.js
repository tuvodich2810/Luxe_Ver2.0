// ===================================
// Response thành công
// ===================================
const successResponse = (res, statusCode, message, data = null, meta = null) => {
  const response = {
    success: true,
    message,
  };

  // Thêm data nếu có
  if (data !== null) {
    response.data = data;
  }

  // Thêm meta (pagination, count...) nếu có
  if (meta !== null) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

// ===================================
// Response lỗi
// ===================================
const errorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message,
  };

  // Thêm chi tiết lỗi validation nếu có
  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

// ===================================
// Shortcuts cho các loại response phổ biến
// ===================================
const created = (res, message, data) => successResponse(res, 201, message, data);
const ok = (res, message, data, meta) => successResponse(res, 200, message, data, meta);
const badRequest = (res, message, errors) => errorResponse(res, 400, message, errors);
const unauthorized = (res, message = 'Bạn chưa đăng nhập') => errorResponse(res, 401, message);
const forbidden = (res, message = 'Bạn không có quyền thực hiện hành động này') => errorResponse(res, 403, message);
const notFound = (res, message = 'Không tìm thấy') => errorResponse(res, 404, message);
const serverError = (res, message = 'Lỗi máy chủ, vui lòng thử lại') => errorResponse(res, 500, message);

module.exports = {
  successResponse,
  errorResponse,
  created,
  ok,
  notFound,
  badRequest,
  unauthorized,
  forbidden,
  serverError,
};