/**
 * Middleware làm sạch dữ liệu chống NoSQL Injection ($gt, $ne, $regex...)
 */
const sanitizeNoSQL = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeNoSQL);
  }

  const sanitized = {};
  for (const key of Object.keys(obj)) {
    // Chặn các key chứa ký tự $ (toán tử NoSQL Injection)
    if (key.startsWith('$')) {
      continue;
    }
    sanitized[key] = sanitizeNoSQL(obj[key]);
  }
  return sanitized;
};

const mongoSanitizeMiddleware = (req, res, next) => {
  if (req.body) req.body = sanitizeNoSQL(req.body);
  if (req.query) req.query = sanitizeNoSQL(req.query);
  if (req.params) req.params = sanitizeNoSQL(req.params);
  next();
};

module.exports = { sanitizeNoSQL, mongoSanitizeMiddleware };
