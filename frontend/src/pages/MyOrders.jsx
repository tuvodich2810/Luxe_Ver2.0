import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Chatbot from '@/components/common/Chatbot';
import orderService from '@/services/orderService';
import {
  ShoppingBag,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from 'lucide-react';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ===================================
  // Lấy đơn hàng của USER hiện tại
  // ===================================
  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const result = await orderService.getMyOrders();

      setOrders(result.orders || []);
    } catch (err) {
      console.error('❌ Không lấy được đơn hàng:', err);
      setError(err.message || 'Không thể tải đơn hàng');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  // ===================================
  // Hủy đơn
  // ===================================
  const handleCancel = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn đặt cọc này?')) {
      return;
    }

    try {
      await orderService.cancelOrder(orderId);

      // Load lại danh sách từ MongoDB
      await fetchMyOrders();
    } catch (err) {
      alert(err.message || 'Không thể hủy đơn hàng');
    }
  };

  // ===================================
  // Loading
  // ===================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#070709] text-slate-100">
        <Navbar />

        <main className="pt-28 pb-24">
          <div className="lux-container text-center py-24">
            <Clock className="w-8 h-8 text-[#D4AF37] mx-auto animate-spin" />

            <p className="mt-4 text-xs text-slate-400">
              Đang tải đơn hàng của bạn...
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-28 pb-24">
        <div className="lux-container space-y-10">

          {/* Header */}
          <div className="border-b border-white/10 pb-6 space-y-2">
            <div className="lux-eyebrow">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              MY RESERVATIONS & ORDERS
            </div>

            <h1 className="font-serif-lux text-4xl sm:text-5xl font-bold text-white">
              Đơn Đặt Cọc{' '}
              <span className="lux-gradient-gold-text italic">
                Của Tôi
              </span>
            </h1>

            <p className="text-xs text-slate-400">
              Theo dõi tiến độ xử lý hồ sơ, tình trạng cọc giữ xe
              và thông tin bàn giao siêu xe.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 border border-red-500/30 bg-red-500/10 rounded text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Orders */}
          {orders.length > 0 ? (
            <div className="space-y-6">

              {orders.map((ord) => {
                const carName =
                  ord.carSnapshot?.name ||
                  ord.car?.name ||
                  'Không xác định';

                const carImage =
                  ord.carSnapshot?.image ||
                  ord.car?.mainImage ||
                  '';

                const totalPrice =
                  ord.totalAmount ||
                  ord.carSnapshot?.price ||
                  0;

                const depositAmount =
                  ord.depositAmount || 0;

                const depositPercent =
                  totalPrice > 0
                    ? Math.round(
                        (depositAmount / totalPrice) * 100
                      )
                    : 0;

                return (
                  <div
                    key={ord._id}
                    className="bg-[#0E0E12] border border-[#D4AF37]/30 rounded-lg p-6 space-y-6 shadow-2xl"
                  >

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">

                      <div>
                        <span className="text-[10px] font-mono-lux text-slate-500 uppercase">
                          Mã Đơn Cọc:
                        </span>

                        <h3 className="font-mono-lux text-sm font-bold text-[#D4AF37]">
                          {ord.orderNumber || ord._id}
                        </h3>

                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Ngày đặt:{' '}
                          {new Date(
                            ord.createdAt
                          ).toLocaleString('vi-VN')}
                        </p>
                      </div>

                      {/* Status */}
                      <div>
                        {ord.orderStatus === 'cancelled' ? (
                          <span className="lux-badge lux-badge-crimson">
                            <XCircle className="w-3.5 h-3.5" />
                            Đã Hủy Cọc
                          </span>
                        ) : ord.orderStatus === 'delivered' ? (
                          <span className="lux-badge lux-badge-gold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Đã Giao Xe
                          </span>
                        ) : (
                          <span className="lux-badge lux-badge-gold">
                            <Clock className="w-3.5 h-3.5 animate-spin" />
                            {ord.orderStatus === 'confirmed'
                              ? 'Đã Xác Nhận'
                              : ord.orderStatus === 'processing'
                              ? 'Đang Xử Lý'
                              : 'Đang Xử Lý Hồ Sơ'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

                      {/* Image */}
                      <div className="md:col-span-3">
                        {carImage ? (
                          <img
                            src={carImage}
                            alt={carName}
                            className="w-full aspect-[16/10] object-cover rounded border border-white/10"
                          />
                        ) : (
                          <div className="w-full aspect-[16/10] bg-[#15151B] rounded flex items-center justify-center">
                            <ShoppingBag className="text-slate-600" />
                          </div>
                        )}
                      </div>

                      {/* Car info */}
                      <div className="md:col-span-5 space-y-2">

                        <span className="text-[10px] font-mono-lux text-[#D4AF37] uppercase">
                          SIÊU XE ĐẶT CỌC
                        </span>

                        <h4 className="font-serif-lux text-2xl font-bold text-white">
                          {carName}
                        </h4>

                        <p className="text-xs text-slate-400">
                          Phương thức thanh toán:{' '}
                          <strong className="text-[#D4AF37] uppercase">
                            {ord.paymentMethod}
                          </strong>
                        </p>

                        {ord.deliveryAddress && (
                          <p className="text-xs text-slate-400">
                            Địa chỉ bàn giao:{' '}
                            <strong className="text-white">
                              {ord.deliveryAddress}
                            </strong>
                          </p>
                        )}
                      </div>

                      {/* Price */}
                      <div className="md:col-span-4 p-4 rounded bg-[#15151B] border border-white/5 space-y-3 text-right">

                        <div>
                          <span className="text-[10px] font-mono-lux text-slate-400 uppercase block">
                            Tổng Giá Trị Xe:
                          </span>

                          <span className="font-serif-lux text-lg font-bold text-slate-200">
                            ${Number(totalPrice).toLocaleString()} USD
                          </span>
                        </div>

                        <div className="border-t border-white/10 pt-2">
                          <span className="text-[10px] font-mono-lux text-[#D4AF37] uppercase block">
                            Số Tiền Đã Cọc ({depositPercent}%):
                          </span>

                          <span className="font-serif-lux text-2xl font-bold text-[#D4AF37]">
                            ${Number(depositAmount).toLocaleString()} USD
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {!['cancelled', 'delivered'].includes(
                      ord.orderStatus
                    ) && (
                      <div className="flex justify-end gap-4 border-t border-white/5 pt-4">

                        <button
                          onClick={() =>
                            handleCancel(ord._id)
                          }
                          className="px-4 py-2 rounded text-xs font-mono-lux text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all"
                        >
                          Hủy đơn cọc này
                        </button>

                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          ) : (
            /* Không có đơn */
            <div className="py-24 text-center space-y-6 bg-[#0E0E12] border border-white/10 rounded-lg max-w-xl mx-auto">

              <div className="w-16 h-16 rounded-full bg-[#15151B] border border-white/10 text-slate-500 mx-auto flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif-lux text-2xl font-bold text-white">
                  Bạn Chưa Có Đơn Đặt Cọc Nào
                </h3>

                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Hãy chọn siêu xe yêu thích và tiến hành đặt
                  cọc trực tuyến để giữ xe ngay hôm nay.
                </p>
              </div>

              <Link
                to="/cars"
                className="btn-lux-gold px-8 py-3"
              >
                <span>Khám phá Showroom xe</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </main>

      <Chatbot />
      <Footer />
    </div>
  );
}