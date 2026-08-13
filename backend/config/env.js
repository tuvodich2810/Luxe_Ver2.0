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
  SMTP_HOST: process.env.SMTP_HOST || process.env.EMAIL_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT, 10) || 587,
  SMTP_USER: process.env.SMTP_USER || process.env.EMAIL_USER,
  SMTP_PASS: process.env.SMTP_PASS || process.env.EMAIL_PASS,
  FROM_EMAIL: process.env.FROM_EMAIL || process.env.EMAIL_FROM || 'no-reply@luxemotors.com',
  FROM_NAME: process.env.FROM_NAME || 'Luxe Motors Showroom',

  // Zalo Official Account (OA) Credentials
  ZALO_OA_ID: process.env.ZALO_OA_ID || '',
  ZALO_ACCESS_TOKEN: process.env.ZALO_ACCESS_TOKEN || '',
  ZALO_APP_ID: process.env.ZALO_APP_ID || '',
  ZALO_SECRET_KEY: process.env.ZALO_SECRET_KEY || '',

  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',

  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GROQ_MODEL: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',

  PAYOS_CLIENT_ID: process.env.PAYOS_CLIENT_ID || '',
  PAYOS_API_KEY: process.env.PAYOS_API_KEY || '',
  PAYOS_CHECKSUM_KEY: process.env.PAYOS_CHECKSUM_KEY || '',

  // Cấu hình Ngân hàng & Mã QR VietQR cá nhân
  BANK_CODE: process.env.BANK_CODE || 'MB',
  BANK_NAME: process.env.BANK_NAME || 'MBBank (Ngân hàng Quân Đội)',
  BANK_ACCOUNT_NO: process.env.BANK_ACCOUNT_NO || '0372950720',
  BANK_ACCOUNT_NAME: process.env.BANK_ACCOUNT_NAME || 'LUXE MOTORS SHOWROOM',
  STATIC_QR_URL: process.env.STATIC_QR_URL || '',
};