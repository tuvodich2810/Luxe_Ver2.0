const { spawn } = require('child_process');
const path = require('path');

console.log('\x1b[36m%s\x1b[0m', '==================================================');
console.log('\x1b[33m%s\x1b[0m', '🏎️  LUXE MOTORS VER 2.0 - KHỞI ĐỘNG HỆ THỐNG DEMO');
console.log('\x1b[36m%s\x1b[0m', '==================================================');
console.log('📌 Frontend: http://localhost:5173');
console.log('📌 Backend:  http://localhost:5000/api\n');

console.log('\x1b[32m%s\x1b[0m', '🔑 TÀI KHOẢN DEMO SẴN CÓ:');
console.log(' - Admin:     admin@luxemotors.com   / 123456 (Full quyền)');
console.log(' - Giám Đốc:  minh.nguyen@gmail.com  / 123456 (Dashboard doanh thu, CRM, VIP)');
console.log(' - Quản Lý:   quanly@luxemotors.com  / 123456 (Quản lý kho xe, thương hiệu, duyệt đơn)');
console.log(' - Sales:     sales@luxemotors.com   / 123456 (Lead scoring, chốt đơn, tiếp khách)');
console.log(' - CSKH:      cskh@luxemotors.com    / 123456 (Hỗ trợ khách hàng, liên hệ)');
console.log(' - Khách VIP: khachvip@gmail.com     / 123456 (Đặt lịch lái thử, mua xe)\n');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// Khởi chạy Backend
const backend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true,
});

// Khởi chạy Frontend
const frontend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true,
});

function cleanup() {
  console.log('\n\x1b[31m%s\x1b[0m', 'Đang dừng hệ thống Luxe Motors...');
  try {
    if (isWindows) {
      if (backend.pid) spawn('taskkill', ['/pid', backend.pid.toString(), '/f', '/t']);
      if (frontend.pid) spawn('taskkill', ['/pid', frontend.pid.toString(), '/f', '/t']);
    } else {
      backend.kill('SIGINT');
      frontend.kill('SIGINT');
    }
  } catch (e) {}
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
