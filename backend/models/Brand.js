const mongoose = require('mongoose');
const slugify = require('slugify');

const brandSchema = new mongoose.Schema(
  {
    // Tên thương hiệu
    name: {
      type: String,
      required: [true, 'Tên thương hiệu là bắt buộc'],
      unique: true,
      trim: true,
      maxlength: [100, 'Tên thương hiệu không được quá 100 ký tự'],
    },

    // Slug URL-friendly
    slug: {
      type: String,
      unique: true,
      index: true,
    },

    // Logo thương hiệu
    logo: {
      type: String,
      default: '',
    },

    // Ảnh banner thương hiệu
    bannerImage: {
      type: String,
      default: '',
    },

    // Quốc gia xuất xứ
    country: {
      type: String,
      trim: true,
      default: '',
    },

    // Năm thành lập
    foundedYear: {
      type: Number,
    },

    // Mô tả thương hiệu
    description: {
      type: String,
      trim: true,
      default: '',
    },

    // Website chính thức
    website: {
      type: String,
      trim: true,
      default: '',
    },

    // Hiển thị trên trang chủ
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // Thứ tự hiển thị
    displayOrder: {
      type: Number,
      default: 0,
    },

    // Trạng thái hoạt động
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ===================================
// PRE-SAVE HOOK: Tạo slug
// ===================================
brandSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// ===================================
// VIRTUAL: Đếm số xe của thương hiệu này
// ===================================
brandSchema.virtual('carCount', {
  ref: 'Car',
  localField: '_id',
  foreignField: 'brand',
  count: true,
});

// ===================================
// INDEX
// ===================================
brandSchema.index({ isFeatured: 1, displayOrder: 1 });

const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;