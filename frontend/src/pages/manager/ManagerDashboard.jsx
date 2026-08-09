import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import api from '@/services/api';
import {
  UserCheck,
  Car,
  Users,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Award,
  Calendar,
  Plus,
  Minus,
  RefreshCw,
  ArrowRight,
  Phone,
} from 'lucide-react';

export default function ManagerDashboard() {
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalCars: 0,
    totalStockCount: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalContacts: 0,
    carsList: [],
    recentOrders: [],
    contactsList: [],
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchManagerData = useCallback(async () => {
    setLoading(true);
    try {
      const [carsRes, orderRes, contactRes] = await Promise.allSettled([
        api.get('/cars?limit=100'),
        api.get('/orders'),
        api.get('/contacts'),
      ]);

      const carsList = carsRes.status === 'fulfilled' ? carsRes.value?.data || carsRes.value || [] : [];
      const rawOrders = orderRes.status === 'fulfilled' ? orderRes.value?.data || orderRes.value || [] : [];
      const orderList = Array.isArray(rawOrders) ? rawOrders : rawOrders.orders || [];
      const contactList = contactRes.status === 'fulfilled'
        ? Array.isArray(contactRes.value?.data) ? contactRes.value.data : Array.isArray(contactRes.value) ? contactRes.value : []
        : [];

      const totalStock = carsList.reduce((acc, c) => acc + (c.stockCount ?? (c.inStock ? 1 : 0)), 0);

      setDashboardData({
        totalCars: carsList.length,
        totalStockCount: totalStock,
        totalOrders: orderList.length,
        pendingOrders: orderList.filter((o) => o.orderStatus === 'pending').length,
        totalContacts: contactList.length,
        carsList: carsList,
        recentOrders: orderList.filter((o) => o.orderStatus === 'pending').slice(0, 5),
        contactsList: contactList.slice(0, 5),
      });
    } catch (err) {
      console.error('Lỗi tải dữ liệu Quản Lý:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchManagerData();
  }, [fetchManagerData]);

  // Quản lý thay đổi tồn kho trực tiếp trên MongoDB
  const handleStockChange = async (car, delta) => {
    const newStock = Math.max(0, (car.stockCount || 0) + delta);
    setUpdatingId(car._id);
    try {
      await api.put(`/cars/${car._id}`, {
        stockCount: newStock,
        inStock: newStock > 0,
      });
      showToast(`✅ Đã cập nhật tồn kho siêu xe "${car.name}" sang ${newStock} chiếc!`);
      await fetchManagerData();
    } catch (err) {
      showToast(`⚠️ Cập nhật tồn kho thất bại: ${err.message || 'Lỗi kết nối máy chủ'}`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Quản lý duyệt cọc hạn mức
  const handleApproveOrder = async (order) => {
    setUpdatingId(order._id);
    try {
      await api.patch(`/orders/${order._id}/status`, { orderStatus: 'confirmed' });
      showToast(`✅ Quản lý đã duyệt hợp đồng cọc xe #${order.orderNumber || order._id.slice(-6)} thành công!`);
      await fetchManagerData();
    } catch (err) {
      showToast(`⚠️ Duyệt hợp đồng thất bại: ${err.message || 'Lỗi máy chủ'}`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Quản lý phân bổ Lead cho Sales
  const handleAssignLead = async (contact) => {
    setUpdatingId(contact._id);
    try {
      await api.put(`/contacts/${contact._id}`, { status: 'contacted', notes: 'Đã phân bổ cho Sales Executive' });
      showToast(`✅ Đã phân bổ khách hàng "${contact.name}" cho đội ngũ Sales Executive!`);
      await fetchManagerData();
    } catch (err) {
      showToast(`⚠️ Phân bổ thất bại: ${err.message}`);
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
        <AdminHeader title="Phân Hệ Quản Lý Showroom (/manager)" />

        <main style={{ padding: '32px 36px', flex: 1 }} className="space-y-6">
          {/* Toast Notification Banner */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 bg-[#14141C] border border-blue-400 text-blue-300 font-mono-lux text-xs rounded-xl shadow-2xl flex items-center justify-between"
              >
                <span>{toastMessage}</span>
                <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white font-bold ml-4">✕</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header Banner */}
          <div className="relative bg-[#0E0E12] border border-blue-500/40 rounded-xl p-8 overflow-hidden shadow-2xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono-lux text-xs font-bold inline-flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  SHOWROOM OPERATIONS MANAGER WORKSPACE
                </span>
                <h1 className="font-serif-lux text-3xl font-bold text-white">
                  Phân Hệ Quản Lý <span className="text-blue-400 italic">Kho Xe, Phân Bổ Sales & Duyệt Đơn</span>
                </h1>
                <p className="text-xs text-slate-400 max-w-2xl">
                  Quản lý số lượng tồn kho thực tế từng mẫu siêu xe trên MongoDB, phân bổ yêu cầu tư vấn cho đội ngũ Sales Executive và duyệt các đơn cọc xe theo hạn mức quy định.
                </p>
              </div>

              <button
                onClick={fetchManagerData}
                disabled={loading}
                className="px-4 py-2.5 bg-[#14141C] hover:bg-[#1E1E2A] border border-blue-400/30 text-blue-400 rounded-lg font-mono-lux text-xs flex items-center gap-2 transition-all shadow"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Cập Nhật Realtime MongoDB</span>
              </button>
            </div>

            {/* Scope Badge */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs font-mono-lux">
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Quản lý tồn kho {dashboardData.totalCars} mẫu ({dashboardData.totalStockCount} chiếc)
              </span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Phân bổ {dashboardData.totalContacts} yêu cầu cho Sales
              </span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Duyệt cọc xe hạn mức ({dashboardData.pendingOrders} đơn chờ)
              </span>
            </div>
          </div>

          {/* Manager Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0E0E12] border border-blue-500/40 rounded-xl p-5 space-y-2 shadow-xl">
              <span className="text-slate-400 text-xs font-mono-lux block">Kho Xe Sẵn Sàng</span>
              <p className="font-mono-lux text-2xl font-bold text-blue-400">{dashboardData.totalCars} mẫu ({dashboardData.totalStockCount} chiếc)</p>
              <Link to="/admin/cars" className="text-[11px] text-blue-400 hover:underline block font-mono-lux">Quản lý toàn bộ kho xe →</Link>
            </div>

            <div className="bg-[#0E0E12] border border-amber-500/40 rounded-xl p-5 space-y-2 shadow-xl">
              <span className="text-slate-400 text-xs font-mono-lux block">Khách Hàng Phân Bổ</span>
              <p className="font-mono-lux text-2xl font-bold text-amber-400">{dashboardData.totalContacts} yêu cầu lead</p>
              <Link to="/admin/contacts" className="text-[11px] text-amber-400 hover:underline block font-mono-lux">Xem danh sách lead →</Link>
            </div>

            <div className="bg-[#0E0E12] border border-purple-500/40 rounded-xl p-5 space-y-2 shadow-xl">
              <span className="text-slate-400 text-xs font-mono-lux block">Duyệt Đơn Hàng Hạn Mức</span>
              <p className="font-mono-lux text-2xl font-bold text-purple-400">{dashboardData.pendingOrders} đơn chờ duyệt</p>
              <Link to="/admin/orders" className="text-[11px] text-purple-400 hover:underline block font-mono-lux">Duyệt hợp đồng →</Link>
            </div>
          </div>

          {/* Realtime Inventory Management Grid with 1-Click Stock Controls */}
          <div className="bg-[#0E0E12] border border-white/10 rounded-xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-serif-lux text-xl font-bold text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-400" />
                <span>Số Lượng Tồn Kho Siêu Xe Thực Tế (Thay Đổi Trực Tiếp MongoDB)</span>
              </h3>
              <Link to="/admin/cars" className="text-xs font-mono-lux text-[#D4AF37] hover:underline">Quản lý kho xe →</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dashboardData.carsList.map((c) => (
                <div key={c._id} className="p-4 bg-[#14141C] border border-white/10 hover:border-blue-500/40 rounded-lg space-y-3 transition-all">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.mainImage || c.images?.[0]?.url || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=200'}
                      alt=""
                      className="w-12 h-9 object-cover rounded border border-white/10"
                    />
                    <div>
                      <p className="font-bold text-white text-xs truncate max-w-[160px]">{c.name}</p>
                      <p className="text-xs text-[#D4AF37] font-mono-lux">{formatVND(c.price)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 font-mono-lux text-xs">
                    <span className="text-slate-400">Tồn kho: <strong className="text-emerald-400 font-bold">{c.stockCount || 0} chiếc</strong></span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStockChange(c, -1)}
                        disabled={updatingId === c._id}
                        className="w-7 h-7 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-400 rounded flex items-center justify-center font-bold text-xs transition-colors"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleStockChange(c, 1)}
                        disabled={updatingId === c._id}
                        className="w-7 h-7 bg-emerald-500/10 hover:bg-emerald-500 hover:text-black border border-emerald-500/20 text-emerald-400 rounded flex items-center justify-center font-bold text-xs transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Order Approvals Grid */}
          <div className="bg-[#0E0E12] border border-white/10 rounded-xl p-6 space-y-4 shadow-xl">
            <h3 className="font-serif-lux text-xl font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-400" />
              <span>Đơn Hàng Đặt Cọc Cần Quản Lý Duyệt Hạn Mức</span>
            </h3>

            <div className="space-y-3">
              {dashboardData.recentOrders.length === 0 ? (
                <p className="text-xs text-slate-500 font-mono-lux py-4 text-center">Không có đơn hàng nào chờ duyệt</p>
              ) : (
                dashboardData.recentOrders.map((ord) => (
                  <div key={ord._id} className="p-4 rounded-lg bg-[#14141C] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div>
                      <span className="font-mono-lux text-purple-400 font-bold">#{ord.orderNumber || ord._id.slice(-6).toUpperCase()}</span>
                      <p className="font-bold text-white text-sm mt-0.5">{ord.carSnapshot?.name || ord.car?.name}</p>
                      <p className="text-slate-400 text-[11px] font-mono-lux mt-0.5">
                        Khách hàng: <strong className="text-white">{ord.user?.fullName || 'Khách VIP'}</strong> • SĐT: {ord.user?.phone || 'N/A'} • Tiền cọc: {formatVND(ord.depositAmount)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleApproveOrder(ord)}
                      disabled={updatingId === ord._id}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-mono-lux font-bold text-xs rounded shadow flex items-center gap-1"
                    >
                      <span>✓ Duyệt Hạn Mức Cọc</span>
                    </button>
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
