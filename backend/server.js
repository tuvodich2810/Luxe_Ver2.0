// ===================================
// Load config trước tiên
// ===================================
const { PORT, NODE_ENV, FRONTEND_URL, UPLOAD_PATH } = require('./config/env');
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

// ===================================
// Import Middlewares
// ===================================
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

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
// Helmet thêm các security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Cho phép load ảnh từ domain khác
  })
);

// ===================================
// CORS Configuration
// ===================================
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,          // Cho phép gửi cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ===================================
// Request Parsing
// ===================================
app.use(express.json({ limit: '10mb' }));                   // Parse JSON body
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse form data

// ===================================
// Logger (chỉ trong development)
// ===================================
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ===================================
// Serve static files (ảnh đã upload)
// ===================================
app.use('/uploads', express.static(path.resolve(UPLOAD_PATH)));

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
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRoutes);
// ===================================
// Error Handling (phải đặt sau tất cả routes)
// ===================================
app.use(notFound);
app.use(errorHandler);

// ===================================
// Khởi động server
// ===================================
const server = app.listen(PORT, () => {
  console.log(
    `\n🚀 Luxe Motors Server đang chạy`.green.bold +
    `\n   Môi trường: ${NODE_ENV}`.yellow +
    `\n   Cổng: ${PORT}`.cyan +
    `\n   API: http://localhost:${PORT}/api`.cyan +
    `\n`
  );
});

// ===================================
// Xử lý lỗi bất đồng bộ không được bắt
// ===================================
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Promise Rejection: ${err.message}`.red);
  // Đóng server gracefully trước khi thoát
  server.close(() => process.exit(1));
});

// Xử lý SIGTERM (khi deploy container bị stop)
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM nhận được, đóng server...'.yellow);
  server.close(() => {
    console.log('✅ Server đã đóng'.green);
    process.exit(0);
  });
});

module.exports = app;