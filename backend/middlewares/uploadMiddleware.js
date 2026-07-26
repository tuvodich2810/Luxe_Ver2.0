const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { MAX_FILE_SIZE, UPLOAD_PATH } = require('../config/env');

// ===================================
// Đảm bảo thư mục upload tồn tại
// ===================================
const ensureUploadDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// ===================================
// Cấu hình nơi lưu file và tên file
// ===================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.resolve(UPLOAD_PATH);
    ensureUploadDir(uploadDir);
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    // Tạo tên file duy nhất: timestamp-random.extension
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `img-${uniqueSuffix}${ext}`);
  },
});

// ===================================
// Validate file type (chỉ chấp nhận ảnh)
// ===================================
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Chấp nhận file
  } else {
    cb(
      new Error('Chỉ chấp nhận file ảnh: JPEG, PNG, WebP'),
      false // Từ chối file
    );
  }
};

// ===================================
// Tạo Multer instance
// ===================================
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE, // Giới hạn kích thước file
    files: 10,               // Tối đa 10 file mỗi request
  },
});

// ===================================
// Export các middleware upload cụ thể
// ===================================
module.exports = {
  uploadSingle: upload.single('image'),   // Upload 1 file, field name = 'image'
  uploadMultiple: upload.array('images', 10), // Upload nhiều file, tối đa 10
};