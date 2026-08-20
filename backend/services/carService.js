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
  if (category && typeof category === 'string') {
    // Chuyển category về dạng chuẩn khớp với database
    const catLower = category.toLowerCase().replace(/[\s-]/g, '_');
    if (catLower === 'all' || catLower === 'tat_ca_sieu_xe') {
      // no category filter
    } else if (catLower === 'hypercar') {
      filter.category = 'hypercar';
    } else if (catLower === 'supercar') {
      filter.category = 'supercar';
    } else if (catLower === 'luxury_sedan' || catLower === 'luxurysedan' || catLower === 'sedan') {
      filter.category = { $in: ['luxury_sedan', 'sedan'] };
    } else if (catLower === 'grand_tourer' || catLower === 'grandtourer' || catLower === 'coupe') {
      filter.category = { $in: ['grand_tourer', 'coupe'] };
    } else {
      filter.category = category;
    }
  }

  if (condition) filter.condition = condition;
  if (inStock !== undefined) filter.inStock = inStock === 'true';
  if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';

  // Lọc theo khoảng giá
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Tìm kiếm regex linh hoạt (theo tên, model, loại xe)
  if (search) {
    const searchRegex = new RegExp(search.trim(), 'i');
    filter.$or = [
      { name: searchRegex },
      { model: searchRegex },
      { category: searchRegex },
      { color: searchRegex },
    ];
  }

  // Tính toán skip cho pagination
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  // Helper format car object
  const formatCar = (c) => {
    if (!c) return c;
    const images = c.images || [];
    let mainUrl = null;
    if (images.length > 0) {
      const mainObj = images.find((img) => img && img.isMain);
      mainUrl = mainObj ? (mainObj.url || mainObj) : (images[0].url || images[0]);
    }
    return {
      ...c,
      mainImage: c.mainImage || mainUrl || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800',
    };
  };

  // Query song song: lấy data và đếm total
  const [carsRaw, total] = await Promise.all([
    Car.find(filter)
      .populate('brand', 'name logo slug')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Car.countDocuments(filter),
  ]);

  const cars = carsRaw.map(formatCar);

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
  const carsRaw = await Car.find({ isFeatured: true, isPublished: true, inStock: true })
    .populate('brand', 'name logo slug')
    .sort('-createdAt')
    .limit(limit)
    .lean();

  return carsRaw.map((c) => {
    const images = c.images || [];
    let mainUrl = null;
    if (images.length > 0) {
      const mainObj = images.find((img) => img && img.isMain);
      mainUrl = mainObj ? (mainObj.url || mainObj) : (images[0].url || images[0]);
    }
    return {
      ...c,
      mainImage: c.mainImage || mainUrl || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800',
    };
  });
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
  const orConditions = [];
  if (brandId) orConditions.push({ brand: brandId });
  if (category) orConditions.push({ category: category });

  const query = {
    _id: { $ne: carId },       // Loại trừ xe hiện tại
    isPublished: true,
  };

  if (orConditions.length > 0) {
    query.$or = orConditions;
  }

  return Car.find(query)
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
// Xóa xe (Soft Delete)
// ===================================
const deleteCar = async (id) => {
  const car = await Car.findByIdAndUpdate(
    id,
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
        isPublished: false,
      },
    },
    { new: true }
  );

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