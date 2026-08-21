const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const NotificationLog = require('../models/NotificationLog');
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  FROM_EMAIL,
  FROM_NAME,
  FRONTEND_URL,
  BANK_CODE,
  BANK_NAME,
  BANK_ACCOUNT_NO,
  BANK_ACCOUNT_NAME,
  STATIC_QR_URL,
} = require('../config/env');

const createTransporter = () => {
  const user = SMTP_USER || process.env.EMAIL_USER || process.env.SMTP_USER || 'tuankwan2810@gmail.com';
  const pass = SMTP_PASS || process.env.EMAIL_PASS || process.env.SMTP_PASS || 'jwdyeuelkgblorik';

  console.log(`✉️ [EMAIL SERVICE] Khởi tạo SMTP Transporter SSL Port 465 cho tài khoản: ${user}`);
  
  // Dùng trực tiếp host smtp.gmail.com cổng 465 SSL để tránh lỗi STARTTLS Connection Timeout trên Render Cloud
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
};

const transporter = createTransporter();

const formatMoney = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

/**
 * Helper ghi nhận log vào DB MongoDB
 */
const logNotification = async (payload) => {
  try {
    if (mongoose.connection.readyState !== 1) return;
    await NotificationLog.create(payload);
  } catch (err) {
    console.error('❌ Lỗi ghi NotificationLog (Email):', err.message);
  }
};

/**
 * Send Email Generic Wrapper
 */
const sendMailGeneric = async ({ toEmail, subject, htmlContent, eventType, orderId, userId }) => {
  if (!toEmail) return false;

  const mailOptions = {
    from: `"${FROM_NAME || 'Luxe Motors Showroom'}" <${FROM_EMAIL || 'no-reply@luxemotors.com'}>`,
    to: toEmail,
    subject,
    html: htmlContent,
  };

  if (transporter) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`✉️ [EMAIL SUCCESS] Sent to: ${toEmail} | Subject: ${subject}`);
      await logNotification({
        order: orderId,
        user: userId,
        eventType,
        channel: 'email',
        recipient: toEmail,
        status: 'success',
        subject,
        messageContent: htmlContent.substring(0, 300) + '...',
      });
      return true;
    } catch (err) {
      console.error(`❌ [EMAIL FAILED] To: ${toEmail} | Error:`, err.message);
      await logNotification({
        order: orderId,
        user: userId,
        eventType,
        channel: 'email',
        recipient: toEmail,
        status: 'failed',
        subject,
        errorMessage: err.message,
      });
      return false;
    }
  } else {
    console.log(`\n[EMAIL SIMULATION] To: ${toEmail} | Subject: ${subject}`);
    await logNotification({
      order: orderId,
      user: userId,
      eventType,
      channel: 'email',
      recipient: toEmail,
      status: 'simulated',
      subject,
      messageContent: 'Email simulation (SMTP not configured).',
    });
    return true;
  }
};

/**
 * 1. Email Tạo đơn hàng đặt cọc thành công (Thiết kế mới: Light Luxury & VietQR Code)
 */
