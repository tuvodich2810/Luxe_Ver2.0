import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import VietQRBankCard from '@/components/common/VietQRBankCard';
import {
  X,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function PurchaseModal({
  car,
  isOpen,
  onClose,
  onSuccess,
}) {
  const { user } = useAuth();

  const [depositPercent, setDepositPercent] = useState(10);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [showroomLocation, setShowroomLocation] = useState('hanoi');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);
  const [error, setError] = useState('');

  const handleClose = () => {
    setNotes('');
    setError('');
    setOrderComplete(null);
    setSubmitting(false);
    if (onClose) onClose();
  };

  if (!isOpen || !car) return null;

  // ===================================
  // Giá xe VND
  // ===================================
  const rawPrice =
    typeof car.displayPrice === 'number'
      ? car.displayPrice
      : typeof car.salePrice === 'number' &&
        car.salePrice > 0 &&
        car.salePrice < car.price
      ? car.salePrice
      : car.price || 0;

  const totalPriceVND = rawPrice;

  const depositAmountVND = Math.round(
    (totalPriceVND * depositPercent) / 100
  );

  const formatCarPriceVND = (num) => {
    if (!num) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  // ===================================
  // Tạo đơn hàng
  // ===================================
  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('Bạn cần đăng nhập trước khi đặt cọc.');
      return;
    }

    if (!car?._id) {
      setError('Không xác định được xe cần đặt.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // ===================================
      // Dữ liệu gửi Backend
      // ===================================
      const orderData = {
        car: car._id,
        depositAmount: depositAmountVND,
        paymentMethod,
        deliveryAddress: showroomLocation,
        notes: notes.trim(),
      };

      console.log('========== CREATE ORDER ==========');
      console.log('ORDER DATA:', orderData);
      console.log('USER:', user);
      console.log('==================================');

      // ===================================
      // Gọi Backend
      // POST /api/orders
      // ===================================
      const response = await api.post(
        '/orders',
        orderData
      );

      console.log('========== ORDER CREATED ==========');
      console.log('RESPONSE:', response);
      console.log('===================================');

      // api.js của bạn trả về res.data
      // Backend có dạng:
      // {
      //   success: true,
      //   message: "...",
      //   data: order
      // }

      const order = response?.data;

      if (!order) {
        throw new Error(
          'Backend không trả về thông tin đơn hàng'
        );
      }

      setOrderComplete(order);

      if (onSuccess) {
        onSuccess(order);
      }
    } catch (err) {
      console.error(
        '❌ CREATE ORDER ERROR:',
        err
      );

      setError(
        err?.message ||
          'Không thể tạo đơn hàng. Vui lòng thử lại.'
      );
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
                Cam kết giữ xe chính hãng, hoàn tiền
                100% nếu thay đổi quyết định trong 7 ngày.
              </p>
            </div>

            {/* Car Summary */}
            <div className="flex items-center gap-4 p-4 rounded bg-[#15151B] border border-white/5">
              <img
                src={
                  car.mainImage ||
                  car.images?.[0]?.url ||
                  car.images?.[0]
                }
                alt={car.name}
                className="w-24 h-16 object-cover rounded border border-white/10"
              />

              <div className="flex-1">
                <span className="text-[10px] font-mono-lux text-[#D4AF37] uppercase">
                  {typeof car.brand === 'object'
                    ? car.brand?.name
                    : car.brand}
                </span>

                <h4 className="font-serif-lux text-lg text-white font-bold">
                  {car.name}
                </h4>

                <p className="text-xs font-mono-lux text-slate-300">
                  Giá niêm yết:{' '}
                  <span className="text-[#D4AF37] font-bold">
                    {formatCarPriceVND(totalPriceVND)}
                  </span>
                </p>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmitOrder}
              className="space-y-5"
            >

              {/* Deposit Percentage */}
              <div className="space-y-2">
                <label className="text-xs font-mono-lux uppercase tracking-wider text-slate-300">
                  Tỷ lệ đặt cọc giữ xe
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {[10, 20, 30].map((pct) => (
                    <button
                      type="button"
                      key={pct}
                      onClick={() =>
                        setDepositPercent(pct)
                      }
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

              {/* Deposit Amount */}
              <div className="p-4 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-between">
                <span className="text-xs font-mono-lux text-slate-300">
                  Số tiền cọc thanh toán ngay ({depositPercent}%):
                </span>

                <span className="font-serif-lux text-xl sm:text-2xl text-[#D4AF37] font-bold">
                  {formatCarPriceVND(depositAmountVND)}
                </span>
              </div>

              {/* Showroom + Payment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Showroom */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                    Flagship Showroom Bàn Giao
                  </label>

                  <select
                    value={showroomLocation}
                    onChange={(e) =>
                      setShowroomLocation(e.target.value)
                    }
                    className="lux-input text-xs bg-[#15151B]"
                  >
                    <option value="hanoi">
                      Showroom Flagship Hà Nội
                    </option>

                    <option value="hcm">
                      Showroom Flagship TP. Hồ Chí Minh
                    </option>

                    <option value="home">
                      Giao Xe Tận Dinh Thự Khách Hàng
                    </option>
                  </select>
                </div>

                {/* Payment */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                    Phương Thức Thanh Toán Cọc
                  </label>

                  <select
                    value={paymentMethod}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                    className="lux-input text-xs bg-[#15151B]"
                  >
                    <option value="bank_transfer">
                      Chuyển Khoản Ngân Hàng VIP
                    </option>

                    <option value="cash">
                      Tiền mặt
                    </option>

                    <option value="installment">
                      Trả góp
                    </option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                  Ghi chú riêng cho Chuyên viên LuxeMotors
                </label>

                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                  placeholder="VD: Yêu cầu giao xe vào giờ đẹp..."
                  className="lux-input text-xs"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="rounded border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-lux-gold w-full py-4 text-xs tracking-[0.2em] font-mono-lux font-bold"
              >
                {submitting
                  ? 'Đang Khởi Tạo Đơn Cọc...'
                  : `XÁC NHẬN ĐẶT CỌC ${formatCarPriceVND(depositAmountVND)}`}
              </button>
            </form>
          </>
        ) : (

          /* Success */
          <div className="py-6 text-center space-y-6">

            <div className="w-14 h-14 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif-lux text-2xl font-bold text-white">
                Đã Khởi Tạo Đơn Đặt Cọc Xe!
              </h3>

              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Mã đơn hàng: {' '}
                <span className="text-[#D4AF37] font-mono-lux font-bold">
                  {orderComplete.orderNumber || orderComplete._id}
                </span>
              </p>
            </div>

            {/* VietQR Dynamic Code Payment */}
            {paymentMethod === 'bank_transfer' && (
              <VietQRBankCard
                depositAmountVND={depositAmountVND}
                orderCode={orderComplete.orderNumber}
                orderId={orderComplete._id}
              />
            )}

            <button
              onClick={() => {
                setOrderComplete(null);
                if (onClose) {
                  onClose();
                }
              }}
              className="btn-lux-gold px-8 py-3 text-xs tracking-wider"
            >
              Hoàn Tất và Xem Đơn Hàng Của Tôi
            </button>

          </div>
        )}
      </div>
    </div>
  );
}