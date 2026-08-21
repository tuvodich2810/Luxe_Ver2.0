// Tải biến môi trường từ file .env
const dotenv = require('dotenv');
dotenv.config();

const DEFAULT_MONGO_URI = 'mongodb+srv://tuankwan2810_db_user:GVP3q082yxRV8PQA@cluster0.rw2tjas.mongodb.net/luxurymoto?retryWrites=true&w=majority&appName=Cluster0';
const DEFAULT_JWT_SECRET = 'luxe_motors_jwt_secret_key_2024_very_long_and_secure';
const path = require("path");

// Export tất cả config đã được validate kèm fallback an toàn
module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'production',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGO_URI: process.env.MONGO_URI || DEFAULT_MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024,
  UPLOAD_PATH: path.resolve(process.env.UPLOAD_PATH || './public/uploads'),
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT, 10) || 587,
  EMAIL_USER: process.env.EMAIL_USER || 'tuankwan2810@gmail.com',
  EMAIL_PASS: process.env.EMAIL_PASS || 'jwdyeuelkgblorik',
  EMAIL_FROM: process.env.EMAIL_FROM || 'Luxe Motors Showroom <tuankwan2810@gmail.com>',
  SMTP_HOST: process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT, 10) || 587,
  SMTP_USER: process.env.SMTP_USER || process.env.EMAIL_USER || 'tuankwan2810@gmail.com',
  SMTP_PASS: process.env.SMTP_PASS || process.env.EMAIL_PASS || 'jwdyeuelkgblorik',
  FROM_EMAIL: process.env.FROM_EMAIL || process.env.EMAIL_FROM || 'tuankwan2810@gmail.com',
  FROM_NAME: process.env.FROM_NAME || 'Luxe Motors Showroom',


  // Zalo Official Account (OA) Credentials
  ZALO_OA_ID: process.env.ZALO_OA_ID || '',
  ZALO_ACCESS_TOKEN: process.env.ZALO_ACCESS_TOKEN || '',
  ZALO_APP_ID: process.env.ZALO_APP_ID || '',
  ZALO_SECRET_KEY: process.env.ZALO_SECRET_KEY || '',

  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',

  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GROQ_MODEL: process.env.GROQ_MODEL || 'groq/compound-mini',

  PAYOS_CLIENT_ID: process.env.PAYOS_CLIENT_ID || '',
  PAYOS_API_KEY: process.env.PAYOS_API_KEY || '',
  PAYOS_CHECKSUM_KEY: process.env.PAYOS_CHECKSUM_KEY || '',

  // HTTPS Email API (Dành riêng cho Render Free Cloud qua Port 443 không bao giờ bị chặn)
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  BREVO_API_KEY: process.env.BREVO_API_KEY || '',

  // Cấu hình Ngân hàng & Mã QR VietQR cá nhân
  BANK_CODE: process.env.BANK_CODE || 'MB',
  BANK_NAME: process.env.BANK_NAME || 'MBBank (Ngân hàng Quân Đội)',
  BANK_ACCOUNT_NO: process.env.BANK_ACCOUNT_NO || '0372950720',
  BANK_ACCOUNT_NAME: process.env.BANK_ACCOUNT_NAME || 'LUXE MOTORS SHOWROOM',
  STATIC_QR_URL: process.env.STATIC_QR_URL || '',
};