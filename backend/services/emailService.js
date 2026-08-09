const nodemailer = require('nodemailer');
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  FROM_EMAIL,
  FROM_NAME,
} = require('../config/env');

// ===================================
// Tạo Transporter cho Nodemailer
// ===================================
const createTransporter = () => {
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }
  return null; // Giả lập nếu chưa có SMTP
};

const transporter = createTransporter();

/**
 * Gửi email xác nhận đặt mua / đặt cọc xe
 */
const sendOrderConfirmation = async (order, toEmail, userName) => {
  const formatMoney = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const subject = `[Luxe Motors] Xác nhận đơn hàng đặt xe #${order.orderNumber || order._id}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #0a0a0a; color: #e5e5e5; padding: 30px; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #c9a96e; font-size: 28px; margin: 0;">LUXE MOTORS</h1>
        <p style="color: #a0a0a0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Supercar Showroom</p>
      </div>

      <p>Xin chào <strong>${userName || 'Quý khách'}</strong>,</p>
      <p>Cảm ơn Quý khách đã tin tưởng lựa chọn Luxe Motors. Đơn hàng của Quý khách đã được ghi nhận trên hệ thống:</p>

      <div style="background-color: #141414; border: 1px solid #262626; padding: 20px; border-radius: 6px; margin: 20px 0;">
        <h3 style="color: #c9a96e; margin-top: 0;">Thông tin đơn hàng #${order.orderNumber || order._id}</h3>
        <p><strong>Mẫu xe:</strong> ${order.carSnapshot?.name || 'Siêu xe Luxe Motors'}</p>
        <p><strong>Giá niêm yết:</strong> ${formatMoney(order.totalAmount)}</p>
        <p><strong>Số tiền đặt cọc:</strong> <span style="color: #34d399; font-weight: bold;">${formatMoney(order.depositAmount)}</span></p>
        <p><strong>Phương thức thanh toán:</strong> ${order.paymentMethod === 'bank_transfer' ? 'Chuyển khoản ngân hàng' : order.paymentMethod === 'cash' ? 'Tiền mặt' : 'Trả góp'}</p>
        <p><strong>Trạng thái đơn:</strong> <span style="color: #c9a96e;">${order.orderStatus}</span></p>
      </div>

      <p>Chuyên viên tư vấn của Luxe Motors sẽ sớm liên hệ với Quý khách để hoàn tất các thủ tục nhận xe.</p>
      
      <hr style="border: 0; border-top: 1px solid #262626; margin: 30px 0;" />
      <p style="font-size: 12px; color: #6b6b6b; text-align: center;">
        Luxe Motors Showroom · 268 Trần Hưng Đạo, Quận 1, TP.HCM · Hotline: +84 (90) 123 4567
      </p>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"${FROM_NAME || 'Luxe Motors'}" <${FROM_EMAIL || 'no-reply@luxemotors.com'}>`,
        to: toEmail,
        subject,
        html: htmlContent,
      });
      console.log(`✉️ Email xác nhận đơn hàng đã gửi tới: ${toEmail}`);
    } catch (err) {
      console.error('❌ Lỗi gửi email Nodemailer:', err.message);
    }
  } else {
    console.log(`\n[EMAIL SIMULATION - Cấu hình SMTP chưa bật]`);
    console.log(`Tới: ${toEmail} | Tiêu đề: ${subject}`);
    console.log(`Nội dung: Đơn hàng #${order.orderNumber || order._id} của ${userName} đã tạo thành công.\n`);
  }
};

/**
 * Gửi email cập nhật lịch hẹn xem xe
 */
const sendAppointmentConfirmation = async (appointment, toEmail, userName) => {
  const subject = `[Luxe Motors] Cập nhật lịch hẹn xem xe #${appointment._id}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #0a0a0a; color: #e5e5e5; padding: 30px; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #c9a96e; font-size: 28px; margin: 0;">LUXE MOTORS</h1>
      </div>
      <p>Xin chào <strong>${userName || 'Quý khách'}</strong>,</p>
      <p>Lịch hẹn xem xe của Quý khách đã được cập nhật trạng thái mới: <strong style="color: #c9a96e;">${appointment.status}</strong></p>
      <p><strong>Ngày hẹn:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString('vi-VN')}</p>
      <p><strong>Khung giờ:</strong> ${appointment.timeSlot}</p>
      <hr style="border: 0; border-top: 1px solid #262626; margin: 30px 0;" />
      <p style="font-size: 12px; color: #6b6b6b; text-align: center;">Luxe Motors © 2026</p>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"${FROM_NAME || 'Luxe Motors'}" <${FROM_EMAIL || 'no-reply@luxemotors.com'}>`,
        to: toEmail,
        subject,
        html: htmlContent,
      });
    } catch (err) {
      console.error('❌ Lỗi gửi email lịch hẹn:', err.message);
    }
  } else {
    console.log(`[EMAIL SIMULATION] Cập nhật lịch hẹn gửi tới ${toEmail}: ${appointment.status}`);
  }
};

module.exports = {
  sendOrderConfirmation,
  sendAppointmentConfirmation,
};
