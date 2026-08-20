const expressAsyncHandler = require('express-async-handler');
const Favorite = require('../models/Favorite');
const Car = require('../models/Car');
const { ok, created, notFound, badRequest } = require('../utils/apiResponse');

// ===================================
// GET /api/favorites
// Lấy danh sách siêu xe yêu thích của User hiện tại
// ===================================
const getMyFavorites = expressAsyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ user: req.user._id })
    .populate({
      path: 'car',
      populate: { path: 'brand', select: 'name logo country' },
    })
    .sort({ createdAt: -1 });

  // Lọc bỏ những mục mà xe đã bị xóa khỏi hệ thống
  const validFavorites = favorites.filter((f) => f.car != null);

  return ok(res, 'Lấy danh sách xe yêu thích thành công', validFavorites);
});

// ===================================
// POST /api/favorites/:carId
// Thêm siêu xe vào danh sách yêu thích
// ===================================
const addFavorite = expressAsyncHandler(async (req, res) => {
  const { carId } = req.params;

  const car = await Car.findById(carId);
  if (!car) {
    return notFound(res, 'Không tìm thấy thông tin siêu xe');
  }

  let favorite = await Favorite.findOne({ user: req.user._id, car: carId });
  if (!favorite) {
    favorite = await Favorite.create({ user: req.user._id, car: carId });
  }

  await favorite.populate({
    path: 'car',
    populate: { path: 'brand', select: 'name logo country' },
  });

  return created(res, 'Đã thêm siêu xe vào danh sách yêu thích', favorite);
});

// ===================================
// DELETE /api/favorites/:carId
// Xóa siêu xe khỏi danh sách yêu thích
// ===================================
const removeFavorite = expressAsyncHandler(async (req, res) => {
  const { carId } = req.params;

  await Favorite.findOneAndDelete({ user: req.user._id, car: carId });

  return ok(res, 'Đã xóa siêu xe khỏi danh sách yêu thích');
});

// ===================================
// DELETE /api/favorites
// Xóa toàn bộ danh sách xe yêu thích của User hiện tại
// ===================================
const clearFavorites = expressAsyncHandler(async (req, res) => {
  await Favorite.deleteMany({ user: req.user._id });

  return ok(res, 'Đã xóa toàn bộ danh sách xe yêu thích');
});

module.exports = {
  getMyFavorites,
  addFavorite,
  removeFavorite,
  clearFavorites,
};
