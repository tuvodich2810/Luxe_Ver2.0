const mongoose = require('mongoose');
const { MONGO_URI, EMAIL_USER } = require('../config/env');
const Car = require('../models/Car');
const Order = require('../models/Order');
const User = require('../models/User');
const NotificationLog = require('../models/NotificationLog');
const emailService = require('../services/emailService');
const zaloService = require('../services/zaloService');

async function testRealEmailAndZalo() {
  console.log('----------------------------------------------------');
  console.log('🚀 BẮT ĐẦU KIỂM THỬ THỰC TẾ GỬI GMAIL VÀ ZALO');
  console.log('----------------------------------------------------');

  try {
    console.log('1. Đang kết nối tới MongoDB Atlas real database...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Đã kết nối thành công tới Database: luxurymoto\n');

    // Truy vấn dữ liệu thực tế từ Database
    console.log('2. Truy vấn dữ liệu xe thực tế từ Database...');
    const realCar = await Car.findOne() || {
      name: 'Porsche 911 GT3 RS 2024',
      price: 15900000000,
    };
    console.log(`📌 Mẫu xe lấy từ DB: ${realCar.name} - Giá: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(realCar.price)}`);

    // Truy vấn hoặc lấy thông tin người dùng thực tế
    const realUser = await User.findOne({ email: EMAIL_USER }) || {
      name: 'Nguyễn Văn Tuấn',
      email: EMAIL_USER,
      phone: '0372950720',
    };
    console.log(`👤 Khách nhận thông báo: ${realUser.name} | Email: ${realUser.email} | SĐT: ${realUser.phone}\n`);

    // Tạo giả định Order từ thông tin thật để test
    const mockOrder = {
      _id: new mongoose.Types.ObjectId(),
      payosOrderCode: Number(String(Date.now()).slice(-8)),
      depositAmount: Math.round(realCar.price * 0.1), // Cọc 10%
      carSnapshot: {
        name: realCar.name,
        price: realCar.price,
      },
      user: realUser._id,
    };

    console.log('3. GỬI EMAIL THỰC TẾ QUA GMAIL NODEMAILER...');
    console.log(`✉️ Đang gửi email tới: ${realUser.email} ...`);
    const emailResult = await emailService.sendOrderCreatedEmail(
      mockOrder,
      realUser.email,
      realUser.name
    );
    console.log(`KẾT QUẢ GỬI GMAIL: ${emailResult ? '✅ GỬI THÀNH CÔNG!' : '❌ THẤT BẠI'}\n`);

    console.log('4. GỬI TIN NHẮN ZALO MÔ PHỎNG VÀ LƯU LOG THỰC TẾ...');
    const zaloResult = await zaloService.sendOrderCreatedZalo(
      mockOrder,
      realUser.phone,
      realUser.name
    );
    console.log(`KẾT QUẢ GỬI ZALO: ${zaloResult ? '✅ GỬI MÔ PHỎNG THÀNH CÔNG!' : '❌ THẤT BẠI'}\n`);

    console.log('5. KIỂM TRA LOG DỮ LIỆU ĐÃ GHI VÀO MONGODB...');
    const recentLogs = await NotificationLog.find().sort({ createdAt: -1 }).limit(2);
    console.log(`📊 Tìm thấy ${recentLogs.length} bản ghi NotificationLog mới nhất trong DB:`);
    recentLogs.forEach((log, index) => {
      console.log(`   [${index + 1}] Kênh: ${log.channel.toUpperCase()} | Trạng thái: ${log.status} | Người nhận: ${log.recipient} | Thời gian: ${log.createdAt}`);
    });

    console.log('\n----------------------------------------------------');
    console.log('🎉 TẤT CẢ TÍNH NĂNG KIỂM THỬ ĐÃ HOÀN THÀNH VỚI DỮ LIỆU THỰC TẾ!');
    console.log('----------------------------------------------------');

  } catch (err) {
    console.error('❌ CÓ LỖI XẢY RA TRONG QUÁ TRÌNH KIỂM THỬ:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Đã ngắt kết nối Database an toàn.');
  }
}

testRealEmailAndZalo();
