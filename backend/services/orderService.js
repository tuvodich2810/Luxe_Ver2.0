const Order = require('../models/Order');
const Car = require('../models/Car');
const User = require('../models/User');
const mongoose = require('mongoose');
const emailService = require('./emailService');
const notificationService = require('./notificationService');

// ===================================
// Tạo đơn hàng
// ===================================
const createOrder = async (userId, orderData) => {
  const {
    car: carId,
    depositAmount = 0,
    paymentMethod = 'bank_transfer',
    deliveryAddress = '',
    notes = '',
  } = orderData;

  // ===================================
  // Kiểm tra User ID
  // ===================================
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error('ID người dùng không hợp lệ');
    error.statusCode = 400;
    throw error;
  }

  // ===================================
  // Kiểm tra Car ID
  // ===================================
  if (!mongoose.Types.ObjectId.isValid(carId)) {
    const error = new Error('ID xe không hợp lệ');
    error.statusCode = 400;
    throw error;
  }

  // ===================================
  // Tìm xe
  // ===================================
  const car = await Car.findById(carId).populate('brand', 'name');

  if (!car) {
    const error = new Error('Không tìm thấy xe');
    error.statusCode = 404;
    throw error;
  }

  // ===================================
  // Kiểm tra xe còn hàng
  // ===================================
  if (!car.inStock || car.stockCount <= 0) {
    const error = new Error('Xe hiện đã hết hàng');
    error.statusCode = 400;
    throw error;
  }

  // ===================================
  // Kiểm tra tiền cọc
  // ===================================
  const deposit = Number(depositAmount);

  if (!Number.isFinite(deposit) || deposit < 0) {
    const error = new Error('Tiền cọc không hợp lệ');
    error.statusCode = 400;
    throw error;
  }

  // ===================================
  // Lấy giá hiện tại (Quy đổi sang VNĐ nếu DB lưu USD)
  // ===================================
  let currentPrice =
    car.salePrice &&
    car.salePrice > 0 &&
    car.salePrice < car.price
      ? car.salePrice
      : car.price;

  // ===================================
  // Tiền cọc không được vượt quá giá xe
  // ===================================
  if (deposit > currentPrice) {
    const error = new Error(
      'Tiền cọc không được lớn hơn giá xe'
    );
    error.statusCode = 400;
    throw error;
  }

  // ===================================
  // Kiểm tra phương thức thanh toán
  // ===================================
  const paymentMethods = [
    'cash',
    'bank_transfer',
    'installment',
  ];

  if (!paymentMethods.includes(paymentMethod)) {
    const error = new Error(
      'Phương thức thanh toán không hợp lệ'
    );
    error.statusCode = 400;
    throw error;
  }

  // ===================================
  // Snapshot thông tin xe
  // Lưu lại thông tin xe tại thời điểm đặt
  // ===================================
  const carSnapshot = {
    name: car.name,
    brand: car.brand?.name || '',
    model: car.model,
    year: car.year,
    image:
      car.mainImage ||
      car.images?.[0]?.url ||
      '',
    price: currentPrice,
  };

  // ===================================
  // Giảm số lượng xe trong kho & Tạo đơn qua Mongoose ACID Transaction
  // Ngăn ngừa lỗi Concurrency & Hỏng dữ liệu (Data Corruption)
  // ===================================
  const session = await mongoose.startSession().catch(() => null);
  if (session) session.startTransaction();

  try {
    const updatedCar = await Car.findOneAndUpdate(
      {
        _id: car._id,
        inStock: true,
        stockCount: { $gt: 0 },
      },
      {
        $inc: { stockCount: -1 },
      },
      { new: true, session: session || undefined }
    );

    if (!updatedCar) {
      const error = new Error('Xe vừa hết hàng tại thời điểm bạn đặt mua');
      error.statusCode = 400;
      throw error;
    }

    if (updatedCar.stockCount <= 0) {
      await Car.findByIdAndUpdate(
        car._id,
        { $set: { inStock: false, stockCount: 0 } },
        { session: session || undefined }
      );
    }

    // Tạo đơn hàng trong MongoDB
    const orders = await Order.create(
      [
        {
          user: userId,
          car: car._id,
          carSnapshot,
          depositAmount: deposit,
          totalAmount: currentPrice,
          paymentMethod,
          deliveryAddress,
          notes,
          statusHistory: [
            {
              status: 'pending',
              note: 'Đơn hàng vừa được tạo trên hệ thống',
              changedAt: new Date(),
            },
          ],
        },
      ],
      { session: session || undefined }
    );

    const order = orders[0];

    if (session) {
      await session.commitTransaction();
      session.endSession();
    }

    // Gửi thông báo đa kênh Email + Zalo (Async non-blocking)
    notificationService.triggerOrderCreated(order);

    return order;
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    } else {
      // Fallback Rollback cho Standalone Mongo: hoàn lại stock nếu tạo đơn thất bại
      await Car.findByIdAndUpdate(car._id, {
        $inc: { stockCount: 1 },
        $set: { inStock: true },
      }).catch(() => {});
    }
    throw error;
  }
};

