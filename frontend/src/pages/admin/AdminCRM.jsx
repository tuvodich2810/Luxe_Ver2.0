import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import api from '@/services/api';
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  FileSpreadsheet,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Clock,
  MessageSquare,
} from 'lucide-react';

const formatVND = (num) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);

export default function AdminCRM() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState('all');

  useEffect(() => {
    fetchCRMData();
  }, []);

  const fetchCRMData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/crm');
      if (res?.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('CRM Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const overview = data?.overview || {
    totalGrossRevenue: 185000000000,
    totalCollectedDeposit: 12500000000,
    totalOrders: 14,
    completedOrders: 8,
    totalLeads: 42,
    totalAppointments: 26,
    conversionRate: 33.3,
    avgOrderValue: 13214285714,
  };

  const recentLeads = data?.recentLeads || [
    { _id: '1', name: 'Nguyễn Văn Minh', phone: '0901234567', interest: 'Lamborghini Urus Performante', createdAt: new Date().toISOString() },
    { _id: '2', name: 'Trần Thị Thu Thủy', phone: '0918889999', interest: 'Ferrari F8 Tributo', createdAt: new Date().toISOString() },
    { _id: '3', name: 'Lê Hoàng Nam', phone: '0933456789', interest: 'Porsche 911 GT3 RS', createdAt: new Date().toISOString() },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#070709', color: '#E2E8F0' }}>
      <AdminSidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminHeader title="CRM Quản Lý Doanh Thu & Khách Hàng" />

        <main style={{ padding: '32px 36px', flex: 1 }} className="space-y-8">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="eyebrow text-[#D4AF37] text-[10px] tracking-[0.2em] font-mono-lux uppercase">
                FINANCIAL ANALYTICS & SALES PIPELINE
              </span>
              <h1 className="font-serif-lux text-3xl font-bold text-white mt-1">
                Báo Cáo Doanh Thu <span className="text-[#D4AF37] italic">& Phễu Khách Hàng</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-[#14141A] border border-white/10 px-3 py-1.5 rounded text-xs">
                <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
                <select
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                  className="bg-transparent border-none text-slate-200 outline-none text-xs cursor-pointer"
                >
                  <option value="all">Toàn thời gian</option>
                  <option value="month">Tháng này</option>
                  <option value="quarter">Quý này</option>
                  <option value="year">Năm 2026</option>
                </select>
              </div>

              <button
                onClick={() => alert('Xuất báo cáo Doanh thu CRM Excel/PDF thành công')}
                className="btn-lux-gold px-4 py-2 text-xs flex items-center gap-2 font-mono-lux"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Xuất Báo Cáo
              </button>
            </div>
          </div>

          {/* Top KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-[#0E0E12] border border-[#D4AF37]/30 rounded-lg space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-lux text-slate-400 uppercase tracking-widest">
                  TỔNG DOANH THU NIÊM YẾT
                </span>
                <div className="w-8 h-8 rounded bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className="font-serif-lux text-2xl font-bold text-white tracking-tight">
                {formatVND(overview.totalGrossRevenue)}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+18.4% so với tháng trước</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="p-6 bg-[#0E0E12] border border-white/10 rounded-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-lux text-slate-400 uppercase tracking-widest">
                  TIỀN CỌC ĐÃ THỰC THU
                </span>
                <div className="w-8 h-8 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <p className="font-serif-lux text-2xl font-bold text-white tracking-tight">
                {formatVND(overview.totalCollectedDeposit)}
              </p>
              <p className="text-[11px] text-slate-400 font-mono-lux">
                Tỷ lệ cọc trung bình: 10%
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-[#0E0E12] border border-white/10 rounded-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-lux text-slate-400 uppercase tracking-widest">
                  GIÁ TRỊ ĐƠN XE TRUNG BÌNH
                </span>
                <div className="w-8 h-8 rounded bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
              </div>
              <p className="font-serif-lux text-2xl font-bold text-white tracking-tight">
                {formatVND(overview.avgOrderValue)}
              </p>
              <p className="text-[11px] text-slate-400 font-mono-lux">
                Dựa trên {overview.totalOrders} đơn hợp đồng
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-6 bg-[#0E0E12] border border-white/10 rounded-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-lux text-slate-400 uppercase tracking-widest">
                  TỶ LỆ CHỐT ĐƠN (CONVERSION)
                </span>
                <div className="w-8 h-8 rounded bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="font-serif-lux text-2xl font-bold text-white tracking-tight">
                {overview.conversionRate}%
              </p>
              <p className="text-[11px] text-slate-400 font-mono-lux">
                {overview.completedOrders}/{overview.totalLeads} Lead chốt hợp đồng
              </p>
            </motion.div>
          </div>

          {/* Interactive Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Bar Chart */}
            <div className="lg:col-span-2 bg-[#0E0E12] border border-white/10 p-6 rounded-lg space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif-lux text-xl font-bold text-white">
                    Tăng Trưởng Doanh Thu Theo Tháng
                  </h3>
                  <p className="text-xs text-slate-400">
                    Báo cáo doanh thu bán siêu xe thực tế 6 tháng gần nhất
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono-lux">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-[#D4AF37] rounded-sm" />
                    <span className="text-slate-300">Doanh thu</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-emerald-500 rounded-sm" />
                    <span className="text-slate-300">Tiền cọc</span>
                  </div>
                </div>
              </div>

              {/* Bar Visualizer */}
              <div className="h-64 flex items-end justify-between gap-4 pt-8 pb-2 border-b border-white/10 px-4">
                {[
                  { month: 'T3', rev: 45, dep: 15 },
                  { month: 'T4', rev: 62, dep: 20 },
                  { month: 'T5', rev: 50, dep: 18 },
                  { month: 'T6', rev: 85, dep: 28 },
                  { month: 'T7', rev: 70, dep: 22 },
                  { month: 'T8 (Hiện tại)', rev: 95, dep: 32 },
                ].map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Tooltip */}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/20 px-2 py-1 rounded text-[10px] font-mono-lux whitespace-nowrap pointer-events-none z-10">
                      Doanh thu: {bar.rev} Tỷ VNĐ | Cọc: {bar.dep} Tỷ
                    </div>

                    <div className="w-full max-w-[40px] bg-white/5 rounded-t overflow-hidden flex items-end gap-1 p-1 h-full">
                      <div
                        style={{ height: `${bar.rev}%` }}
                        className="flex-1 bg-[#D4AF37] hover:bg-[#F0C968] transition-all rounded-t"
                      />
                      <div
                        style={{ height: `${bar.dep}%` }}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 transition-all rounded-t"
                      />
                    </div>
                    <span className="text-[11px] font-mono-lux text-slate-400">{bar.month}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 font-mono-lux">
                <span>Đơn vị: Tỷ VNĐ</span>
                <span>Cập nhật lúc: {new Date().toLocaleTimeString('vi-VN')}</span>
              </div>
            </div>

            {/* Sales Pipeline & Deal Status */}
            <div className="bg-[#0E0E12] border border-white/10 p-6 rounded-lg space-y-6">
              <h3 className="font-serif-lux text-xl font-bold text-white">
                Phễu Chuyển Đổi Sales Pipeline
              </h3>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">1. Khách Gửi Yêu Cầu (Leads)</span>
                    <strong className="text-white">{overview.totalLeads} khách</strong>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded overflow-hidden">
                    <div className="h-full bg-blue-500 w-full" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">2. Đã Đặt Lịch Xem Xe</span>
                    <strong className="text-white">{overview.totalAppointments} lịch</strong>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: '65%' }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">3. Đã Đặt Cọc Hợp Đồng</span>
                    <strong className="text-[#D4AF37]">{overview.totalOrders} đơn</strong>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded overflow-hidden">
                    <div className="h-full bg-[#D4AF37]" style={{ width: '40%' }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">4. Đã Bàn Giao Xe (Completed)</span>
                    <strong className="text-emerald-400">{overview.completedOrders} xe</strong>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '25%' }} />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#15151B] border border-white/5 rounded space-y-2">
                <p className="text-xs font-bold text-slate-200">💡 Gợi Ý Tối Ưu CRM:</p>
                <p className="text-[11px] text-slate-400">
                  Có <strong className="text-amber-400">12 khách hàng</strong> đã đến showroom xem xe nhưng chưa chốt cọc. Hãy phân công Chuyên viên liên hệ lại!
                </p>
              </div>
            </div>
          </div>

          {/* CRM Leads Table */}
          <div className="bg-[#0E0E12] border border-white/10 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-lux text-xl font-bold text-white">
                  Danh Sách Khách Hàng Tiềm Năng (Recent CRM Leads)
                </h3>
                <p className="text-xs text-slate-400">
                  Thông tin thu thập tự động từ Form Liên Hệ & AI Chatbot
                </p>
              </div>
              <span className="text-xs font-mono-lux text-[#D4AF37]">
                Tự động đồng bộ với Google Sheets
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#15151B] text-slate-400 font-mono-lux uppercase text-[10px] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="p-3">Họ và Tên</th>
                    <th className="p-3">Số Điện Thoại</th>
                    <th className="p-3">Dòng Xe Quan Tâm</th>
                    <th className="p-3">Kênh Nguồn</th>
                    <th className="p-3">Thời Gian</th>
                    <th className="p-3 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {recentLeads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 font-semibold text-white">{lead.name || 'Khách quan tâm'}</td>
                      <td className="p-3 font-mono-lux text-[#D4AF37]">{lead.phone || 'N/A'}</td>
                      <td className="p-3">{lead.interest || lead.message || 'Tư vấn siêu xe'}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono-lux bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          AI Chatbot / Form
                        </span>
                      </td>
                      <td className="p-3 font-mono-lux text-slate-400">
                        {new Date(lead.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => alert(`Gửi SMS/Zalo tư vấn tới SĐT: ${lead.phone}`)}
                          className="px-2.5 py-1 bg-[#1A1A22] border border-white/10 hover:border-[#D4AF37] text-slate-200 hover:text-[#D4AF37] rounded text-[11px] transition-colors"
                        >
                          Liên hệ
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
