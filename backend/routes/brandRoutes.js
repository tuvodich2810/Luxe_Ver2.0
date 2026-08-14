const express = require('express');
const router = express.Router();
const { getBrands, getBrandById, createBrand, updateBrand, deleteBrand } = require('../controllers/brandController');
const { protect } = require('../middlewares/authMiddleware');
const { hasRole } = require('../middlewares/adminMiddleware');

router.get('/', getBrands);
router.get('/:id', getBrandById);

const brandManageRoles = hasRole('admin', 'quan_ly');
router.post('/', protect, brandManageRoles, createBrand);
router.put('/:id', protect, brandManageRoles, updateBrand);
router.delete('/:id', protect, brandManageRoles, deleteBrand);

module.exports = router;