import { useState, useEffect, useCallback, useMemo } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import api from '@/services/api';
import { calculateLeadScore, LEAD_TIERS } from '@/utils/leadScoring';
import {
  Mail,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Search,
  Filter,
  UserCheck,
  Award,
  Sparkles,
  Info,
  ChevronRight,
  X,
  Target,
  Car,
  RefreshCw,
  RotateCcw,
  SlidersHorizontal,
  Layers,
  Flame,
  Zap,
  Users,
} from 'lucide-react';

const STATUS_CFG = {
  new: {
    label: 'Mới - Chờ Xử Lý',
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
  contacted: {
    label: 'Đã Liên Hệ',
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  },
  closed: {
    label: 'Hoàn Thành',
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
};

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTier, setFilterTier] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [sortBy, setSortBy] = useState('score_desc');
  const [search, setSearch] = useState('');
  const [actionId, setActionId] = useState(null);
  const [selectedScoreLead, setSelectedScoreLead] = useState(null);
  const [selectedEmailLead, setSelectedEmailLead] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);

  const generatePersonalizedEmail = (lead) => {
    const name = lead?.name || 'Quý khách';
    const car = lead?.car || lead?.interest || lead?.subject || 'Siêu Xe Luxe Motors';
    const phone = lead?.phone || '';

    const subject = `[Luxe Motors Concierge] Thư Tư Vấn & Đặc Quyền Lái Thử Mẫu Xe ${car} – Kính Gửi ${name}`;
    const body = `Kính gửi Quý khách ${name},

Lời đầu tiên, Luxe Motors xin gửi tới Quý khách lời chào trân trọng và lời chúc sức khỏe, thành công thịnh vượng!

Chúng tôi chân thành cảm ơn Quý khách đã quan tâm đến mẫu siêu xe ${car} tại hệ thống phân phối chính hãng Luxe Motors.

Bộ phận Quản lý Khách hàng VIP xin tóm lược 03 thông tin quan trọng nhất dành cho Quý khách:

💎 03 THÔNG TIN ĐẶC QUYỀN DÀNH RIÊNG CHO QUÝ KHÁCH:
1. Tình trạng xe có sẵn: Mẫu xe ${car} đã hoàn tất kiểm định 150 điểm kỹ thuật, biểu giá niêm yết chuẩn VNĐ (đã bao gồm toàn bộ thuế VAT và hóa đơn nhập khẩu minh bạch).
2. Dịch vụ Lái thử tận nhà (Home Concierge): Xe chuyên dụng sàn phẳng sẽ vận chuyển siêu xe đến tận tư gia để Quý khách trực tiếp cầm lái trải nghiệm riêng tư.
3. Đặc quyền bảo vệ & Hậu mãi: Cam kết bảo mật danh tính 100% theo Thỏa thuận NDA pháp lý, gói bảo hành 05 năm chính hãng và dịch vụ cứu hộ khẩn cấp 24/7.

Chuyên viên Quản lý Khách hàng VIP - Mr. Trần Quốc Bảo (Hotline: 0372 950 720) sẽ liên hệ với Quý khách qua số điện thoại ${phone || 'của Quý khách'} trong ít phút tới để xác nhận lịch trình tiếp đón.

👉 Quý khách có thể tra cứu lịch hẹn trực tuyến tại: https://luxe-ver2-0.vercel.app/appointment/my

Trân trọng kính gửi,
----------------------------------------------------------------------
TRẦN QUỐC BẢO | Senior VIP Concierge Specialist
LUXE MOTORS AUTOMOBILES
📍 18 Lý Thường Kiệt, Q. Hoàn Kiếm, Hà Nội
📞 Hotline 24/7: 0372 950 720 | 🌐 Website: https://luxe-ver2-0.vercel.app`;

    return { subject, body };
  };

  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/contacts');
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setContacts(list);
    } catch (err) {
      console.error('Lỗi tải danh sách yêu cầu liên hệ:', err);
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Nạp dữ liệu Lead mẫu chuẩn lên MongoDB Atlas
  const handleSeedContacts = async () => {
    setIsSeeding(true);
    try {
      await api.post('/contacts/seed');
      await fetchContacts();
      alert('🎉 Đã nạp thành công 20 hồ sơ khách hàng tiềm năng (Leads) chuẩn lên cơ sở dữ liệu MongoDB Atlas!');
    } catch (err) {
      console.error('Lỗi nạp dữ liệu:', err);
      alert('⚠️ Không thể nạp dữ liệu: ' + (err?.response?.data?.message || err.message));
    } finally {
      setIsSeeding(false);
    }
  };

  // Lọc và tính điểm cho từng lead
  const scoredContacts = useMemo(() => {
    return contacts.map((c) => ({
      ...c,
      scoreData: calculateLeadScore(c),
    }));
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    const s = String(search || '').toLowerCase();
    return scoredContacts.filter((item) => {
      const carStr = typeof item.car === 'object' && item.car !== null ? (item.car.name || '') : String(item.car || '');
      const matchSearch =
        !s ||
        item.name?.toLowerCase().includes(s) ||
        item.phone?.includes(search) ||
        item.email?.toLowerCase().includes(s) ||
        item.message?.toLowerCase().includes(s) ||
        carStr.toLowerCase().includes(s) ||
        item.interest?.toLowerCase().includes(s);

      const matchStatus = !filterStatus || item.status === filterStatus;
      const matchTier = !filterTier || item.scoreData.tier === filterTier;

      let matchBrand = true;
      if (filterBrand) {
        const carInfo = `${carStr} ${item.interest || ''} ${item.subject || ''} ${item.message || ''}`.toLowerCase();
        if (filterBrand === 'ferrari') matchBrand = carInfo.includes('ferrari') || carInfo.includes('sf90') || carInfo.includes('roma') || carInfo.includes('296');
        else if (filterBrand === 'lamborghini') matchBrand = carInfo.includes('lamborghini') || carInfo.includes('revuelto') || carInfo.includes('huracan');
        else if (filterBrand === 'rolls-royce') matchBrand = carInfo.includes('rolls') || carInfo.includes('ghost') || carInfo.includes('phantom') || carInfo.includes('cullinan');
        else if (filterBrand === 'porsche') matchBrand = carInfo.includes('porsche') || carInfo.includes('911') || carInfo.includes('gt3') || carInfo.includes('taycan');
        else if (filterBrand === 'bentley') matchBrand = carInfo.includes('bentley') || carInfo.includes('continental') || carInfo.includes('flying spur') || carInfo.includes('maybach');
        else if (filterBrand === 'other') matchBrand = carInfo.includes('mclaren') || carInfo.includes('bugatti') || carInfo.includes('aston') || carInfo.includes('750s') || carInfo.includes('chiron') || carInfo.includes('db12');
      }

      return matchSearch && matchStatus && matchTier && matchBrand;
    });
  }, [scoredContacts, search, filterStatus, filterTier, filterBrand]);

  // Sắp xếp linh hoạt theo bộ chọn
  const sortedContacts = useMemo(() => {
    return [...filteredContacts].sort((a, b) => {
      if (sortBy === 'score_desc') return b.scoreData.totalScore - a.scoreData.totalScore;
      if (sortBy === 'score_asc') return a.scoreData.totalScore - b.scoreData.totalScore;
      if (sortBy === 'date_desc') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'date_asc') return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });
  }, [filteredContacts, sortBy]);

  // Thống kê nhanh
  const hotCount = useMemo(() => scoredContacts.filter((c) => c.scoreData.tier === 'HOT').length, [scoredContacts]);
  const warmCount = useMemo(() => scoredContacts.filter((c) => c.scoreData.tier === 'WARM').length, [scoredContacts]);
  const coldCount = useMemo(() => scoredContacts.filter((c) => c.scoreData.tier === 'COLD').length, [scoredContacts]);
  const newCount = useMemo(() => scoredContacts.filter((c) => c.status === 'new' || !c.status).length, [scoredContacts]);
  const contactedCount = useMemo(() => scoredContacts.filter((c) => c.status === 'contacted').length, [scoredContacts]);
  const closedCount = useMemo(() => scoredContacts.filter((c) => c.status === 'closed').length, [scoredContacts]);

  const avgScore = useMemo(() => {
    if (scoredContacts.length === 0) return 0;
    const sum = scoredContacts.reduce((acc, c) => acc + c.scoreData.totalScore, 0);
    return Math.round(sum / scoredContacts.length);
  }, [scoredContacts]);

  const handleUpdateStatus = async (id, newStatus) => {
    setActionId(id);
    try {
      await api.put(`/contacts/${id}`, { status: newStatus });
      fetchContacts();
    } catch (err) {
      alert('Không thể cập nhật trạng thái liên hệ');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa yêu cầu liên hệ này?')) return;
    setActionId(id);
    try {
      await api.delete(`/contacts/${id}`);
      fetchContacts();
    } catch (err) {
      alert('Không thể xóa liên hệ');
    } finally {
      setActionId(null);
    }
  };

  const handleResetFilters = () => {
    setFilterTier('');
    setFilterStatus('');
    setFilterBrand('');
    setSearch('');
    setSortBy('score_desc');
  };

  const columns = [
    {
      key: 'name',
      label: 'Khách Hàng & Liên Hệ',
      render: (item) => (
        <div className="space-y-1">
          <p className="font-bold text-white text-xs">{item.name || 'Khách VIP Chưa Định Danh'}</p>
          <div className="flex flex-col gap-0.5 text-[10px] text-slate-400 font-mono-lux">
            <span className="flex items-center gap-1 text-[#D4AF37]">
              <Phone className="w-2.5 h-2.5" />
              {item.phone || 'Chưa để lại SĐT'}
            </span>
            {item.email && (
              <span className="flex items-center gap-1 text-slate-300">
                <Mail className="w-2.5 h-2.5" />
                {item.email}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'car',
      label: 'Nhu Cầu & Lời Nhắn',
      render: (item) => (
        <div className="max-w-xs space-y-1">
          {(item.car || item.interest || item.subject) && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono-lux text-[#D4AF37]">
              <Car className="w-2.5 h-2.5" />
              {item.car || item.interest || item.subject}
            </span>
          )}
          <p className="text-xs text-slate-300 italic line-clamp-2" title={item.message}>
            "{item.message || 'Yêu cầu tư vấn mua siêu xe'}"
          </p>
        </div>
      ),
    },
    {
      key: 'score',
      label: 'Điểm Đánh Giá Lead (Lead Score)',
      render: (item) => {
        const { scoreData } = item;
        return (
          <div
            onClick={() => setSelectedScoreLead(item)}
            className="cursor-pointer group p-2 rounded bg-[#14141A] border border-white/5 hover:border-[#D4AF37]/40 transition-all space-y-1.5 min-w-[150px]"
            title="Bấm để xem chi tiết cách tính điểm"
          >
            <div className="flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded text-[9px] font-mono-lux border font-bold flex items-center gap-1 ${scoreData.badgeClass}`}>
                {scoreData.emoji} {scoreData.tier}
              </span>
              <span className="text-xs font-mono-lux font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                {scoreData.totalScore} <span className="text-[9px] text-slate-500">/100đ</span>
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full ${scoreData.barColor} transition-all duration-500`}
                style={{ width: `${Math.max(scoreData.totalScore, 5)}%` }}
              />
            </div>

            <p className="text-[9px] text-slate-400 truncate flex items-center justify-between">
              <span>{scoreData.slaAction}</span>
              <Info className="w-2.5 h-2.5 text-slate-500 group-hover:text-[#D4AF37]" />
            </p>
          </div>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Thời Gian Gửi',
      render: (item) => (
        <div className="text-xs font-mono-lux text-slate-300 space-y-0.5">
          <p className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#D4AF37]" />
            {new Date(item.createdAt).toLocaleDateString('vi-VN')}
          </p>
          <p className="text-[10px] text-slate-400">
            {new Date(item.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Trạng Thái Xử Lý',
      render: (item) => {
        const cfg = STATUS_CFG[item.status] || STATUS_CFG.new;
        return (
          <span className={`px-2.5 py-1 rounded text-[10px] font-mono-lux border ${cfg.color} inline-block`}>
            {cfg.label}
          </span>
        );
      },
    },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#070709', color: '#E2E8F0' }}>
      <AdminSidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminHeader title="Quản Lý & Chấm Điểm Khách Hàng Tiềm Năng (Leads)" />

        <main style={{ padding: '32px 36px', flex: 1 }} className="space-y-6">
          {/* Header Title & MongoDB Seed Action */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="eyebrow text-[#D4AF37] text-[10px] tracking-[0.2em] font-mono-lux uppercase flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" /> LEAD SCORING &amp; SALES PIPELINE INTELLIGENCE
              </span>
              <h1 className="font-serif-lux text-3xl font-bold text-white mt-1">
                Chấm Điểm &amp; Phân Loại <span className="text-[#D4AF37] italic">Khách Hàng (Leads)</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Tự động chấm điểm 100đ theo định danh, nhu cầu siêu xe, từ khóa cọc/lái thử và nguồn Lead từ Chatbot/Website.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSeedContacts}
                disabled={isSeeding}
                className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-[#070709] font-mono-lux font-bold text-xs shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                title="Tạo mới và đồng bộ 20 Lead chất lượng cao vào cơ sở dữ liệu MongoDB Atlas"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
                {isSeeding ? 'Đang Nạp MongoDB...' : '🚀 Nạp Dữ Liệu Lead MongoDB'}
              </button>

              <button
                onClick={fetchContacts}
                disabled={isLoading}
                className="px-3 py-2.5 rounded-lg bg-[#14141A] border border-white/10 hover:border-white/30 text-slate-300 hover:text-white text-xs font-mono-lux flex items-center gap-1.5 transition-all"
                title="Tải lại danh sách từ máy chủ"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                Làm Mới
              </button>

              <div className="px-3 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-mono-lux font-bold rounded-lg text-xs flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>TB: {avgScore}/100đ</span>
              </div>
            </div>
          </div>

          {/* Stat KPI Cards (Click để lọc nhanh) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => { setFilterTier(''); setFilterStatus(''); }}
              className={`p-4 rounded-lg border cursor-pointer transition-all space-y-1 ${
                !filterTier && !filterStatus ? 'bg-[#14141A] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.15)]' : 'bg-[#0E0E12] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-mono-lux">Tổng Số Khách Hàng</span>
                <Users className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <p className="font-mono-lux text-2xl font-bold text-white">{scoredContacts.length}</p>
              <span className="text-[10px] text-slate-500">Tất cả nguồn đổ về MongoDB</span>
            </div>

            <div
              onClick={() => setFilterTier(filterTier === 'HOT' ? '' : 'HOT')}
              className={`p-4 rounded-lg border cursor-pointer transition-all space-y-1 ${
                filterTier === 'HOT' ? 'bg-rose-500/20 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)]' : 'bg-[#0E0E12] border-rose-500/30 hover:border-rose-500/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-rose-400 text-xs font-mono-lux flex items-center gap-1">
                  🔴 HOT Leads (≥ 70đ)
                </span>
                <Flame className="w-4 h-4 text-rose-500" />
              </div>
              <p className="font-mono-lux text-2xl font-bold text-rose-400">{hotCount}</p>
              <span className="text-[10px] text-rose-400/70">Ưu tiên gọi lại trong 15 phút</span>
            </div>

            <div
              onClick={() => setFilterTier(filterTier === 'WARM' ? '' : 'WARM')}
              className={`p-4 rounded-lg border cursor-pointer transition-all space-y-1 ${
                filterTier === 'WARM' ? 'bg-amber-500/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-[#0E0E12] border-amber-500/30 hover:border-amber-500/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-amber-400 text-xs font-mono-lux flex items-center gap-1">
                  🟡 WARM Leads (40-69đ)
                </span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <p className="font-mono-lux text-2xl font-bold text-amber-400">{warmCount}</p>
              <span className="text-[10px] text-amber-400/70">Liên hệ tư vấn trong 2 giờ</span>
            </div>

            <div
              onClick={() => setFilterTier(filterTier === 'COLD' ? '' : 'COLD')}
              className={`p-4 rounded-lg border cursor-pointer transition-all space-y-1 ${
                filterTier === 'COLD' ? 'bg-slate-500/20 border-slate-400 shadow-[0_0_15px_rgba(148,163,184,0.2)]' : 'bg-[#0E0E12] border-slate-500/30 hover:border-slate-500/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-mono-lux flex items-center gap-1">
                  🔵 COLD Leads (&lt; 40đ)
                </span>
                <Target className="w-4 h-4 text-slate-400" />
              </div>
              <p className="font-mono-lux text-2xl font-bold text-slate-400">{coldCount}</p>
              <span className="text-[10px] text-slate-500">Nuôi dưỡng tự động qua Email</span>
            </div>
          </div>

          {/* BỘ NÚT PHÂN LOẠI & KIỂM SOÁT ĐA CHIỀU (Classification Toolbar) */}
          <div className="bg-[#0E0E12] border border-white/10 p-5 rounded-xl space-y-4 shadow-lg">
            {/* Hàng 1: Nút Phân Loại Theo Hạng Lead */}
            <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-white/5">
              <span className="text-[11px] font-mono-lux text-slate-400 uppercase tracking-wider flex items-center gap-1 min-w-[130px]">
                <Layers className="w-3.5 h-3.5 text-[#D4AF37]" /> Phân Hạng:
              </span>
              {[
                { id: '', label: `Tất Cả (${scoredContacts.length})` },
                { id: 'HOT', label: `🔴 HOT Lead (≥70đ) (${hotCount})` },
                { id: 'WARM', label: `🟡 WARM Lead (40-69đ) (${warmCount})` },
                { id: 'COLD', label: `🔵 COLD Lead (<40đ) (${coldCount})` },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setFilterTier(btn.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono-lux transition-all ${
                    filterTier === btn.id
                      ? 'bg-[#D4AF37] text-black font-bold shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                      : 'bg-[#14141A] text-slate-400 hover:text-white border border-white/5 hover:border-white/20'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Hàng 2: Nút Phân Loại Theo Dòng Siêu Xe */}
            <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-white/5">
              <span className="text-[11px] font-mono-lux text-slate-400 uppercase tracking-wider flex items-center gap-1 min-w-[130px]">
                <Car className="w-3.5 h-3.5 text-[#D4AF37]" /> Dòng Siêu Xe:
              </span>
              {[
                { id: '', label: 'Tất Cả Hãng' },
                { id: 'ferrari', label: '🏎️ Ferrari' },
                { id: 'lamborghini', label: '🐂 Lamborghini' },
                { id: 'rolls-royce', label: '🏛️ Rolls-Royce' },
                { id: 'porsche', label: '🏁 Porsche' },
                { id: 'bentley', label: '👑 Bentley & Maybach' },
                { id: 'other', label: '⚡ McLaren / Bugatti' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setFilterBrand(btn.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono-lux transition-all ${
                    filterBrand === btn.id
                      ? 'bg-[#D4AF37] text-black font-bold shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                      : 'bg-[#14141A] text-slate-400 hover:text-white border border-white/5 hover:border-white/20'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Hàng 3: Tìm Kiếm, Trạng Thái, Sắp Xếp & Reset */}
            <div className="flex flex-col lg:flex-row gap-3 items-center justify-between pt-1">
              {/* Ô tìm kiếm */}
              <div className="relative flex-1 w-full max-w-md">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm theo tên, SĐT, Email, mẫu xe, nội dung..."
                  className="w-full bg-[#14141A] border border-white/10 rounded-lg pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:border-[#D4AF37] outline-none transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Bộ chọn Trạng thái & Sắp xếp */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
                {/* Trạng thái Buttons */}
                <div className="flex items-center gap-1 bg-[#14141A] p-1 rounded-lg border border-white/10">
                  {[
                    { value: '', label: 'Tất Cả' },
                    { value: 'new', label: `Mới (${newCount})` },
                    { value: 'contacted', label: `Đã LH (${contactedCount})` },
                    { value: 'closed', label: `Xong (${closedCount})` },
                  ].map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setFilterStatus(tab.value)}
                      className={`px-2.5 py-1 text-[11px] font-mono-lux rounded transition-all whitespace-nowrap ${
                        filterStatus === tab.value
                          ? 'bg-[#D4AF37] text-black font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Sắp xếp Dropdown */}
                <div className="flex items-center gap-1.5 bg-[#14141A] px-2.5 py-1 rounded-lg border border-white/10">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-xs font-mono-lux text-slate-300 outline-none cursor-pointer"
                  >
                    <option value="score_desc" className="bg-[#14141A] text-white">Điểm Lead Cao Nhất ⬇</option>
                    <option value="score_asc" className="bg-[#14141A] text-white">Điểm Lead Thấp Nhất ⬆</option>
                    <option value="date_desc" className="bg-[#14141A] text-white">Mới Nhất Trước ⬇</option>
                    <option value="date_asc" className="bg-[#14141A] text-white">Cũ Nhất Trước ⬆</option>
                  </select>
                </div>

                {/* Reset Filters */}
                {(filterTier || filterBrand || filterStatus || search || sortBy !== 'score_desc') && (
                  <button
                    onClick={handleResetFilters}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-mono-lux flex items-center gap-1 transition-all"
                    title="Xóa tất cả bộ lọc đang áp dụng"
                  >
                    <X className="w-3.5 h-3.5" />
                    Xóa Lọc
                  </button>
                )}
              </div>
            </div>

            {/* Dòng kết quả bộ lọc */}
            <div className="flex items-center justify-between text-[11px] font-mono-lux text-slate-400 pt-1">
              <span>
                Đang hiển thị <strong className="text-white">{sortedContacts.length}</strong> / <span className="text-[#D4AF37]">{scoredContacts.length}</span> hồ sơ khách hàng
              </span>
              {(filterTier || filterBrand || filterStatus || search) && (
                <span className="text-[#D4AF37] flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Đang áp dụng bộ lọc phân loại
                </span>
              )}
            </div>
          </div>

          {/* DataTable - sorted highest score first */}
          <DataTable
            columns={columns}
            data={sortedContacts}
            isLoading={isLoading}
            emptyMessage="Chưa có yêu cầu liên hệ nào phù hợp với bộ lọc"
            actions={(item) => (
              <div className="flex items-center justify-end gap-1.5">
                <button
                  onClick={() => setSelectedScoreLead(item)}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-[#D4AF37] text-[11px] font-mono-lux rounded transition-colors flex items-center gap-1"
                  title="Xem chi tiết chấm điểm"
                >
                  <Award className="w-3 h-3" />
                  Điểm
                </button>

                <button
                  onClick={() => {
                    setSelectedEmailLead(item);
                    setCopiedEmail(false);
                  }}
                  className="px-2 py-1 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-mono-lux rounded transition-colors flex items-center gap-1"
                  title="Soạn Email tư vấn cá nhân hóa (TX6)"
                >
                  <Mail className="w-3 h-3" />
                  Email VIP
                </button>

                {(item.status === 'new' || !item.status) && (
                  <button
                    onClick={() => handleUpdateStatus(item._id, 'contacted')}
                    disabled={actionId === item._id}
                    className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 text-blue-400 text-[11px] font-mono-lux rounded transition-colors flex items-center gap-1"
                  >
                    <UserCheck className="w-3 h-3" />
                    Đã Liên Hệ
                  </button>
                )}

                {item.status !== 'closed' && (
                  <button
                    onClick={() => handleUpdateStatus(item._id, 'closed')}
                    disabled={actionId === item._id}
                    className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-mono-lux rounded transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Hoàn Thành
                  </button>
                )}

                <button
                  onClick={() => handleDelete(item._id)}
                  disabled={actionId === item._id}
                  className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-[11px] font-mono-lux rounded transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}
          />

          {/* Modal Xem Chi Tiết Chấm Điểm 4 Nhóm Tiêu Chí */}
          {selectedScoreLead && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#0E0E12] border border-[#D4AF37]/30 rounded-xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
                <button
                  onClick={() => setSelectedScoreLead(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>

                <div>
                  <span className="eyebrow text-[#D4AF37] text-[10px] tracking-[0.2em] font-mono-lux uppercase">
                    CHI TIẾT ĐÁNH GIÁ CHẤT LƯỢNG LEAD
                  </span>
                  <h3 className="font-serif-lux text-xl font-bold text-white mt-1">
                    {selectedScoreLead.name || 'Khách Hàng VIP'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono-lux">
                    {selectedScoreLead.phone} {selectedScoreLead.email ? `• ${selectedScoreLead.email}` : ''}
                  </p>
                </div>

                {/* Tổng Điểm & Xếp Loại */}
                <div className={`p-4 rounded-lg border flex items-center justify-between ${selectedScoreLead.scoreData.bgColor} ${selectedScoreLead.scoreData.borderColor}`}>
                  <div>
                    <span className="text-[10px] uppercase font-mono-lux text-slate-400">Xếp Hạng Phân Loại</span>
                    <h4 className="font-mono-lux font-bold text-lg text-white flex items-center gap-1.5">
                      <span>{selectedScoreLead.scoreData.emoji}</span>
                      <span>{selectedScoreLead.scoreData.fullName}</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">{selectedScoreLead.scoreData.slaAction}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono-lux text-3xl font-bold text-[#D4AF37]">
                      {selectedScoreLead.scoreData.totalScore}
                    </span>
                    <span className="text-xs text-slate-400 font-mono-lux">/100</span>
                  </div>
                </div>

                {/* 4 Nhóm Tiêu Chí */}
                <div className="space-y-3">
                  <h5 className="text-xs font-mono-lux uppercase text-slate-400 font-bold">
                    Bảng Phân Tích 4 Nhóm Điểm (Breakdown):
                  </h5>

                  {/* 1. Định danh */}
                  <div className="bg-[#14141A] p-3 rounded border border-white/5 space-y-1">
                    <div className="flex justify-between text-xs font-mono-lux">
                      <span className="text-slate-300">1. Thông Tin Định Danh & SĐT/Email</span>
                      <span className="font-bold text-[#D4AF37]">
                        {selectedScoreLead.scoreData.breakdown.identity.score} / {selectedScoreLead.scoreData.breakdown.identity.max}đ
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex flex-wrap gap-1.5">
                      {selectedScoreLead.scoreData.breakdown.identity.details.map((d, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-400">
                          ✓ {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 2. Nhu cầu xe */}
                  <div className="bg-[#14141A] p-3 rounded border border-white/5 space-y-1">
                    <div className="flex justify-between text-xs font-mono-lux">
                      <span className="text-slate-300">2. Giá Trị Xe & Yêu Cầu Bespoke</span>
                      <span className="font-bold text-[#D4AF37]">
                        {selectedScoreLead.scoreData.breakdown.car.score} / {selectedScoreLead.scoreData.breakdown.car.max}đ
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex flex-wrap gap-1.5">
                      {selectedScoreLead.scoreData.breakdown.car.details.map((d, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-400">
                          ✓ {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 3. Ý định mua */}
                  <div className="bg-[#14141A] p-3 rounded border border-white/5 space-y-1">
                    <div className="flex justify-between text-xs font-mono-lux">
                      <span className="text-slate-300">3. Ý Định Mua Hàng & Từ Khóa Cọc/Hẹn</span>
                      <span className="font-bold text-[#D4AF37]">
                        {selectedScoreLead.scoreData.breakdown.intent.score} / {selectedScoreLead.scoreData.breakdown.intent.max}đ
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex flex-wrap gap-1.5">
                      {selectedScoreLead.scoreData.breakdown.intent.details.map((d, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-400">
                          ✓ {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 4. Nguồn Lead */}
                  <div className="bg-[#14141A] p-3 rounded border border-white/5 space-y-1">
                    <div className="flex justify-between text-xs font-mono-lux">
                      <span className="text-slate-300">4. Nguồn Thu Thập & Kênh Phát Sinh</span>
                      <span className="font-bold text-[#D4AF37]">
                        {selectedScoreLead.scoreData.breakdown.source.score} / {selectedScoreLead.scoreData.breakdown.source.max}đ
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex flex-wrap gap-1.5">
                      {selectedScoreLead.scoreData.breakdown.source.details.map((d, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-400">
                          ✓ {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setSelectedScoreLead(null)}
                    className="btn-lux-gold px-4 py-2 text-xs font-mono-lux"
                  >
                    Đóng Bảng Đánh Giá
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Soạn Email Tư Vấn Cá Nhân Hóa VIP (TX6 Generator) */}
          {selectedEmailLead && (() => {
            const emailData = generatePersonalizedEmail(selectedEmailLead);
            return (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#0E0E12] border border-[#D4AF37]/40 rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] flex flex-col">
                  <button
                    onClick={() => setSelectedEmailLead(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div>
                    <span className="eyebrow text-[#D4AF37] text-[10px] tracking-[0.2em] font-mono-lux uppercase flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> AI EMAIL MARKETING GENERATOR (TX6)
                    </span>
                    <h3 className="font-serif-lux text-xl font-bold text-white mt-1">
                      Thư Tư Vấn VIP Cá Nhân Hóa
                    </h3>
                    <p className="text-xs text-slate-400 font-mono-lux">
                      Người nhận: <strong className="text-white">{selectedEmailLead.name}</strong> • Email: <strong className="text-[#D4AF37]">{selectedEmailLead.email || 'Chưa cập nhật email'}</strong>
                    </p>
                  </div>

                  {/* Subject Line */}
                  <div className="bg-[#14141A] p-3 rounded border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono-lux text-slate-400 uppercase">Tiêu Đề Email (Subject):</span>
                    <p className="text-xs font-semibold text-[#D4AF37] select-all">
                      {emailData.subject}
                    </p>
                  </div>

                  {/* Email Body */}
                  <div className="bg-[#14141A] p-4 rounded border border-white/10 flex-1 overflow-y-auto font-sans text-xs text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
                    {emailData.body}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/10 shrink-0">
                    <span className="text-[10px] text-slate-400 font-mono-lux">
                      {copiedEmail ? '✅ Đã sao chép vào bộ nhớ tạm!' : '💡 Bấm sao chép để dán vào Outlook / Gmail'}
                    </span>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          const fullEmail = `Tiêu đề: ${emailData.subject}\n\n${emailData.body}`;
                          navigator.clipboard.writeText(fullEmail);
                          setCopiedEmail(true);
                          setTimeout(() => setCopiedEmail(false), 3000);
                        }}
                        className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-mono-lux transition-colors"
                      >
                        {copiedEmail ? '✓ Đã Sao Chép' : '📋 Sao Chép'}
                      </button>

                      {selectedEmailLead.email && (
                        <>
                          <a
                            href={`mailto:${selectedEmailLead.email}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`}
                            onClick={() => {
                              handleUpdateStatus(selectedEmailLead._id, 'contacted');
                              setSelectedEmailLead(null);
                            }}
                            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono-lux flex items-center gap-1.5 border border-white/10"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Mở Ứng Dụng Mail
                          </a>

                          <button
                            onClick={async () => {
                              setIsSendingReply(true);
                              try {
                                await api.post(`/contacts/${selectedEmailLead._id}/reply`, {
                                  subject: emailData.subject,
                                  replyMessage: emailData.body,
                                });
                                alert(`🎉 Đã gửi email phản hồi thành công qua máy chủ Gmail tới: ${selectedEmailLead.email}`);
                                setSelectedEmailLead(null);
                                fetchContacts();
                              } catch (err) {
                                alert('❌ Không thể gửi email: ' + (err?.response?.data?.message || err.message));
                              } finally {
                                setIsSendingReply(false);
                              }
                            }}
                            disabled={isSendingReply}
                            className="btn-lux-gold px-4 py-2 text-xs font-mono-lux font-bold flex items-center gap-1.5 disabled:opacity-50"
                          >
                            <Send className="w-3.5 h-3.5" />
                            {isSendingReply ? 'Đang Gửi Gmail...' : 'Gửi Gmail Trực Tiếp (SMTP)'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </main>
      </div>
    </div>
  );
}

