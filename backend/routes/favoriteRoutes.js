const express = require('express');
const router = express.Router();
const {
  getMyFavorites,
  addFavorite,
  removeFavorite,
  clearFavorites,
} = require('../controllers/favoriteController');
const { protect } = require('../middlewares/authMiddleware');

// Tất cả endpoints yêu thích đều yêu cầu đăng nhập
router.use(protect);

router.get('/', getMyFavorites);
router.delete('/', clearFavorites);
router.post('/:carId', addFavorite);
router.delete('/:carId', removeFavorite);

module.exports = router;
