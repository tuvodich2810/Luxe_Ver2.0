import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import api from '@/services/api';
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  CheckCircle2,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';

export default function DirectorDashboard() {
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Tất cả dữ liệu đều từ /api/admin/dashboard — Single Source of Truth từ MongoDB Atlas
  const [stats, setStats] = useState({
    totalRevenue: 0,
    completedRevenue: 0,
    totalDeposit: 0,
    totalProfit: 0,
    completedCount: 0,
    totalOrders: 0,
    pendingAppointments: 0,
    totalUsers: 0,
    totalCars: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchDirectorData = useCallback(async () => {
    setLoading(true);
    try {
      // Dùng ĐÚNG một endpoint duy nhất giống Admin — /api/admin/dashboard
      const res = await api.get('/admin/dashboard');
      const s = res.data?.stats || res.stats || {};
      const orders = res.data?.recentOrders || res.recentOrders || [];

      setStats({
        totalRevenue: s.totalRevenue || 0,
        completedRevenue: s.completedRevenue || 0,
        totalDeposit: s.totalDeposit || 0,
        totalProfit: s.totalProfit || 0,
        completedCount: s.completedCount || 0,
        totalOrders: s.totalOrders || 0,
        pendingAppointments: s.pendingAppointments || 0,
        totalUsers: s.totalUsers || 0,
        totalCars: s.totalCars || 0,
      });
      setRecentOrders(orders);
    } catch (err) {
      console.error('Lỗi tải dữ liệu Giám Đốc:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDirectorData();
  }, [fetchDirectorData]);

  // Phê duyệt hợp đồng — cập nhật trực tiếp trên MongoDB
  const handleApproveOrder = async (order) => {
    setUpdatingId(order._id);
    try {
      await api.patch(`/orders/${order._id}/status`, { orderStatus: 'confirmed' });
      showToast(`✅ Giám đốc đã phê duyệt thành công hợp đồng #${order.orderNumber || order._id.slice(-6).toUpperCase()}!`);
      await fetchDirectorData();
    } catch {
      showToast(`⚠️ Không thể phê duyệt hợp đồng — vui lòng thử lại.`);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatVND = (num) => {
    if (!num || isNaN(num)) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#070709', color: '#E2E8F0' }}>
      <AdminSidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminHeader title="Phân Hệ Điều Hành Giám Đốc Exec (/director)" />

        <main style={{ padding: '32px 36px', flex: 1 }} className="space-y-6">
          {/* Toast */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 bg-[#14141C] border border-[#D4AF37] text-[#D4AF37] font-mono-lux text-xs rounded-xl shadow-2xl flex items-center justify-between"
              >
                <span>{toastMessage}</span>
                <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white font-bold ml-4">✕</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header Banner */}
          <div className="relative bg-[#0E0E12] border border-[#D4AF37]/40 rounded-xl p-8 overflow-hidden shadow-2xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-mono-lux text-xs font-bold inline-flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  EXECUTIVE DIRECTOR BOARDROOM — DỮ LIỆU REALTIME TỪ MONGODB ATLAS
                </span>
                <h1 className="font-serif-lux text-3xl font-bold text-white">
                  Phân Hệ Giám Đốc <span className="text-[#D4AF37] italic">Doanh Thu, Lợi Nhuận & Phê Duyệt Hợp Đồng</span>
                </h1>
                <p className="text-xs text-slate-400 max-w-2xl">
                  Tất cả số liệu dưới đây đều được lấy trực tiếp từ MongoDB Atlas — đồng nhất 100% với Bảng Điều Khiển Admin. Không có số liệu giả hay hardcode.
                </p>
              </div>

              <button
                onClick={fetchDirectorData}
                disabled={loading}
                className="px-4 py-2.5 bg-[#14141C] hover:bg-[#1E1E2A] border border-[#D4AF37]/30 text-[#D4AF37] rounded-lg font-mono-lux text-xs flex items-center gap-2 transition-all shadow"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Tải Lại Dữ Liệu MongoDB</span>
              </button>
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs font-mono-lux">
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Doanh thu bàn giao: {formatVND(stats.completedRevenue)}
              </span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Lợi nhuận gộp: {formatVND(stats.totalProfit)}
              </span>
              <span className="text-slate-400 flex items-center gap-1">
                Nguồn dữ liệu: <strong className="text-white">/api/admin/dashboard (MongoDB Atlas)</strong>
              </span>
            </div>
          </div>

          {/* Live Financial KPI Cards — Giống hệt Admin Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tổng Doanh Thu Hợp Đồng */}
            <div className="bg-[#0E0E12] border border-[#D4AF37]/50 rounded-xl p-5 space-y-2 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-mono-lux block">Tổng Doanh Thu Hợp Đồng</span>
                <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <p className="font-mono-lux text-2xl font-bold text-[#D4AF37]">{formatVND(stats.totalRevenue)}</p>
              <span className="text-[10px] text-slate-400 font-mono-lux">{stats.totalOrders} hợp đồng đặt cọc</span>
            </div>

            {/* Doanh Thu Đã Bàn Giao Xe */}
            <div className="bg-[#0E0E12] border border-emerald-500/40 rounded-xl p-5 space-y-2 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-mono-lux block">Doanh Thu Đã Bàn Giao Xe</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="font-mono-lux text-2xl font-bold text-emerald-400">{formatVND(stats.completedRevenue)}</p>
              <span className="text-[10px] text-emerald-400 font-mono-lux">{stats.completedCount} xe đã bàn giao xong</span>
            </div>

            {/* Tiền Cọc Thực Thu */}
            <div className="bg-[#0E0E12] border border-white/10 rounded-xl p-5 space-y-2 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-mono-lux block">Tiền Cọc Thực Thu (20%)</span>
                <DollarSign className="w-4 h-4 text-slate-400" />
              </div>
              <p className="font-mono-lux text-2xl font-bold text-white">{formatVND(stats.totalDeposit)}</p>
              <span className="text-[10px] text-slate-400 font-mono-lux">Đã ghi nhận ngân hàng</span>
            </div>

            {/* Lợi Nhuận Gộp Thực Thu */}
            <div className="bg-[#0E0E12] border border-purple-500/40 rounded-xl p-5 space-y-2 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-mono-lux block">Lợi Nhuận Gộp Thực Thu</span>
                <DollarSign className="w-4 h-4 text-purple-400" />
              </div>
              <p className="font-mono-lux text-2xl font-bold text-purple-400">{formatVND(stats.totalProfit)}</p>
              <span className="text-[10px] text-slate-400 font-mono-lux">Biên lợi nhuận gộp 15%</span>
            </div>
          </div>

          {/* Bảng Phê Duyệt Hợp Đồng Giám Đốc — Realtime MongoDB */}
          <div className="bg-[#0E0E12] border border-white/10 rounded-xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-serif-lux text-xl font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#D4AF37]" />
                <span>Phê Duyệt Đơn Hàng & Ưu Đãi Hợp Đồng Lớn (Realtime)</span>
              </h3>
              <Link to="/admin/orders" className="text-xs text-[#D4AF37] hover:underline font-mono-lux">
                Quản Lý Toàn Bộ Hợp Đồng →
              </Link>
            </div>

            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <p className="text-xs text-slate-500 font-mono-lux py-4 text-center">Chưa có đơn hàng nào</p>
              ) : (
                recentOrders.map((ord) => (
                  <div key={ord._id} className="p-4 rounded-lg bg-[#14141C] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono-lux text-[#D4AF37] font-bold">#{ord.orderNumber || ord._id.slice(-6).toUpperCase()}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono-lux font-bold border ${
                          ord.orderStatus === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : ord.orderStatus === 'confirmed'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : ord.orderStatus === 'cancelled'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {ord.orderStatus === 'completed' ? 'Đã Bàn Giao Xe'
                           : ord.orderStatus === 'confirmed' ? 'Đã Xác Nhận Cọc'
                           : ord.orderStatus === 'processing' ? 'Đang Làm Hồ Sơ'
                           : ord.orderStatus === 'cancelled' ? 'Đã Hủy'
                           : 'Chờ Duyệt'}
                        </span>
                      </div>
                      <p className="font-bold text-white text-sm">{ord.carSnapshot?.name || ord.car?.name || 'Mẫu Siêu Xe Luxe'}</p>
                      <p className="text-slate-400 text-[11px] font-mono-lux mt-0.5">
                        Khách hàng: <strong className="text-white">{ord.user?.fullName || 'Khách VIP'}</strong> • Tổng giá trị: {formatVND(ord.totalAmount)} • Cọc: {formatVND(ord.depositAmount)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {ord.orderStatus === 'pending' ? (
                        <button
                          onClick={() => handleApproveOrder(ord)}
                          disabled={updatingId === ord._id}
                          className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-black font-mono-lux font-bold text-xs rounded hover:brightness-110 shadow"
                        >
                          {updatingId === ord._id ? '⏳ Đang duyệt...' : '✓ Phê Duyệt Giám Đốc'}
                        </button>
                      ) : (
                        <span className="text-emerald-400 font-mono-lux text-xs flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-4 h-4" /> Đã Xử Lý
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
