const expressAsyncHandler = require('express-async-handler');
const carService = require('../services/carService');
const { ok, created, notFound, badRequest } = require('../utils/apiResponse');

// GET /api/cars
const getCars = expressAsyncHandler(async (req, res) => {
  const { cars, meta } = await carService.getCars(req.query);
  return ok(res, 'Lấy danh sách xe thành công', cars, meta);
});

// GET /api/cars/featured
const getFeaturedCars = expressAsyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 6;
  const cars = await carService.getFeaturedCars(limit);
  return ok(res, 'Lấy xe nổi bật thành công', cars);
});

// GET /api/cars/:idOrSlug
const getCarById = expressAsyncHandler(async (req, res) => {
  const car = await carService.getCarById(req.params.idOrSlug);
  return ok(res, 'Lấy thông tin xe thành công', car);
});

// GET /api/cars/:id/related
const getRelatedCars = expressAsyncHandler(async (req, res) => {
  const car = await carService.getCarById(req.params.id);
  const brandId = car.brand?._id || car.brand;
  const related = await carService.getRelatedCars(
    car._id,
    brandId,
    car.category
  );
  return ok(res, 'Lấy xe liên quan thành công', related);
});

// POST /api/cars [Admin]
const createCar = expressAsyncHandler(async (req, res) => {
  if (!req.body.name || !req.body.brand || !req.body.price) {
    return badRequest(res, 'Vui lòng điền đầy đủ thông tin xe');
  }
  const car = await carService.createCar(req.body);
  return created(res, 'Thêm xe thành công', car);
});

// PUT /api/cars/:id [Admin]
const updateCar = expressAsyncHandler(async (req, res) => {
  const car = await carService.updateCar(req.params.id, req.body);
  return ok(res, 'Cập nhật xe thành công', car);
});

// DELETE /api/cars/:id [Admin]
const deleteCar = expressAsyncHandler(async (req, res) => {
  await carService.deleteCar(req.params.id);
  return ok(res, 'Xóa xe thành công');
});

module.exports = {
  getCars,
  getFeaturedCars,
  getCarById,
  getRelatedCars,
  createCar,
  updateCar,
  deleteCar,
};