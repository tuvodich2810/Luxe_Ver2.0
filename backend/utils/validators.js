// ===================================
// Helper validation dữ liệu đầu vào (Input Validators)
// ===================================

/**
 * Kiểm tra định dạng Email hợp lệ
 */
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
};

/**
 * Kiểm tra số điện thoại Việt Nam hợp lệ (10 chữ số, đầu 03, 05, 07, 08, 09)
 */
const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s.-]/g, '');
  const re = /^(03|05|07|08|09|02)+[0-9]{8,9}$/;
  return re.test(cleaned);
};

/**
 * Kiểm tra độ dài mật khẩu (tối thiểu 6 ký tự)
 */
const isValidPassword = (password) => {
  return typeof password === 'string' && password.trim().length >= 6;
};

/**
 * Kiểm tra ngày đặt lịch xem xe (phải từ hôm nay trở đi)
 */
const isValidAppointmentDate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

/**
 * Middleware validate đăng ký tài khoản
 */
const validateRegisterInput = (req, res, next) => {
  const { fullName, email, password, phone } = req.body;

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Họ và tên phải có ít nhất 2 ký tự',
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Địa chỉ email không hợp lệ',
    });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({
      success: false,
      message: 'Mật khẩu phải có ít nhất 6 ký tự',
    });
  }

  if (phone && !isValidPhone(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Số điện thoại không đúng định dạng',
    });
  }

  next();
};

/**
 * Middleware validate đăng nhập
 */
const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Email đăng nhập không hợp lệ',
    });
  }

  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng nhập mật khẩu',
    });
  }

  next();
};

/**
 * Middleware validate đặt lịch hẹn
 */
const validateAppointmentInput = (req, res, next) => {
  const { car, appointmentDate, timeSlot, visitorName, visitorPhone, visitorEmail } = req.body;

  if (!car) {
    return res.status(400).json({ success: false, message: 'Vui lòng chọn xe' });
  }

  if (!isValidAppointmentDate(appointmentDate)) {
    return res.status(400).json({
      success: false,
      message: 'Ngày đặt lịch phải từ ngày hôm nay trở đi',
    });
  }

  if (!timeSlot) {
    return res.status(400).json({ success: false, message: 'Vui lòng chọn khung giờ' });
  }

  if (!visitorName || visitorName.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập họ tên người xem xe' });
  }

  if (!isValidPhone(visitorPhone)) {
    return res.status(400).json({
      success: false,
      message: 'Số điện thoại liên hệ không hợp lệ',
    });
  }

  if (!isValidEmail(visitorEmail)) {
    return res.status(400).json({ success: false, message: 'Email liên hệ không hợp lệ' });
  }

  next();
};

module.exports = {
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isValidAppointmentDate,
  validateRegisterInput,
  validateLoginInput,
  validateAppointmentInput,
};
