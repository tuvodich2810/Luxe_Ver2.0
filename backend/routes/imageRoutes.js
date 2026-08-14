const express = require('express');
const router = express.Router();
const { uploadImage, uploadMultipleImages, deleteImage } = require('../controllers/imageController');
const { protect } = require('../middlewares/authMiddleware');
const { hasRole } = require('../middlewares/adminMiddleware');
const { uploadSingle, uploadMultiple } = require('../middlewares/uploadMiddleware');

const imageManageRoles = hasRole('admin', 'quan_ly');
router.post('/upload', protect, imageManageRoles, uploadSingle, uploadImage);
router.post('/upload-multiple', protect, imageManageRoles, uploadMultiple, uploadMultipleImages);
router.delete('/:id', protect, imageManageRoles, deleteImage);

module.exports = router;