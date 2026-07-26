const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // Mã đơn hàng
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },

    // Người đặt
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Xe được đặt
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },

    // Lưu thông tin xe tại thời điểm đặt
    carSnapshot: {
      name: String,
      brand: String,
      model: String,
      year: Number,
      image: String,
      price: Number,
    },

    // Tiền cọc
    depositAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Tổng tiền
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Thanh toán
    paymentMethod: {
      type: String,
      enum: ["cash", "bank_transfer", "installment"],
      default: "bank_transfer",
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "deposit_paid",
        "fully_paid",
        "refunded",
      ],
      default: "pending",
    },

    // Trạng thái đơn
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    // Địa chỉ giao xe
    deliveryAddress: {
      type: String,
      trim: true,
      default: "",
    },

    // Ghi chú
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Sinh mã đơn hàng
orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    const random = Math.floor(100000 + Math.random() * 900000);
    this.orderNumber = `LM-${new Date().getFullYear()}-${random}`;
  }
  next();
});

orderSchema.index({ user: 1 });
orderSchema.index({ car: 1 });
orderSchema.index({ orderStatus: 1 });

module.exports = mongoose.model("Order", orderSchema);