const mongoose = require("mongoose");
const colors = require("colors");
const dns = require("dns");
const { MONGO_URI, NODE_ENV } = require("./env");

// Sử dụng Google & Cloudflare DNS để giải quyết lỗi DNS SRV (querySrv ECONNREFUSED) trên Windows
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore DNS set error if not supported
}

let mongoServer;

// Hàm kết nối MongoDB
const connectDB = async () => {
  try {
    // Debug kiểm tra URI
    console.log("=================================");
    console.log("📌 MONGO_URI:", MONGO_URI);
    console.log("=================================");

    if (!MONGO_URI) {
      throw new Error("MONGO_URI không tồn tại");
    }

    const conn = await mongoose.connect(MONGO_URI);

    console.log(
      `✅ MongoDB đã kết nối: ${conn.connection.host}`.cyan.bold
    );

    // Tự động nạp tài khoản ban đầu nếu DB chưa có người dùng
    try {
      const User = require("../models/User");
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log("🌱 Database trống, đang khởi tạo dữ liệu mẫu ban đầu...".yellow);
        const { seedFullData } = require("../services/seedService");
        await seedFullData();
      }
    } catch (seedErr) {
      console.error("⚠️ Không thể tự động nạp dữ liệu mẫu:", seedErr.message);
    }

    return conn;
  } catch (error) {
    console.error(`❌ Lỗi kết nối MongoDB: ${error.message}`.red.bold);

    if (NODE_ENV === "development") {
      try {
        console.log("⚠️ Đang thử MongoDB Memory Server...".yellow);

        const { MongoMemoryServer } = require("mongodb-memory-server");
        mongoServer = await MongoMemoryServer.create();

        const uri = mongoServer.getUri();

        const conn = await mongoose.connect(uri);

        console.log(
          `✅ Đã chuyển sang MongoDB in-memory: ${conn.connection.host}`.yellow.bold
        );

        // Auto-seed data nếu in-memory DB chưa có dữ liệu
        try {
          const User = require("../models/User");
          const count = await User.countDocuments();
          if (count === 0) {
            console.log("🌱 Tự động khởi tạo dữ liệu mẫu cho In-Memory Database...".yellow);
            const { seedFullData } = require("../services/seedService");
            await seedFullData();
          }
        } catch (seedErr) {
          console.error("⚠️ Lỗi tự động nạp dữ liệu mẫu:", seedErr.message);
        }

        return conn;
      } catch (memError) {
        console.error(
          `❌ Lỗi MongoDB in-memory: ${memError.message}`.red.bold
        );
      }
    }

    process.exit(1);
  }
};

// Mất kết nối
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB mất kết nối".yellow);
});

// Kết nối lại
mongoose.connection.on("reconnected", () => {
  console.log("🔄 MongoDB đã kết nối lại".green);
});

module.exports = connectDB;