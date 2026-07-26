const express = require('express');
const router = express.Router();
const {
  getCars, getFeaturedCars, getCarById,
  getRelatedCars, createCar, updateCar, deleteCar,
} = require('../controllers/carController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/adminMiddleware');

// Routes công khai
router.get('/', getCars);
router.get('/featured', getFeaturedCars);
router.get('/:idOrSlug', getCarById);
router.get('/:id/related', getRelatedCars);

// Routes chỉ dành cho Admin
router.post('/', protect, adminOnly, createCar);
router.put('/:id', protect, adminOnly, updateCar);
router.delete('/:id', protect, adminOnly, deleteCar);

module.exports = router;