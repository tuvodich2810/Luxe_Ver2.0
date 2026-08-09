// ===================================
// Middleware Rate Limiter chống DDoS / Brute-force
// (Đã tắt / vô hiệu hóa tính năng giới hạn IP theo yêu cầu để phát triển & test mượt mà)
// ===================================

/**
 * Hàm tạo Middleware Rate Limiter (Bypass tự do)
 */
const createRateLimiter = () => {
  return (req, res, next) => {
    // Tắt tính năng giới hạn truy vấn IP -> Cho phép mọi request qua ngay lập tức
    return next();
  };
};

// Vô hiệu hóa toàn bộ Rate Limiters
const authRateLimiter = createRateLimiter();
const chatRateLimiter = createRateLimiter();
const apiRateLimiter = createRateLimiter();

module.exports = {
  createRateLimiter,
  authRateLimiter,
  chatRateLimiter,
  apiRateLimiter,
};
