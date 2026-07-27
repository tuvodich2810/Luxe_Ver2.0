import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import orderService from '@/services/orderService';
import { X, ShieldCheck, CreditCard, CheckCircle2, Sparkles, Building2 } from 'lucide-react';

export default function PurchaseModal({ car, isOpen, onClose, onSuccess }) {
  const { user } = useAuth();
  const [depositPercent, setDepositPercent] = useState(10);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [showroomLocation, setShowroomLocation] = useState('hanoi');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);

  if (!isOpen || !car) return null;

  const totalPrice = typeof car.price === 'number' ? car.price : 500000;
  const depositAmount = Math.round((totalPrice * depositPercent) / 100);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const orderData = {
        carId: car._id,
        carName: car.name,
        carImage: car.mainImage || car.images?.[0],
        totalPrice,
        depositAmount,
        depositPercent,
        paymentMethod,
        showroomLocation,
        notes,
        customerName: user?.fullName || 'Khách Hàng VIP',
        customerPhone: user?.phone || '0988888888',
        customerEmail: user?.email || 'vip@luxemotors.vn',
      };

      const order = orderService.createOrder(orderData);
      setOrderComplete(order);
      if (onSuccess) onSuccess(order);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0E0E12] border border-[#D4AF37]/30 rounded-lg p-6 sm:p-8 shadow-2xl shadow-black space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!orderComplete ? (
          <>
            {/* Header */}
            <div className="border-b border-white/10 pb-4 space-y-1">
              <div className="lux-eyebrow">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                ONLINE CAR RESERVATION
              </div>
              <h2 className="font-serif-lux text-2xl sm:text-3xl font-bold text-white">
                Đặt Cọc Giữ Xe Thượng Lưu
              </h2>
              <p className="text-xs text-slate-400">
                Cam kết giữ xe chính hãng, hoàn tiền 100% nếu thay đổi quyết định trong 7 ngày.
              </p>
            </div>

            {/* Car Summary Box */}
            <div className="flex items-center gap-4 p-4 rounded bg-[#15151B] border border-white/5">
              <img
                src={car.mainImage || car.images?.[0]}
                alt={car.name}
                className="w-24 h-16 object-cover rounded border border-white/10"
              />
              <div className="flex-1">
                <span className="text-[10px] font-mono-lux text-[#D4AF37] uppercase">
                  {typeof car.brand === 'object' ? car.brand?.name : car.brand}
                </span>
                <h4 className="font-serif-lux text-lg text-white font-bold">{car.name}</h4>
                <p className="text-xs font-mono-lux text-slate-300">
                  Giá niêm yết: <span className="text-[#D4AF37] font-bold">${totalPrice.toLocaleString()}</span>
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmitOrder} className="space-y-5">
              {/* Deposit Percentage Selection */}
              <div className="space-y-2">
                <label className="text-xs font-mono-lux uppercase tracking-wider text-slate-300">
                  Tỷ lệ đặt cọc giữ xe
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[10, 20, 30].map((pct) => (
                    <button
                      type="button"
                      key={pct}
                      onClick={() => setDepositPercent(pct)}
                      className={`p-3 rounded border text-xs font-mono-lux transition-all ${
                        depositPercent === pct
                          ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37] font-bold'
                          : 'border-white/10 bg-[#15151B] text-slate-400 hover:text-white'
                      }`}
                    >
                      Đặt Cọc {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Deposit Amount Display */}
              <div className="p-4 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-between">
                <span className="text-xs font-mono-lux text-slate-300">
                  Số tiền cọc thanh toán ngay ({depositPercent}%):
                </span>
                <span className="font-serif-lux text-2xl text-[#D4AF37] font-bold">
                  ${depositAmount.toLocaleString()} USD
                </span>
              </div>

              {/* Showroom & Payment Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                    Flagship Showroom Bàn Giao
                  </label>
                  <select
                    value={showroomLocation}
                    onChange={(e) => setShowroomLocation(e.target.value)}
                    className="lux-input text-xs bg-[#15151B]"
                  >
                    <option value="hanoi">Showroom Flagship Hà Nội</option>
                    <option value="hcm">Showroom Flagship TP. Hồ Chí Minh</option>
                    <option value="home">Giao Xe Tận Dinh Thự Khách Hàng</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                    Phương Thức Thanh Toán Cọc
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="lux-input text-xs bg-[#15151B]"
                  >
                    <option value="bank_transfer">Chuyển Khoản Ngân Hàng VIP</option>
                    <option value="credit_card">Thẻ Tín Dụng Quản Lý (Visa/Mastercard Black)</option>
                    <option value="crypto">Tài Sản Số (USDT / Crypto VIP)</option>
                  </select>
                </div>
              </div>

              {/* Notes Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                  Ghi chú riêng cho Chuyên viên LuxeMotors
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="VD: Yêu cầu giao xe vào giờ đẹp, chuẩn bị hoa chúc mừng..."
                  className="lux-input text-xs"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-lux-gold w-full py-4 text-xs tracking-[0.2em]"
              >
                {submitting ? 'Đang Khởi Tạo Đơn Cọc...' : `XÁC NHẬN ĐẶT CỌC $${depositAmount.toLocaleString()}`}
              </button>
            </form>
          </>
        ) : (
          /* Order Success State */
          <div className="py-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif-lux text-3xl font-bold text-white">
                Đặt Cọc Xe Thành Công!
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Mã đơn hàng cọc của bạn là{' '}
                <span className="text-[#D4AF37] font-mono-lux font-bold">{orderComplete._id}</span>.
                Chuyên viên LuxeMotors sẽ liên hệ trong vòng 15 phút để hoàn tất thủ tục bàn giao.
              </p>
            </div>

            <button
              onClick={() => {
                setOrderComplete(null);
                onClose();
              }}
              className="btn-lux-gold px-8 py-3"
            >
              Đóng và Xem Đơn Hàng Của Tôi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}