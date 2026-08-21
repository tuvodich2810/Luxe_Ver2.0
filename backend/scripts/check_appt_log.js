const mongoose = require('mongoose');
const { MONGO_URI } = require('../config/env');
const User = require('../models/User');
const NotificationLog = require('../models/NotificationLog');
const Appointment = require('../models/Appointment');

async function check() {
  await mongoose.connect(MONGO_URI);
  const latestAppt = await Appointment.findOne().sort({ createdAt: -1 }).populate('user');
  console.log('=== LATEST APPOINTMENT IN DB ===');
  console.log('ID:', latestAppt?._id);
  console.log('Visitor Name:', latestAppt?.visitorName);
  console.log('Visitor Email:', latestAppt?.visitorEmail);
  console.log('Visitor Phone:', latestAppt?.visitorPhone);
  console.log('User Email:', latestAppt?.user?.email);

  const logs = await NotificationLog.find().sort({ createdAt: -1 }).limit(6);
  console.log('\n=== LATEST NOTIFICATION LOGS ===');
  logs.forEach((l, i) => {
    console.log(`[#${i + 1}] Event: ${l.eventType} | To: ${l.recipient} | Channel: ${l.channel} | Status: ${l.status} | Err: ${l.errorMessage || 'None'}`);
  });

  await mongoose.disconnect();
}

check().catch(console.error);
