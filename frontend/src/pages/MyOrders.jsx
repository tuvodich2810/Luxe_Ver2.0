import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Chatbot from '@/components/common/Chatbot';
import VietQRBankCard from '@/components/common/VietQRBankCard';
import orderService from '@/services/orderService';
import {
  ShoppingBag,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  FileText,
  CreditCard,
  MapPin,
  Calendar,
  AlertCircle,
  QrCode,
  X,
} from 'lucide-react';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQrOrder, setSelectedQrOrder] = useState(null);

  // Lấy đơn hàng của USER hiện tại
  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const result = await orderService.getMyOrders();
      const list = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.orders)
        ? result.orders
        : Array.isArray(result)
        ? result
        : [];

      setOrders(list);
    } catch (err) {
      console.error('❌ Không lấy được đơn hàng:', err);
      setError(err.message || 'Không thể tải danh sách đơn đặt cọc');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  // Hủy đơn cọc
  const handleCancel = async (orderId) => {
    if (!window.confirm('Quý khách có chắc chắn muốn gửi yêu cầu hủy đơn đặt cọc này?')) {
      return;
    }

    try {
      await orderService.cancelOrder(orderId);
      await fetchMyOrders();
    } catch (err) {
      alert(err.message || 'Không thể hủy đơn đặt cọc');
    }
  };

  const formatVND = (num) => {
    if (!num || isNaN(num)) return 'Thỏa thuận';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'cancelled':
        return (
          <span className="px-3 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono-lux text-xs font-bold flex items-center gap-1.5">
            <XCircle className="w-4 h-4" />
            Đã Hủy Cọc
          </span>
        );
      case 'completed':
      case 'delivered':
        return (
          <span className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono-lux text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Đã Bàn Giao Xe Tận Nhà
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-3 py-1 rounded bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] font-mono-lux text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Đã Xác Nhận Tiền Cọc
          </span>
        );
      case 'processing':
        return (
          <span className="px-3 py-1 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono-lux text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-4 h-4 animate-spin" />
            Đang Làm Thủ Tục Đăng Ký Xe
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono-lux text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-4 h-4 animate-spin" />
            Chờ Tiếp Nhận Hồ Sơ
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070709] text-slate-100 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 pt-32 pb-24 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Clock className="w-10 h-10 text-[#D4AF37] mx-auto animate-spin" />
            <p className="text-xs font-mono-lux text-slate-400 uppercase tracking-widest">
              Đang tải danh sách đơn đặt cọc VIP...
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

      <main className="flex-1 pt-32 pb-24">
        <div className="lux-container space-y-10">
          {/* Header Banner */}
          <div className="relative bg-[#0E0E12] border border-[#D4AF37]/30 rounded-xl p-8 overflow-hidden shadow-2xl space-y-3">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="lux-eyebrow text-[#D4AF37]">
              <Sparkles className="w-3.5 h-3.5" />
              VIP RESERVATIONS & DEPOSITS PORTAL
            </div>

            <h1 className="font-serif-lux text-3xl sm:text-5xl font-bold text-white">
              Đơn Đặt Cọc <span className="lux-gradient-gold-text italic">Siêu Xe Của Tôi</span>
            </h1>

            <p className="text-xs text-slate-400 max-w-2xl">
              Quản lý danh sách cọc giữ xe, theo dõi hợp đồng mua bán, tình trạng hoàn thiện hồ sơ và lịch bàn giao siêu xe tận nhà với dịch vụ VIP Concierge.
            </p>
          </div>

          {/* Error notification */}
          {error && (
            <div className="p-4 border border-red-500/30 bg-red-500/10 rounded-lg text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Orders List */}
          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((ord) => {
                const carName = ord.carSnapshot?.name || ord.car?.name || 'Siêu Xe Độc Bản Luxe Motors';
                const carImage = ord.carSnapshot?.image || ord.car?.mainImage || ord.car?.images?.[0] || '';
                const carBrand = ord.carSnapshot?.brandName || ord.car?.brand?.name || 'Showroom Luxe Motors';
                const totalPrice = ord.totalAmount || ord.carSnapshot?.price || ord.car?.price || 0;
                const depositAmount = ord.depositAmount || 500000000;
                const orderCode = ord.orderNumber || `#LUXE-${ord._id.slice(-6).toUpperCase()}`;

                return (
                  <div
                    key={ord._id}
                    className="bg-[#0E0E12] border border-[#D4AF37]/40 rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl hover:border-[#D4AF37]/70 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Top Status & Code Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono-lux text-slate-400 uppercase tracking-wider">
                            Mã Hợp Đồng Cọc:
                          </span>
                          <span className="font-mono-lux text-sm font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/30">
                            {orderCode}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono-lux flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            Ngày đặt cọc: {new Date(ord.createdAt).toLocaleDateString('vi-VN')} ({new Date(ord.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })})
                          </span>
                        </p>
                      </div>

                      {/* Status badge */}
                      <div>{getStatusBadge(ord.orderStatus)}</div>
                    </div>

                    {/* Content Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      {/* Car Image Preview */}
                      <div className="lg:col-span-4 relative group">
                        {carImage ? (
                          <img
                            src={carImage}
                            alt={carName}
                            className="w-full aspect-[16/10] object-cover rounded-lg border border-white/15 shadow-xl group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full aspect-[16/10] bg-[#15151B] rounded-lg border border-white/10 flex items-center justify-center">
                            <ShoppingBag className="w-10 h-10 text-slate-600" />
                          </div>
                        )}
                        <span className="absolute bottom-2 left-2 text-[10px] font-mono-lux font-bold px-2 py-0.5 rounded bg-black/80 text-[#D4AF37] border border-[#D4AF37]/40">
                          {carBrand}
                        </span>
                      </div>

                      {/* Info Overview */}
                      <div className="lg:col-span-5 space-y-3">
                        <div>
                          <span className="text-[10px] font-mono-lux text-[#D4AF37] uppercase tracking-widest">
                            MẪU XE ĐĂNG KÝ CỌC
                          </span>
                          <h3 className="font-serif-lux text-2xl sm:text-3xl font-bold text-white mt-0.5">
                            {carName}
                          </h3>
                        </div>

                        <div className="space-y-1 text-xs text-slate-300">
                          <p className="flex items-center gap-2">
                            <CreditCard className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Hình thức cọc: <strong className="text-white uppercase">{ord.paymentMethod || 'Chuyển khoản Ngân hàng'}</strong></span>
                          </p>
                          {ord.deliveryAddress && (
                            <p className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>Địa chỉ nhận xe: <strong className="text-white">{ord.deliveryAddress}</strong></span>
                            </p>
                          )}
                          {ord.customerNotes && (
                            <p className="text-slate-400 italic">
                              "Ghi chú: {ord.customerNotes}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Financial Amount Details */}
                      <div className="lg:col-span-3 p-5 rounded-lg bg-[#14141C] border border-[#D4AF37]/30 space-y-3">
                        <div>
                          <span className="text-[10px] font-mono-lux text-slate-400 uppercase block">
                            Niêm Yết Niêm Yết Siêu Xe:
                          </span>
                          <span className="font-serif-lux text-lg font-bold text-slate-200">
                            {formatVND(totalPrice)}
                          </span>
                        </div>

                        <div className="border-t border-white/10 pt-2">
                          <span className="text-[10px] font-mono-lux text-[#D4AF37] uppercase block font-bold">
                            Số Tiền Đã Cọc Giữ Xe:
                          </span>
                          <span className="font-serif-lux text-2xl font-bold text-[#D4AF37]">
                            {formatVND(depositAmount)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <a
                          href="tel:0372950720"
                          className="px-3 py-1.5 rounded bg-white/5 hover:bg-[#D4AF37] text-slate-300 hover:text-black border border-white/10 text-xs font-mono-lux transition-all flex items-center gap-1.5"
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Gọi Chuyên Viên VIP Concierge (0372 950 720)</span>
                        </a>

                        {!['cancelled', 'delivered', 'completed'].includes(ord.orderStatus) && (
                          <button
                            onClick={() => setSelectedQrOrder(ord)}
                            className="px-3.5 py-1.5 rounded bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/40 text-xs font-mono-lux font-bold transition-all flex items-center gap-1.5"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Quét Mã QR Thanh Toán Cọc</span>
                          </button>
                        )}
                      </div>

                      {!['cancelled', 'delivered', 'completed'].includes(ord.orderStatus) && (
                        <button
                          onClick={() => handleCancel(ord._id)}
                          className="px-4 py-2 rounded text-xs font-mono-lux text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Gửi Yêu Cầu Hủy Đơn Cọc</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="py-20 text-center space-y-6 bg-[#0E0E12] border border-white/10 rounded-xl max-w-2xl mx-auto shadow-2xl p-8">
              <div className="w-16 h-16 rounded-full bg-[#161620] border border-[#D4AF37]/40 text-[#D4AF37] mx-auto flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif-lux text-2xl font-bold text-white">
                  Bạn Chưa Có Đơn Đặt Cọc Nào
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Khám phá kho siêu xe thương gia tại Luxe Motors và tiến hành đặt cọc trực tuyến để giữ mẫu xe yêu thích của bạn ngay hôm nay.
                </p>
              </div>

              <Link
                to="/cars"
                className="btn-lux-gold px-8 py-3.5 text-xs font-mono-lux tracking-wider inline-flex items-center gap-2"
              >
                <span>KHÁM PHÁ KHO SIÊU XE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Modal QR Code Bank Card */}
      {selectedQrOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0E0E12] border border-[#D4AF37]/30 rounded-2xl p-6 shadow-2xl space-y-5">
            <button
              onClick={() => setSelectedQrOrder(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <div className="lux-eyebrow justify-center text-[#D4AF37]">
                <Sparkles className="w-3.5 h-3.5" />
                MÃ VIETQR CHUYỂN KHOẢN TỰ ĐỘNG
              </div>
              <h3 className="font-serif-lux text-2xl font-bold text-white">
                Thanh Toán Đặt Cọc Siêu Xe
              </h3>
              <p className="text-xs text-slate-400 font-mono-lux">
                Mã hợp đồng: <span className="text-[#D4AF37] font-bold">{selectedQrOrder.orderNumber || `#LUXE-${selectedQrOrder._id.slice(-6).toUpperCase()}`}</span>
              </p>
            </div>

            <VietQRBankCard
              depositAmountVND={selectedQrOrder.depositAmount || 500000000}
              orderCode={selectedQrOrder.orderNumber || `LUXE${selectedQrOrder._id.slice(-6).toUpperCase()}`}
              orderId={selectedQrOrder._id}
              initialCheckoutUrl={selectedQrOrder.checkoutUrl}
              initialQrCodeUrl={selectedQrOrder.qrCodeUrl}
              initialDepositExpiredAt={selectedQrOrder.depositExpiredAt}
              onPaymentConfirmed={() => {
                fetchMyOrders();
              }}
            />
          </div>
        </div>
      )}

      <Chatbot />
      <Footer />
    </div>
  );
}