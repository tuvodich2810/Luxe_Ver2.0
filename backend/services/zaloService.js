const mongoose = require('mongoose');
const NotificationLog = require('../models/NotificationLog');
const {
  ZALO_OA_ID,
  ZALO_ACCESS_TOKEN,
  FRONTEND_URL,
} = require('../config/env');

const formatMoney = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

/**
 * Ghi log vào Database MongoDB
 */
const logNotification = async (payload) => {
  try {
    if (mongoose.connection.readyState !== 1) return;
    await NotificationLog.create(payload);
  } catch (err) {
    console.error('❌ Lỗi ghi NotificationLog (Zalo):', err.message);
  }
};

/**
 * Send Zalo Generic Wrapper
 */
const sendZaloGeneric = async ({ phone, textContent, eventType, orderId, userId }) => {
  if (!phone) {
    console.log(`[ZALO SKIP] Không tìm thấy số điện thoại của người dùng để gửi Zalo.`);
    return false;
  }

  // Chuẩn hóa SĐT Việt Nam về định dạng quốc tế (84xxx)
  let cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '84' + cleanPhone.slice(1);
  }

  if (ZALO_ACCESS_TOKEN && ZALO_OA_ID) {
    try {
      const res = await fetch('https://openapi.zalo.me/v3.0/oa/message/cs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          access_token: ZALO_ACCESS_TOKEN,
        },
        body: JSON.stringify({
          recipient: {
            user_id: cleanPhone,
          },
          message: {
            text: textContent,
          },
        }),
      });

      const resData = await res.json();
      const isSuccess = resData?.error === 0;

      await logNotification({
        order: orderId,
        user: userId,
        eventType,
        channel: 'zalo',
        recipient: phone,
        status: isSuccess ? 'success' : 'failed',
        subject: `[ZALO OA] ${eventType}`,
        messageContent: textContent,
        errorMessage: isSuccess ? null : JSON.stringify(resData),
      });

      console.log(`📱 [ZALO OA ${isSuccess ? 'SUCCESS' : 'FAILED'}] Phone: ${phone}`);
      return isSuccess;
    } catch (err) {
      console.error(`❌ [ZALO OA ERROR] Phone: ${phone} | Error:`, err.message);
      await logNotification({
        order: orderId,
        user: userId,
        eventType,
        channel: 'zalo',
        recipient: phone,
        status: 'failed',
        subject: `[ZALO OA] ${eventType}`,
        messageContent: textContent,
        errorMessage: err.message,
      });
      return false;
    }
  } else {
    console.log(`\n[ZALO SIMULATION] SĐT: ${phone} (${cleanPhone})`);
    console.log(`Nội dung tin nhắn Zalo:\n${textContent}\n`);

    await logNotification({
      order: orderId,
      user: userId,
      eventType,
      channel: 'zalo',
      recipient: phone,
      status: 'simulated',
      subject: `[ZALO OA SIMULATED] ${eventType}`,
      messageContent: textContent,
    });
    return true;
  }
};

/**
 * 1. Zalo: Đặt cọc thành công -> Tạo đơn cọc xe
 */
const sendOrderCreatedZalo = async (order, phone, userName) => {
  const textContent =
`[LUXE MOTORS SHOWROOM]
Kính chào Quý khách ${userName || 'VIP'},

Đơn hàng đặt cọc xe #${order.orderNumber || order._id} đã được tạo thành công:
• Mẫu xe: ${order.carSnapshot?.name || 'Siêu Xe Luxe Motors'}
• Giá niêm yết: ${formatMoney(order.totalAmount)}
• Số tiền cọc cần thanh toán: ${formatMoney(order.depositAmount)} (${order.depositPercent || 10}%)

Vui lòng quét mã QR PayOS trong 30 phút để hoàn tất giữ chỗ siêu xe:
${FRONTEND_URL}/orders

Hotline VIP Concierge: 0372 950 720`;

  return sendZaloGeneric({
    phone,
    textContent,
    eventType: 'ORDER_CREATED',
    orderId: order._id,
    userId: order.user?._id || order.user,
  });
};

/**
 * 2. Zalo: Xác nhận thanh toán nạp cọc thành công qua PayOS
 */
const sendDepositSuccessZalo = async (order, phone, userName) => {
  const textContent =
`[LUXE MOTORS SHOWROOM] ✅ XÁC NHẬN CHUYỂN CỌC THÀNH CÔNG

Kính chào Quý khách ${userName || 'VIP'},

Luxe Motors đã nhận thành công khoản cọc ${formatMoney(order.depositAmount)} cho đơn hàng #${order.orderNumber || order._id}.
• Mẫu xe: ${order.carSnapshot?.name || 'Siêu Xe Luxe Motors'}
• Mã giao dịch: ${order.transactionReference || order.payosOrderCode || 'PAYOS-SUCCESS'}
• Trạng thái xe: Đã được giữ chỗ an toàn trong kho.

Chuyên viên Concierge sẽ liên hệ Quý khách trong vòng 30 phút để làm thủ tục hợp đồng & bàn giao xe.

Hotline VIP: 0372 950 720`;

  return sendZaloGeneric({
    phone,
    textContent,
    eventType: 'DEPOSIT_SUCCESS',
    orderId: order._id,
    userId: order.user?._id || order.user,
  });
};

/**
 * 3. Zalo: Cập nhật trạng thái đơn hàng
 */
