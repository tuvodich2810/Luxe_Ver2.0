const mongoose = require('mongoose');
const { MONGO_URI } = require('../config/env');
const fs = require('fs');
const path = require('path');

async function runFullAudit() {
  console.log('====================================================');
  console.log('🔍 BẮT ĐẦU AUDIT HỆ THỐNG THỰC TẾ (CODEBASE + MONGODB)');
  console.log('====================================================\n');

  await mongoose.connect(MONGO_URI);
  console.log('✅ Đã kết nối MongoDB Atlas:', MONGO_URI.split('@')[1]?.split('?')[0]);

  // 1. Kiểm tra Models
  const modelsDir = path.join(__dirname, '..', 'models');
  const modelFiles = fs.readdirSync(modelsDir).filter(f => f.endsWith('.js'));
  console.log('\n📁 1. DANH SÁCH MONGOOSE MODELS TRONG CODEBASE:');
  modelFiles.forEach(f => {
    const model = require(path.join(modelsDir, f));
    const modelName = model.modelName || f.replace('.js', '');
    console.log(`   - Model: ${modelName.padEnd(16)} (File: backend/models/${f})`);
  });

  // 2. Kiểm tra Collections thực tế trong Database
  console.log('\n📊 2. SỐ LƯỢNG DOCUMENTS TRONG CÁC COLLECTIONS THỰC TẾ TRÊN MONGODB ATLAS:');
  const collections = await mongoose.connection.db.listCollections().toArray();
  for (const col of collections) {
    const count = await mongoose.connection.db.collection(col.name).countDocuments();
    console.log(`   - Collection [${col.name.padEnd(16)}]: ${count} records`);
  }

  // 3. Kiểm tra Routes & Controllers
  const routesDir = path.join(__dirname, '..', 'routes');
  const routeFiles = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));
  console.log('\n🌐 3. DANH SÁCH API ROUTERS & ENDPOINTS:');
  routeFiles.forEach(rf => {
    console.log(`   - Router: backend/routes/${rf}`);
  });

  // 4. Kiểm tra User Roles thực tế trong Database
  const User = require('../models/User');
  const userRolesCount = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]);
  console.log('\n👥 4. PHÂN BỐ TÀI KHOẢN THEO VAI TRÒ (ROLES TRONG DB):');
  userRolesCount.forEach(r => {
    console.log(`   - Role [${r._id}]: ${r.count} users`);
  });

  // 5. Kiểm tra Cars & Brands thực tế
  const Car = require('../models/Car');
  const Brand = require('../models/Brand');
  const carCount = await Car.countDocuments();
  const brandCount = await Brand.countDocuments();
  const carStatusCount = await Car.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  console.log(`\n🏎️ 5. THỰC TRẠNG KHO XE & THƯƠNG HIỆU:`);
  console.log(`   - Tổng số thương hiệu (Brands): ${brandCount}`);
  console.log(`   - Tổng số siêu xe (Cars): ${carCount}`);
  carStatusCount.forEach(s => {
    console.log(`     + Trạng thái [${s._id || 'available'}]: ${s.count} xe`);
  });

  // 6. Kiểm tra Orders
  const Order = require('../models/Order');
  const orderCount = await Order.countDocuments();
  const orderStatusCount = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  console.log(`\n💳 6. THỰC TRẠNG ĐƠN HÀNG ĐẶT CỌC (ORDERS):`);
  console.log(`   - Tổng số đơn cọc: ${orderCount}`);
  orderStatusCount.forEach(s => {
    console.log(`     + Trạng thái [${s._id}]: ${s.count} đơn`);
  });

  // 7. Kiểm tra Appointments & Contacts & Favorites
  const Appointment = require('../models/Appointment');
  const Contact = require('../models/Contact');
  const Favorite = require('../models/Favorite');
  const NotificationLog = require('../models/NotificationLog');

  console.log(`\n📅 7. CÁC MODULE NGHIỆP VỤ KHÁC:`);
  console.log(`   - Lịch hẹn lái thử (Appointments): ${await Appointment.countDocuments()} bản ghi`);
  console.log(`   - Liên hệ & Leads CRM (Contacts): ${await Contact.countDocuments()} bản ghi`);
  console.log(`   - Danh sách xe yêu thích (Favorites): ${await Favorite.countDocuments()} bản ghi`);
  console.log(`   - Nhật ký thông báo (NotificationLog): ${await NotificationLog.countDocuments()} bản ghi`);

  await mongoose.disconnect();
  console.log('\n====================================================');
  console.log('✅ AUDIT DỮ LIỆU HOÀN TẤT!');
  console.log('====================================================');
}

runFullAudit().catch(err => {
  console.error('Audit Error:', err);
  process.exit(1);
});
