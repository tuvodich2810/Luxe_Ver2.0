const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

// ===================================
// Load config trước tiên
// ===================================
const {
  PORT,
  NODE_ENV,
  FRONTEND_URL,
  UPLOAD_PATH,
} = require('./config/env');

const connectDB = require('./config/db');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const colors = require('colors');

// ===================================
// Import Routes
// ===================================
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const brandRoutes = require('./routes/brandRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const imageRoutes = require('./routes/imageRoutes');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const orderRoutes = require('./routes/orderRoutes');
const chatRoutes = require('./routes/chatRoutes');
const adminRoutes = require('./routes/adminRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

// ===================================
// Import Middlewares
// ===================================
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const { apiRateLimiter } = require('./middlewares/rateLimitMiddleware');

// ===================================
// Khởi tạo Express app
// ===================================
const app = express();

// ===================================
// Kết nối Database
// ===================================
connectDB();

// ===================================
// Security Middlewares
// ===================================
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Cho phép load ảnh từ domain khác
  })
);

// ===================================
// CORS Configuration (Cho phép mọi phương thức GET, POST, PUT, PATCH, DELETE, OPTIONS)
// ===================================
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'https://luxe-ver2-0.vercel.app',
  ...(FRONTEND_URL ? [FRONTEND_URL.replace(/\/$/, '')] : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép requests không có origin (Postman, mobile app, server-to-server)
      if (!origin) return callback(null, true);
      
      const cleanOrigin = origin.replace(/\/$/, '');

      // Cho phép mọi port localhost, các domain trong allowedOrigins, hoặc BẤT KỲ domain Vercel / Render nào
      if (
        allowedOrigins.includes(cleanOrigin) ||
        cleanOrigin.endsWith('.vercel.app') ||
        cleanOrigin.includes('vercel.app') ||
        cleanOrigin.endsWith('.onrender.com') ||
        cleanOrigin.includes('localhost') ||
        cleanOrigin.includes('127.0.0.1') ||
        /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(cleanOrigin)
      ) {
        return callback(null, true);
      }
      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  })
);

const cookieParser = require('cookie-parser');

// ===================================
// Request Parsing
// ===================================
app.use(express.json({ limit: '10mb' }));                   // Parse JSON body
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse form data
const { mongoSanitizeMiddleware } = require('./middlewares/sanitizeMiddleware');
app.use(mongoSanitizeMiddleware); // Chống NoSQL Query Injection

// ===================================
// Logger (chỉ trong development)
// ===================================
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ===================================
// Serve static files (ảnh đã upload)
// ===================================
app.use('/uploads', express.static(path.resolve(UPLOAD_PATH || './uploads')));

// ===================================
// Health check
// ===================================
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Luxe Motors API đang hoạt động',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ===================================
// API Routes
// ===================================
app.use('/api', apiRateLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/favorites', favoriteRoutes);

// ===================================
// Error Handling (phải đặt sau tất cả routes)
// ===================================
app.use(notFound);
app.use(errorHandler);

// ===================================
// Khởi động server
// ===================================
const server = app.listen(PORT || 5000, () => {
  console.log(
    `\n🚀 Luxe Motors Server đang chạy`.green.bold +
    `\n   Môi trường: ${NODE_ENV || 'development'}`.yellow +
    `\n   Cổng: ${PORT || 5000}`.cyan +
    `\n   API: http://localhost:${PORT || 5000}/api`.cyan +
    `\n`
  );
});

// ===================================
// Xử lý lỗi bất đồng bộ không được bắt
// ===================================
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Promise Rejection: ${err.message}`.red);
  server.close(() => process.exit(1));
});

// Xử lý SIGTERM
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM nhận được, đóng server...'.yellow);
  server.close(() => {
    console.log('✅ Server đã đóng'.green);
    process.exit(0);
  });
});

module.exports = app;