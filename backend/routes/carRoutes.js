const express = require('express');
const router = express.Router();
const {
  getCars, getFeaturedCars, getCarById,
  getRelatedCars, createCar, updateCar, deleteCar,
} = require('../controllers/carController');
const { protect } = require('../middlewares/authMiddleware');
const { hasRole } = require('../middlewares/adminMiddleware');

// Routes công khai
router.get('/', getCars);
router.get('/featured', getFeaturedCars);
router.get('/:idOrSlug', getCarById);
router.get('/:id/related', getRelatedCars);

// Routes dành cho Admin và Quản lý Showroom
const carManageRoles = hasRole('admin', 'quan_ly');
router.post('/', protect, carManageRoles, createCar);
router.put('/:id', protect, carManageRoles, updateCar);
router.delete('/:id', protect, carManageRoles, deleteCar);

module.exports = router;