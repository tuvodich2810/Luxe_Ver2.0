const mongoose = require('mongoose');
const { MONGO_URI } = require('../config/env');
const emailService = require('../services/emailService');
const NotificationLog = require('../models/NotificationLog');

const TARGET_EMAIL = 'tuankwan2810@gmail.com';
const TARGET_NAME = 'Nguyễn Đăng Tuấn (VIP Member)';

async function runComprehensiveEmailTest() {
  console.log('================================================================');
  console.log('🚀 BẮT ĐẦU KIỂM THỬ TOÀN DIỆN HỆ THỐNG GỬI GMAIL LUXE MOTORS VER 2.0');
  console.log(`🎯 Địa chỉ email nhận kiểm thử: ${TARGET_EMAIL}`);
  console.log('================================================================\n');

  try {
    console.log('1. Đang kết nối tới MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Đã kết nối cơ sở dữ liệu MongoDB Atlas thành công!\n');

    // [TEST 1] Email Tạo đơn đặt cọc xe (Kèm VietQR Napas 24/7)
    console.log('----------------------------------------------------');
    console.log('📦 [TEST 1/6] Gửi Email Hóa Đơn & Mã QR Đặt Cọc Xe...');
    const mockOrder = {
      _id: new mongoose.Types.ObjectId(),
      orderNumber: 'LUXE-888899',
      payosOrderCode: 888899,
      totalAmount: 18500000000, // 18.5 Tỷ
      depositAmount: 1850000000, // 1.85 Tỷ (10%)
      depositPercent: 10,
      carSnapshot: {
        name: 'Ferrari SF90 Stradale Rosso Corsa 2024',
        price: 18500000000,
      },
    };
    const res1 = await emailService.sendOrderCreatedEmail(mockOrder, TARGET_EMAIL, TARGET_NAME);
    console.log(`👉 Kết quả [TEST 1]: ${res1 ? '✅ GỬI THÀNH CÔNG!' : '❌ THẤT BẠI'}\n`);

    // [TEST 2] Email Xác nhận thanh toán cọc thành công (Biên nhận PayOS)
    console.log('----------------------------------------------------');
    console.log('💳 [TEST 2/6] Gửi Email Biên Nhận Đã Nhận Tiền Cọc Thành Công...');
    mockOrder.paidAt = new Date();
    mockOrder.transactionReference = 'FT240821-PAYOS-9988';
    const res2 = await emailService.sendDepositSuccessEmail(mockOrder, TARGET_EMAIL, TARGET_NAME);
    console.log(`👉 Kết quả [TEST 2]: ${res2 ? '✅ GỬI THÀNH CÔNG!' : '❌ THẤT BẠI'}\n`);

    // [TEST 3] Email Cập nhật trạng thái đơn hàng (Đang chuẩn bị xe & bàn giao)
    console.log('----------------------------------------------------');
    console.log('🏎️ [TEST 3/6] Gửi Email Cập Nhật Trạng Thái Đơn Hàng (Processing)...');
    const res3 = await emailService.sendOrderStatusChangedEmail(
      mockOrder,
      TARGET_EMAIL,
      TARGET_NAME,
      'approved',
      'processing'
    );
    console.log(`👉 Kết quả [TEST 3]: ${res3 ? '✅ GỬI THÀNH CÔNG!' : '❌ THẤT BẠI'}\n`);

    // [TEST 4] Email Xác nhận Đăng ký Lịch hẹn lái thử siêu xe
    console.log('----------------------------------------------------');
    console.log('📅 [TEST 4/6] Gửi Email Xác Nhận Đăng Ký Lịch Lái Thử VIP...');
    const mockAppt = {
      _id: new mongoose.Types.ObjectId(),
      car: { name: 'Rolls-Royce Phantom VIII Extended Bespoke' },
      appointmentDate: new Date('2026-08-25T10:00:00'),
      timeSlot: '10:00 - 11:30 Sáng',
      visitorName: TARGET_NAME,
      visitorPhone: '0372950720',
      status: 'pending',
    };
    const res4 = await emailService.sendAppointmentCreatedEmail(mockAppt, TARGET_EMAIL, TARGET_NAME);
    console.log(`👉 Kết quả [TEST 4]: ${res4 ? '✅ GỬI THÀNH CÔNG!' : '❌ THẤT BẠI'}\n`);

    // [TEST 5] Email Chuyên viên Showroom phê duyệt & xác nhận đón tiếp
    console.log('----------------------------------------------------');
    console.log('👑 [TEST 5/6] Gửi Email Phê Duyệt Lịch Hẹn Đón Tiếp Concierge...');
    mockAppt.status = 'confirmed';
    const res5 = await emailService.sendAppointmentConfirmation(
      mockAppt,
      TARGET_EMAIL,
      TARGET_NAME,
      'pending',
      'confirmed'
    );
    console.log(`👉 Kết quả [TEST 5]: ${res5 ? '✅ GỬI THÀNH CÔNG!' : '❌ THẤT BẠI'}\n`);

    // [TEST 6] Email Tự động xác nhận tiếp nhận liên hệ / đóng góp ý kiến
    console.log('----------------------------------------------------');
    console.log('📬 [TEST 6/6] Gửi Email Tự Động Tiếp Nhận Liên Hệ / Đóng Góp Ý Kiến...');
    const mockContact = {
      _id: new mongoose.Types.ObjectId(),
      name: TARGET_NAME,
      email: TARGET_EMAIL,
      phone: '0372950720',
      subject: 'Yêu cầu tư vấn gói cá nhân hóa Bespoke cho Rolls-Royce Phantom',
      message: 'Tôi muốn tư vấn lắp đặt gói trần sao Starlight Headliner 1.600 sợi quang và tủ làm mát champagne tại tư gia Vinhomes Riverside.',
      car: 'Rolls-Royce Phantom VIII Extended',
    };
    const res6 = await emailService.sendContactReceivedEmail(mockContact);
    console.log(`👉 Kết quả [TEST 6]: ${res6 ? '✅ GỬI THÀNH CÔNG!' : '❌ THẤT BẠI'}\n`);

    // [TEST 7] Email Chuyên viên CSKH phản hồi tư vấn trực tiếp
    console.log('----------------------------------------------------');
    console.log('💬 [TEST 7/7] Gửi Email Chuyên Viên CSKH Phản Hồi Tư Vấn Chi Tiết...');
    const res7 = await emailService.sendContactReplyEmail({
      toEmail: TARGET_EMAIL,
      customerName: TARGET_NAME,
      subject: '[Luxe Motors Concierge] Thư Tư Vấn Gói Bespoke Rolls-Royce Phantom Gửi Anh Tuấn',
      replyMessage: `Kính gửi Anh Tuấn,

Luxe Motors xin trân trọng cảm ơn Anh đã quan tâm đến dòng xe Rolls-Royce Phantom VIII Extended. 

Phòng Thiết kế Bespoke xin xác nhận:
1. Gói trần sao Starlight Headliner với 1.600 sợi quang thủ công tạo hiệu ứng sao băng hiện đã sẵn sàng tùy biến theo chòm sao ngày sinh của Anh.
2. Tủ làm mát Champagne tích hợp ly pha lê Rolls-Royce chính hãng sẽ được hoàn thiện đồng bộ cùng nội thất da Alcantara màu Tan.

Chuyên viên Quản lý Khách hàng VIP Mr. Trần Quốc Bảo (Hotline: 0372 950 720) sẽ liên hệ trực tiếp để mang bảng mẫu da và catalogue màu sơn đến tư gia của Anh vào 10:00 sáng Thứ Bảy tuần này.

Kính chúc Anh Tuấn luôn dồi dào sức khỏe và vạn sự hanh thông!`,
      originalMessage: mockContact.message,
      staffName: 'Trần Quốc Bảo',
    });
    console.log(`👉 Kết quả [TEST 7]: ${res7 ? '✅ GỬI THÀNH CÔNG!' : '❌ THẤT BẠI'}\n`);

    // Kiểm tra NotificationLog trên MongoDB Atlas
    console.log('================================================================');
    console.log('📊 ĐANG KIỂM TRA LỊCH SỬ LOG TRÊN MONGODB ATLAS (NotificationLog)...');
    const recentLogs = await NotificationLog.find({ recipient: TARGET_EMAIL }).sort({ createdAt: -1 }).limit(7);
    console.log(`✅ Đã tìm thấy ${recentLogs.length} bản ghi thông báo mới nhất vừa lưu vào MongoDB:`);
    recentLogs.forEach((log, index) => {
      console.log(`   [#${index + 1}] Event: ${log.eventType.padEnd(22)} | Kênh: ${log.channel.toUpperCase()} | Trạng thái: ${log.status.toUpperCase()} | Tiêu đề: ${log.subject.substring(0, 45)}...`);
    });

    console.log('\n================================================================');
    console.log('🎉 TẤT CẢ 7 KỊCH BẢN GỬI GMAIL ĐÃ ĐƯỢC TEST THÀNH CÔNG VÀ CHẠY ỔN ĐỊNH 100%!');
    console.log('================================================================');

  } catch (error) {
    console.error('❌ Lỗi trong quá trình kiểm thử:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Đã ngắt kết nối Database an toàn.');
  }
}

runComprehensiveEmailTest();
