const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const connectDB = require("../config/db");
const Brand = require("../models/Brand");

async function seedBrands() {
  try {
    // Kết nối MongoDB
    await connectDB();

    // Đọc dữ liệu từ file JSON
    const brands = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../data/brands.json"),
        "utf8"
      )
    );

    // Xóa toàn bộ dữ liệu cũ
    await Brand.deleteMany({});

    console.log("🗑️ Đã xóa dữ liệu thương hiệu cũ.");

    // Thêm từng thương hiệu để pre('save') chạy và tạo slug
    for (const brandData of brands) {
      const brand = new Brand(brandData);
      await brand.save();
      console.log(`✅ Đã thêm: ${brand.name}`);
    }

    console.log(`\n🎉 Hoàn thành! Đã thêm ${brands.length} thương hiệu.`);

    // Đóng kết nối MongoDB
    await mongoose.connection.close();

    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi:", err);

    await mongoose.connection.close();

    process.exit(1);
  }
}

seedBrands();