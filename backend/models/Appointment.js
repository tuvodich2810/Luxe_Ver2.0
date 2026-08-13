const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    // Người đặt lịch
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // Xe muốn xem
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: [true, 'Xe là bắt buộc'],
    },

    // Ngày hẹn
    appointmentDate: {
      type: Date,
      required: [true, 'Ngày hẹn là bắt buộc'],
    },

    // Khung giờ
    timeSlot: {
      type: String,
      required: [true, 'Khung giờ là bắt buộc'],
      enum: [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
      ],
    },

    // Tên người đến xem (có thể khác user)
    visitorName: {
      type: String,
      required: [true, 'Tên người xem là bắt buộc'],
      trim: true,
    },

    // SĐT liên hệ
    visitorPhone: {
      type: String,
      required: [true, 'Số điện thoại là bắt buộc'],
      trim: true,
    },

    // Email liên hệ
    visitorEmail: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      lowercase: true,
      trim: true,
    },

    // Ghi chú thêm
    notes: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Ghi chú không quá 500 ký tự'],
    },

    // Trạng thái lịch hẹn
    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'completed', 'cancelled'],
        message: 'Trạng thái không hợp lệ',
      },
      default: 'pending',
    },

    // Lý do hủy (nếu cancelled)
    cancelReason: {
      type: String,
      trim: true,
      default: '',
    },

    // Admin notes (ghi chú nội bộ)
    adminNotes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// ===================================
// INDEX: Tăng tốc query theo user và trạng thái
// ===================================
appointmentSchema.index({ user: 1, status: 1 });
appointmentSchema.index({ appointmentDate: 1 });
appointmentSchema.index({ car: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;