const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    // Người dùng
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Xe được yêu thích
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ===================================
// COMPOUND UNIQUE INDEX: Mỗi user chỉ thêm 1 lần/xe
// ===================================
favoriteSchema.index({ user: 1, car: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorite;