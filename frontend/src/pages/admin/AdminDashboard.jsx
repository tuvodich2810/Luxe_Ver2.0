import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuth } from '@/context/AuthContext';
import { ROLES_CONFIG } from '@/config/rolesConfig';
import api from '@/services/api';
import {
  DollarSign,
  Car,
  Calendar,
  ShoppingBag,
  Users,
  Award,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Mail,
  Phone,
  Clock,
  ChevronRight,
  ShieldCheck,
  Headphones,
  Briefcase,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  FileText,
  MessageSquare,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalCars: 0,
    totalStockCount: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalUsers: 0,
    totalContacts: 0,
    newContacts: 0,
    totalRevenue: 0,
    totalDeposit: 0,
    completedRevenue: 0,
    completedCount: 0,
    totalProfit: 0,
    recentAppointments: [],
    recentOrders: [],
    recentContacts: [],
    carsList: [],
  });

  const roleKey = user?.role || 'admin';
  const roleConfig = ROLES_CONFIG[roleKey] || ROLES_CONFIG.admin;

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const [dashRes, carsRes, apptRes, orderRes, userRes, contactRes] = await Promise.allSettled([
          api.get('/admin/dashboard'),
          api.get('/cars?limit=100'),
          api.get('/appointments?limit=10'),
          api.get('/orders?limit=10'),
          api.get('/users?limit=10'),
          api.get('/contacts'),
        ]);

        const dashStats = dashRes.status === 'fulfilled' ? dashRes.value.data?.stats : {};
        const carsList = carsRes.status === 'fulfilled' ? carsRes.value.data || [] : [];
        const apptList = apptRes.status === 'fulfilled' ? apptRes.value.data || [] : [];
        const orderList = orderRes.status === 'fulfilled' ? orderRes.value.data || [] : [];
        const userList = userRes.status === 'fulfilled' ? userRes.value.data || [] : [];
        const contactList = contactRes.status === 'fulfilled'
          ? Array.isArray(contactRes.value.data) ? contactRes.value.data : Array.isArray(contactRes.value) ? contactRes.value : []
          : [];

        const totalStock = carsList.reduce((acc, c) => acc + (c.stockCount ?? (c.inStock ? 1 : 0)), 0);
        const pendingAppt = apptList.filter((a) => a.status === 'pending').length;
        const pendingOrd = orderList.filter((o) => o.orderStatus === 'pending').length;
        const newCont = contactList.filter((c) => c.status === 'new' || !c.status).length;

        setDashboardData({
          totalCars: dashStats?.totalCars || carsList.length || 0,
          totalStockCount: totalStock,
          totalAppointments: dashStats?.totalAppointments || apptList.length || 0,
          pendingAppointments: dashStats?.pendingAppointments || pendingAppt || 0,
          totalOrders: dashStats?.totalOrders || orderList.length || 0,
          pendingOrders: pendingOrd,
          totalUsers: dashStats?.totalUsers || userList.length || 0,
          totalContacts: contactList.length,
          newContacts: newCont,
          totalRevenue: dashStats?.totalRevenue || 0,
          totalDeposit: dashStats?.totalDeposit || 0,
          completedRevenue: dashStats?.completedRevenue || 0,
          completedCount: dashStats?.completedCount || 0,
          totalProfit: dashStats?.totalProfit || 0,
          recentAppointments: apptList.slice(0, 5),
          recentOrders: orderList.slice(0, 5),
          recentContacts: contactList.slice(0, 5),
          carsList: carsList.slice(0, 6),
        });
      } catch (err) {
        console.error('Lỗi tải dữ liệu Dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const formatVND = (num) => {
    if (!num || isNaN(num)) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#070709', color: '#E2E8F0' }}>
      <AdminSidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminHeader title={`Bảng Điều Khiển — ${roleConfig.label.split(' ')[0]}`} />

        <main className="p-4 sm:p-6 lg:p-8 flex-1 space-y-8 overflow-x-hidden">
          {/* Customized Role Welcome Banner */}
          <div className="relative bg-[#0E0E12] border border-[#D4AF37]/40 rounded-xl p-6 sm:p-8 overflow-hidden shadow-2xl space-y-4">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded text-xs font-mono-lux font-bold border ${roleConfig.color}`}>
                    {roleConfig.label}
                  </span>
                  <span className="text-xs text-slate-400 font-mono-lux">
                    Xin chào, <strong className="text-white">{user?.fullName}</strong>
                  </span>
                </div>

                <h1 className="font-serif-lux text-3xl sm:text-4xl font-bold text-white">
                  {roleKey === 'giam_doc' && <>Báo Cáo Doanh Thu & <span className="lux-gradient-gold-text italic">Phê Duyệt Chiến Lược</span></>}
                  {roleKey === 'quan_ly' && <>Quản Lý Vận Hành Showroom & <span className="lux-gradient-gold-text italic">Tồn Kho Xe</span></>}
                  {roleKey === 'sales' && <>Giao Diện Bán Hàng & <span className="lux-gradient-gold-text italic">Quản Lý Khách Hàng VIP</span></>}
                  {roleKey === 'cskh' && <>Trung Tâm Concierge & <span className="lux-gradient-gold-text italic">Chăm Sóc Khách Hàng</span></>}
                  {roleKey === 'admin' && <>Bảng Điều Khiển Tối Cao <span className="lux-gradient-gold-text italic">Executive Control</span></>}
                </h1>

                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  {roleConfig.description}
                </p>
              </div>

                {roleKey === 'admin' && (
                  <Link to="/admin/users" className="btn-lux-outline px-5 py-3 text-xs font-mono-lux tracking-wider">
                    <span>Phân Quyền User</span>
                  </Link>
                )}
            </div>

            {/* Allowed & Restricted Permissions Pill Box */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs">
              <span className="font-mono-lux text-slate-400 text-[10px] uppercase tracking-wider font-bold">
                Quyền hạn làm việc:
              </span>
              {roleConfig.permissions.map((p, idx) => (
                <span key={idx} className="text-[11px] text-emerald-400 font-mono-lux flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>{p}</span>
                </span>
              ))}
              {roleConfig.limitations?.map((l, idx) => (
                <span key={idx} className="text-[11px] text-amber-400 font-mono-lux flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-semibold">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>⚠️ {l}</span>
                </span>
              ))}
            </div>
          </div>

          {/* -------------------------------------------------------------
              VIEW 1: GIÁM ĐỐC (giam_doc) VIEW
             ------------------------------------------------------------- */}
          {roleKey === 'giam_doc' && (
            <div className="space-y-6">
              {/* Executive Financial Metrics — đều từ MongoDB Atlas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0E0E12] border border-[#D4AF37]/50 rounded-lg p-5 space-y-2">
                  <span className="text-slate-400 text-xs font-mono-lux block">Tổng Doanh Thu Hợp Đồng</span>
                  <p className="font-mono-lux text-2xl font-bold text-[#D4AF37]">{formatVND(dashboardData.totalRevenue)}</p>
                  <span className="text-[10px] text-slate-400 font-mono-lux">{dashboardData.totalOrders} hợp đồng đặt cọc</span>
                </div>

                <div className="bg-[#0E0E12] border border-emerald-500/40 rounded-lg p-5 space-y-2">
                  <span className="text-slate-400 text-xs font-mono-lux block">Doanh Thu Đã Bàn Giao Xe</span>
                  <p className="font-mono-lux text-2xl font-bold text-emerald-400">{formatVND(dashboardData.completedRevenue)}</p>
                  <span className="text-[10px] text-emerald-400 font-mono-lux">{dashboardData.completedCount} xe đã bàn giao xong</span>
                </div>

                <div className="bg-[#0E0E12] border border-white/10 rounded-lg p-5 space-y-2">
                  <span className="text-slate-400 text-xs font-mono-lux block">Tiền Cọc Thực Thu (20%)</span>
                  <p className="font-mono-lux text-2xl font-bold text-white">{formatVND(dashboardData.totalDeposit)}</p>
                  <span className="text-[10px] text-slate-400 font-mono-lux">Đã ghi nhận ngân hàng</span>
                </div>

                <div className="bg-[#0E0E12] border border-purple-500/40 rounded-lg p-5 space-y-2">
                  <span className="text-slate-400 text-xs font-mono-lux block">Lợi Nhuận Gộp Thực Thu</span>
                  <p className="font-mono-lux text-2xl font-bold text-purple-400">{formatVND(dashboardData.totalProfit)}</p>
                  <span className="text-[10px] text-slate-400 font-mono-lux">Biên lợi nhuận gộp 15%</span>
                </div>
              </div>

              {/* Approval Box for Director */}
              <div className="bg-[#0E0E12] border border-[#D4AF37]/40 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="font-serif-lux text-xl font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#D4AF37]" />
                    <span>Phê Duyệt Đơn Hàng & Giảm Giá Lớn (Giám Đốc Exec)</span>
                  </h3>
                  <Link to="/admin/orders" className="text-xs font-mono-lux text-[#D4AF37] hover:underline">
                    Xem tất cả đơn hàng →
                  </Link>
                </div>

                <div className="space-y-3">
                  {dashboardData.recentOrders.map((ord) => (
                    <div key={ord._id} className="p-4 rounded-lg bg-[#14141C] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                      <div>
                        <span className="font-mono-lux text-[#D4AF37] font-bold">#{ord._id.slice(-6).toUpperCase()}</span>
                        <p className="font-bold text-white text-sm mt-0.5">{ord.car?.name || 'Mẫu Siêu Xe Độc Bản'}</p>
                        <p className="text-slate-400 text-[11px] font-mono-lux">
                          Tổng tiền: {formatVND(ord.totalAmount)} • Cọc: {formatVND(ord.depositAmount)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => alert(`Đã phê duyệt ưu đãi hợp đồng #${ord._id.slice(-6).toUpperCase()}`)}
                          className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-black font-bold font-mono-lux text-xs rounded hover:brightness-110 shadow"
                        >
                          ✓ Phê Duyệt Ưu Đãi Giám Đốc
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------------
              VIEW 2: QUẢN LÝ (quan_ly) VIEW
             ------------------------------------------------------------- */}
          {roleKey === 'quan_ly' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#0E0E12] border border-blue-500/40 rounded-lg p-5 space-y-2">
                  <span className="text-slate-400 text-xs font-mono-lux block">Tổng Siêu Xe Trong Kho</span>
                  <p className="font-mono-lux text-2xl font-bold text-blue-400">{dashboardData.totalCars} mẫu ({dashboardData.totalStockCount} chiếc)</p>
                  <Link to="/admin/cars" className="text-[11px] text-blue-400 hover:underline block font-mono-lux">Quản lý tồn kho →</Link>
                </div>

                <div className="bg-[#0E0E12] border border-amber-500/40 rounded-lg p-5 space-y-2">
                  <span className="text-slate-400 text-xs font-mono-lux block">Khách Hàng Mới Phân Bổ</span>
                  <p className="font-mono-lux text-2xl font-bold text-amber-400">{dashboardData.totalContacts} yêu cầu</p>
                  <Link to="/admin/contacts" className="text-[11px] text-amber-400 hover:underline block font-mono-lux">Phân bổ cho Sales →</Link>
                </div>

                <div className="bg-[#0E0E12] border border-purple-500/40 rounded-lg p-5 space-y-2">
                  <span className="text-slate-400 text-xs font-mono-lux block">Duyệt Báo Giá Hạn Mức</span>
                  <p className="font-mono-lux text-2xl font-bold text-purple-400">{dashboardData.pendingOrders} đơn chờ duyệt</p>
                  <Link to="/admin/orders" className="text-[11px] text-purple-400 hover:underline block font-mono-lux">Duyệt hợp đồng →</Link>
                </div>
              </div>

              {/* Inventory Management Table Preview */}
              <div className="bg-[#0E0E12] border border-white/10 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="font-serif-lux text-xl font-bold text-white flex items-center gap-2">
                    <Car className="w-5 h-5 text-blue-400" />
                    <span>Danh Sách Xe & Tồn Kho Thực Tế (Showroom Manager)</span>
                  </h3>
                  <Link to="/admin/cars" className="text-xs font-mono-lux text-[#D4AF37] hover:underline">Quản lý kho xe →</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dashboardData.carsList.map((car) => (
                    <div key={car._id} className="p-3 bg-[#14141C] border border-white/10 rounded-lg space-y-2">
                      <p className="font-bold text-white text-sm">{car.name}</p>
                      <p className="text-xs text-[#D4AF37] font-mono-lux">{formatVND(car.price)}</p>
                      <p className="text-[10px] text-slate-400 font-mono-lux">
                        Công suất: {car.specifications?.horsepower || 'N/A'} HP • Tồn kho: <strong className="text-emerald-400">{car.stockCount || 1} chiếc</strong>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------------
              VIEW 3: NHÂN VIÊN SALES (sales) VIEW
             ------------------------------------------------------------- */}
          {roleKey === 'sales' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#0E0E12] border border-purple-500/40 rounded-lg p-5 space-y-2">
                  <span className="text-slate-400 text-xs font-mono-lux block">Khách Hàng Cá Nhân</span>
                  <p className="font-mono-lux text-2xl font-bold text-purple-400">{dashboardData.totalContacts} khách</p>
                  <span className="text-[10px] text-slate-400 font-mono-lux">Đã liên hệ tư vấn</span>
                </div>

                <div className="bg-[#0E0E12] border border-[#D4AF37]/40 rounded-lg p-5 space-y-2">
                  <span className="text-slate-400 text-xs font-mono-lux block">Báo Giá & Đơn Cọc Đã Tạo</span>
                  <p className="font-mono-lux text-2xl font-bold text-[#D4AF37]">{dashboardData.totalOrders} đơn</p>
                  <span className="text-[10px] text-emerald-400 font-mono-lux">Tỷ lệ chốt 85%</span>
                </div>

                <div className="bg-[#0E0E12] border border-emerald-500/40 rounded-lg p-5 space-y-2">
                  <span className="text-slate-400 text-xs font-mono-lux block">Lịch Hẹn Cá Nhân</span>
                  <p className="font-mono-lux text-2xl font-bold text-emerald-400">{dashboardData.totalAppointments} lịch</p>
                  <span className="text-[10px] text-amber-400 font-mono-lux">Lái thử tận nơi</span>
                </div>
              </div>

              {/* Sales Workstation Quick Actions */}
              <div className="bg-[#0E0E12] border border-white/10 rounded-lg p-6 space-y-4">
                <h3 className="font-serif-lux text-xl font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-purple-400" />
                  <span>Công Cụ Tạo Báo Giá & Quản Lý Khách Hàng (Sales Workstation)</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => alert('Mở form tạo thông tin khách hàng VIP mới')}
                    className="p-4 bg-[#14141C] hover:bg-[#1A1A26] border border-white/10 hover:border-[#D4AF37] rounded-lg text-left space-y-2 transition-all group"
                  >
                    <PlusCircle className="w-6 h-6 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                    <h4 className="font-bold text-white text-sm">Tạo Khách Hàng Mới</h4>
                    <p className="text-xs text-slate-400">Nhập Họ tên, SĐT và nhu cầu dòng xe của khách</p>
                  </button>

                  <button
                    onClick={() => alert('Mở công cụ tính báo giá siêu xe lăn bánh')}
                    className="p-4 bg-[#14141C] hover:bg-[#1A1A26] border border-white/10 hover:border-[#D4AF37] rounded-lg text-left space-y-2 transition-all group"
                  >
                    <FileText className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                    <h4 className="font-bold text-white text-sm">Tạo Báo Giá VIP</h4>
                    <p className="text-xs text-slate-400">Lập bảng giá niêm yết, ưu đãi cọc và chi phí lăn bánh</p>
                  </button>

                  <Link
                    to="/admin/orders"
                    className="p-4 bg-[#14141C] hover:bg-[#1A1A26] border border-white/10 hover:border-[#D4AF37] rounded-lg text-left space-y-2 transition-all group block"
                  >
                    <ShoppingBag className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <h4 className="font-bold text-white text-sm">Tạo Yêu Cầu Đặt Cọc</h4>
                    <p className="text-xs text-slate-400">Tạo đơn cọc giữ xe trực tuyến cho khách hàng</p>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------------
              VIEW 4: CHĂM SÓC KHÁCH HÀNG (cskh) VIEW
             ------------------------------------------------------------- */}
          {roleKey === 'cskh' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#0E0E12] border border-emerald-500/40 rounded-lg p-5 space-y-2">
                  <span className="text-slate-400 text-xs font-mono-lux block">Lịch Hẹn Concierge Cần Đón Tiếp</span>
                  <p className="font-mono-lux text-2xl font-bold text-emerald-400">{dashboardData.totalAppointments} lịch</p>
                  <Link to="/admin/appointments" className="text-[11px] text-emerald-400 hover:underline block font-mono-lux">Quản lý lịch hẹn →</Link>
                </div>

                <div className="bg-[#0E0E12] border border-amber-500/40 rounded-lg p-5 space-y-2">
                  <span className="text-slate-400 text-xs font-mono-lux block">Khách Hàng Cần Gọi Chăm Sóc</span>
                  <p className="font-mono-lux text-2xl font-bold text-amber-400">{dashboardData.totalContacts} khách</p>
                  <Link to="/admin/contacts" className="text-[11px] text-amber-400 hover:underline block font-mono-lux">Danh sách cuộc gọi →</Link>
                </div>

                <div className="bg-[#0E0E12] border border-blue-500/40 rounded-lg p-5 space-y-2">
                  <span className="text-slate-400 text-xs font-mono-lux block">Đơn Xe Đã Bàn Giao (Hậu Mãi)</span>
                  <p className="font-mono-lux text-2xl font-bold text-blue-400">{dashboardData.totalOrders} xe</p>
                  <span className="text-[10px] text-slate-400 font-mono-lux">Chăm sóc định kỳ</span>
                </div>
              </div>

              {/* CSKH Appointments & Feedback Handling Table */}
              <div className="bg-[#0E0E12] border border-white/10 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="font-serif-lux text-xl font-bold text-white flex items-center gap-2">
                    <Headphones className="w-5 h-5 text-emerald-400" />
                    <span>Lịch Hẹn Concierge & Gọi Chăm Sóc Khách Hàng (CSKH Center)</span>
                  </h3>
                  <Link to="/admin/appointments" className="text-xs font-mono-lux text-[#D4AF37] hover:underline">Xem tất cả →</Link>
                </div>

                <div className="space-y-3">
                  {dashboardData.recentAppointments.map((appt) => (
                    <div key={appt._id} className="p-4 rounded-lg bg-[#14141C] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                      <div>
                        <p className="font-bold text-white text-sm">{appt.visitorName} ({appt.visitorPhone || '090888999'})</p>
                        <p className="text-slate-400 text-[11px] font-mono-lux mt-0.5">
                          Xe quan tâm: <strong className="text-[#D4AF37]">{appt.car?.name || 'Siêu Xe Luxe'}</strong> • Khung giờ: {appt.timeSlot}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => alert(`Ghi nhận cuộc gọi tư vấn thành công cho khách ${appt.visitorName}`)}
                          className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-mono-lux text-xs rounded"
                        >
                          ✓ Đã Gọi Chăm Sóc
                        </button>
                        <button
                          onClick={() => alert(`Mở nhật ký ghi nhận phản hồi của ${appt.visitorName}`)}
                          className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 hover:text-white font-mono-lux text-xs rounded"
                        >
                          Ghi Nhận Phản Hồi
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------------
              VIEW 5: ADMIN (admin) FULL CONTROL VIEW
             ------------------------------------------------------------- */}
          {roleKey === 'admin' && (
            <>
              {/* Top 6 KPI Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="bg-[#0E0E12] border border-[#D4AF37]/40 rounded-lg p-5 space-y-3">
                  <span className="text-slate-400 text-xs font-mono-lux block">Doanh Thu Cọc</span>
                  <p className="font-mono-lux text-lg font-bold text-[#D4AF37] truncate">{formatVND(dashboardData.totalRevenue)}</p>
                </div>

                <div className="bg-[#0E0E12] border border-amber-500/40 rounded-lg p-5 space-y-3">
                  <span className="text-amber-400 text-xs font-mono-lux block">Form Contact</span>
                  <p className="font-mono-lux text-2xl font-bold text-amber-400">{dashboardData.totalContacts}</p>
                </div>

                <div className="bg-[#0E0E12] border border-blue-500/40 rounded-lg p-5 space-y-3">
                  <span className="text-slate-400 text-xs font-mono-lux block">Kho Xe</span>
                  <p className="font-mono-lux text-2xl font-bold text-white">{dashboardData.totalCars}</p>
                </div>

                <div className="bg-[#0E0E12] border border-emerald-500/40 rounded-lg p-5 space-y-3">
                  <span className="text-slate-400 text-xs font-mono-lux block">Lịch Hẹn</span>
                  <p className="font-mono-lux text-2xl font-bold text-white">{dashboardData.totalAppointments}</p>
                </div>

                <div className="bg-[#0E0E12] border border-purple-500/40 rounded-lg p-5 space-y-3">
                  <span className="text-slate-400 text-xs font-mono-lux block">Đơn Cọc Xe</span>
                  <p className="font-mono-lux text-2xl font-bold text-white">{dashboardData.totalOrders}</p>
                </div>

                <div className="bg-[#0E0E12] border border-white/10 rounded-lg p-5 space-y-3">
                  <span className="text-slate-400 text-xs font-mono-lux block">Thành Viên VIP</span>
                  <p className="font-mono-lux text-2xl font-bold text-white">{dashboardData.totalUsers}</p>
                </div>
              </div>

              {/* Admin Management Hub Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/admin/users" className="p-6 bg-[#0E0E12] border border-white/10 hover:border-[#D4AF37] rounded-lg space-y-2 group transition-all">
                  <Users className="w-6 h-6 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                  <h4 className="font-serif-lux font-bold text-lg text-white">Quản Lý Phân Quyền User</h4>
                  <p className="text-xs text-slate-400">Cấp quyền Admin, Giám đốc, Quản lý, Sales, CSKH &amp; Khách VIP</p>
                </Link>

                <Link to="/admin/crm" className="p-6 bg-[#0E0E12] border border-white/10 hover:border-[#D4AF37] rounded-lg space-y-2 group transition-all">
                  <TrendingUp className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
                  <h4 className="font-serif-lux font-bold text-lg text-white">Báo Cáo Doanh Thu CRM</h4>
                  <p className="text-xs text-slate-400">Xem phễu kinh doanh và biểu đồ doanh thu 6 tháng</p>
                </Link>

                <Link to="/admin/contacts" className="p-6 bg-[#0E0E12] border border-white/10 hover:border-[#D4AF37] rounded-lg space-y-2 group transition-all">
                  <Mail className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <h4 className="font-serif-lux font-bold text-lg text-white">Yêu Cầu Từ Contact Form</h4>
                  <p className="text-xs text-slate-400">Xem và phân loại các yêu cầu liên hệ từ trang Contact và AI Chatbot</p>
                </Link>
              </div>

              {/* Realtime System Activity Feed */}
              <div className="bg-[#0E0E12] border border-white/10 rounded-xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="font-serif-lux text-xl font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#D4AF37]" />
                    <span>Nhật Ký Hoạt Động Hệ Thống (Live MongoDB Stream)</span>
                  </h3>
                  <span className="text-[10px] font-mono-lux text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Stream
                  </span>
                </div>

                <div className="space-y-3 font-mono-lux text-xs">
                  {dashboardData.recentOrders.length > 0 ? (
                    dashboardData.recentOrders.slice(0, 4).map((ord, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded bg-[#14141C] border border-white/5">
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                          <span className="text-white font-bold">#{ord.orderNumber || ord._id?.slice(-6).toUpperCase()}</span>
                          <span className="text-slate-400">— Đơn cọc mới cho <strong className="text-slate-200">{ord.carSnapshot?.name || ord.car?.name}</strong></span>
                        </div>
                        <span className="text-slate-500 text-[10px]">
                          {ord.createdAt ? new Date(ord.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'Vừa xong'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-3 p-3 rounded bg-[#14141C] border border-white/5 text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Hệ thống hoạt động ổn định. Sẵn sàng ghi nhận giao dịch cọc xe &amp; yêu cầu tư vấn mới từ khách hàng VIP.</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
}