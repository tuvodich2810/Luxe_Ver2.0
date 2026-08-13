const express = require('express');
const router = express.Router();
const { getDashboardStats, getCRMStats, seedDatabaseController } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { hasRole } = require('../middlewares/adminMiddleware');

// Route thống kê Dashboard Admin & CRM Doanh thu
// Mở cho Admin và Giám Đốc (giam_doc) cùng xem dữ liệu từ một nguồn MongoDB duy nhất
router.get('/dashboard', protect, hasRole('admin', 'giam_doc', 'quan_ly'), getDashboardStats);
router.get('/crm', protect, hasRole('admin', 'giam_doc'), getCRMStats);
router.post('/seed-data', protect, hasRole('admin', 'giam_doc'), seedDatabaseController);

module.exports = router;
