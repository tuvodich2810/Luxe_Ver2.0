const expressAsyncHandler = require('express-async-handler');
const Brand = require('../models/Brand');
const { ok, created, notFound, badRequest } = require('../utils/apiResponse');

// GET /api/brands
const getBrands = expressAsyncHandler(async (req, res) => {
  const { featured } = req.query;
  const filter = { isActive: true };
  if (featured === 'true') filter.isFeatured = true;

  const brands = await Brand.find(filter)
    .sort('displayOrder name')
    .lean();

  return ok(res, 'Lấy danh sách thương hiệu thành công', brands);
});

// GET /api/brands/:id
const getBrandById = expressAsyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) return notFound(res, 'Không tìm thấy thương hiệu');
  return ok(res, 'Lấy thông tin thương hiệu thành công', brand);
});

// POST /api/brands [Admin]
const createBrand = expressAsyncHandler(async (req, res) => {
  if (!req.body.name) return badRequest(res, 'Tên thương hiệu là bắt buộc');
  const brand = await Brand.create(req.body);
  return created(res, 'Thêm thương hiệu thành công', brand);
});

// PUT /api/brands/:id [Admin]
const updateBrand = expressAsyncHandler(async (req, res) => {
  const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!brand) return notFound(res, 'Không tìm thấy thương hiệu');
  return ok(res, 'Cập nhật thương hiệu thành công', brand);
});

// DELETE /api/brands/:id [Admin]
const deleteBrand = expressAsyncHandler(async (req, res) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  if (!brand) return notFound(res, 'Không tìm thấy thương hiệu');
  return ok(res, 'Xóa thương hiệu thành công');
});

module.exports = { getBrands, getBrandById, createBrand, updateBrand, deleteBrand };