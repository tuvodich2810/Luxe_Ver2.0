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

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};