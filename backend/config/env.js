// Tải biến môi trường từ file .env
const dotenv = require('dotenv');
dotenv.config();

// Danh sách các biến bắt buộc phải có
const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'JWT_EXPIRE',
];

const path = require("path");
// Kiểm tra từng biến bắt buộc
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

// Nếu thiếu biến nào → dừng chương trình ngay
if (missingVars.length > 0) {
  console.error(`❌ Thiếu biến môi trường bắt buộc: ${missingVars.join(', ')}`);
  process.exit(1);
}

// Export tất cả config đã được validate
module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024,
  UPLOAD_PATH: path.resolve(process.env.UPLOAD_PATH || './public/uploads'),
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT, 10) || 587,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};