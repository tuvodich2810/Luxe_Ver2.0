const expressAsyncHandler = require('express-async-handler');
const orderService = require('../services/orderService');
const { ok, created, badRequest } = require('../utils/apiResponse');

// ===================================
// POST /api/orders
// Tạo đơn hàng đặt cọc xe
// ===================================
const createOrder = expressAsyncHandler(async (req, res) => {
  const { car } = req.body;

  if (!car) {
    return badRequest(res, 'Vui lòng chọn xe');
  }

  const order = await orderService.createOrder(req.user._id, req.body);

  return created(res, 'Đặt cọc xe thành công', order);
});

// ===================================
// GET /api/orders/my-orders
// Lấy đơn hàng của User hiện tại
// ===================================
const getMyOrders = expressAsyncHandler(async (req, res) => {
  const result = await orderService.getMyOrders(req.user._id, req.query);

  return ok(res, 'Lấy danh sách đơn hàng thành công', result.orders, result.meta);
});

// ===================================
// GET /api/orders
// Lấy tất cả đơn hàng (Dành cho Admin, Giám đốc, Quản lý, Sales)
// ===================================
const getAllOrders = expressAsyncHandler(async (req, res) => {
  const result = await orderService.getAllOrders(req.query);

  return ok(res, 'Lấy tất cả đơn hàng thành công', result.orders, result.meta);
});

// ===================================
// GET /api/orders/:id
// Xem chi tiết đơn hàng
// ===================================
const getOrderById = expressAsyncHandler(async (req, res) => {
  const isStaff = ['admin', 'giam_doc', 'quan_ly', 'sales', 'cskh'].includes(req.user.role);
  const order = await orderService.getOrderById(req.params.id, req.user._id, isStaff);

  return ok(res, 'Lấy chi tiết đơn hàng thành công', order);
});

// ===================================
// PATCH /api/orders/:id/status
// Cập nhật / Phê duyệt trạng thái đơn hàng
// ===================================
const updateOrderStatus = expressAsyncHandler(async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;

  if (!orderStatus && !paymentStatus) {
    return badRequest(res, 'Vui lòng cung cấp trạng thái cần cập nhật');
  }

  const validOrderStatuses = ['pending', 'confirmed', 'approved', 'processing', 'delivered', 'completed', 'cancelled'];
  const validPaymentStatuses = ['pending', 'deposit_paid', 'fully_paid', 'refunded', 'failed'];

  if (orderStatus && !validOrderStatuses.includes(orderStatus)) {
    return badRequest(res, `Trạng thái đơn hàng không hợp lệ: ${orderStatus}`);
  }
  if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
    return badRequest(res, `Trạng thái thanh toán không hợp lệ: ${paymentStatus}`);
  }

  const order = await orderService.updateOrderStatus(req.params.id, {
    orderStatus,
    paymentStatus,
  });

  return ok(res, 'Cập nhật phê duyệt đơn hàng thành công', order);
});

// ===================================
// PATCH /api/orders/:id/cancel
// Hủy đơn hàng
// ===================================
const cancelOrder = expressAsyncHandler(async (req, res) => {
  const isStaff = ['admin', 'giam_doc', 'quan_ly', 'sales'].includes(req.user.role);
  const order = await orderService.cancelOrder(req.params.id, req.user._id, isStaff);

  return ok(res, 'Hủy đơn hàng thành công', order);
});

// ===================================
// POST /api/orders/:id/create-payment-link
// Tạo link thanh toán & QR Code động PayOS
// ===================================
const createPayOSPaymentLink = expressAsyncHandler(async (req, res) => {
  const isStaff = ['admin', 'giam_doc', 'quan_ly', 'sales'].includes(req.user?.role);
  const paymentData = await orderService.createPayOSPaymentLink(req.params.id, req.user._id, isStaff);

  return ok(res, 'Tạo link thanh toán PayOS thành công', paymentData);
});

// ===================================
// POST /api/orders/payos-webhook
// Webhook tự động nhận thông báo chuyển khoản từ PayOS (Public, Verify Signature)
// ===================================
const handlePayOSWebhook = expressAsyncHandler(async (req, res) => {
  const result = await orderService.processPayOSWebhook(req.body);

  return ok(res, result.message, result);
});

// ===================================
// GET /api/orders/:id/payment-status
// Lấy trạng thái thanh toán cho Frontend Polling & tự động hủy đơn hết hạn
// ===================================
const getPaymentStatus = expressAsyncHandler(async (req, res) => {
  const isStaff = ['admin', 'giam_doc', 'quan_ly', 'sales', 'cskh'].includes(req.user?.role);
  const statusData = await orderService.getPaymentStatus(req.params.id, req.user._id, isStaff);

  return ok(res, 'Lấy trạng thái thanh toán thành công', statusData);
});

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  createPayOSPaymentLink,
  handlePayOSWebhook,
  getPaymentStatus,
};