const sendOrderStatusChangedZalo = async (order, phone, userName, oldStatus, newStatus) => {
  const statusLabels = {
    pending: 'Chờ thanh toán',
    approved: 'Đã phê duyệt cọc',
    confirmed: 'Đã xác nhận đơn hàng',
    processing: 'Đang chuẩn bị xe & hợp đồng',
    delivered: 'Đã bàn giao siêu xe',
    completed: 'Đã hoàn tất hợp đồng',
    cancelled: 'Đã hủy đơn hàng',
  };

  const statusLabel = statusLabels[newStatus] || newStatus;

  const textContent =
`[LUXE MOTORS SHOWROOM] CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG

Kính chào Quý khách ${userName || 'VIP'},

Đơn hàng #${order.orderNumber || order._id} (Xe ${order.carSnapshot?.name || ''}) đã chuyển sang trạng thái mới:
👉 TRẠNG THÁI: ${statusLabel.toUpperCase()}

Tra cứu chi tiết đơn hàng tại: ${FRONTEND_URL}/orders
Hotline hỗ trợ 24/7: 0372 950 720`;

  return sendZaloGeneric({
    phone,
    textContent,
    eventType: 'ORDER_STATUS_CHANGED',
    orderId: order._id,
    userId: order.user?._id || order.user,
  });
};

/**
 * 4. Zalo: Nhắc nhở sắp hết hạn giữ chỗ cọc (10 phút còn lại)
 */
const sendReservationExpiringZalo = async (order, phone, userName) => {
  const textContent =
`[LUXE MOTORS SHOWROOM] ⏰ CẢNH BÁO SẮP HẾT HẠN GIỮ CHỖ

Kính chào Quý khách ${userName || 'VIP'},

Mã QR thanh toán cọc ${formatMoney(order.depositAmount)} cho đơn hàng #${order.orderNumber || order._id} sẽ hết hạn trong ít phút tới.

Nếu chưa thanh toán, siêu xe sẽ tự động mở lại cho khách hàng khác mua.
Thanh toán ngay tại: ${FRONTEND_URL}/orders

Hotline hỗ trợ: 0372 950 720`;

  return sendZaloGeneric({
    phone,
    textContent,
    eventType: 'RESERVATION_EXPIRING',
    orderId: order._id,
    userId: order.user?._id || order.user,
  });
};

/**
 * 5. Zalo: Đăng ký lịch hẹn mới
 */
const sendAppointmentCreatedZalo = async (appointment, phone, userName) => {
  const carName = appointment.car?.name || 'Siêu Xe Luxe Motors';
  const apptDateStr = new Date(appointment.appointmentDate).toLocaleDateString('vi-VN');
  const apptIdStr = String(appointment._id).slice(-8).toUpperCase();

  const textContent =
`[LUXE MOTORS CONCIERGE] XÁC NHẬN ĐĂNG KÝ LỊCH HẸN #${apptIdStr}

Kính chào Quý khách ${userName || appointment.visitorName || 'VIP'},

Lịch hẹn trải nghiệm siêu xe ${carName} của Quý khách đã được tạo thành công:
• Mẫu xe: ${carName}
• Ngày hẹn: ${apptDateStr}
• Khung giờ: ${appointment.timeSlot}
• Trạng thái: CHỜ CHUYÊN VIÊN XÁC NHẬN

Chuyên viên VIP Concierge sẽ liên hệ trong 15 phút.
Tra cứu lịch hẹn: ${FRONTEND_URL}/appointment/my
Hotline: 0372 950 720`;

  return sendZaloGeneric({
    phone: phone || appointment.visitorPhone,
    textContent,
    eventType: 'APPOINTMENT_CREATED',
    orderId: null,
    userId: appointment.user?._id || appointment.user,
  });
};

/**
 * 6. Zalo: Cập nhật trạng thái lịch hẹn xem xe
 */
const sendAppointmentUpdatedZalo = async (appointment, phone, userName, oldStatus, newStatus) => {
  const statusLabels = {
    pending: 'Chờ Chuyên Viên Xác Nhận',
    confirmed: 'Đã Xác Nhận Lịch Hẹn',
    completed: 'Đã Hoàn Thành Lái Thử',
    cancelled: 'Đã Hủy Lịch Hẹn',
  };

  const currentStatus = newStatus || appointment.status;
  const statusLabel = statusLabels[currentStatus] || currentStatus;
  const carName = appointment.car?.name || 'Siêu Xe Luxe Motors';
  const apptDateStr = new Date(appointment.appointmentDate).toLocaleDateString('vi-VN');
  const apptIdStr = String(appointment._id).slice(-8).toUpperCase();

  const textContent =
`[LUXE MOTORS CONCIERGE] CẬP NHẬT TRẠNG THÁI LỊCH HẸN #${apptIdStr}

Kính chào Quý khách ${userName || appointment.visitorName || 'VIP'},

Lịch hẹn trải nghiệm siêu xe ${carName} đã chuyển sang trạng thái mới:
👉 TRẠNG THÁI: ${statusLabel.toUpperCase()}
• Ngày hẹn: ${apptDateStr}
• Khung giờ: ${appointment.timeSlot}

Tra cứu chi tiết: ${FRONTEND_URL}/appointment/my
Hotline VIP Concierge: 0372 950 720`;

  return sendZaloGeneric({
    phone: phone || appointment.visitorPhone,
    textContent,
    eventType: 'APPOINTMENT_UPDATED',
    orderId: null,
    userId: appointment.user?._id || appointment.user,
  });
};

module.exports = {
  sendOrderCreatedZalo,
  sendDepositSuccessZalo,
  sendOrderStatusChangedZalo,
  sendReservationExpiringZalo,
  sendAppointmentCreatedZalo,
  sendAppointmentUpdatedZalo,
};
