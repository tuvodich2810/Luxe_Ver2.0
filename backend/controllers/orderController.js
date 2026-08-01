const expressAsyncHandler = require('express-async-handler');
const orderService = require('../services/orderService');
const {
  ok,
  created,
  badRequest,
} = require('../utils/apiResponse');

// ===================================
// POST /api/orders
// Tạo đơn hàng
// ===================================
const createOrder = expressAsyncHandler(async (req, res) => {
  const { car } = req.body;

  if (!car) {
    return badRequest(res, 'Vui lòng chọn xe');
  }

  const order = await orderService.createOrder(
    req.user._id,
    req.body
  );

  return created(
    res,
    'Đặt xe thành công',
    order
  );
});

// ===================================
// GET /api/orders/my-orders
// Lấy đơn hàng của User hiện tại
// ===================================
const getMyOrders = expressAsyncHandler(async (req, res) => {
  const result = await orderService.getMyOrders(
    req.user._id,
    req.query
  );

  return ok(
    res,
    'Lấy danh sách đơn hàng thành công',
    result.orders,
    result.meta
  );
});

// ===================================
// GET /api/orders
// Admin lấy tất cả đơn hàng
// ===================================
const getAllOrders = expressAsyncHandler(async (req, res) => {
  const result = await orderService.getAllOrders(
    req.query
  );

  return ok(
    res,
    'Lấy tất cả đơn hàng thành công',
    result.orders,
    result.meta
  );
});

// ===================================
// GET /api/orders/:id
// Xem chi tiết đơn hàng
// User chỉ xem đơn của mình
// Admin xem được tất cả
// ===================================
const getOrderById = expressAsyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(
    req.params.id,
    req.user._id,
    req.user.role === 'admin'
  );

  return ok(
    res,
    'Lấy chi tiết đơn hàng thành công',
    order
  );
});

// ===================================
// PATCH /api/orders/:id/status
// Admin cập nhật trạng thái đơn hàng
//
// orderStatus:
// pending
// confirmed
// processing
// completed
// cancelled
// ===================================
const updateOrderStatus = expressAsyncHandler(async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;

  // Kiểm tra phải có ít nhất một trạng thái
  if (!orderStatus && !paymentStatus) {
    return badRequest(
      res,
      'Vui lòng cung cấp trạng thái cần cập nhật'
    );
  }

  const order = await orderService.updateOrderStatus(
    req.params.id,
    {
      orderStatus,
      paymentStatus,
    }
  );

  return ok(
    res,
    'Cập nhật trạng thái đơn hàng thành công',
    order
  );
});

// ===================================
// PATCH /api/orders/:id/cancel
// User/Admin hủy đơn hàng
// ===================================
const cancelOrder = expressAsyncHandler(async (req, res) => {
  const order = await orderService.cancelOrder(
    req.params.id,
    req.user._id,
    req.user.role === 'admin'
  );

  return ok(
    res,
    'Hủy đơn hàng thành công',
    order
  );
});

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};