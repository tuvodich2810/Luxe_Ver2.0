const emailService = require('./emailService');
const zaloService = require('./zaloService');
const User = require('../models/User');

/**
 * Helper tìm thông tin User an toàn nếu order truyền vào chỉ có ID
 */
const resolveUserInfo = async (order, providedUser) => {
  if (providedUser && providedUser.email) {
    return providedUser;
  }

  const userId = order.user?._id || order.user;
  if (!userId) return null;

  try {
    const userObj = await User.findById(userId).select('email fullName phone').lean();
    return userObj;
  } catch (err) {
    console.error('❌ Lỗi query User cho NotificationService:', err.message);
    return null;
  }
};

/**
 * 1. Sự kiện: Đặt cọc tạo đơn thành công
 */
const triggerOrderCreated = (order, providedUser) => {
  // Gửi hoàn toàn bất đồng bộ non-blocking (Promise unawaited)
  setImmediate(async () => {
    try {
      const user = await resolveUserInfo(order, providedUser);
      if (!user) {
        console.log(`⚠️ Notification skipped: Không tìm thấy thông tin User cho đơn hàng #${order._id}`);
        return;
      }

      const email = user.email;
      const phone = user.phone;
      const userName = user.fullName || 'Quý khách VIP';

      console.log(`🔔 [NOTIFICATION SERVICE] Trigger ORDER_CREATED cho đơn #${order.orderNumber || order._id}`);

      const results = await Promise.allSettled([
        emailService.sendOrderCreatedEmail(order, email, userName),
        zaloService.sendOrderCreatedZalo(order, phone, userName),
      ]);

      results.forEach((res, index) => {
        const channel = index === 0 ? 'Email' : 'Zalo';
        if (res.status === 'rejected') {
          console.error(`❌ [NOTIFICATION KÊNH ${channel} ERROR]:`, res.reason);
        }
      });
    } catch (err) {
      console.error('❌ Lỗi hệ thống trong NotificationService (ORDER_CREATED):', err.message);
    }
  });
};

/**
 * 2. Sự kiện: Đặt cọc nạp tiền thành công (PayOS Webhook)
 */
const triggerDepositSuccess = (order, providedUser) => {
  setImmediate(async () => {
    try {
      const user = await resolveUserInfo(order, providedUser);
      if (!user) return;

      const email = user.email;
      const phone = user.phone;
      const userName = user.fullName || 'Quý khách VIP';

      console.log(`🔔 [NOTIFICATION SERVICE] Trigger DEPOSIT_SUCCESS cho đơn #${order.orderNumber || order._id}`);

      await Promise.allSettled([
        emailService.sendDepositSuccessEmail(order, email, userName),
        zaloService.sendDepositSuccessZalo(order, phone, userName),
      ]);
    } catch (err) {
      console.error('❌ Lỗi hệ thống trong NotificationService (DEPOSIT_SUCCESS):', err.message);
    }
  });
};

/**
 * 3. Sự kiện: Thay đổi trạng thái đơn hàng (Confirmed, Processing, Completed, Cancelled...)
 */
const triggerOrderStatusChanged = (order, providedUser, oldStatus, newStatus) => {
  if (oldStatus === newStatus) return;

  setImmediate(async () => {
    try {
      const user = await resolveUserInfo(order, providedUser);
      if (!user) return;

      const email = user.email;
      const phone = user.phone;
      const userName = user.fullName || 'Quý khách VIP';

      console.log(`🔔 [NOTIFICATION SERVICE] Trigger ORDER_STATUS_CHANGED (${oldStatus} -> ${newStatus}) cho đơn #${order.orderNumber || order._id}`);

      await Promise.allSettled([
        emailService.sendOrderStatusChangedEmail(order, email, userName, oldStatus, newStatus),
        zaloService.sendOrderStatusChangedZalo(order, phone, userName, oldStatus, newStatus),
      ]);
    } catch (err) {
      console.error('❌ Lỗi hệ thống trong NotificationService (ORDER_STATUS_CHANGED):', err.message);
    }
  });
};

/**
 * 4. Sự kiện: Nhắc nhở sắp hết hạn giữ chỗ (10 phút còn lại)
 */
const triggerReservationExpiring = (order, providedUser) => {
  setImmediate(async () => {
    try {
      const user = await resolveUserInfo(order, providedUser);
      if (!user) return;

      const email = user.email;
      const phone = user.phone;
      const userName = user.fullName || 'Quý khách VIP';

      console.log(`🔔 [NOTIFICATION SERVICE] Trigger RESERVATION_EXPIRING cho đơn #${order.orderNumber || order._id}`);

      await Promise.allSettled([
        emailService.sendReservationExpiringEmail(order, email, userName),
        zaloService.sendReservationExpiringZalo(order, phone, userName),
      ]);
    } catch (err) {
      console.error('❌ Lỗi hệ thống trong NotificationService (RESERVATION_EXPIRING):', err.message);
    }
  });
};

/**
 * 5. Sự kiện: Đăng ký Lịch hẹn xem xe / Lái thử mới thành công
 */
const triggerAppointmentCreated = (appointment, providedUser) => {
  setImmediate(async () => {
    try {
      const email = appointment.visitorEmail || providedUser?.email;
      const phone = appointment.visitorPhone || providedUser?.phone;
      const userName = appointment.visitorName || providedUser?.fullName || 'Quý khách VIP';

      if (!email) return;

      console.log(`🔔 [NOTIFICATION SERVICE] Trigger APPOINTMENT_CREATED cho lịch hẹn #${appointment._id}`);

      await Promise.allSettled([
        emailService.sendAppointmentCreatedEmail(appointment, email, userName),
        zaloService.sendAppointmentCreatedZalo(appointment, phone, userName),
      ]);
    } catch (err) {
      console.error('❌ Lỗi hệ thống trong NotificationService (APPOINTMENT_CREATED):', err.message);
    }
  });
};

/**
 * 6. Sự kiện: Cập nhật trạng thái Lịch hẹn xem xe / Lái thử
 */
const triggerAppointmentUpdated = (appointment, providedUser, oldStatus, newStatus) => {
  setImmediate(async () => {
    try {
      const email = appointment.visitorEmail || providedUser?.email;
      const phone = appointment.visitorPhone || providedUser?.phone;
      const userName = appointment.visitorName || providedUser?.fullName || 'Quý khách VIP';

      if (!email) return;

      console.log(`🔔 [NOTIFICATION SERVICE] Trigger APPOINTMENT_UPDATED cho lịch hẹn #${appointment._id} (${oldStatus} -> ${newStatus || appointment.status})`);

      await Promise.allSettled([
        emailService.sendAppointmentConfirmation(appointment, email, userName, oldStatus, newStatus),
        zaloService.sendAppointmentUpdatedZalo(appointment, phone, userName, oldStatus, newStatus),
      ]);
    } catch (err) {
      console.error('❌ Lỗi hệ thống trong NotificationService (APPOINTMENT_UPDATED):', err.message);
    }
  });
};

module.exports = {
  triggerOrderCreated,
  triggerDepositSuccess,
  triggerOrderStatusChanged,
  triggerReservationExpiring,
  triggerAppointmentCreated,
  triggerAppointmentUpdated,
};
