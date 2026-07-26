const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    // Tên file gốc
    originalName: {
      type: String,
      required: true,
    },

    // Tên file sau khi lưu (đã đổi tên)
    filename: {
      type: String,
      required: true,
      unique: true,
    },

    // Đường dẫn tương đối
    path: {
      type: String,
      required: true,
    },

    // URL public để truy cập
    url: {
      type: String,
      required: true,
    },

    // Kích thước file (bytes)
    size: {
      type: Number,
      required: true,
    },

    // MIME type
    mimetype: {
      type: String,
      required: true,
    },

    // Người upload
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Liên kết đến đối tượng nào (car, brand, user...)
    relatedTo: {
      model: {
        type: String,
        enum: ['Car', 'Brand', 'User'],
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;