const sendOrderCreatedEmail = async (order, toEmail, userName) => {
  const orderCodeStr = String(order.orderNumber || order.payosOrderCode || order._id).slice(-8);
  const depositAmountFormatted = formatMoney(order.depositAmount);
  const totalAmountFormatted = formatMoney(order.totalAmount);
  
  // URL ảnh VietQR (Thứ tự ưu tiên: 1. STATIC_QR_URL trong .env -> 2. order.qrCodeUrl từ PayOS -> 3. VietQR API động theo STK ngân hàng)
  const cleanAccountNo = (BANK_ACCOUNT_NO || '0372950720').replace(/\s+/g, '');
  const cleanBankCode = BANK_CODE || 'MB';
  const cleanAccountName = encodeURIComponent(BANK_ACCOUNT_NAME || 'LUXE MOTORS');

  const qrImageSrc = STATIC_QR_URL || order.qrCodeUrl || 
    `https://img.vietqr.io/image/${cleanBankCode}-${cleanAccountNo}-compact2.png?amount=${Math.round(order.depositAmount)}&addInfo=COC%20${orderCodeStr}&accountName=${cleanAccountName}`;

  const subject = `[Luxe Motors] Mã QR Thanh Toán Đặt Cọc Xe #${orderCodeStr}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f5f7; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
              
              <!-- HEADER LUXURY BANNER -->
              <tr>
                <td style="background: linear-gradient(135deg, #0b0f19 0%, #1a233a 100%); padding: 35px 30px; text-align: center; border-bottom: 3px solid #D4AF37;">
                  <h1 style="color: #D4AF37; font-size: 28px; margin: 0; font-weight: 800; letter-spacing: 3px; font-family: Georgia, serif;">LUXE MOTORS</h1>
                  <p style="color: #cbd5e1; font-size: 10px; letter-spacing: 4px; text-transform: uppercase; margin: 6px 0 0 0; font-weight: 600;">SUPERCAR SHOWROOM & VIP CONCIERGE</p>
                </td>
              </tr>

              <!-- GREETING & INTRO -->
              <tr>
                <td style="padding: 30px 35px 15px 35px; color: #1e293b;">
                  <h2 style="color: #0f172a; font-size: 20px; margin: 0 0 10px 0; font-weight: 700;">HÓA ĐƠN ĐẶT CỌC XE #${orderCodeStr}</h2>
                  <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0;">
                    Xin chào <strong>${userName || 'Quý khách VIP'}</strong>,<br>
                    Cảm ơn Quý khách đã tin tưởng lựa chọn siêu xe tại <strong>Luxe Motors Flagship Showroom</strong>. Đơn hàng đặt cọc giữ xe của Quý khách đã được tạo thành công trên hệ thống.
                  </p>
                </td>
              </tr>

              <!-- ORDER DETAILS TABLE -->
              <tr>
                <td style="padding: 0 35px 25px 35px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fafafa; border-radius: 12px; border: 1px solid #e2e8f0; padding: 18px 20px;">
                    <tr>
                      <td style="padding: 8px 0; font-size: 13px; color: #64748b; border-bottom: 1px dashed #e2e8f0;">Mẫu siêu xe:</td>
                      <td style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #0f172a; text-align: right; border-bottom: 1px dashed #e2e8f0;">${order.carSnapshot?.name || 'Siêu Xe Luxe Motors'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 13px; color: #64748b; border-bottom: 1px dashed #e2e8f0;">Giá niêm yết:</td>
                      <td style="padding: 8px 0; font-size: 13px; font-weight: 600; color: #334155; text-align: right; border-bottom: 1px dashed #e2e8f0;">${totalAmountFormatted}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 13px; color: #64748b; border-bottom: 1px dashed #e2e8f0;">Tỷ lệ đặt cọc:</td>
                      <td style="padding: 8px 0; font-size: 13px; font-weight: 600; color: #334155; text-align: right; border-bottom: 1px dashed #e2e8f0;">${order.depositPercent || 10}%</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0 6px 0; font-size: 14px; font-weight: 700; color: #0f172a;">CẦN THANH TOÁN CỌC:</td>
                      <td style="padding: 12px 0 6px 0; font-size: 18px; font-weight: 800; color: #b45309; text-align: right;">${depositAmountFormatted}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- VIETQR PAYMENT SECTION (DARK LUXURY CARD) -->
              <tr>
                <td style="padding: 0 35px 25px 35px;">
                  <div style="background-color: #0b0f19; border-radius: 16px; border: 2px solid #D4AF37; padding: 25px; text-align: center; box-shadow: 0 8px 25px rgba(11, 15, 25, 0.25);">
                    <p style="color: #D4AF37; font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 15px 0;">
                      ⚡ QUÉT MÃ VIETQR ĐỂ THANH TOÁN CỌC NGAY
                    </p>

                    <!-- QR CODE IMAGE -->
                    <div style="background-color: #ffffff; padding: 12px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 15px rgba(255,255,255,0.2);">
                      <img src="${qrImageSrc}" width="210" height="210" alt="Mã QR PayOS VietQR" style="display: block; margin: 0 auto; border-radius: 8px;" />
                    </div>

                    <p style="color: #94a3b8; font-size: 11px; margin: 12px 0 16px 0;">Mở ứng dụng Ngân hàng (MB, VCB, Techcombank...) quét mã trên</p>

                    <!-- BANK INFO TABLE -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #161e2e; border-radius: 10px; padding: 14px; border: 1px solid #1e293b; text-align: left;">
                      <tr>
                        <td style="padding: 5px 8px; font-size: 12px; color: #94a3b8;">Ngân hàng:</td>
                        <td style="padding: 5px 8px; font-size: 12px; font-weight: 700; color: #ffffff; text-align: right;">${BANK_NAME || 'MBBank (Ngân hàng Quân Đội)'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 8px; font-size: 12px; color: #94a3b8;">Chủ tài khoản:</td>
                        <td style="padding: 5px 8px; font-size: 12px; font-weight: 700; color: #ffffff; text-align: right;">${BANK_ACCOUNT_NAME || 'LUXE MOTORS SHOWROOM'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 8px; font-size: 12px; color: #94a3b8;">Số tài khoản:</td>
                        <td style="padding: 5px 8px; font-size: 13px; font-weight: 800; color: #38bdf8; text-align: right;">${BANK_ACCOUNT_NO || '0372 950 720'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 8px; font-size: 12px; color: #94a3b8;">Nội dung chuyển:</td>
                        <td style="padding: 5px 8px; font-size: 13px; font-weight: 800; color: #f59e0b; text-align: right;">COC ${orderCodeStr}</td>
                      </tr>
                    </table>

                    <p style="color: #ef4444; font-size: 11px; font-weight: 600; margin: 14px 0 0 0;">
                      ⏱️ Mã QR giữ chỗ siêu xe có hiệu lực trong vòng 30 phút.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- CTA BUTTON -->
              <tr>
                <td style="padding: 0 35px 30px 35px; text-align: center;">
                  <a href="${FRONTEND_URL}/orders" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #d97706 0%, #b45309 100%); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 30px; letter-spacing: 1px; box-shadow: 0 4px 14px rgba(180, 83, 9, 0.35);">
                    XEM CHI TIẾT ĐƠN HÀNG TRÊN WEBSITE
                  </a>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="background-color: #fafafa; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #64748b; font-size: 11px; margin: 0; line-height: 1.5;">
                    Luxe Motors Flagship Showroom · Hotline VIP Concierge: <strong>0372 950 720</strong><br>
                    Website: <a href="${FRONTEND_URL}" style="color: #b45309; text-decoration: none;">${FRONTEND_URL}</a>
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return sendMailGeneric({
    toEmail,
    subject,
    htmlContent,
    eventType: 'ORDER_CREATED',
    orderId: order._id,
    userId: order.user?._id || order.user,
  });
};

/**
 * 2. Email Thanh toán nạp cọc thành công (Xác nhận hóa đơn PayOS)
 */
const sendDepositSuccessEmail = async (order, toEmail, userName) => {
  const subject = `[Luxe Motors] ✅ Đã nhận tiền đặt cọc thành công đơn #${order.orderNumber || order._id}`;
  const htmlContent = `
    <div style="font-family: 'Jost', Arial, sans-serif; background-color: #070709; color: #e2e8f0; padding: 35px; border-radius: 12px; border: 1px solid rgba(52,211,153,0.4);">
      <div style="text-align: center; margin-bottom: 25px;">
        <h1 style="color: #D4AF37; font-size: 30px; margin: 0; font-weight: bold;">LUXE MOTORS</h1>
        <p style="color: #34d399; font-size: 13px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">XÁC NHẬN THANH TOÁN THÀNH CÔNG</p>
      </div>

      <p style="font-size: 14px;">Xin chào <strong>${userName || 'Quý khách VIP'}</strong>,</p>
      <p style="font-size: 13px; color: #cbd5e1;">Luxe Motors xin xác nhận đã nhận thành công khoản tiền đặt cọc cho đơn hàng <strong>#${order.orderNumber || order._id}</strong>.</p>

      <div style="background-color: #0E0E12; border: 1px solid #34d399; padding: 22px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #34d399; margin-top: 0; font-size: 16px;">BIÊN NHẬN ĐẶT CỌC XE THÀNH CÔNG</h3>
        <p style="font-size: 13px;"><strong>Siêu xe:</strong> ${order.carSnapshot?.name || 'Siêu Xe Luxe Motors'}</p>
        <p style="font-size: 13px;"><strong>Số tiền đã đặt cọc:</strong> <span style="color: #34d399; font-weight: bold; font-size: 18px;">${formatMoney(order.depositAmount)}</span></p>
        <p style="font-size: 13px;"><strong>Mã giao dịch ngân hàng:</strong> ${order.transactionReference || order.payosOrderCode || 'PAYOS-SUCCESS'}</p>
        <p style="font-size: 13px;"><strong>Thời gian thanh toán:</strong> ${new Date(order.paidAt || Date.now()).toLocaleString('vi-VN')}</p>
        <p style="font-size: 13px;"><strong>Trạng thái xe:</strong> <span style="color: #34d399; font-weight: bold;">Đã giữ chỗ an toàn trong kho</span></p>
      </div>

      <p style="font-size: 13px;">Chuyên viên VIP Concierge Luxe Motors sẽ liên hệ trực tiếp với Quý khách trong vòng 30 phút để bàn giao hợp đồng và lịch bàn giao siêu xe.</p>
      <hr style="border: 0; border-top: 1px solid #1e293b; margin: 30px 0;" />
      <p style="font-size: 11px; color: #64748b; text-align: center;">Luxe Motors Flagship Showroom · Hotline: 0372 950 720</p>
    </div>
  `;

  return sendMailGeneric({
    toEmail,
    subject,
    htmlContent,
    eventType: 'DEPOSIT_SUCCESS',
    orderId: order._id,
    userId: order.user?._id || order.user,
  });
};

/**
 * 3. Email Cập nhật trạng thái đơn hàng (Processing, Confirmed, Completed, Cancelled)
 */
const sendOrderStatusChangedEmail = async (order, toEmail, userName, oldStatus, newStatus) => {
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
  const subject = `[Luxe Motors] Cập nhật trạng thái đơn hàng #${order.orderNumber || order._id}: ${statusLabel}`;

  const htmlContent = `
    <div style="font-family: 'Jost', Arial, sans-serif; background-color: #070709; color: #e2e8f0; padding: 35px; border-radius: 12px; border: 1px solid rgba(212,175,55,0.3);">
      <div style="text-align: center; margin-bottom: 25px;">
        <h1 style="color: #D4AF37; font-size: 30px; margin: 0; font-weight: bold;">LUXE MOTORS</h1>
        <p style="color: #94a3b8; font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">CẬP NHẬT TIẾN ĐỘ HỢP ĐỒNG</p>
      </div>

      <p style="font-size: 14px;">Xin chào <strong>${userName || 'Quý khách VIP'}</strong>,</p>
      <p style="font-size: 13px; color: #cbd5e1;">Đơn hàng <strong>#${order.orderNumber || order._id}</strong> của Quý khách vừa được chuyển sang trạng thái mới:</p>

      <div style="background-color: #0E0E12; border: 1px solid rgba(212,175,55,0.4); padding: 22px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <p style="font-size: 12px; color: #94a3b8; margin: 0;">Trạng thái đơn hàng hiện tại:</p>
        <h2 style="color: #D4AF37; font-size: 22px; margin: 8px 0; font-weight: bold;">${statusLabel}</h2>
        <p style="font-size: 12px; color: #cbd5e1; margin-top: 5px;">Mẫu xe: <strong>${order.carSnapshot?.name || 'Siêu Xe Luxe Motors'}</strong></p>
      </div>

      <p style="font-size: 12px; color: #94a3b8;">Quý khách có thể tra cứu thông tin chi tiết đơn hàng trong phần "Đơn Hàng Của Tôi" trên website Luxe Motors.</p>
      <hr style="border: 0; border-top: 1px solid #1e293b; margin: 30px 0;" />
      <p style="font-size: 11px; color: #64748b; text-align: center;">Luxe Motors Flagship Showroom · Hotline: 0372 950 720</p>
    </div>
  `;

  return sendMailGeneric({
    toEmail,
    subject,
    htmlContent,
    eventType: 'ORDER_STATUS_CHANGED',
    orderId: order._id,
    userId: order.user?._id || order.user,
  });
};