// ===================================
// [ADMIN] Lấy tất cả đơn hàng
// ===================================
const getAllOrders = async (queryParams = {}) => {
  const {
    page = 1,
    limit = 20,
    orderStatus,
    paymentStatus,
    userId,
  } = queryParams;

  const filter = {};
  if (orderStatus) filter.orderStatus = orderStatus;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (userId && mongoose.Types.ObjectId.isValid(userId)) filter.user = userId;

  const pageNumber = Math.max(1, parseInt(page, 10) || 1);
  const limitNumber = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNumber - 1) * limitNumber;

  // ===================================
  // Lấy danh sách Order
  // ===================================
  const [orders, total] =
    await Promise.all([
      Order.find(filter)
        .populate(
          'user',
          'fullName email phone'
        )
        .populate(
          'car',
          'name slug images'
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limitNumber)
        .lean(),

      Order.countDocuments(filter),
    ]);

  // ===================================
  // DEBUG KẾT QUẢ
  // ===================================
  console.log(
    'Total theo filter:',
    total
  );

  console.log(
    'Orders trả về:',
    orders.length
  );

  console.log(
    'Orders:',
    JSON.stringify(
      orders,
      null,
      2
    )
  );

  console.log(
    '====================================\n'
  );

  // ===================================
  // Trả kết quả
  // ===================================
  return {
    orders,

    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(
        total / limitNumber
      ),
    },
  };
};
// ===================================
// [USER]
// Lấy đơn hàng của chính mình
// GET /api/orders/my-orders
// ===================================
const getMyOrders = async (
  userId,
  queryParams = {}
) => {
  const {
    page = 1,
    limit = 20,
    orderStatus,
  } = queryParams;

  const filter = {
    user: userId,
  };

  if (orderStatus) {
    filter.orderStatus = orderStatus;
  }

  const pageNumber = Math.max(
    1,
    parseInt(page, 10) || 1
  );

  const limitNumber = Math.min(
    50,
    Math.max(1, parseInt(limit, 10) || 20)
  );

  const skip =
    (pageNumber - 1) * limitNumber;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate(
        'user',
        'fullName email phone'
      )
      .populate(
        'car',
        'name slug mainImage brand'
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),

    Order.countDocuments(filter),
  ]);

  return {
    orders,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(
        total / limitNumber
      ),
    },
  };
};

// ===================================
// Lấy chi tiết đơn hàng
// Admin xem được tất cả
// User chỉ xem được đơn của mình
// ===================================
const getOrderById = async (
  orderId,
  userId,
  isAdmin = false
) => {
  if (
    !mongoose.Types.ObjectId.isValid(orderId)
  ) {
    const error = new Error(
      'ID đơn hàng không hợp lệ'
    );
    error.statusCode = 400;
    throw error;
  }

  const order = await Order.findById(orderId)
    .populate(
      'user',
      'fullName email phone'
    )
    .populate(
      'car',
      'name slug mainImage'
    );

  if (!order) {
    const error = new Error(
      'Không tìm thấy đơn hàng'
    );
    error.statusCode = 404;
    throw error;
  }

  // User chỉ được xem đơn của mình
  if (
    !isAdmin &&
    order.user &&
    order.user._id.toString() !==
      userId.toString()
  ) {
    const error = new Error(
      'Bạn không có quyền xem đơn hàng này'
    );
    error.statusCode = 403;
    throw error;
  }

  return order;
};

