import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Chatbot from '@/components/common/Chatbot';
import orderService from '@/services/orderService';
import { ShoppingBag, Sparkles, Clock, CheckCircle2, ShieldCheck, XCircle, ArrowRight } from 'lucide-react';

export default function MyOrders() {
  const [orders, setOrders] = useState(orderService.getOrders());

  useEffect(() => {
    const handleUpdate = (e) => {
      setOrders(e.detail || []);
    };
    window.addEventListener('luxe_orders_updated', handleUpdate);
    return () => window.removeEventListener('luxe_orders_updated', handleUpdate);
  }, []);

  const handleCancel = (orderId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn đặt cọc giữ xe này?')) {
      orderService.cancelOrder(orderId);
    }
  };

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
              Đơn Đặt Cọc <span className="lux-gradient-gold-text italic">Của Tôi</span>
            </h1>
            <p className="text-xs text-slate-400">
              Theo dõi tiến độ xử lý hồ sơ, tình trạng cọc giữ xe và thông tin bàn giao siêu xe tận nhà.
            </p>
          </div>

          {/* Orders List */}
          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((ord) => (
                <div
                  key={ord._id}
                  className="bg-[#0E0E12] border border-[#D4AF37]/30 rounded-lg p-6 space-y-6 shadow-2xl"
                >
                  {/* Top Bar Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <span className="text-[10px] font-mono-lux text-slate-500 uppercase">
                        Mã Đơn Cọc:
                      </span>
                      <h3 className="font-mono-lux text-sm font-bold text-[#D4AF37]">{ord._id}</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Ngày đặt: {new Date(ord.orderDate).toLocaleString('vi-VN')}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {ord.status === 'cancelled' ? (
                        <span className="lux-badge lux-badge-crimson">
                          <XCircle className="w-3.5 h-3.5" /> Đã Hủy Cọc
                        </span>
                      ) : (
                        <span className="lux-badge lux-badge-gold">
                          <Clock className="w-3.5 h-3.5 animate-spin" /> Đang Xử Lý Hồ Sơ
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-3">
                      <img
                        src={ord.carImage || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=600'}
                        alt={ord.carName}
                        className="w-full aspect-[16/10] object-cover rounded border border-white/10"
                      />
                    </div>

                    <div className="md:col-span-5 space-y-2">
                      <span className="text-[10px] font-mono-lux text-[#D4AF37] uppercase">
                        SIÊU XE ĐẶT CỌC
                      </span>
                      <h4 className="font-serif-lux text-2xl font-bold text-white">{ord.carName}</h4>
                      <p className="text-xs text-slate-400">
                        Showroom bàn giao: <strong className="text-white">{ord.showroomLocation === 'hanoi' ? 'Hà Nội Flagship' : 'TP. Hồ Chí Minh Flagship'}</strong>
                      </p>
                      <p className="text-xs text-slate-400">
                        Phương thức thanh toán: <strong className="text-[#D4AF37] uppercase">{ord.paymentMethod}</strong>
                      </p>
                    </div>

                    <div className="md:col-span-4 p-4 rounded bg-[#15151B] border border-white/5 space-y-3 text-right">
                      <div>
                        <span className="text-[10px] font-mono-lux text-slate-400 uppercase block">
                          Tổng Giá Trị Xe:
                        </span>
                        <span className="font-serif-lux text-lg font-bold text-slate-200">
                          ${ord.totalPrice?.toLocaleString()} USD
                        </span>
                      </div>
                      <div className="border-t border-white/10 pt-2">
                        <span className="text-[10px] font-mono-lux text-[#D4AF37] uppercase block">
                          Số Tiền Đã Cọc ({ord.depositPercent}%):
                        </span>
                        <span className="font-serif-lux text-2xl font-bold text-[#D4AF37]">
                          ${ord.depositAmount?.toLocaleString()} USD
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  {ord.status !== 'cancelled' && (
                    <div className="flex justify-end gap-4 border-t border-white/5 pt-4">
                      <button
                        onClick={() => handleCancel(ord._id)}
                        className="px-4 py-2 rounded text-xs font-mono-lux text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all"
                      >
                        Hủy đơn cọc này
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center space-y-6 bg-[#0E0E12] border border-white/10 rounded-lg max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#15151B] border border-white/10 text-slate-500 mx-auto flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif-lux text-2xl font-bold text-white">
                  Bạn Chưa Có Đơn Đặt Cọc Nào
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Hãy chọn siêu xe yêu thích và tiến hành đặt cọc trực tuyến để giữ xe ngay hôm nay.
                </p>
              </div>

              <Link to="/cars" className="btn-lux-gold px-8 py-3">
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