/**
 * 4. Email Cảnh báo sắp hết hạn cọc giữ chỗ (10 phút còn lại)
 */
const sendReservationExpiringEmail = async (order, toEmail, userName) => {
  const subject = `[Luxe Motors] ⏰ Cảnh báo: Đơn cọc xe #${order.orderNumber || order._id} sắp hết hạn giữ chỗ`;
  const htmlContent = `
    <div style="font-family: 'Jost', Arial, sans-serif; background-color: #070709; color: #e2e8f0; padding: 35px; border-radius: 12px; border: 1px solid #ef4444;">
      <div style="text-align: center; margin-bottom: 25px;">
        <h1 style="color: #D4AF37; font-size: 30px; margin: 0; font-weight: bold;">LUXE MOTORS</h1>
        <p style="color: #f87171; font-size: 12px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">CẢNH BÁO SẮP HẾT HẠN GIỮ CHỖ</p>
      </div>

      <p style="font-size: 14px;">Xin chào <strong>${userName || 'Quý khách VIP'}</strong>,</p>
      <p style="font-size: 13px; color: #cbd5e1;">Mã QR giữ chỗ siêu xe <strong>${order.carSnapshot?.name || ''}</strong> cho đơn hàng <strong>#${order.orderNumber || order._id}</strong> sẽ hết hạn trong ít phút nữa.</p>

      <div style="background-color: #0E0E12; border: 1px solid #ef4444; padding: 22px; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 13px;"><strong>Số tiền cọc:</strong> <span style="color: #ef4444; font-weight: bold; font-size: 16px;">${formatMoney(order.depositAmount)}</span></p>
        <p style="font-size: 12px; color: #fca5a5;">Nếu không nhận được thanh toán trước khi thời gian đếm ngược kết thúc, siêu xe sẽ tự động được mở lại cho khách hàng khác mua.</p>
      </div>

      <p style="font-size: 12px; color: #94a3b8;">Vui lòng truy cập website mở mã QR PayOS để thanh toán ngay.</p>
      <hr style="border: 0; border-top: 1px solid #1e293b; margin: 30px 0;" />
      <p style="font-size: 11px; color: #64748b; text-align: center;">Luxe Motors Flagship Showroom · Hotline: 0372 950 720</p>
    </div>
  `;

  return sendMailGeneric({
    toEmail,
    subject,
    htmlContent,
    eventType: 'RESERVATION_EXPIRING',
    orderId: order._id,
    userId: order.user?._id || order.user,
  });
};