// ===================================
// [ADMIN]
// Cập nhật trạng thái đơn hàng
// PATCH /api/orders/:id/status
// ===================================
const updateOrderStatus = async (
  orderId,
  updateData
) => {
  if (
    !mongoose.Types.ObjectId.isValid(orderId)
  ) {
    const error = new Error(
      'ID đơn hàng không hợp lệ'
    );
    error.statusCode = 400;
    throw error;
  }

  const {
    orderStatus,
    paymentStatus,
  } = updateData;

  // ===================================
  // Trạng thái đơn hàng hợp lệ
  // Phải khớp với Order.js
  // ===================================
  const validOrderStatuses = [
    'pending',
    'confirmed',
    'approved',
    'processing',
    'delivered',
    'completed',
    'cancelled',
  ];

  // ===================================
  // Trạng thái thanh toán hợp lệ
  // ===================================
  const validPaymentStatuses = [
    'pending',
    'deposit_paid',
    'fully_paid',
    'refunded',
    'failed',
  ];

  if (
    orderStatus &&
    !validOrderStatuses.includes(orderStatus)
  ) {
    const error = new Error(
      'Trạng thái đơn hàng không hợp lệ'
    );
    error.statusCode = 400;
    throw error;
  }

  if (
    paymentStatus &&
    !validPaymentStatuses.includes(
      paymentStatus
    )
  ) {
    const error = new Error(
      'Trạng thái thanh toán không hợp lệ'
    );
    error.statusCode = 400;
    throw error;
  }

  const updateFields = {};

  if (orderStatus) {
    updateFields.orderStatus = orderStatus;
    if (orderStatus === 'completed') {
      updateFields.paymentStatus = 'fully_paid';
    } else if (orderStatus === 'cancelled') {
      updateFields.paymentStatus = 'refunded';
    }
  }

  if (paymentStatus) {
    updateFields.paymentStatus = paymentStatus;
  }

  if (Object.keys(updateFields).length === 0) {
    const error = new Error('Không có dữ liệu để cập nhật');
    error.statusCode = 400;
    throw error;
  }

  const updateQuery = { $set: updateFields };

  if (orderStatus) {
    updateQuery.$push = {
      statusHistory: {
        status: orderStatus,
        note: 'Cập nhật từ quản trị viên',
        changedAt: new Date(),
      },
    };
  }

  const oldOrder = await Order.findById(orderId);
  if (!oldOrder) {
    const error = new Error('Không tìm thấy đơn hàng');
    error.statusCode = 404;
    throw error;
  }
  const oldStatus = oldOrder.orderStatus;

  const order = await Order.findByIdAndUpdate(orderId, updateQuery, {
    new: true,
    runValidators: true,
  })
      .populate(
        'user',
        'fullName email phone'
      )
      .populate(
        'car',
        'name slug mainImage'
      );

  if (!order) {
    const error = new Error(
      'Không tìm thấy đơn hàng'
    );
    error.statusCode = 404;
    throw error;
  }

  // Gửi thông báo đa kênh Email + Zalo khi thay đổi trạng thái đơn
  if (oldStatus !== order.orderStatus) {
    notificationService.triggerOrderStatusChanged(order, order.user, oldStatus, order.orderStatus);
  }

  return order;
};

