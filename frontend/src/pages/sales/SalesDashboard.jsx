import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import api from '@/services/api';
import {
  ShoppingBag,
  PlusCircle,
  FileText,
  Users,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Search,
} from 'lucide-react';

export default function SalesDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalContacts: 0,
    totalOrders: 0,
    totalAppointments: 0,
    recentContacts: [],
  });

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      try {
        const [contactRes, orderRes, apptRes] = await Promise.allSettled([
          api.get('/contacts'),
          api.get('/orders?limit=10'),
          api.get('/appointments?limit=10'),
        ]);

        const contactList = contactRes.status === 'fulfilled'
          ? Array.isArray(contactRes.value.data) ? contactRes.value.data : Array.isArray(contactRes.value) ? contactRes.value : []
          : [];
        const orderList = orderRes.status === 'fulfilled' ? orderRes.value.data || [] : [];
        const apptList = apptRes.status === 'fulfilled' ? apptRes.value.data || [] : [];

        setDashboardData({
          totalContacts: contactList.length,
          totalOrders: orderList.length,
          totalAppointments: apptList.length,
          recentContacts: contactList.slice(0, 5),
        });
      } catch (err) {
        console.error('Lỗi tải dữ liệu Sales:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#070709', color: '#E2E8F0' }}>
      <AdminSidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminHeader title="Phân Hệ Nhân Viên Bán Hàng (/sales)" />

        <main style={{ padding: '32px 36px', flex: 1 }} className="space-y-6">
          {/* Header Banner */}
          <div className="relative bg-[#0E0E12] border border-purple-500/40 rounded-xl p-8 overflow-hidden shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono-lux text-xs font-bold inline-flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4" />
                  SALES EXECUTIVE WORKSTATION
                </span>
                <h1 className="font-serif-lux text-3xl font-bold text-white">
                  Phân Hệ Sales <span className="text-purple-400 italic">Tạo Khách Hàng & Chốt Đơn Cọc</span>
                </h1>
                <p className="text-xs text-slate-400 max-w-2xl">
                  Nhập thông tin khách hàng tiềm năng, lập bảng tính báo giá chi phí lăn bánh, tạo đơn cọc xe trực tuyến và theo dõi lịch hẹn cá nhân.
                </p>
              </div>
            </div>

            {/* Scope Badge */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs font-mono-lux">
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Tạo thông tin khách hàng mới
              </span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Lập báo giá & tư vấn siêu xe
              </span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Tạo đơn cọc xe cho khách hàng
              </span>
              <span className="text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> 🚫 Không xem tổng doanh thu tài chính công ty
              </span>
            </div>
          </div>

          {/* Sales Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => alert('Mở công cụ nhập thông tin khách hàng VIP mới')}
              className="p-5 bg-[#0E0E12] hover:bg-[#14141E] border border-white/10 hover:border-purple-400 rounded-xl text-left space-y-3 transition-all shadow-lg group"
            >
              <PlusCircle className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              <h3 className="font-serif-lux text-xl font-bold text-white">Tạo Khách Hàng Mới</h3>
              <p className="text-xs text-slate-400">Nhập Họ tên, SĐT, nhu cầu dòng xe và thông tin tài chính khách hàng</p>
            </button>

            <button
              onClick={() => alert('Mở công cụ tính giá niêm yết & phí lăn bánh siêu xe')}
              className="p-5 bg-[#0E0E12] hover:bg-[#14141E] border border-white/10 hover:border-purple-400 rounded-xl text-left space-y-3 transition-all shadow-lg group"
            >
              <FileText className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform" />
              <h3 className="font-serif-lux text-xl font-bold text-white">Lập Báo Giá VIP</h3>
              <p className="text-xs text-slate-400">Tính toán chính xác giá cọc xe, thuế trước bạ và quà tặng theo kèm</p>
            </button>

            <Link
              to="/admin/orders"
              className="p-5 bg-[#0E0E12] hover:bg-[#14141E] border border-white/10 hover:border-purple-400 rounded-xl text-left space-y-3 transition-all shadow-lg group block"
            >
              <ShoppingBag className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition-transform" />
              <h3 className="font-serif-lux text-xl font-bold text-white">Tạo Đơn Cọc Xe</h3>
              <p className="text-xs text-slate-400">Tạo đơn đặt cọc giữ xe chính thức cho khách hàng của mình</p>
            </Link>
          </div>

          {/* Assigned Customers Table */}
          <div className="bg-[#0E0E12] border border-white/10 rounded-xl p-6 space-y-4">
            <h3 className="font-serif-lux text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span>Danh Sách Khách Hàng Cá Nhân Phụ Trách</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#14141C] text-slate-400 font-mono-lux uppercase text-[10px] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="p-3">Họ và Tên Khách</th>
                    <th className="p-3">Số Điện Thoại</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Dòng Xe Quan Tâm</th>
                    <th className="p-3 text-right">Thao Tác Sales</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {dashboardData.recentContacts.map((c) => (
                    <tr key={c._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 font-bold text-white">{c.name || 'Khách VIP'}</td>
                      <td className="p-3 font-mono-lux text-[#D4AF37]">{c.phone || 'N/A'}</td>
                      <td className="p-3 text-slate-400">{c.email || 'N/A'}</td>
                      <td className="p-3 text-purple-300">{c.subject || c.interest || 'Siêu Xe Luxe'}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => alert(`Mở bảng tính báo giá cho khách ${c.name}`)}
                          className="px-3 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded text-[11px] font-mono-lux"
                        >
                          Tạo Báo Giá
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
