const express = require('express');
const router = express.Router();
const { uploadImage, uploadMultipleImages, deleteImage } = require('../controllers/imageController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/adminMiddleware');
const { uploadSingle, uploadMultiple } = require('../middlewares/uploadMiddleware');

router.post('/upload', protect, adminOnly, uploadSingle, uploadImage);
router.post('/upload-multiple', protect, adminOnly, uploadMultiple, uploadMultipleImages);
router.delete('/:id', protect, adminOnly, deleteImage);

module.exports = router;