const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// Schema người dùng
const userSchema = new mongoose.Schema(
  {
    // Tên đầy đủ
    fullName: {
      type: String,
      required: [true, 'Họ tên là bắt buộc'],
      trim: true,
      minlength: [2, 'Họ tên phải có ít nhất 2 ký tự'],
      maxlength: [100, 'Họ tên không được quá 100 ký tự'],
    },

    // Email dùng để đăng nhập
    email: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: 'Email không hợp lệ',
      },
    },

    // Số điện thoại
    phone: {
      type: String,
      trim: true,
      match: [/^(\+84|0)[0-9]{9}$/, 'Số điện thoại không hợp lệ'],
    },

    // Password đã được hash
    password: {
      type: String,
      required: [true, 'Mật khẩu là bắt buộc'],
      minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
      select: false, // Không trả password trong query mặc định
    },

    // Vai trò: user thường hoặc admin
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'Vai trò phải là user hoặc admin',
      },
      default: 'user',
    },

    // Avatar URL
    avatar: {
      type: String,
      default: '',
    },

    // Địa chỉ
    address: {
      type: String,
      trim: true,
      default: '',
    },

    // Trạng thái tài khoản
    isActive: {
      type: Boolean,
      default: true,
    },

    // Thời gian đăng nhập cuối
    lastLogin: {
      type: Date,
    },
  },
  {
    // Tự động thêm createdAt và updatedAt
    timestamps: true,
    // Thêm virtual fields vào JSON output
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ===================================
// PRE-SAVE HOOK: Hash password trước khi lưu
// ===================================
userSchema.pre('save', async function (next) {
  // Chỉ hash khi password được thay đổi
  if (!this.isModified('password')) {
    return next();
  }

  // Tạo salt với cost factor 12 (cân bằng bảo mật và hiệu năng)
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ===================================
// INSTANCE METHOD: So sánh password khi đăng nhập
// ===================================
userSchema.methods.comparePassword = async function (candidatePassword) {
  // bcrypt.compare tự động dùng salt được nhúng trong hash
  return await bcrypt.compare(candidatePassword, this.password);
};

// ===================================
// VIRTUAL: Danh sách xe yêu thích (populate từ Favorite collection)
// ===================================
userSchema.virtual('favorites', {
  ref: 'Favorite',
  localField: '_id',
  foreignField: 'user',
  count: true, // Chỉ lấy count, không populate full document
});

// ===================================
// INDEX: Tăng tốc query theo email
// ===================================
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
module.exports = User;