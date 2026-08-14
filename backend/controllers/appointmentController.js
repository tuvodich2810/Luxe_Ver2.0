const expressAsyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const notificationService = require('../services/notificationService');
const {
  ok,
  created,
  notFound,
  badRequest,
  forbidden,
} = require('../utils/apiResponse');

// ===================================
// GET /api/appointments [Admin]
// ===================================
const getAllAppointments = expressAsyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const [appointments, total] = await Promise.all([
    Appointment.find(filter)
      .populate('user', 'fullName email phone')
      .populate('car', 'name model year mainImage slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),

    Appointment.countDocuments(filter),
  ]);

  return ok(
    res,
    'Lấy danh sách lịch hẹn thành công',
    appointments,
    {
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    }
  );
});

// ===================================
// GET /api/appointments/my
// ===================================
const getMyAppointments = expressAsyncHandler(async (req, res) => {

  const appointments = await Appointment.find({
    user: req.user._id,
  })
    .populate('car', 'name model year mainImage slug brand')
    .sort({ createdAt: -1 });

  return ok(
    res,
    'Lấy lịch hẹn của bạn thành công',
    appointments
  );
});

// ===================================
// POST /api/appointments
// ===================================
const createAppointment = expressAsyncHandler(async (req, res) => {
  try {

    const {
      car,
      appointmentDate,
      timeSlot,
      visitorName,
      visitorPhone,
      visitorEmail,
      notes,
    } = req.body;

    let cleanTimeSlot = String(timeSlot || '').trim();
    const timeMatch = cleanTimeSlot.match(/\b(0[9]|1[0-6]):[0-5][0]\b/);
    if (timeMatch) {
      cleanTimeSlot = timeMatch[0];
    }

    if (
      !car ||
      !appointmentDate ||
      !cleanTimeSlot ||
      !visitorName ||
      !visitorPhone ||
      !visitorEmail
    ) {
      return badRequest(
        res,
        'Vui lòng nhập đầy đủ thông tin'
      );
    }

    // ===================================
    // Kiểm tra trùng lịch hẹn (Appointment Conflict Check)
    // ===================================
    const targetDate = new Date(appointmentDate);
    const startOfDay = new Date(targetDate.getTime());
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate.getTime());
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointment = await Appointment.findOne({
      car,
      timeSlot: cleanTimeSlot,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existingAppointment) {
      return badRequest(
        res,
        'Khung giờ và ngày chọn xem mẫu xe này đã có người đăng ký trước. Vui lòng chọn khung giờ hoặc ngày khác.'
      );
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      car,
      appointmentDate,
      timeSlot: cleanTimeSlot,
      visitorName,
      visitorPhone,
      visitorEmail,
      notes,
    });

    await appointment.populate(
      'car',
      'name model year mainImage'
    );

    // TỰ ĐỘNG GỬI THÔNG BÁO EMAIL & ZALO CHO KHÁCH HÀNG
    notificationService.triggerAppointmentCreated(appointment, req.user);

    return created(
      res,
      'Đặt lịch xem xe thành công',
      appointment
    );

  } catch (err) {

    console.log("=========== ERROR ===========");
    console.error(err);
    console.log("=============================");

    throw err;
  }

});

// ===================================
// PUT
// ===================================
const updateAppointmentStatus = expressAsyncHandler(async (req, res) => {

  const {
    status,
    adminNotes,
    cancelReason,
  } = req.body;

  const oldAppt = await Appointment.findById(req.params.id);
  const oldStatus = oldAppt ? oldAppt.status : 'pending';

  const appointment =
    await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status,
        adminNotes,
        cancelReason,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate('user', 'fullName email phone')
      .populate('car', 'name');

  if (!appointment) {
    return notFound(
      res,
      'Không tìm thấy lịch hẹn'
    );
  }

  // TỰ ĐỘNG GỬI THÔNG BÁO EMAIL & ZALO CẬP NHẬT TRẠNG THÁI CHO KHÁCH HÀNG
  notificationService.triggerAppointmentUpdated(appointment, req.user, oldStatus, status);

  return ok(
    res,
    'Cập nhật thành công',
    appointment
  );

});

// ===================================
// DELETE
// ===================================
const cancelAppointment = expressAsyncHandler(async (req, res) => {

  const appointment =
    await Appointment.findById(req.params.id)
      .populate('user', 'fullName email phone')
      .populate('car', 'name');

  if (!appointment) {
    return notFound(
      res,
      'Không tìm thấy lịch hẹn'
    );
  }

  const apptUserId = appointment.user?._id ? appointment.user._id.toString() : appointment.user?.toString();
  const isOwner = apptUserId === req.user._id.toString();
  const isStaff = ['admin', 'giam_doc', 'quan_ly', 'sales', 'cskh'].includes(req.user.role);

  if (!isOwner && !isStaff) {
    return forbidden(
      res,
      'Bạn không có quyền hủy lịch hẹn này'
    );
  }

  const oldStatus = appointment.status;
  appointment.status = 'cancelled';

  appointment.cancelReason =
    req.body.cancelReason ||
    'Khách hàng tự hủy trên hệ thống';

  await appointment.save();

  // TỰ ĐỘNG GỬI THÔNG BÁO EMAIL & ZALO KHI HỦY LỊCH HẸN
  notificationService.triggerAppointmentUpdated(appointment, req.user, oldStatus, 'cancelled');

  return ok(
    res,
    'Đã hủy lịch hẹn thành công',
    appointment
  );

});

module.exports = {
  getAllAppointments,
  getMyAppointments,
  createAppointment,
  updateAppointmentStatus,
  cancelAppointment,
};