/**
 * 5. Email Đăng ký Lịch hẹn xem xe / Lái thử mới thành công
 */
const sendAppointmentCreatedEmail = async (appointment, toEmail, userName) => {
  const carName = appointment.car?.name || 'Siêu Xe Luxe Motors';
  const apptDateStr = new Date(appointment.appointmentDate).toLocaleDateString('vi-VN');
  const apptIdStr = String(appointment._id).slice(-8).toUpperCase();
  const subject = `[Luxe Motors] Xác nhận đăng ký lịch hẹn lái thử #${apptIdStr}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f5f7; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
              
              <!-- HEADER LUXURY BANNER -->
              <tr>
                <td style="background: linear-gradient(135deg, #0b0f19 0%, #1a233a 100%); padding: 35px 30px; text-align: center; border-bottom: 3px solid #D4AF37;">
                  <h1 style="color: #D4AF37; font-size: 26px; margin: 0; font-weight: 800; letter-spacing: 3px; font-family: Georgia, serif;">LUXE MOTORS</h1>
                  <p style="color: #cbd5e1; font-size: 10px; letter-spacing: 4px; text-transform: uppercase; margin: 6px 0 0 0; font-weight: 600;">VIP CONCIERGE SCHEDULER</p>
                </td>
              </tr>

              <!-- BODY CONTENT -->
              <tr>
                <td style="padding: 30px 35px 15px 35px; color: #1e293b;">
                  <h2 style="color: #0f172a; font-size: 20px; margin: 0 0 10px 0; font-weight: 700;">XÁC NHẬN ĐĂNG KÝ LỊCH HẸN #${apptIdStr}</h2>
                  <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0;">
                    Xin chào <strong>${userName || appointment.visitorName || 'Quý khách VIP'}</strong>,<br>
                    Yêu cầu đặt lịch trải nghiệm siêu xe <strong>${carName}</strong> của Quý khách đã được tiếp nhận thành công trên hệ thống Concierge.
                  </p>
                </td>
              </tr>

              <!-- APPOINTMENT DETAILS BOX -->
              <tr>
                <td style="padding: 0 35px 25px 35px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fafafa; border-radius: 12px; border: 1px solid #e2e8f0; padding: 20px;">
                    <tr>
                      <td style="padding: 8px 0; font-size: 13px; color: #64748b; border-bottom: 1px dashed #e2e8f0;">Mẫu xe đăng ký:</td>
                      <td style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #0f172a; text-align: right; border-bottom: 1px dashed #e2e8f0;">${carName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 13px; color: #64748b; border-bottom: 1px dashed #e2e8f0;">Ngày trải nghiệm:</td>
                      <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #b45309; text-align: right; border-bottom: 1px dashed #e2e8f0;">📅 ${apptDateStr}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 13px; color: #64748b; border-bottom: 1px dashed #e2e8f0;">Khung giờ tiếp đón:</td>
                      <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #0284c7; text-align: right; border-bottom: 1px dashed #e2e8f0;">⏰ ${appointment.timeSlot || '10:00'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 13px; color: #64748b; border-bottom: 1px dashed #e2e8f0;">Người đăng ký:</td>
                      <td style="padding: 8px 0; font-size: 13px; font-weight: 600; color: #334155; text-align: right; border-bottom: 1px dashed #e2e8f0;">${appointment.visitorName} (${appointment.visitorPhone})</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0 4px 0; font-size: 13px; color: #64748b;">Trạng thái:</td>
                      <td style="padding: 10px 0 4px 0; font-size: 13px; font-weight: 700; color: #d97706; text-align: right;">⏳ Chờ Chuyên Viên Xác Nhận</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- NOTICE BOX -->
              <tr>
                <td style="padding: 0 35px 25px 35px;">
                  <div style="background-color: #f0fdf4; border-radius: 12px; border: 1px solid #bbf7d0; padding: 16px; color: #166534; font-size: 12px; line-height: 1.5;">
                    💡 Chuyên viên Concierge Luxe Motors sẽ điện thoại xác nhận lịch đón tiếp tận nhà hoặc tại Showroom trong vòng <strong>15 phút</strong>.
                  </div>
                </td>
              </tr>

              <!-- CTA BUTTON -->
              <tr>
                <td style="padding: 0 35px 30px 35px; text-align: center;">
                  <a href="${FRONTEND_URL}/appointment/my" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #0b0f19 0%, #1a233a 100%); color: #D4AF37; text-decoration: none; font-size: 13px; font-weight: 700; padding: 13px 28px; border-radius: 30px; border: 1px solid #D4AF37; letter-spacing: 1px;">
                    XEM LỊCH HẸN CỦA TÔI
                  </a>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="background-color: #fafafa; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #64748b; font-size: 11px; margin: 0; line-height: 1.5;">
                    Luxe Motors Flagship Showroom · Hotline VIP Concierge: <strong>0372 950 720</strong>
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return sendMailGeneric({
    toEmail,
    subject,
    htmlContent,
    eventType: 'APPOINTMENT_CREATED',
    orderId: null,
    userId: appointment.user?._id || appointment.user,
  });
};

/**
 * 6. Email Cập nhật trạng thái lịch hẹn xem xe Concierge
 */
const sendAppointmentConfirmation = async (appointment, toEmail, userName, oldStatus, newStatus) => {
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

  const subject = `[Luxe Motors] Cập nhật lịch hẹn #${apptIdStr}: ${statusLabel}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f5f7; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
              
              <!-- HEADER -->
              <tr>
                <td style="background: linear-gradient(135deg, #0b0f19 0%, #1a233a 100%); padding: 35px 30px; text-align: center; border-bottom: 3px solid #D4AF37;">
                  <h1 style="color: #D4AF37; font-size: 26px; margin: 0; font-weight: 800; letter-spacing: 3px; font-family: Georgia, serif;">LUXE MOTORS</h1>
                  <p style="color: #cbd5e1; font-size: 10px; letter-spacing: 4px; text-transform: uppercase; margin: 6px 0 0 0; font-weight: 600;">CẬP NHẬT TRẠNG THÁI LỊCH HẸN</p>
                </td>
              </tr>

              <!-- BODY CONTENT -->
              <tr>
                <td style="padding: 30px 35px 15px 35px; color: #1e293b;">
                  <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0;">
                    Xin chào <strong>${userName || appointment.visitorName || 'Quý khách VIP'}</strong>,<br>
                    Lịch hẹn trải nghiệm siêu xe <strong>${carName}</strong> (#${apptIdStr}) của Quý khách vừa được cập nhật trạng thái mới.
                  </p>
                </td>
              </tr>

              <!-- STATUS HIGHLIGHT BOX -->
              <tr>
                <td style="padding: 0 35px 25px 35px;">
                  <div style="background-color: #fafafa; border-radius: 12px; border: 1px solid #e2e8f0; padding: 22px; text-align: center;">
                    <p style="font-size: 12px; color: #64748b; margin: 0;">Trạng thái lịch hẹn hiện tại:</p>
                    <h3 style="color: #0284c7; font-size: 22px; margin: 8px 0; font-weight: 800;">${statusLabel}</h3>
                    <p style="font-size: 13px; color: #334155; margin: 4px 0 0 0;">
                      📅 Ngày: <strong>${apptDateStr}</strong> &nbsp;|&nbsp; ⏰ Khung giờ: <strong>${appointment.timeSlot}</strong>
                    </p>
                  </div>
                </td>
              </tr>

              <!-- CTA BUTTON -->
              <tr>
                <td style="padding: 0 35px 30px 35px; text-align: center;">
                  <a href="${FRONTEND_URL}/appointment/my" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #d97706 0%, #b45309 100%); color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 13px 28px; border-radius: 30px; letter-spacing: 1px;">
                    TRA CỨU TRÊN WEBSITE
                  </a>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="background-color: #fafafa; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #64748b; font-size: 11px; margin: 0; line-height: 1.5;">
                    Luxe Motors Flagship Showroom · Hotline VIP Concierge: <strong>0372 950 720</strong>
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return sendMailGeneric({
    toEmail,
    subject,
    htmlContent,
    eventType: 'APPOINTMENT_UPDATED',
    orderId: null,
    userId: appointment.user?._id || appointment.user,
  });
};

/**
 * 7. Email Tự động xác nhận tiếp nhận liên hệ / phản hồi của khách hàng
 */
const sendContactReceivedEmail = async (contact) => {
  const toEmail = contact.email;
  if (!toEmail) return false;

  const customerName = contact.name || 'Quý khách VIP';
  const topic = contact.subject || contact.interest || 'Tư vấn siêu xe';
  const carName = contact.car ? ` - Mẫu xe: ${contact.car}` : '';
  const subject = `[Luxe Motors] Đã tiếp nhận yêu cầu liên hệ: ${topic}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f5f7; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
              
              <!-- HEADER LUXURY -->
              <tr>
                <td style="background: linear-gradient(135deg, #0b0f19 0%, #1a233a 100%); padding: 35px 30px; text-align: center; border-bottom: 3px solid #D4AF37;">
                  <h1 style="color: #D4AF37; font-size: 26px; margin: 0; font-weight: 800; letter-spacing: 3px; font-family: Georgia, serif;">LUXE MOTORS</h1>
                  <p style="color: #cbd5e1; font-size: 10px; letter-spacing: 4px; text-transform: uppercase; margin: 6px 0 0 0; font-weight: 600;">VIP CONCIERGE & CUSTOMER CARE</p>
                </td>
              </tr>

              <!-- BODY -->
              <tr>
                <td style="padding: 30px 35px 15px 35px; color: #1e293b;">
                  <h2 style="color: #0f172a; font-size: 19px; margin: 0 0 10px 0; font-weight: 700;">CẢM ƠN QUÝ KHÁCH ĐÃ LIÊN HỆ</h2>
                  <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0;">
                    Kính gửi <strong>${customerName}</strong>,<br>
                    Luxe Motors xin trân trọng cảm ơn Quý khách đã gửi yêu cầu thông tin đến phòng Dịch vụ Khách hàng VIP. Chúng tôi đã ghi nhận nội dung liên hệ của Quý khách trên hệ thống.
                  </p>
                </td>
              </tr>

              <!-- DETAIL BOX -->
              <tr>
                <td style="padding: 0 35px 25px 35px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fafafa; border-radius: 12px; border: 1px solid #e2e8f0; padding: 18px 20px;">
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px; color: #64748b; border-bottom: 1px dashed #e2e8f0;">Chủ đề yêu cầu:</td>
                      <td style="padding: 6px 0; font-size: 13px; font-weight: 700; color: #0f172a; text-align: right; border-bottom: 1px dashed #e2e8f0;">${topic}${carName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px; color: #64748b; border-bottom: 1px dashed #e2e8f0;">Số điện thoại:</td>
                      <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #334155; text-align: right; border-bottom: 1px dashed #e2e8f0;">${contact.phone || 'Chưa cung cấp'}</td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding: 10px 0 4px 0; font-size: 12px; color: #64748b;">Nội dung tin nhắn:</td>
                    </tr>
                    <tr>
                      <td colspan="2" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-size: 13px; color: #334155; line-height: 1.5; font-style: italic;">
                        "${contact.message}"
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- NOTICE -->
              <tr>
                <td style="padding: 0 35px 25px 35px;">
                  <div style="background-color: #f0fdf4; border-radius: 12px; border: 1px solid #bbf7d0; padding: 14px; color: #166534; font-size: 12px; line-height: 1.5;">
                    ⏱️ Chuyên viên Quản lý Khách hàng VIP sẽ liên hệ trực tiếp qua điện thoại hoặc email trong vòng <strong>15 - 30 phút</strong> để giải đáp chi tiết nhất.
                  </div>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="background-color: #fafafa; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #64748b; font-size: 11px; margin: 0; line-height: 1.5;">
                    Luxe Motors Flagship Showroom · Hotline VIP Concierge: <strong>0372 950 720</strong><br>
                    📍 18 Lý Thường Kiệt, Q. Hoàn Kiếm, Hà Nội | 88 Nguyễn Huệ, Q. 1, TP. HCM
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return sendMailGeneric({
    toEmail,
    subject,
    htmlContent,
    eventType: 'CONTACT_RECEIVED',
    orderId: null,
    userId: null,
  });
};

/**
 * 8. Email Chuyên viên CSKH / Sales phản hồi trực tiếp cho khách hàng
 */
const sendContactReplyEmail = async ({ toEmail, customerName, subject, replyMessage, originalMessage, staffName }) => {
  if (!toEmail) return false;

  const emailSubject = subject || `[Luxe Motors] Phản hồi từ Bộ phận VIP Concierge gửi ${customerName || 'Quý khách'}`;
  const senderTitle = staffName ? `${staffName} - Chuyên viên VIP Concierge` : 'Bộ phận Quản lý Khách hàng VIP Luxe Motors';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${emailSubject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f5f7; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
              
              <!-- HEADER LUXURY -->
              <tr>
                <td style="background: linear-gradient(135deg, #0b0f19 0%, #1a233a 100%); padding: 35px 30px; text-align: center; border-bottom: 3px solid #D4AF37;">
                  <h1 style="color: #D4AF37; font-size: 26px; margin: 0; font-weight: 800; letter-spacing: 3px; font-family: Georgia, serif;">LUXE MOTORS</h1>
                  <p style="color: #cbd5e1; font-size: 10px; letter-spacing: 4px; text-transform: uppercase; margin: 6px 0 0 0; font-weight: 600;">VIP CONCIERGE RESPONSE</p>
                </td>
              </tr>

              <!-- GREETING -->
              <tr>
                <td style="padding: 30px 35px 15px 35px; color: #1e293b;">
                  <p style="font-size: 15px; line-height: 1.6; color: #0f172a; margin: 0 0 15px 0;">
                    Kính gửi Quý khách <strong>${customerName || 'Quý khách VIP'}</strong>,
                  </p>
                  <p style="font-size: 14px; line-height: 1.7; color: #334155; margin: 0; white-space: pre-wrap;">
${replyMessage}
                  </p>
                </td>
              </tr>

              ${originalMessage ? `
              <!-- ORIGINAL MESSAGE QUOTE -->
              <tr>
                <td style="padding: 10px 35px 25px 35px;">
                  <div style="background-color: #f8fafc; border-left: 4px solid #D4AF37; padding: 14px 16px; border-radius: 0 8px 8px 0;">
                    <p style="font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase; margin: 0 0 6px 0;">Nội dung Quý khách đã gửi trước đó:</p>
                    <p style="font-size: 12px; color: #475569; font-style: italic; margin: 0; line-height: 1.5;">"${originalMessage}"</p>
                  </div>
                </td>
              </tr>` : ''}

              <!-- SIGNATURE -->
              <tr>
                <td style="padding: 10px 35px 30px 35px;">
                  <div style="border-top: 1px solid #e2e8f0; padding-top: 16px;">
                    <p style="font-size: 13px; font-weight: 700; color: #0f172a; margin: 0;">${senderTitle}</p>
                    <p style="font-size: 12px; color: #64748b; margin: 4px 0 0 0;">LUXE MOTORS AUTOMOBILES SHOWROOM</p>
                    <p style="font-size: 12px; color: #b45309; margin: 4px 0 0 0;">📞 Hotline VIP: 0372 950 720 · 🌐 <a href="${FRONTEND_URL}" style="color: #b45309; text-decoration: none;">${FRONTEND_URL}</a></p>
                  </div>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="background-color: #fafafa; padding: 18px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #94a3b8; font-size: 11px; margin: 0;">
                    Đây là thư điện tử chính thức từ Hệ thống Quản trị Showroom Luxe Motors Ver 2.0.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return sendMailGeneric({
    toEmail,
    subject: emailSubject,
    htmlContent,
    eventType: 'CONTACT_REPLY',
    orderId: null,
    userId: null,
  });
};

module.exports = {
  sendOrderCreatedEmail,
  sendDepositSuccessEmail,
  sendOrderStatusChangedEmail,
  sendReservationExpiringEmail,
  sendAppointmentCreatedEmail,
  sendAppointmentConfirmation,
  sendAppointmentUpdatedEmail: sendAppointmentConfirmation,
  sendOrderConfirmation: sendOrderCreatedEmail, // Backward compatibility alias
  sendContactReceivedEmail,
  sendContactReplyEmail,
};

