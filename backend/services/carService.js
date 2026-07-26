const Car = require('../models/Car');

// ===================================
// Lấy danh sách xe với filter, sort, pagination
// ===================================
const getCars = async (queryParams) => {
  const {
    page = 1,
    limit = 12,
    sort = '-createdAt',
    brand,
    category,
    condition,
    minPrice,
    maxPrice,
    search,
    isFeatured,
    inStock,
  } = queryParams;

  // Xây dựng filter object
  const filter = { isPublished: true };

  if (brand) filter.brand = brand;
  if (category) filter.category = category;
  if (condition) filter.condition = condition;
  if (inStock !== undefined) filter.inStock = inStock === 'true';
  if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';

  // Lọc theo khoảng giá
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Tìm kiếm full-text
  if (search) {
    filter.$text = { $search: search };
  }

  // Tính toán skip cho pagination
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  // Query song song: lấy data và đếm total
  const [cars, total] = await Promise.all([
    Car.find(filter)
      .populate('brand', 'name logo slug')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(), // .lean() trả plain JS object, nhanh hơn Mongoose document
    Car.countDocuments(filter),
  ]);

  return {
    cars,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      hasNextPage: pageNum < Math.ceil(total / limitNum),
      hasPrevPage: pageNum > 1,
    },
  };
};

// ===================================
// Lấy xe nổi bật
// ===================================
const getFeaturedCars = async (limit = 6) => {
  return Car.find({ isFeatured: true, isPublished: true, inStock: true })
    .populate('brand', 'name logo slug')
    .sort('-createdAt')
    .limit(limit)
    .lean();
};

// ===================================
// Lấy chi tiết xe theo ID hoặc slug
// ===================================
const getCarById = async (idOrSlug) => {
  let car;

  // Kiểm tra là ObjectId hay slug
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);

  if (isObjectId) {
    car = await Car.findById(idOrSlug).populate('brand', 'name logo slug country');
  } else {
    car = await Car.findOne({ slug: idOrSlug }).populate('brand', 'name logo slug country');
  }

  if (!car || !car.isPublished) {
    const error = new Error('Không tìm thấy xe');
    error.statusCode = 404;
    throw error;
  }

  // Tăng lượt xem
  await Car.findByIdAndUpdate(car._id, { $inc: { views: 1 } });

  return car;
};

// ===================================
// Lấy xe liên quan (cùng brand hoặc category)
// ===================================
const getRelatedCars = async (carId, brandId, category, limit = 4) => {
  return Car.find({
    _id: { $ne: carId },       // Loại trừ xe hiện tại
    isPublished: true,
    $or: [
      { brand: brandId },
      { category: category },
    ],
  })
    .populate('brand', 'name logo slug')
    .sort('-views')
    .limit(limit)
    .lean();
};

// ===================================
// Tạo xe mới
// ===================================
const createCar = async (carData) => {
  const car = await Car.create(carData);
  return Car.findById(car._id).populate('brand', 'name logo slug');
};

// ===================================
// Cập nhật xe
// ===================================
const updateCar = async (id, updateData) => {
  const car = await Car.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate('brand', 'name logo slug');

  if (!car) {
    const error = new Error('Không tìm thấy xe');
    error.statusCode = 404;
    throw error;
  }

  return car;
};

// ===================================
// Xóa xe
// ===================================
const deleteCar = async (id) => {
  const car = await Car.findByIdAndDelete(id);

  if (!car) {
    const error = new Error('Không tìm thấy xe');
    error.statusCode = 404;
    throw error;
  }

  return car;
};

module.exports = {
  getCars,
  getFeaturedCars,
  getCarById,
  getRelatedCars,
  createCar,
  updateCar,
  deleteCar,
};