// ===================================
// Hủy đơn hàng
// User chỉ hủy đơn của mình
// Admin hủy mọi đơn
// PATCH /api/orders/:id/cancel
// ===================================
const cancelOrder = async (
  orderId,
  userId,
  isAdmin = false
) => {
  if (
    !mongoose.Types.ObjectId.isValid(orderId)
  ) {
    const error = new Error(
      'ID đơn hàng không hợp lệ'
    );
    error.statusCode = 400;
    throw error;
  }

  const order =
    await Order.findById(orderId);

  if (!order) {
    const error = new Error(
      'Không tìm thấy đơn hàng'
    );
    error.statusCode = 404;
    throw error;
  }

  // User chỉ được hủy đơn của mình
  if (
    !isAdmin &&
    order.user.toString() !==
      userId.toString()
  ) {
    const error = new Error(
      'Bạn không có quyền hủy đơn hàng này'
    );
    error.statusCode = 403;
    throw error;
  }

  // User chỉ được hủy khi pending/confirmed
  if (
    !isAdmin &&
    ![
      'pending',
      'confirmed',
    ].includes(order.orderStatus)
  ) {
    const error = new Error(
      'Đơn hàng hiện không thể hủy'
    );
    error.statusCode = 400;
    throw error;
  }

  if (
    order.orderStatus === 'cancelled'
  ) {
    const error = new Error(
      'Đơn hàng đã được hủy trước đó'
    );
    error.statusCode = 400;
    throw error;
  }

  // ===================================
  // Cập nhật trạng thái
  // ===================================
  order.orderStatus = 'cancelled';
  await order.save();

  // ===================================
  // Cộng lại số lượng xe (Atomic Update)
  // ===================================
  if (order.car) {
    await Car.findByIdAndUpdate(order.car, {
      $inc: { stockCount: 1 },
      $set: { inStock: true },
    });
  }

  return order;

  return order;
};

// ===================================
// PAYOS PAYMENT GATEWAY INTEGRATION
// ===================================
const payosService = require('./payosService');

// Tạo PayOS Link thanh toán cho đơn hàng
const createPayOSPaymentLink = async (orderId, userId, isStaff = false) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    const error = new Error('ID đơn hàng không hợp lệ');
    error.statusCode = 400;
    throw error;
  }

  const order = await Order.findById(orderId).populate('car', 'name');
  if (!order) {
    const error = new Error('Không tìm thấy đơn hàng');
    error.statusCode = 404;
    throw error;
  }

  if (!isStaff && order.user.toString() !== userId.toString()) {
    const error = new Error('Bạn không có quyền thao tác trên đơn hàng này');
    error.statusCode = 403;
    throw error;
  }

  if (order.paymentStatus === 'deposit_paid' || order.paymentStatus === 'fully_paid') {
    const error = new Error('Đơn hàng đã được thanh toán cọc trước đó');
    error.statusCode = 400;
    throw error;
  }

  if (order.orderStatus === 'cancelled') {
    const error = new Error('Đơn hàng đã bị hủy, không thể tạo link thanh toán');
    error.statusCode = 400;
    throw error;
  }

  // Tạo payosOrderCode dạng số nguyên duy nhất dựa trên timestamp nếu chưa có
  if (!order.payosOrderCode) {
    order.payosOrderCode = Number(String(Date.now()).slice(-8));
  }

  // Đặt thời hạn giữ cọc +30 phút
  order.depositExpiredAt = new Date(Date.now() + 30 * 60 * 1000);

  // Gọi PayOS SDK tạo Checkout URL
  const payosRes = await payosService.createPaymentLink(order);

  order.paymentLinkId = payosRes.paymentLinkId;
  order.checkoutUrl = payosRes.checkoutUrl;
  order.qrCodeUrl = payosRes.qrCodeUrl;

  await order.save();

  return {
    orderId: order._id,
    orderNumber: order.orderNumber,
    payosOrderCode: order.payosOrderCode,
    depositAmount: order.depositAmount,
    checkoutUrl: order.checkoutUrl,
    qrCodeUrl: order.qrCodeUrl,
    depositExpiredAt: order.depositExpiredAt,
  };
};

