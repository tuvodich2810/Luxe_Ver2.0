const mongoose = require("mongoose");
const colors = require("colors");
const { MONGO_URI, NODE_ENV } = require("./env");

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