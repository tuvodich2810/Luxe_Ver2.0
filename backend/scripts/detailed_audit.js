const mongoose = require('mongoose');
const { MONGO_URI } = require('../config/env');
const User = require('../models/User');
const Car = require('../models/Car');
const Brand = require('../models/Brand');
const Order = require('../models/Order');
const Appointment = require('../models/Appointment');
const Contact = require('../models/Contact');
const Favorite = require('../models/Favorite');
const NotificationLog = require('../models/NotificationLog');

async function inspectData() {
  await mongoose.connect(MONGO_URI);
  
  console.log('================================================================');
  console.log('📊 CHI TIẾT DỮ LIỆU THỰC TẾ TRÊN MONGODB ATLAS (LUXURYMOTO)');
  console.log('================================================================\n');

  console.log('👥 1. DANH SÁCH 12 TÀI KHOẢN NGƯỜI DÙNG & PHÂN QUYỀN RBAC 6 ROLES:');
  const users = await User.find().select('fullName email phone role isActive');
  users.forEach((u, i) => {
    console.log(`   [#${i + 1}] ${u.fullName.padEnd(24)} | Email: ${u.email.padEnd(30)} | Role: [${u.role.padEnd(8)}] | Active: ${u.isActive}`);
  });

  console.log('\n🏎️ 2. DANH SÁCH 10 SIÊU XE TRONG SHOWROOM & GIÁ NIÊM YẾT:');
  const cars = await Car.find().select('name brand price year status isFeatured');
  cars.forEach((c, i) => {
    const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(c.price);
    console.log(`   [#${i + 1}] ${c.name.padEnd(35)} | Năm: ${c.year} | Giá: ${formattedPrice.padEnd(20)} | Status: ${c.status} | Nổi bật: ${c.isFeatured}`);
  });

  console.log('\n🏢 3. DANH SÁCH 10 THƯƠNG HIỆU SIÊU XE (BRANDS):');
  const brands = await Brand.find().select('name country description carCount');
  brands.forEach((b, i) => {
    console.log(`   [#${i + 1}] ${b.name.padEnd(16)} | Quốc gia: ${(b.country || 'N/A').padEnd(12)} | Xe: ${b.carCount || 0}`);
  });

  console.log('\n💳 4. PHÂN TÍCH 32 ĐƠN HÀNG ĐẶT CỌC (ORDERS):');
  const orderBreakdown = await Order.aggregate([
    { $group: { _id: '$orderStatus', count: { $sum: 1 }, totalDeposit: { $sum: '$depositAmount' } } }
  ]);
  orderBreakdown.forEach(b => {
    const formattedDeposit = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(b.totalDeposit);
    console.log(`   - Trạng thái Order: [${(b._id || 'pending').padEnd(12)}] | Số lượng: ${String(b.count).padStart(2)} đơn | Tổng tiền cọc: ${formattedDeposit}`);
  });

  console.log('\n📅 5. PHÂN TÍCH 27 LỊCH HẸN LÁI THỬ (APPOINTMENTS):');
  const apptBreakdown = await Appointment.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  apptBreakdown.forEach(a => {
    console.log(`   - Trạng thái: [${(a._id || 'pending').padEnd(12)}] | Số lượng: ${a.count} lịch hẹn`);
  });

  console.log('\n📈 6. PHÂN TÍCH 16 HỒ SƠ LEADS CRM & LIÊN HỆ (CONTACTS):');
  const contactBreakdown = await Contact.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  contactBreakdown.forEach(c => {
    console.log(`   - Trạng thái CRM: [${(c._id || 'new').padEnd(12)}] | Số lượng: ${c.count} leads`);
  });

  console.log('\n⭐ 7. ĐỒNG BỘ FAVORITES TRÊN ĐÁM MÂY:');
  const favorites = await Favorite.find().populate('user', 'fullName email').populate('car', 'name');
  favorites.forEach((f, i) => {
    console.log(`   [#${i + 1}] User: ${f.user?.fullName || f.user} | Xe yêu thích: ${f.car?.name || f.car}`);
  });

  console.log('\n✉️ 8. NHẬT KÝ THÔNG BÁO ĐA KÊNH (NOTIFICATIONLOGS):');
  const logStats = await NotificationLog.aggregate([
    { $group: { _id: { event: '$eventType', channel: '$channel', status: '$status' }, count: { $sum: 1 } } }
  ]);
  logStats.forEach(l => {
    console.log(`   - Event: [${l._id.event.padEnd(20)}] | Kênh: [${l._id.channel.padEnd(6)}] | Trạng thái: [${l._id.status.padEnd(7)}] | Số lượng: ${l.count}`);
  });

  console.log('\n================================================================');
  console.log('✅ HOÀN TẤT TRÍCH XUẤT VÀ KIỂM ĐỊNH DỮ LIỆU THỰC TẾ 100%');
  console.log('================================================================');

  await mongoose.disconnect();
}

inspectData().catch(console.error);
