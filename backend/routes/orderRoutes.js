const express = require('express');
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  createPayOSPaymentLink,
  handlePayOSWebhook,
  getPaymentStatus,
} = require('../controllers/orderController');

const { protect } = require('../middlewares/authMiddleware');
const { staffOnly, hasRole } = require('../middlewares/adminMiddleware');

// ===================================
// PAYOS WEBHOOK (PUBLIC - VERIFY SIGNATURE IN CONTROLLER)
// ===================================
router.post('/payos-webhook', handlePayOSWebhook);

// ===================================
// USER & STAFF CONTRACT ROUTES
// ===================================

// Tạo đơn hàng
router.post('/', protect, createOrder);

// Lấy đơn hàng của mình
router.get('/my-orders', protect, getMyOrders);

// Tạo link thanh toán PayOS & QR động
router.post('/:id/create-payment-link', protect, createPayOSPaymentLink);

// Trạng thái thanh toán cho Frontend Polling
router.get('/:id/payment-status', protect, getPaymentStatus);

// Xem chi tiết đơn hàng (Dành cho User & Nhân sự các phân hệ)
router.get('/:id', protect, getOrderById);

// Hủy đơn hàng (Dành cho User & Nhân sự các phân hệ)
router.patch('/:id/cancel', protect, cancelOrder);

// ===================================
// ADMIN / EXECUTIVES / MANAGEMENT / SALES / CSKH
// ===================================

// Lấy tất cả đơn hàng (Nhân sự CSKH được phép xem danh sách đơn)
router.get('/', protect, staffOnly, getAllOrders);

// Cập nhật / Phê duyệt trạng thái đơn hàng (CHỈ DÀNH CHO Admin, Giám Đốc, Quản Lý, Sales. CSKH KHÔNG CÓ QUYỀN DUYỆT CỌC)
const orderApprovalRoles = hasRole('admin', 'giam_doc', 'quan_ly', 'sales');
router.patch('/:id/status', protect, orderApprovalRoles, updateOrderStatus);
router.put('/:id/status', protect, orderApprovalRoles, updateOrderStatus);
router.put('/:id', protect, orderApprovalRoles, updateOrderStatus);

module.exports = router;