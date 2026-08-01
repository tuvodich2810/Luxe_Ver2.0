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
const { adminOnly } = require('../middlewares/adminMiddleware');

// ===================================
// USER
// ===================================

// Tạo đơn hàng
router.post('/', protect, createOrder);

// Lấy đơn hàng của mình
router.get('/my-orders', protect, getMyOrders);

// Xem chi tiết đơn hàng
router.get('/:id', protect, getOrderById);

// Hủy đơn hàng
router.patch('/:id/cancel', protect, cancelOrder);

// ===================================
// ADMIN
// ===================================

// Lấy tất cả đơn hàng
router.get('/', protect, adminOnly, getAllOrders);

// Cập nhật trạng thái đơn hàng
router.patch(
  '/:id/status',
  protect,
  adminOnly,
  updateOrderStatus
);

module.exports = router;