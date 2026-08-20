import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import api from '@/services/api';
import { calculateLeadScore, LEAD_TIERS } from '@/utils/leadScoring';
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
  PhoneCall,
  Mail,
  Flame,
  Clock,
  ChevronRight,
  Filter,
  X,
  Target,
  Shield,
} from 'lucide-react';

export default function SalesDashboard() {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedTier, setSelectedTier] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Lead Form State
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    email: '',
    car: 'Ferrari SF90 Stradale',
    budget: 'Trên 30 Tỷ',
    notes: '',
    appointmentDate: '',
  });

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const [contactRes, orderRes, apptRes] = await Promise.allSettled([
        api.get('/contacts'),
        api.get('/orders?limit=20'),
        api.get('/appointments?limit=20'),
      ]);

      const contactList = contactRes.status === 'fulfilled'
        ? Array.isArray(contactRes.value.data) ? contactRes.value.data : Array.isArray(contactRes.value) ? contactRes.value : []
        : [];
      const orderList = orderRes.status === 'fulfilled' ? orderRes.value.data || [] : [];
      const apptList = apptRes.status === 'fulfilled' ? apptRes.value.data || [] : [];

      setContacts(contactList);
      setOrders(orderList);
      setAppointments(apptList);
    } catch (err) {
      console.error('Lỗi tải dữ liệu Sales:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  // Chấm điểm Lead Scoring động cho toàn bộ danh sách
  const scoredLeads = useMemo(() => {
    return contacts.map((c) => {
      const scoreObj = calculateLeadScore(c);
      return {
        ...c,
        leadScoreResult: scoreObj,
      };
    });
  }, [contacts]);

  // Thống kê phân nhóm
  const tierCounts = useMemo(() => {
    const counts = { ALL: scoredLeads.length, HOT: 0, WARM: 0, COLD: 0 };
    scoredLeads.forEach((l) => {
      const tier = l.leadScoreResult.tier;
      if (counts[tier] !== undefined) counts[tier]++;
    });
    return counts;
  }, [scoredLeads]);

  // Danh sách đã lọc theo Tab & Search
  const filteredLeads = useMemo(() => {
    return scoredLeads.filter((lead) => {
      const matchTier = selectedTier === 'ALL' || lead.leadScoreResult.tier === selectedTier;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        (lead.name && lead.name.toLowerCase().includes(q)) ||
        (lead.phone && lead.phone.includes(q)) ||
        (lead.email && lead.email.toLowerCase().includes(q)) ||
        (lead.subject && lead.subject.toLowerCase().includes(q));
      return matchTier && matchSearch;
    });
  }, [scoredLeads, selectedTier, searchQuery]);

  const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
      await api.post('/contacts', {
        name: newLead.name,
        phone: newLead.phone,
        email: newLead.email,
        subject: newLead.car,
        message: `[Ngân sách: ${newLead.budget}] ${newLead.notes}`,
        appointmentDate: newLead.appointmentDate,
      });
      alert('🎉 Đã thêm khách hàng VIP mới vào hệ thống CRM!');
      setIsCreateModalOpen(false);
      setNewLead({
        name: '',
        phone: '',
        email: '',
        car: 'Ferrari SF90 Stradale',
        budget: 'Trên 30 Tỷ',
        notes: '',
        appointmentDate: '',
      });
      fetchSalesData();
    } catch (err) {
      alert('⚠️ Lỗi khi thêm khách hàng: ' + (err?.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#070709', color: '#E2E8F0' }}>
      <AdminSidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminHeader title="Phân Hệ Sales Executive (/sales)" />

        <main className="p-4 sm:p-6 lg:p-8 flex-1 space-y-6 overflow-x-hidden">
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-[#12121A] via-[#181528] to-[#12121A] border border-purple-500/30 rounded-2xl p-6 sm:p-8 overflow-hidden shadow-2xl space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono-lux font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  SALES CRM &amp; AI LEAD SCORING WORKSTATION
                </div>
                <h1 className="font-serif-lux text-2xl sm:text-4xl font-bold text-white tracking-tight">
                  Phân Hệ Sales <span className="text-purple-400 italic">&amp; Chốt Cọc Khách VIP</span>
                </h1>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  Thuật toán Lead Scoring tự động chấm điểm khách hàng tiềm năng, phân loại mức độ khẩn cấp (HOT / WARM / COLD) và cam kết thời gian phản hồi SLA nhằm tối đa hóa tỷ lệ chốt đơn siêu xe.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8972E] text-black font-bold text-xs font-mono-lux flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 hover:brightness-110 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Thêm Khách Hàng Mới</span>
                </button>
                <Link
                  to="/admin/orders"
                  className="px-4 py-2.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-mono-lux font-bold flex items-center gap-2 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Quản Lý Đơn Cọc</span>
                </Link>
              </div>
            </div>

            {/* SLA Info Chips */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-lux">
              <div className="flex items-center gap-2 p-2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <Flame className="w-4 h-4 shrink-0" />
                <span>🔴 <strong>HOT (≥70đ):</strong> SLA gọi lại trong 15 PHÚT</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Clock className="w-4 h-4 shrink-0" />
                <span>🟡 <strong>WARM (40-69đ):</strong> SLA gọi lại trong 2 GIỜ</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-slate-500/10 border border-slate-500/30 text-slate-400">
                <Mail className="w-4 h-4 shrink-0" />
                <span>🔵 <strong>COLD (&lt;40đ):</strong> Luồng Email Nurturing tự động</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-[#0E0E12] border border-white/10 rounded-xl space-y-1">
              <span className="text-[10px] font-mono-lux uppercase text-slate-400">Tổng Khách Hàng</span>
              <p className="font-serif-lux text-2xl font-bold text-white">{tierCounts.ALL}</p>
            </div>
            <div className="p-4 bg-[#0E0E12] border border-rose-500/30 rounded-xl space-y-1">
              <span className="text-[10px] font-mono-lux uppercase text-rose-400 flex items-center gap-1">
                <Flame className="w-3 h-3" /> Khách Ưu Tiên (HOT)
              </span>
              <p className="font-serif-lux text-2xl font-bold text-rose-400">{tierCounts.HOT}</p>
            </div>
            <div className="p-4 bg-[#0E0E12] border border-amber-500/30 rounded-xl space-y-1">
              <span className="text-[10px] font-mono-lux uppercase text-amber-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Tiềm Năng (WARM)
              </span>
              <p className="font-serif-lux text-2xl font-bold text-amber-400">{tierCounts.WARM}</p>
            </div>
            <div className="p-4 bg-[#0E0E12] border border-emerald-500/30 rounded-xl space-y-1">
              <span className="text-[10px] font-mono-lux uppercase text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Đơn Cọc Đã Tạo
              </span>
              <p className="font-serif-lux text-2xl font-bold text-emerald-400">{orders.length}</p>
            </div>
          </div>

          {/* Main Table Card */}
          <div className="bg-[#0E0E12] border border-white/10 rounded-xl p-6 space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedTier('ALL')}
                  className={`px-3 py-1.5 rounded text-xs font-mono-lux transition-all ${
                    selectedTier === 'ALL'
                      ? 'bg-purple-600 text-white font-bold shadow'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  Tất Cả ({tierCounts.ALL})
                </button>
                <button
                  onClick={() => setSelectedTier('HOT')}
                  className={`px-3 py-1.5 rounded text-xs font-mono-lux transition-all flex items-center gap-1 ${
                    selectedTier === 'HOT'
                      ? 'bg-rose-600 text-white font-bold shadow'
                      : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                  }`}
                >
                  <span>🔴 HOT Lead ({tierCounts.HOT})</span>
                </button>
                <button
                  onClick={() => setSelectedTier('WARM')}
                  className={`px-3 py-1.5 rounded text-xs font-mono-lux transition-all flex items-center gap-1 ${
                    selectedTier === 'WARM'
                      ? 'bg-amber-600 text-white font-bold shadow'
                      : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                  }`}
                >
                  <span>🟡 WARM Lead ({tierCounts.WARM})</span>
                </button>
                <button
                  onClick={() => setSelectedTier('COLD')}
                  className={`px-3 py-1.5 rounded text-xs font-mono-lux transition-all flex items-center gap-1 ${
                    selectedTier === 'COLD'
                      ? 'bg-slate-700 text-white font-bold shadow'
                      : 'bg-slate-500/10 text-slate-400 hover:bg-slate-500/20'
                  }`}
                >
                  <span>🔵 COLD Lead ({tierCounts.COLD})</span>
                </button>
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên, SĐT, xe..."
                  className="w-full pl-9 pr-3 py-1.5 bg-[#15151B] border border-white/10 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#14141C] text-slate-400 font-mono-lux uppercase text-[10px] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="p-3">Khách Hàng VIP</th>
                    <th className="p-3">Số Điện Thoại</th>
                    <th className="p-3">Siêu Xe Quan Tâm</th>
                    <th className="p-3 text-center">Điểm Lead Score</th>
                    <th className="p-3">Phân Hạng &amp; SLA</th>
                    <th className="p-3 text-right">Thao Tác Nhanh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        Đang tải danh sách dữ liệu Lead...
                      </td>
                    </tr>
                  ) : filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        Không tìm thấy khách hàng nào phù hợp với bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => {
                      const res = lead.leadScoreResult;
                      return (
                        <tr key={lead._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-3">
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{lead.name || 'Khách Vãng Lai'}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono-lux block">
                              {lead.email || 'Chưa có email'}
                            </span>
                          </td>
                          <td className="p-3 font-mono-lux text-[#D4AF37]">
                            <a href={`tel:${lead.phone}`} className="hover:underline flex items-center gap-1">
                              <PhoneCall className="w-3 h-3 text-[#D4AF37]" />
                              {lead.phone || 'N/A'}
                            </a>
                          </td>
                          <td className="p-3 text-purple-300 font-medium max-w-[200px] truncate">
                            {lead.subject || lead.car?.name || 'Siêu Xe Luxe'}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className={`px-2.5 py-1 rounded-full font-mono-lux font-bold text-xs inline-flex items-center gap-1 cursor-pointer transition-transform hover:scale-105 ${res.badgeClass}`}
                              title="Bấm để xem bảng bóc tách điểm chi tiết"
                            >
                              <span>{res.totalScore}/100</span>
                            </button>
                          </td>
                          <td className="p-3">
                            <div className="space-y-0.5">
                              <span className={`text-[10px] font-mono-lux font-bold block ${res.color}`}>
                                {res.emoji} {res.fullName}
                              </span>
                              <span className="text-[9px] text-slate-400 block truncate max-w-[180px]">
                                {res.slaAction}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedLead(lead)}
                                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded text-[11px] font-mono-lux"
                              >
                                Chi Tiết
                              </button>
                              <a
                                href={`tel:${lead.phone}`}
                                className="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded text-[11px] font-mono-lux flex items-center gap-1"
                              >
                                <PhoneCall className="w-3 h-3" />
                                Gọi Ngay
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Chi Tiết Điểm Lead Scoring */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0E0E14] border border-[#D4AF37]/40 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedLead(null)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-mono-lux uppercase tracking-widest text-[#D4AF37]">
                  LEAD SCORING BREAKDOWN
                </span>
                <h3 className="font-serif-lux text-2xl font-bold text-white">
                  {selectedLead.name || 'Khách Vãng Lai'}
                </h3>
                <p className="text-xs text-slate-400 font-mono-lux">
                  SĐT: {selectedLead.phone} | Quan tâm: {selectedLead.subject}
                </p>
              </div>

              {/* Score Header */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${selectedLead.leadScoreResult.bgColor} ${selectedLead.leadScoreResult.borderColor}`}>
                <div>
                  <span className="text-xs font-mono-lux text-slate-400 block">Tổng Điểm Tiềm Năng</span>
                  <span className={`text-3xl font-bold font-serif-lux ${selectedLead.leadScoreResult.color}`}>
                    {selectedLead.leadScoreResult.totalScore} / 100
                  </span>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-mono-lux font-bold inline-flex items-center gap-1 ${selectedLead.leadScoreResult.badgeClass}`}>
                    {selectedLead.leadScoreResult.emoji} {selectedLead.leadScoreResult.label} LEAD
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1 font-mono-lux">
                    {selectedLead.leadScoreResult.slaAction}
                  </span>
                </div>
              </div>

              {/* 4 Breakdown Categories */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono-lux uppercase text-slate-400 tracking-wider">
                  Bóc Tách 4 Nhóm Tiêu Chí Chấm Điểm:
                </h4>

                {Object.entries(selectedLead.leadScoreResult.breakdown).map(([key, group]) => {
                  const names = {
                    identity: '1. Điểm Định Danh & Liên Hệ',
                    car: '2. Giá Trị & Nhu Cầu Siêu Xe',
                    intent: '3. Ý Định Mua & Mức Độ Khẩn Cấp',
                    source: '4. Nguồn Thu Thập Lead',
                  };
                  return (
                    <div key={key} className="p-3 bg-[#15151B] border border-white/5 rounded-lg space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{names[key]}</span>
                        <span className="font-mono-lux text-[#D4AF37] font-bold">
                          {group.score} / {group.max}đ
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#D4AF37]"
                          style={{ width: `${(group.score / group.max) * 100}%` }}
                        />
                      </div>
                      {group.details.length > 0 && (
                        <div className="text-[11px] text-slate-400 space-y-0.5 pt-1">
                          {group.details.map((d, i) => (
                            <span key={i} className="block text-slate-300">
                              • {d}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Message Context */}
              {selectedLead.message && (
                <div className="p-3 bg-[#15151B] border border-white/5 rounded-lg space-y-1">
                  <span className="text-[10px] font-mono-lux uppercase text-slate-400">Ghi Chú Nhu Cầu:</span>
                  <p className="text-xs text-slate-300">{selectedLead.message}</p>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex gap-3">
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="flex-1 py-2.5 bg-[#D4AF37] text-black font-bold text-xs font-mono-lux rounded-lg flex items-center justify-center gap-2 hover:brightness-110"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Gọi Điện Khách VIP</span>
                </a>
                <button
                  onClick={() => {
                    alert(`Đã kích hoạt chuỗi Email Báo Giá Siêu Xe gửi đến ${selectedLead.email || selectedLead.name}`);
                  }}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-mono-lux text-xs rounded-lg flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Gửi Báo Giá</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Thêm Khách Hàng VIP Mới */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0E0E14] border border-purple-500/40 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-mono-lux uppercase tracking-widest text-purple-400">
                  NEW VIP CUSTOMER INTAKE
                </span>
                <h3 className="font-serif-lux text-2xl font-bold text-white">
                  Nhập Khách Hàng Tiềm Năng Mới
                </h3>
              </div>

              <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Họ và Tên Khách VIP *</label>
                  <input
                    type="text"
                    required
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    placeholder="VD: Nguyễn Văn Hoàng"
                    className="w-full px-3 py-2 bg-[#15151B] border border-white/10 rounded text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Số Điện Thoại *</label>
                    <input
                      type="tel"
                      required
                      value={newLead.phone}
                      onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                      placeholder="0908123456"
                      className="w-full px-3 py-2 bg-[#15151B] border border-white/10 rounded text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Email Doanh Nghiệp</label>
                    <input
                      type="email"
                      value={newLead.email}
                      onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                      placeholder="hoang@holdings.vn"
                      className="w-full px-3 py-2 bg-[#15151B] border border-white/10 rounded text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Siêu Xe Quan Tâm</label>
                    <select
                      value={newLead.car}
                      onChange={(e) => setNewLead({ ...newLead, car: e.target.value })}
                      className="w-full px-3 py-2 bg-[#15151B] border border-white/10 rounded text-white focus:outline-none focus:border-purple-400"
                    >
                      <option value="Ferrari SF90 Stradale">Ferrari SF90 Stradale</option>
                      <option value="Lamborghini Revuelto">Lamborghini Revuelto</option>
                      <option value="Porsche 911 GT3 RS">Porsche 911 GT3 RS</option>
                      <option value="McLaren 750S Spider">McLaren 750S Spider</option>
                      <option value="Rolls-Royce Ghost">Rolls-Royce Ghost</option>
                      <option value="Bentley Continental GT">Bentley Continental GT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Ngân Sách Dự Kiến</label>
                    <select
                      value={newLead.budget}
                      onChange={(e) => setNewLead({ ...newLead, budget: e.target.value })}
                      className="w-full px-3 py-2 bg-[#15151B] border border-white/10 rounded text-white focus:outline-none focus:border-purple-400"
                    >
                      <option value="Trên 30 Tỷ">Trên 30 Tỷ VNĐ</option>
                      <option value="15 - 30 Tỷ">15 - 30 Tỷ VNĐ</option>
                      <option value="Dưới 15 Tỷ">Dưới 15 Tỷ VNĐ</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Hẹn Lịch Lái Thử (Nếu có)</label>
                  <input
                    type="date"
                    value={newLead.appointmentDate}
                    onChange={(e) => setNewLead({ ...newLead, appointmentDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#15151B] border border-white/10 rounded text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Ghi Chú Nhu Cầu &amp; Option Bespoke</label>
                  <textarea
                    rows={3}
                    value={newLead.notes}
                    onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                    placeholder="Màu sơn độc bản, gói carbon, thời gian mong muốn nhận xe..."
                    className="w-full px-3 py-2 bg-[#15151B] border border-white/10 rounded text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg font-mono-lux"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold rounded-lg font-mono-lux hover:brightness-110 shadow-lg"
                  >
                    Lưu &amp; Chấm Điểm CRM
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

