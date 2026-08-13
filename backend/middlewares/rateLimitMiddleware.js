// ===================================
// Middleware Rate Limiter chống DDoS / Brute-force
// (Sử dụng Memory Store tự động dọn dẹp bộ nhớ)
// ===================================

/**
 * Hàm tạo Middleware Rate Limiter theo IP
 * @param {Object} options - Cấu hình rate limit
 * @param {number} options.windowMs - Thời gian cửa sổ tính bằng miligiây (VD: 15 * 60 * 1000)
 * @param {number} options.max - Số lượng request tối đa trong cửa sổ thời gian
 * @param {string} options.message - Thông báo lỗi khi vượt quá giới hạn
 */
const createRateLimiter = ({ windowMs, max, message }) => {
  const requests = new Map();

  // Dọn dẹp định kỳ các IP đã hết hạn để tránh rò rỉ bộ nhớ (Memory Leak)
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of requests.entries()) {
      if (now > data.resetTime) {
        requests.delete(ip);
      }
    }
  }, windowMs).unref();

  return (req, res, next) => {
    // Lấy IP của client (hỗ trợ cả đằng sau Reverse Proxy)
    const clientIp =
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    const now = Date.now();
    const record = requests.get(clientIp);

    if (!record || now > record.resetTime) {
      // Khởi tạo bản ghi mới cho IP
      requests.set(clientIp, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    if (record.count >= max) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({
        success: false,
        message: message || 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau.',
        retryAfterSeconds,
      });
    }

    // Tăng số lượng request
    record.count += 1;
    return next();
  };
};

// ===================================
// Cấu hình cụ thể cho từng loại Route
// ===================================

// Hạn chế Brute-force đăng nhập / đăng ký: 10 lần / 15 phút
const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Bạn đã thử đăng nhập/đăng ký quá 10 lần. Vui lòng thử lại sau 15 phút.',
});

// Hạn chế Spam AI Chatbot: 15 tin nhắn / 1 phút
const chatRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 15,
  message: 'Bạn đang gửi tin nhắn chatbot quá nhanh. Vui lòng đợi 1 phút.',
});

// Giới hạn chung cho API: 100 request / 1 phút
const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 100,
  message: 'Hệ thống nhận được quá nhiều yêu cầu từ IP của bạn. Vui lòng thử lại sau 1 phút.',
});

module.exports = {
  createRateLimiter,
  authRateLimiter,
  chatRateLimiter,
  apiRateLimiter,
};

