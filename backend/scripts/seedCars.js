const fs = require("fs");
const path = require("path");

const connectDB = require("../config/db");
const Brand = require("../models/Brand");
const Car = require("../models/Car");

async function seedCars() {
  try {
    await connectDB();

    const cars = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../data/cars.json"),
        "utf8"
      )
    );

    const brands = await Brand.find();

    const brandMap = {};

    brands.forEach((brand) => {
      brandMap[brand.name] = brand._id;
    });

    await Car.deleteMany();

    let count = 0;

    for (const car of cars) {
      const brandId = brandMap[car.brand];

      if (!brandId) {
        console.log(`⚠ Không tìm thấy brand: ${car.brand}`);
        continue;
      }

      await Car.create({
        ...car,
        brand: brandId,
      });

      count++;
    }

    console.log(`✅ Đã thêm ${count} xe`);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedCars();