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
    },

    // Password đã được hash
    password: {
      type: String,
      required: [true, 'Mật khẩu là bắt buộc'],
      minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
      select: false,
    },

    // Vai trò phân quyền: admin, giam_doc, quan_ly, sales, cskh, user
    role: {
      type: String,
      enum: {
        values: ['admin', 'giam_doc', 'quan_ly', 'sales', 'cskh', 'user'],
        message: 'Vai trò không hợp lệ trong hệ thống',
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
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.virtual('favorites', {
  ref: 'Favorite',
  localField: '_id',
  foreignField: 'user',
  count: true,
});

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
module.exports = User;