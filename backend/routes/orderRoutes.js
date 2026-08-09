const express = require('express');
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} = require('../controllers/orderController');

const { protect } = require('../middlewares/authMiddleware');
const { staffOnly } = require('../middlewares/adminMiddleware');

// ===================================
// USER & STAFF CONTRACT ROUTES
// ===================================

// Tạo đơn hàng
router.post('/', protect, createOrder);

// Lấy đơn hàng của mình
router.get('/my-orders', protect, getMyOrders);

// Xem chi tiết đơn hàng (Dành cho User & Nhân sự các phân hệ)
router.get('/:id', protect, getOrderById);

// Hủy đơn hàng (Dành cho User & Nhân sự các phân hệ)
router.patch('/:id/cancel', protect, cancelOrder);

// ===================================
// ADMIN / EXECUTIVES / MANAGEMENT / SALES / CSKH
// ===================================

// Lấy tất cả đơn hàng
router.get('/', protect, staffOnly, getAllOrders);

// Cập nhật / Phê duyệt trạng thái đơn hàng (Duyệt cọc, Làm hồ sơ, Bàn giao xe, Hủy)
router.patch('/:id/status', protect, staffOnly, updateOrderStatus);

// Cập nhật đơn hàng qua PUT
router.put('/:id/status', protect, staffOnly, updateOrderStatus);
router.put('/:id', protect, staffOnly, updateOrderStatus);

module.exports = router;