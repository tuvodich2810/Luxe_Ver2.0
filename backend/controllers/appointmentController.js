const expressAsyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const { ok, created, notFound, badRequest, forbidden } = require('../utils/apiResponse');

// GET /api/appointments [Admin]
const getAllAppointments = expressAsyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const [appointments, total] = await Promise.all([
    Appointment.find(filter)
      .populate('user', 'fullName email phone')
      .populate('car', 'name model year mainImage slug')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit, 10)),
    Appointment.countDocuments(filter),
  ]);

  return ok(res, 'Lấy danh sách lịch hẹn thành công', appointments, {
    total, page: parseInt(page, 10), totalPages: Math.ceil(total / parseInt(limit, 10)),
  });
});

// GET /api/appointments/my [Auth]
const getMyAppointments = expressAsyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ user: req.user._id })
    .populate('car', 'name model year mainImage slug brand')
    .sort('-createdAt');
  return ok(res, 'Lấy lịch hẹn của bạn thành công', appointments);
});

// POST /api/appointments [Auth]
const createAppointment = expressAsyncHandler(async (req, res) => {
  const { car, appointmentDate, timeSlot, visitorName, visitorPhone, visitorEmail, notes } = req.body;

  if (!car || !appointmentDate || !timeSlot || !visitorName || !visitorPhone || !visitorEmail) {
    return badRequest(res, 'Vui lòng điền đầy đủ thông tin đặt lịch');
  }

  const appointment = await Appointment.create({
    user: req.user._id,
    car,
    appointmentDate,
    timeSlot,
    visitorName,
    visitorPhone,
    visitorEmail,
    notes,
  });

  await appointment.populate('car', 'name model year');

  return created(res, 'Đặt lịch xem xe thành công', appointment);
});

// PUT /api/appointments/:id [Admin]
const updateAppointmentStatus = expressAsyncHandler(async (req, res) => {
  const { status, adminNotes, cancelReason } = req.body;

  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status, adminNotes, cancelReason },
    { new: true, runValidators: true }
  ).populate('user', 'fullName email').populate('car', 'name');

  if (!appointment) return notFound(res, 'Không tìm thấy lịch hẹn');
  return ok(res, 'Cập nhật trạng thái lịch hẹn thành công', appointment);
});

// DELETE /api/appointments/:id [Auth]
const cancelAppointment = expressAsyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return notFound(res, 'Không tìm thấy lịch hẹn');

  // Chỉ người đặt hoặc admin mới được hủy
  if (
    appointment.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return forbidden(res, 'Bạn không có quyền hủy lịch hẹn này');
  }

  appointment.status = 'cancelled';
  appointment.cancelReason = req.body.cancelReason || 'Người dùng tự hủy';
  await appointment.save();

  return ok(res, 'Hủy lịch hẹn thành công', appointment);
});

module.exports = {
  getAllAppointments,
  getMyAppointments,
  createAppointment,
  updateAppointmentStatus,
  cancelAppointment,
};