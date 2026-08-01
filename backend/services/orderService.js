const Order = require('../models/Order');
const Car = require('../models/Car');
const User = require('../models/User');
const mongoose = require('mongoose');
const emailService = require('./emailService');

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
  // Lấy giá hiện tại
  // ===================================
  const currentPrice =
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
  // Tạo đơn hàng trong MongoDB
  // ===================================
  const order = await Order.create({
    user: userId,
    car: car._id,
    carSnapshot,
    depositAmount: deposit,
    totalAmount: currentPrice,
    paymentMethod,
    deliveryAddress,
    notes,
  });

  // ===================================
  // Giảm số lượng xe trong kho
  // ===================================
  car.stockCount -= 1;

  if (car.stockCount <= 0) {
    car.stockCount = 0;
    car.inStock = false;
  }

  await car.save();

  // ===================================
  // Gửi email xác nhận
  // Không làm lỗi tạo đơn nếu email lỗi
  // ===================================
  User.findById(userId)
    .then((user) => {
      if (user) {
        return emailService.sendOrderConfirmation(
          order,
          user.email,
          user.fullName
        );
      }
    })
    .catch((err) => {
      console.error(
        'Send email error:',
        err.message
      );
    });

  return order;
};

// ===================================
// [ADMIN] Lấy tất cả đơn hàng
// ===================================
const getAllOrders = async (queryParams = {}) => {
  console.log('\n🔥🔥🔥 getAllOrders() ĐÃ ĐƯỢC GỌI');

  const {
    page = 1,
    limit = 20,
    orderStatus,
    paymentStatus,
    userId,
  } = queryParams;

  // ===================================
  // Tạo bộ lọc
  // ===================================
  const filter = {};

  if (orderStatus) {
    filter.orderStatus = orderStatus;
  }

  if (paymentStatus) {
    filter.paymentStatus = paymentStatus;
  }

  if (
    userId &&
    mongoose.Types.ObjectId.isValid(userId)
  ) {
    filter.user = userId;
  }

  // ===================================
  // Pagination
  // ===================================
  const pageNumber = Math.max(
    1,
    parseInt(page, 10) || 1
  );

  const limitNumber = Math.min(
    50,
    Math.max(
      1,
      parseInt(limit, 10) || 20
    )
  );

  const skip =
    (pageNumber - 1) * limitNumber;

  // ===================================
  // DEBUG DATABASE
  // ===================================
  console.log('\n========== DATABASE DEBUG ==========');

  console.log(
    'Database:',
    mongoose.connection.db.databaseName
  );

  console.log(
    'Order collection:',
    Order.collection.name
  );

  console.log(
    'Filter:',
    filter
  );

  // Đếm trực tiếp Order
  const directCount =
    await Order.countDocuments({});

  console.log(
    'Total Order trong DB:',
    directCount
  );

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
    'processing',
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
    updateFields.orderStatus =
      orderStatus;
  }

  if (paymentStatus) {
    updateFields.paymentStatus =
      paymentStatus;
  }

  if (
    Object.keys(updateFields).length === 0
  ) {
    const error = new Error(
      'Không có dữ liệu để cập nhật'
    );
    error.statusCode = 400;
    throw error;
  }

  const order =
    await Order.findByIdAndUpdate(
      orderId,
      updateFields,
      {
        new: true,
        runValidators: true,
      }
    )
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
  // Cộng lại số lượng xe
  // ===================================
  const car = await Car.findById(
    order.car
  );

  if (car) {
    car.stockCount =
      Math.max(0, car.stockCount) + 1;

    car.inStock = true;

    await car.save();
  }

  return order;
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
};