// Xử lý Webhook tự động từ PayOS (Verify signature, Idempotency & ACID Transaction)
const processPayOSWebhook = async (webhookBody) => {
  // 1. Verify signature của PayOS
  const verifiedData = payosService.verifyWebhookData(webhookBody);

  const { orderCode, reference, code } = verifiedData;

  // 2. Tìm đơn hàng theo payosOrderCode
  const order = await Order.findOne({ payosOrderCode: Number(orderCode) });
  if (!order) {
    return { success: true, message: 'Đơn hàng không tồn tại trong hệ thống' };
  }

  // 3. Chống ghi nhận trùng thanh toán (Idempotency Check)
  if (order.webhookProcessedAt || order.paymentStatus === 'deposit_paid') {
    return { success: true, message: 'Đơn hàng đã được ghi nhận thanh toán trước đó' };
  }

  // Chỉ xử lý khi giao dịch thành công (code = '00' hoặc 0)
  if (code === '00' || code === 0 || code === 'SUCCESS') {
    // 4. Mongoose ACID Transaction
    const session = await mongoose.startSession().catch(() => null);
    if (session) session.startTransaction();

    try {
      order.paymentStatus = 'deposit_paid';
      order.orderStatus = 'confirmed';
      order.paidAt = new Date();
      order.webhookProcessedAt = new Date();
      order.transactionReference = String(reference || '');
      order.statusHistory.push({
        status: 'confirmed',
        note: `Thanh toán cọc thành công qua PayOS (Mã GD: ${reference || 'Auto'})`,
        changedAt: new Date(),
      });

      await order.save({ session: session || undefined });

      if (session) {
        await session.commitTransaction();
        session.endSession();
      }

      // Gửi thông báo đa kênh Email + Zalo xác nhận tiền cọc thành công (Async non-blocking)
      notificationService.triggerDepositSuccess(order);

      return { success: true, message: 'Xử lý Webhook PayOS thành công', orderId: order._id };
    } catch (err) {
      if (session) {
        await session.abortTransaction();
        session.endSession();
      }
      throw err;
    }
  }

  return { success: true, message: 'Giao dịch PayOS không ở trạng thái thành công' };
};

// Truy vấn trạng thái thanh toán cho Frontend Polling & tự động hủy đơn quá hạn
const getPaymentStatus = async (orderId, userId, isStaff = false) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    const error = new Error('ID đơn hàng không hợp lệ');
    error.statusCode = 400;
    throw error;
  }

  const order = await Order.findById(orderId);
  if (!order) {
    const error = new Error('Không tìm thấy đơn hàng');
    error.statusCode = 404;
    throw error;
  }

  if (!isStaff && order.user.toString() !== userId.toString()) {
    const error = new Error('Bạn không có quyền xem đơn hàng này');
    error.statusCode = 403;
    throw error;
  }

  // Tự động kiểm tra thời hạn thanh toán
  const now = new Date();
  let isExpired = false;
  if (
    order.paymentStatus === 'pending' &&
    order.depositExpiredAt &&
    now > new Date(order.depositExpiredAt) &&
    order.orderStatus !== 'cancelled'
  ) {
    isExpired = true;
    order.orderStatus = 'cancelled';
    order.statusHistory.push({
      status: 'cancelled',
      note: 'Hệ thống tự động hủy đơn do quá hạn thanh toán 30 phút',
      changedAt: new Date(),
    });
    await order.save();

    // Hoàn lại số lượng xe vào kho
    if (order.car) {
      await Car.findByIdAndUpdate(order.car, {
        $inc: { stockCount: 1 },
        $set: { inStock: true },
      });
    }
  }

  return {
    orderId: order._id,
    orderNumber: order.orderNumber,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    paidAt: order.paidAt,
    depositAmount: order.depositAmount,
    totalAmount: order.totalAmount,
    checkoutUrl: order.checkoutUrl,
    qrCodeUrl: order.qrCodeUrl,
    depositExpiredAt: order.depositExpiredAt,
    isExpired,
  };
};

// ===================================
// Export
// ===================================
module.exports = {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  createPayOSPaymentLink,
  processPayOSWebhook,
  getPaymentStatus,
};