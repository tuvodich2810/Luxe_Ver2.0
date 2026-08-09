import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Chatbot from '@/components/common/Chatbot';
import { useAuth } from '@/context/AuthContext';
import appointmentService from '@/services/appointmentService';
import {
  Sparkles,
  Calendar,
  Clock,
  Car,
  User,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Plus,
  ArrowRight,
} from 'lucide-react';

const STATUS_MAP = {
  pending: {
    label: 'Chờ Chuyên Viên Xác Nhận',
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    desc: 'Yêu cầu của bạn đã được ghi nhận. Concierge sẽ gọi điện xác nhận trong 15 phút.',
  },
  confirmed: {
    label: 'Đã Xác Nhận Lịch Hẹn',
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    desc: 'Đã chuẩn bị xe và xếp lịch đón tiếp riêng tại biệt thự hoặc showroom.',
  },
  completed: {
    label: 'Hoàn Thành Lái Thử',
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    desc: 'Cảm ơn quý khách đã trải nghiệm dịch vụ siêu xe LuxeMotors.',
  },
  cancelled: {
    label: 'Đã Hủy Lịch',
    color: 'bg-red-500/10 text-red-400 border-red-500/30',
    desc: 'Lịch hẹn đã hủy.',
  },
};

export default function MyAppointments() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await appointmentService.getMyAppointments();
      // res có thể là array hoặc res.data
      const list = Array.isArray(res) ? res : res?.data || [];
      setAppointments(list);
    } catch (err) {
      console.error('Lỗi lấy lịch hẹn:', err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancel = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn lái thử này?')) return;
    setCancellingId(id);
    try {
      await appointmentService.cancelAppointment(id, 'Khách hàng tự hủy trên website');
      fetchAppointments();
    } catch (err) {
      alert(err.message || 'Hủy lịch hẹn thất bại');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-28 pb-24">
        <div className="lux-container max-w-5xl space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="lux-eyebrow">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                VIP CONCIERGE SCHEDULER
              </div>
              <h1 className="font-serif-lux text-3xl sm:text-4xl font-bold text-white mt-1">
                Lịch Hẹn Xem Xe <span className="lux-gradient-gold-text italic">Của Tôi</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Theo dõi tiến trình và quản lý danh sách đăng ký trải nghiệm siêu xe riêng.
              </p>
            </div>

            <Link
              to="/cars"
              className="btn-lux-gold px-5 py-2.5 text-xs font-mono-lux tracking-wider flex items-center gap-2 w-max"
            >
              <Plus className="w-4 h-4" />
              <span>Đăng Ký Lịch Mới</span>
            </Link>
          </div>

          {/* List Appointments */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-44 bg-[#0E0E12] border border-white/5 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <div className="bg-[#0E0E12] border border-[#D4AF37]/20 rounded-lg p-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] mx-auto flex items-center justify-center">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif-lux text-2xl font-bold text-white">
                  Bạn Chưa Có Lịch Hẹn Lái Thử Nào
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Khám phá bộ sưu tập siêu xe độc quyền và chọn cho mình mẫu xe ưng ý nhất để đặt lịch Concierge phục vụ tận nhà.
                </p>
              </div>
              <Link to="/cars" className="btn-lux-gold px-8 py-3 text-xs inline-flex items-center gap-2">
                <span>Khám Phá Showroom Siêu Xe</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((item) => {
                const statusInfo = STATUS_MAP[item.status] || STATUS_MAP.pending;
                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0E0E12] border border-white/10 hover:border-[#D4AF37]/40 rounded-lg p-6 space-y-4 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded text-xs font-mono-lux font-bold border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        <span className="text-[11px] font-mono-lux text-slate-500">
                          Mã: #{item._id.slice(-6).toUpperCase()}
                        </span>
                      </div>

                      {item.status === 'pending' && (
                        <button
                          onClick={() => handleCancel(item._id)}
                          disabled={cancellingId === item._id}
                          className="text-xs font-mono-lux text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Hủy lịch hẹn</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      {/* Car Thumbnail */}
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            item.car?.mainImage ||
                            'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=300'
                          }
                          alt={item.car?.name}
                          className="w-24 h-16 object-cover rounded border border-white/10 shrink-0"
                        />
                        <div>
                          <span className="text-[10px] font-mono-lux text-[#D4AF37] uppercase">
                            {item.car?.brand?.name || 'LUXE MOTORS'}
                          </span>
                          <h4 className="font-serif-lux text-lg font-bold text-white line-clamp-1">
                            {item.car?.name || 'Siêu xe Luxe'}
                          </h4>
                          <p className="text-[11px] text-slate-400 font-mono-lux">
                            Năm {item.car?.year || 2026}
                          </p>
                        </div>
                      </div>

                      {/* Time & Visitor Details */}
                      <div className="space-y-1 text-xs font-mono-lux">
                        <div className="flex items-center gap-2 text-slate-200">
                          <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Ngày hẹn: {new Date(item.appointmentDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Khung giờ: {item.timeSlot}</span>
                        </div>
                      </div>

                      {/* Contact & Status Note */}
                      <div className="p-3 bg-[#14141B] border border-white/5 rounded text-xs space-y-1">
                        <p className="text-[11px] text-slate-300 font-semibold flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{item.visitorName} ({item.visitorPhone})</span>
                        </p>
                        <p className="text-[10px] text-slate-400 line-clamp-2">
                          {statusInfo.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Chatbot />
      <Footer />
    </div>
  );
}
