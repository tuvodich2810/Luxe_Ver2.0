const expressAsyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');
const Image = require('../models/Image');
const { ok, created, notFound, serverError } = require('../utils/apiResponse');
const { UPLOAD_PATH } = require('../config/env');

// POST /api/images/upload [Admin]
const uploadImage = expressAsyncHandler(async (req, res) => {
  // File đã được xử lý bởi uploadMiddleware
  if (!req.file) {
    const error = new Error('Vui lòng chọn file ảnh');
    error.statusCode = 400;
    throw error;
  }

  const { file } = req;

  // Tạo URL public có thể truy cập
  const url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

  // Lưu metadata vào DB
  const image = await Image.create({
    originalName: file.originalname,
    filename: file.filename,
    path: file.path,
    url,
    size: file.size,
    mimetype: file.mimetype,
    uploadedBy: req.user._id,
  });

  return created(res, 'Upload ảnh thành công', image);
});

// POST /api/images/upload-multiple [Admin]
const uploadMultipleImages = expressAsyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    const error = new Error('Vui lòng chọn ít nhất một file ảnh');
    error.statusCode = 400;
    throw error;
  }

  const images = await Promise.all(
    req.files.map(async (file) => {
      const url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
      return Image.create({
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        url,
        size: file.size,
        mimetype: file.mimetype,
        uploadedBy: req.user._id,
      });
    })
  );

  return created(res, `Upload ${images.length} ảnh thành công`, images);
});

// DELETE /api/images/:id [Admin]
const deleteImage = expressAsyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.id);
  if (!image) return notFound(res, 'Không tìm thấy ảnh');

  // Xóa file vật lý
  const filePath = path.resolve(image.path);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Xóa record trong DB
  await Image.findByIdAndDelete(req.params.id);

  return ok(res, 'Xóa ảnh thành công');
});

module.exports = { uploadImage, uploadMultipleImages, deleteImage };