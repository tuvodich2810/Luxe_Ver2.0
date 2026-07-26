const mongoose = require('mongoose');
const slugify = require('slugify');

// Sub-schema cho thông số kỹ thuật
const specificationsSchema = new mongoose.Schema(
  {
    engine: { type: String, trim: true },        // Loại động cơ (V8 Twin-Turbo...)
    displacement: { type: Number },               // Dung tích xi-lanh (cc)
    horsepower: { type: Number },                 // Công suất (HP)
    torque: { type: Number },                     // Mô-men xoắn (Nm)
    transmission: { type: String, trim: true },   // Hộp số (8-speed automatic...)
    drivetrain: { type: String, trim: true },     // Hệ dẫn động (RWD, AWD, 4WD)
    acceleration: { type: Number },               // 0-100 km/h (giây)
    topSpeed: { type: Number },                   // Tốc độ tối đa (km/h)
    fuelType: { type: String, trim: true },       // Nhiên liệu (Xăng, Diesel, Hybrid)
    fuelConsumption: { type: Number },            // Mức tiêu hao nhiên liệu (L/100km)
    seats: { type: Number },                      // Số chỗ ngồi
    doors: { type: Number },                      // Số cửa
    length: { type: Number },                     // Chiều dài (mm)
    width: { type: Number },                      // Chiều rộng (mm)
    height: { type: Number },                     // Chiều cao (mm)
    wheelbase: { type: Number },                  // Chiều dài cơ sở (mm)
    weight: { type: Number },                     // Trọng lượng (kg)
    cargo: { type: Number },                      // Thể tích khoang hành lý (L)
  },
  { _id: false } // Không tạo _id cho sub-document
);

// Schema chính của xe
const carSchema = new mongoose.Schema(
  {
    // Tên xe đầy đủ
    name: {
      type: String,
      required: [true, 'Tên xe là bắt buộc'],
      trim: true,
      maxlength: [200, 'Tên xe không được quá 200 ký tự'],
    },

    // Slug URL-friendly tự động tạo từ name
    slug: {
      type: String,
      unique: true,
      index: true,
    },

    // Thương hiệu (reference đến Brand collection)
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: [true, 'Thương hiệu là bắt buộc'],
    },

    // Model xe (VD: 911, Urus, F8...)
    model: {
      type: String,
      required: [true, 'Model xe là bắt buộc'],
      trim: true,
    },

    // Năm sản xuất
    year: {
      type: Number,
      required: [true, 'Năm sản xuất là bắt buộc'],
      min: [1900, 'Năm sản xuất không hợp lệ'],
      max: [new Date().getFullYear() + 1, 'Năm sản xuất không hợp lệ'],
    },

    // Mô tả ngắn (dùng cho card)
    excerpt: {
      type: String,
      trim: true,
      maxlength: [300, 'Mô tả ngắn không quá 300 ký tự'],
    },

    // Mô tả đầy đủ
    description: {
      type: String,
      trim: true,
    },

    // Giá niêm yết (VNĐ)
    price: {
      type: Number,
      required: [true, 'Giá xe là bắt buộc'],
      min: [0, 'Giá không thể âm'],
    },

    // Giá khuyến mãi (nếu có)
    salePrice: {
      type: Number,
      default: null,
    },

    // Danh sách ảnh xe
    images: [
      {
        url: { type: String, required: true },   // URL ảnh
        alt: { type: String, default: '' },       // Alt text cho SEO
        isMain: { type: Boolean, default: false },// Ảnh đại diện chính
      },
    ],

    // Màu sắc
    color: {
      type: String,
      trim: true,
    },

    // Nội thất
    interior: {
      type: String,
      trim: true,
    },

    // Loại xe
    category: {
      type: String,
      enum: ['sedan', 'suv', 'coupe', 'convertible', 'supercar', 'hypercar', 'truck'],
      required: [true, 'Loại xe là bắt buộc'],
    },

    // Tình trạng xe
    condition: {
      type: String,
      enum: ['new', 'used', 'certified'],
      default: 'new',
    },

    // Số km đã đi (chỉ với xe cũ)
    mileage: {
      type: Number,
      default: 0,
    },

    // Thông số kỹ thuật chi tiết
    specifications: {
      type: specificationsSchema,
      default: {},
    },

    // Tính năng nổi bật
    features: [
      {
        type: String,
        trim: true,
      },
    ],

    // Có sẵn hàng không
    inStock: {
      type: Boolean,
      default: true,
    },

    // Số lượng trong kho
    stockCount: {
      type: Number,
      default: 1,
      min: 0,
    },

    // Xe nổi bật (hiển thị trên trang chủ)
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // Số lượt xem
    views: {
      type: Number,
      default: 0,
    },

    // Trạng thái hiển thị
    isPublished: {
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
// PRE-SAVE HOOK: Tạo slug từ name
// ===================================
carSchema.pre('save', function (next) {
  // Chỉ tạo lại slug khi name thay đổi
  if (this.isModified('name')) {
    this.slug = slugify(this.name, {
      lower: true,       // Chuyển về chữ thường
      strict: true,      // Bỏ ký tự đặc biệt
      locale: 'vi',      // Hỗ trợ tiếng Việt
    });
  }
  next();
});

// ===================================
// VIRTUAL: Ảnh đại diện chính
// ===================================
carSchema.virtual('mainImage').get(function () {
  // Tìm ảnh có isMain = true, nếu không có thì lấy ảnh đầu tiên
  const main = this.images.find((img) => img.isMain);
  return main ? main.url : (this.images[0] ? this.images[0].url : null);
});

// ===================================
// VIRTUAL: Giá hiển thị (ưu tiên salePrice)
// ===================================
carSchema.virtual('displayPrice').get(function () {
  return this.salePrice && this.salePrice < this.price
    ? this.salePrice
    : this.price;
});

// ===================================
// VIRTUAL: Có giảm giá không
// ===================================
carSchema.virtual('hasDiscount').get(function () {
  return !!(this.salePrice && this.salePrice < this.price);
});

// ===================================
// COMPOUND INDEX: Tăng tốc query lọc xe
// ===================================
carSchema.index({ brand: 1, category: 1 });
carSchema.index({ price: 1 });
carSchema.index({ isFeatured: 1, isPublished: 1 });
carSchema.index({ name: 'text', model: 'text' }); // Full-text search

const Car = mongoose.model('Car', carSchema);
module.exports = Car;