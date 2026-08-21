const mongoose = require('mongoose');
const { MONGO_URI } = require('../config/env');
const NotificationLog = require('../models/NotificationLog');

async function check() {
  await mongoose.connect(MONGO_URI);
  const logs = await NotificationLog.find().sort({ createdAt: -1 }).limit(10);
  console.log('=== 10 NOTIFICATION LOGS MỚI NHẤT TRÊN MONGODB ATLAS ===');
  logs.forEach((l, i) => {
    console.log(`[#${i + 1}] Lúc: ${l.createdAt.toISOString()} | Event: ${l.eventType.padEnd(20)} | Kênh: ${l.channel} | Status: ${l.status.padEnd(9)} | To: ${l.recipient} | Error: ${l.errorMessage || 'None'}`);
  });
  await mongoose.disconnect();
}

check().catch(console.error);
