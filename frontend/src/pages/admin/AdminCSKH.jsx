import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import api from '@/services/api';
import {
  Headphones,
  Calendar,
  PhoneCall,
  MessageSquare,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  AlertTriangle,
  Send,
  Sparkles,
  Search,
  Filter,
  RefreshCw,
} from 'lucide-react';

export default function AdminCSKH() {
  const [appointments, setAppointments] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'contacts' | 'complaints'
  const [callLogModal, setCallLogModal] = useState(null);
  const [callNoteText, setCallNoteText] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [apptRes, contactRes] = await Promise.allSettled([
        api.get('/appointments'),
        api.get('/contacts'),
      ]);

      const apptList = apptRes.status === 'fulfilled' ? apptRes.value?.data || apptRes.value || [] : [];
      const contactList = contactRes.status === 'fulfilled'
        ? Array.isArray(contactRes.value?.data) ? contactRes.value.data : Array.isArray(contactRes.value) ? contactRes.value : []
        : [];

      setAppointments(Array.isArray(apptList) ? apptList : []);
      setContacts(contactList);
    } catch (err) {
      console.error('Lỗi tải dữ liệu CSKH:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Cập nhật trạng thái lịch hẹn Concierge trên MongoDB
  const handleUpdateApptStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      try {
        await api.put(`/appointments/${id}`, { status: newStatus });
      } catch {
        await api.patch(`/appointments/${id}`, { status: newStatus });
      }

      showToast(`✅ Đã cập nhật trạng thái lịch hẹn Concierge sang "${newStatus === 'confirmed' ? 'Đã xác nhận' : newStatus === 'completed' ? 'Hoàn thành' : 'Đã hủy'}" thành công!`);
      await fetchData();
    } catch (err) {
      showToast(`⚠️ Không thể cập nhật lịch hẹn: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Lưu nhật ký gọi điện tư vấn CSKH lên MongoDB
  const handleSaveCallNote = async () => {
    if (!callLogModal || !callNoteText.trim()) return;
    setUpdatingId(callLogModal._id);

    try {
      if (callLogModal.visitorName) {
        // Lịch hẹn Appointment
        await api.put(`/appointments/${callLogModal._id}`, { adminNotes: callNoteText, status: 'confirmed' });
      } else {
        // Lead Contact
        await api.put(`/contacts/${callLogModal._id}`, { notes: callNoteText, status: 'contacted' });
      }

      showToast(`✅ Đã lưu nhật ký gọi điện CSKH cho khách hàng "${callLogModal.name || callLogModal.visitorName}"!`);
      setCallLogModal(null);
      setCallNoteText('');
      await fetchData();
    } catch (err) {
      showToast(`⚠️ Không thể lưu nhật ký cuộc gọi: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredAppointments = appointments.filter((a) =>
    !search ||
    a.visitorName?.toLowerCase().includes(search.toLowerCase()) ||
    a.visitorPhone?.includes(search) ||
    a.car?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredContacts = contacts.filter((c) =>
    !search ||
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search) ||
    c.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#070709', color: '#E2E8F0' }}>
      <AdminSidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminHeader title="Trung Tâm Chăm Sóc Khách Hàng (CSKH Center)" />

        <main style={{ padding: '32px 36px', flex: 1 }} className="space-y-6">
          {/* Toast Notification Banner */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 bg-[#14141C] border border-emerald-400 text-emerald-300 font-mono-lux text-xs rounded-xl shadow-2xl flex items-center justify-between"
              >
                <span>{toastMessage}</span>
                <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white font-bold ml-4">✕</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header Banner */}
          <div className="relative bg-[#0E0E12] border border-emerald-500/40 rounded-xl p-6 sm:p-8 overflow-hidden shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono-lux text-xs font-bold inline-flex items-center gap-1.5">
                  <Headphones className="w-4 h-4" />
                  CHUYÊN VIÊN CSKH CONCIERGE WORKSTATION
                </span>
                <h1 className="font-serif-lux text-3xl font-bold text-white">
                  Quản Lý Lịch Hẹn Đón Tiếp <span className="text-emerald-400 italic">& Nhật Ký Chăm Sóc KH</span>
                </h1>
                <p className="text-xs text-slate-400 max-w-2xl">
                  Tiếp nhận thông tin khách hàng từ form Contact, xác nhận lịch lái thử tận nơi, gọi điện tư vấn chăm sóc và xử lý khiếu nại phản hồi.
                </p>
              </div>

              <button
                onClick={fetchData}
                disabled={isLoading}
                className="px-4 py-2.5 bg-[#14141C] hover:bg-[#1E1E2A] border border-emerald-500/30 text-emerald-400 rounded-lg font-mono-lux text-xs flex items-center gap-2 transition-all shadow"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Đồng Bộ MongoDB</span>
              </button>
            </div>

            {/* Scope Alert Box */}
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded text-[11px] font-mono-lux text-emerald-300 flex items-center justify-between">
              <span>🔒 Chức năng phạm vi CSKH: Xem & gọi chăm sóc khách hàng, quản lý lịch hẹn Concierge và lưu nhật ký phản hồi trực tiếp MongoDB.</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Lưu Vĩnh Viễn</span>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('appointments')}
                className={`px-4 py-2 text-xs font-mono-lux rounded transition-all flex items-center gap-2 ${
                  activeTab === 'appointments'
                    ? 'bg-emerald-500 text-black font-bold shadow'
                    : 'bg-[#14141C] text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Lịch Hẹn Concierge ({appointments.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('contacts')}
                className={`px-4 py-2 text-xs font-mono-lux rounded transition-all flex items-center gap-2 ${
                  activeTab === 'contacts'
                    ? 'bg-emerald-500 text-black font-bold shadow'
                    : 'bg-[#14141C] text-slate-400 hover:text-white'
                }`}
              >
                <PhoneCall className="w-4 h-4" />
                <span>Danh Sách Gọi Chăm Sóc ({contacts.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('complaints')}
                className={`px-4 py-2 text-xs font-mono-lux rounded transition-all flex items-center gap-2 ${
                  activeTab === 'complaints'
                    ? 'bg-emerald-500 text-black font-bold shadow'
                    : 'bg-[#14141C] text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Tiếp Nhận Phản Hồi</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm tên khách, SĐT..."
                className="w-full bg-[#14141C] border border-white/10 rounded pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* TAB 1: LỊCH HẸN CONCIERGE */}
          {activeTab === 'appointments' && (
            <div className="space-y-4">
              {filteredAppointments.length === 0 ? (
                <div className="p-12 text-center text-xs font-mono-lux text-slate-500 bg-[#0E0E12] border border-white/10 rounded-lg">
                  Không có lịch hẹn nào khớp với điều kiện lọc
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAppointments.map((appt) => (
                    <div
                      key={appt._id}
                      className="bg-[#0E0E12] border border-white/10 hover:border-emerald-500/40 rounded-xl p-5 space-y-4 transition-all shadow-lg"
                    >
                      <div className="flex items-start justify-between border-b border-white/10 pb-3">
                        <div>
                          <h4 className="font-bold text-white text-sm flex items-center gap-2">
                            <User className="w-4 h-4 text-emerald-400" />
                            <span>{appt.visitorName || 'Khách VIP Luxe'}</span>
                          </h4>
                          <p className="text-xs font-mono-lux text-emerald-400 font-bold mt-0.5">
                            SĐT: {appt.visitorPhone || '0966 778 899'}
                          </p>
                        </div>

                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-mono-lux font-bold border ${
                            appt.status === 'confirmed'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                              : appt.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : appt.status === 'cancelled'
                              ? 'bg-red-500/10 text-red-400 border-red-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {appt.status === 'confirmed'
                            ? 'Đã Xác Nhận Lịch'
                            : appt.status === 'completed'
                            ? 'Đã Hoàn Thành Đón Tiếp'
                            : appt.status === 'cancelled'
                            ? 'Khách Hủy Lịch'
                            : 'Chờ CSKH Gọi Xác Nhận'}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300">
                        <p className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Thời gian: <strong className="text-white font-mono-lux">{appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleDateString('vi-VN') : 'Hôm nay'} ({appt.timeSlot || '10:00'})</strong></span>
                        </p>
                        <p className="text-slate-400">
                          Mẫu xe muốn lái thử: <strong className="text-[#D4AF37]">{appt.car?.name || appt.carName || 'Ferrari SF90 Stradale'}</strong>
                        </p>
                        {appt.notes && <p className="italic text-slate-400 bg-white/5 p-2 rounded border border-white/5">"{appt.notes}"</p>}
                        {appt.adminNotes && <p className="text-emerald-400 font-mono-lux text-[11px] font-bold">Ghi chú CSKH: "{appt.adminNotes}"</p>}
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                        <button
                          onClick={() => setCallLogModal(appt)}
                          className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-xs font-mono-lux transition-all flex items-center gap-1.5 font-bold"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Gọi Điện CSKH</span>
                        </button>

                        {appt.status !== 'confirmed' && (
                          <button
                            onClick={() => handleUpdateApptStatus(appt._id, 'confirmed')}
                            disabled={updatingId === appt._id}
                            className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-xs font-mono-lux transition-all font-bold"
                          >
                            Xác Nhận Lịch
                          </button>
                        )}

                        {appt.status !== 'completed' && (
                          <button
                            onClick={() => handleUpdateApptStatus(appt._id, 'completed')}
                            disabled={updatingId === appt._id}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded text-xs font-mono-lux transition-all"
                          >
                            ✓ Hoàn Thành
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DANH SÁCH GỌI CHĂM SÓC */}
          {activeTab === 'contacts' && (
            <div className="bg-[#0E0E12] border border-white/10 rounded-xl p-6 space-y-4 shadow-xl">
              <h3 className="font-serif-lux text-xl font-bold text-white flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-emerald-400" />
                <span>Danh Sách Khách Hàng Cần Gọi Chăm Sóc (Form Contact Gửi Về MongoDB)</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#14141C] text-slate-400 font-mono-lux uppercase text-[10px] tracking-wider border-b border-white/10">
                    <tr>
                      <th className="p-3">Họ và Tên Khách</th>
                      <th className="p-3">Số Điện Thoại</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Nhu Cầu Đăng Ký</th>
                      <th className="p-3">Nội Dung Yêu Cầu</th>
                      <th className="p-3 text-right">Thao Tác CSKH</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {filteredContacts.map((c) => (
                      <tr key={c._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-3 font-bold text-white">{c.name || 'Khách quan tâm'}</td>
                        <td className="p-3 font-mono-lux text-emerald-400 font-bold">{c.phone || 'N/A'}</td>
                        <td className="p-3 text-slate-400">{c.email || 'N/A'}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono-lux text-[#D4AF37]">
                            {c.subject || c.interest || 'Tư vấn mua xe'}
                          </span>
                        </td>
                        <td className="p-3 italic text-slate-400 max-w-xs truncate">"{c.message}"</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setCallLogModal(c)}
                            className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[11px] font-mono-lux inline-flex items-center gap-1 font-bold"
                          >
                            <PhoneCall className="w-3 h-3" />
                            <span>Gọi CSKH & Ghi Nhớ</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: TIẾP NHẬN PHẢN HỒI */}
          {activeTab === 'complaints' && (
            <div className="bg-[#0E0E12] border border-white/10 rounded-xl p-6 space-y-4 shadow-xl">
              <h3 className="font-serif-lux text-xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                <span>Tiếp Nhận Phản Hồi & Xử Lý Khiếu Nại Dịch Vụ</span>
              </h3>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-300 space-y-1">
                <p className="font-bold font-mono-lux">📋 Quy trình tiếp nhận khiếu nại CSKH Luxe Motors:</p>
                <p>1. Ghi nhận chi tiết nội dung khiếu nại hoặc phản hồi của chủ xe sau khi nhận xe.</p>
                <p>2. Phân loại mức độ ưu tiên và chuyển thông tin trực tiếp lên hệ thống quản trị xử lý trong 24h.</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Live Call Log Modal with MongoDB Persistence */}
      <AnimatePresence>
        {callLogModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0E0E12] border border-emerald-500/40 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-serif-lux text-lg font-bold text-white flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-emerald-400" />
                  <span>Nhật Ký Cuộc Gọi CSKH (Lưu MongoDB)</span>
                </h3>
                <button onClick={() => setCallLogModal(null)} className="text-slate-400 hover:text-white text-xs font-mono-lux">✕ Đóng</button>
              </div>

              <div className="space-y-1 text-xs font-mono-lux">
                <p className="text-slate-300">Khách hàng: <strong className="text-white">{callLogModal.name || callLogModal.visitorName}</strong></p>
                <p className="text-slate-300">Số điện thoại: <strong className="text-emerald-400 font-bold">{callLogModal.phone || callLogModal.visitorPhone || '0966 778 899'}</strong></p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono-lux text-slate-400 block">Nội dung ghi chú cuộc gọi CSKH:</label>
                <textarea
                  rows={4}
                  value={callNoteText}
                  onChange={(e) => setCallNoteText(e.target.value)}
                  placeholder="Nhập nội dung tư vấn, yêu cầu đón tiếp Concierge hoặc phản hồi của chủ xe..."
                  className="w-full bg-[#14141C] border border-white/15 rounded p-3 text-xs text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setCallLogModal(null)} className="px-4 py-2 rounded bg-white/5 text-slate-400 text-xs font-mono-lux">Hủy</button>
                <button
                  onClick={handleSaveCallNote}
                  disabled={updatingId === callLogModal._id}
                  className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono-lux shadow"
                >
                  ✓ Lưu Nhật Ký CSKH Trực Tiếp
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
