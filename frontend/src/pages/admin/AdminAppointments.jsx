import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import api from '@/services/api';
import { Calendar, Clock, CheckCircle2, XCircle, CheckSquare, UserCheck, Phone, Mail } from 'lucide-react';

const STATUS_CFG = {
  pending: { label: 'Chờ Xử Lý', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  confirmed: { label: 'Đã Xác Nhận', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  completed: { label: 'Hoàn Thành', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  cancelled: { label: 'Đã Hủy', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

const FILTER_TABS = [
  { value: '', label: 'Tất Cả Lịch Hẹn' },
  { value: 'pending', label: 'Chờ Xử Lý' },
  { value: 'confirmed', label: 'Đã Xác Nhận' },
  { value: 'completed', label: 'Hoàn Thành' },
  { value: 'cancelled', label: 'Đã Hủy' },
];

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [actionId, setActionId] = useState(null);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = filterStatus ? { status: filterStatus } : {};
      const res = await api.get('/appointments', { params });
      setAppointments(res.data || res || []);
    } catch (err) {
      console.error('Lỗi lấy lịch hẹn:', err);
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleUpdateStatus = async (id, status) => {
    setActionId(id);
    try {
      await api.put(`/appointments/${id}`, { status });
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
    } catch (err) {
      alert(err.message || 'Cập nhật trạng thái thất bại');
    } finally {
      setActionId(null);
    }
  };

  const columns = [
    {
      key: 'visitorName',
      label: 'Khách Hàng',
      render: (a) => (
        <div className="space-y-0.5">
          <p className="font-semibold text-white text-xs">{a.visitorName || 'Khách quan tâm'}</p>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono-lux">
            <span className="flex items-center gap-1 text-[#D4AF37]"><Phone className="w-2.5 h-2.5" />{a.visitorPhone}</span>
            {a.visitorEmail && <span className="flex items-center gap-1"><Mail className="w-2.5 h-2.5" />{a.visitorEmail}</span>}
          </div>
        </div>
      ),
    },
    {
      key: 'car',
      label: 'Siêu Xe Muốn Xem',
      render: (a) => (
        <div className="flex items-center gap-2.5">
          <img
            src={a.car?.mainImage || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=200'}
            alt=""
            className="w-10 h-7 object-cover rounded border border-white/10"
          />
          <div>
            <p className="text-xs text-white font-medium">{a.car?.name || 'Siêu xe Showroom'}</p>
            <p className="text-[10px] text-slate-400 font-mono-lux">{a.car?.model || 'Thượng hạng'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'appointmentDate',
      label: 'Thời Gian Lịch Hẹn',
      render: (a) => (
        <div className="text-xs font-mono-lux space-y-0.5">
          <p className="text-slate-200 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#D4AF37]" />
            {new Date(a.appointmentDate).toLocaleDateString('vi-VN')}
          </p>
          <p className="text-slate-400 flex items-center gap-1 text-[10px]">
            <Clock className="w-3 h-3 text-slate-500" />
            Khung giờ: {a.timeSlot}
          </p>
        </div>
      ),
    },
    {
      key: 'notes',
      label: 'Ghi Chú Yêu Cầu',
      render: (a) => (
        <span className="text-xs text-slate-300 italic max-w-[200px] truncate block" title={a.notes}>
          {a.notes || 'Không có ghi chú'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Trạng Thái',
      render: (a) => {
        const cfg = STATUS_CFG[a.status] || STATUS_CFG.pending;
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
        <AdminHeader title="Quản Lý Lịch Hẹn Xem Xe" />

        <main style={{ padding: '32px 36px', flex: 1 }} className="space-y-6">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="eyebrow text-[#D4AF37] text-[10px] tracking-[0.2em] font-mono-lux uppercase">
                SHOWROOM APPOINTMENT SCHEDULER
              </span>
              <h1 className="font-serif-lux text-3xl font-bold text-white mt-1">
                Lịch Hẹn Trải Nghiệm <span className="text-[#D4AF37] italic">Siêu Xe</span>
              </h1>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilterStatus(tab.value)}
                className={`px-4 py-2 text-xs font-mono-lux rounded transition-all whitespace-nowrap ${
                  filterStatus === tab.value
                    ? 'bg-[#D4AF37] text-black font-bold shadow-lg shadow-[#D4AF37]/10'
                    : 'bg-[#0E0E12] text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Table Container */}
          <DataTable
            columns={columns}
            data={appointments}
            isLoading={isLoading}
            emptyMessage="Không có lịch hẹn xem xe nào"
              actions={(a) => (
                <div className="flex items-center justify-end gap-1.5">
                  {a.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(a._id, 'confirmed')}
                      disabled={actionId === a._id}
                      className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 text-blue-400 text-[11px] font-mono-lux rounded transition-colors flex items-center gap-1"
                    >
                      <UserCheck className="w-3 h-3" />
                      Duyệt
                    </button>
                  )}
                  {a.status === 'confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(a._id, 'completed')}
                      disabled={actionId === a._id}
                      className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-mono-lux rounded transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Hoàn Tất
                    </button>
                  )}
                  {a.status !== 'cancelled' && a.status !== 'completed' && (
                    <button
                      onClick={() => handleUpdateStatus(a._id, 'cancelled')}
                      disabled={actionId === a._id}
                      className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-[11px] font-mono-lux rounded transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-3 h-3" />
                      Hủy
                    </button>
                  )}
                </div>
              )}
            />
          </main>
      </div>
    </div>
  );
}