import { useState, useEffect, useCallback, useMemo } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import api from '@/services/api';
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
  Send,
} from 'lucide-react';

const STATUS_CFG = {
  new: {
    label: 'Mới - Chờ Liên Hệ',
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
  contacted: {
    label: 'Đã Liên Hệ Tư Vấn',
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
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [actionId, setActionId] = useState(null);

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

  const filteredContacts = useMemo(() => {
    return contacts.filter((item) => {
      const matchSearch =
        !search ||
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.phone?.includes(search) ||
        item.email?.toLowerCase().includes(search.toLowerCase()) ||
        item.message?.toLowerCase().includes(search.toLowerCase());

      const matchStatus = !filterStatus || item.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [contacts, search, filterStatus]);

  const newCount = useMemo(() => contacts.filter((c) => c.status === 'new' || !c.status).length, [contacts]);
  const contactedCount = useMemo(() => contacts.filter((c) => c.status === 'contacted').length, [contacts]);
  const closedCount = useMemo(() => contacts.filter((c) => c.status === 'closed').length, [contacts]);

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

  const columns = [
    {
      key: 'name',
      label: 'Họ và Tên Khách Hàng',
      render: (item) => (
        <div className="space-y-0.5">
          <p className="font-bold text-white text-xs">{item.name || 'Khách quan tâm'}</p>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono-lux">
            <span className="flex items-center gap-1 text-[#D4AF37]">
              <Phone className="w-2.5 h-2.5" />
              {item.phone || 'N/A'}
            </span>
            {item.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-2.5 h-2.5" />
                {item.email}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'message',
      label: 'Nội Dung Yêu Cầu Tư Vấn',
      render: (item) => (
        <div className="max-w-xs space-y-1">
          {item.subject && (
            <span className="inline-block px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono-lux text-[#D4AF37]">
              {item.subject}
            </span>
          )}
          <p className="text-xs text-slate-300 italic line-clamp-2" title={item.message}>
            "{item.message || 'Yêu cầu tư vấn mua siêu xe'}"
          </p>
        </div>
      ),
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
      label: 'Trạng Thái',
      render: (item) => {
        const cfg = STATUS_CFG[item.status] || STATUS_CFG.new;
        return (
          <span className={`px-2.5 py-1 rounded text-[10px] font-mono-lux border ${cfg.color}`}>
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
        <AdminHeader title="Quản Lý Yêu Cầu Liên Hệ & Khách Hàng (Leads)" />

        <main style={{ padding: '32px 36px', flex: 1 }} className="space-y-6">
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="eyebrow text-[#D4AF37] text-[10px] tracking-[0.2em] font-mono-lux uppercase">
                GUEST LEADS & CONCIERGE INQUIRIES
              </span>
              <h1 className="font-serif-lux text-3xl font-bold text-white mt-1">
                Yêu Cầu Liên Hệ <span className="text-[#D4AF37] italic">Khách Vãng Lai</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Quản lý các tin nhắn tư vấn gửi trực tiếp từ trang Contact và AI Chatbot.
              </p>
            </div>
          </div>

          {/* Stat KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0E0E12] border border-white/10 rounded-lg p-4 space-y-1">
              <span className="text-slate-400 text-xs font-mono-lux">Tổng Yêu Cầu Gửi Đội Ngũ</span>
              <p className="font-mono-lux text-2xl font-bold text-white">{contacts.length}</p>
              <span className="text-[10px] text-slate-500">Tin nhắn khách vãng lai</span>
            </div>

            <div className="bg-[#0E0E12] border border-amber-500/30 rounded-lg p-4 space-y-1">
              <span className="text-amber-400 text-xs font-mono-lux">Mới - Chờ Liên Hệ</span>
              <p className="font-mono-lux text-2xl font-bold text-amber-400">{newCount}</p>
              <span className="text-[10px] text-amber-400/70">Cần tư vấn ngay</span>
            </div>

            <div className="bg-[#0E0E12] border border-blue-500/30 rounded-lg p-4 space-y-1">
              <span className="text-blue-400 text-xs font-mono-lux">Đã Liên Hệ Tư Vấn</span>
              <p className="font-mono-lux text-2xl font-bold text-blue-400">{contactedCount}</p>
              <span className="text-[10px] text-slate-500">Đã gọi điện / gửi mail</span>
            </div>

            <div className="bg-[#0E0E12] border border-emerald-500/30 rounded-lg p-4 space-y-1">
              <span className="text-emerald-400 text-xs font-mono-lux">Đã Hoàn Thành</span>
              <p className="font-mono-lux text-2xl font-bold text-emerald-400">{closedCount}</p>
              <span className="text-[10px] text-slate-500">Đã giải đáp nhu cầu</span>
            </div>
          </div>

          {/* Toolbar Search & Tabs */}
          <div className="bg-[#0E0E12] border border-white/10 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên khách, SĐT, Email, nội dung..."
                className="w-full bg-[#14141A] border border-white/10 rounded pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-[#D4AF37] outline-none"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              {[
                { value: '', label: 'Tất Cả' },
                { value: 'new', label: 'Mới' },
                { value: 'contacted', label: 'Đã Liên Hệ' },
                { value: 'closed', label: 'Hoàn Thành' },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilterStatus(tab.value)}
                  className={`px-3 py-1.5 text-xs font-mono-lux rounded transition-all whitespace-nowrap ${
                    filterStatus === tab.value
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'bg-[#14141A] text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* DataTable */}
          <DataTable
            columns={columns}
            data={filteredContacts}
            isLoading={isLoading}
            emptyMessage="Chưa có yêu cầu liên hệ nào từ khách vãng lai"
            actions={(item) => (
              <div className="flex items-center justify-end gap-1.5">
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
        </main>
      </div>
    </div>
  );
}
