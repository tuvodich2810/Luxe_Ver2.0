const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const connectDB = require('../config/db');
const { seedFullData } = require('../services/seedService');

const run = async () => {
  console.log('🔄 Đang kết nối tới Database và nạp 100% dữ liệu lịch sử 8 tháng...');
  await connectDB();
  const res = await seedFullData();
  console.log('🎉 NẠP THÀNH CÔNG:', res);
  process.exit(0);
};

run().catch((err) => {
  console.error('❌ LỖI KHI NẠP DỮ LIỆU:', err);
  process.exit(1);
});
