import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Chatbot from '@/components/common/Chatbot';
import { useAuth } from '@/context/AuthContext';
import carService from '@/services/carService';
import appointmentService from '@/services/appointmentService';
import { Calendar, Clock, MapPin, Sparkles, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function Appointment() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [car, setCar] = useState(null);
  const [visitorName, setVisitorName] = useState(user?.fullName || '');
  const [visitorPhone, setVisitorPhone] = useState(user?.phone || '');
  const [visitorEmail, setVisitorEmail] = useState(user?.email || '');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 AM');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    if (carId && carId !== 'my') {
      const fetchCar = async () => {
        try {
          const res = await carService.getCarByIdOrSlug(carId);
          if (res?.data) setCar(res.data);
        } catch {}
      };
      fetchCar();
    }
  }, [carId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        car: car?._id || carId,
        appointmentDate,
        timeSlot,
        visitorName,
        visitorPhone,
        visitorEmail,
        notes,
      };

      const res = await appointmentService.createAppointment(payload);
      setSuccessData(res.data || payload);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-28 pb-24">
        <div className="lux-container max-w-3xl space-y-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-mono-lux text-slate-400 hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>

          {!successData ? (
            <div className="bg-[#0E0E12] border border-[#D4AF37]/30 rounded-lg p-8 space-y-8 shadow-2xl">
              {/* Header */}
              <div className="border-b border-white/10 pb-6 space-y-2">
                <div className="lux-eyebrow">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  PRIVATE TEST DRIVE & SHOWROOM VISIT
                </div>
                <h1 className="font-serif-lux text-3xl sm:text-4xl font-bold text-white">
                  Đăng Ký Trải Nghiệm Lái Thử Siêu Xe
                </h1>
                <p className="text-xs text-slate-400">
                  Dịch vụ Concierge riêng phục vụ quý khách lái thử tận nhà hoặc đón tiếp riêng tại Flagship Showroom.
                </p>
              </div>

              {/* Selected Car Preview */}
              {car && (
                <div className="flex items-center gap-4 p-4 rounded bg-[#15151B] border border-white/5">
                  <img
                    src={car.mainImage || car.images?.[0]}
                    alt={car.name}
                    className="w-20 h-14 object-cover rounded border border-white/10"
                  />
                  <div>
                    <span className="text-[10px] font-mono-lux text-[#D4AF37] uppercase">
                      {typeof car.brand === 'object' ? car.brand?.name : car.brand}
                    </span>
                    <h4 className="font-serif-lux text-lg text-white font-bold">{car.name}</h4>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                      Họ và tên khách hàng VIP *
                    </label>
                    <input
                      type="text"
                      required
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      className="lux-input text-xs"
                      placeholder="VD: Nguyễn Văn A"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                      Số điện thoại liên hệ *
                    </label>
                    <input
                      type="tel"
                      required
                      value={visitorPhone}
                      onChange={(e) => setVisitorPhone(e.target.value)}
                      className="lux-input text-xs"
                      placeholder="VD: 0988 888 888"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                    Email xác nhận lịch hẹn *
                  </label>
                  <input
                    type="email"
                    required
                    value={visitorEmail}
                    onChange={(e) => setVisitorEmail(e.target.value)}
                    className="lux-input text-xs"
                    placeholder="vip@domain.com"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                      Ngày dự kiến lái thử *
                    </label>
                    <input
                      type="date"
                      required
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="lux-input text-xs bg-[#15151B]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                      Khung giờ tiếp đón *
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="lux-input text-xs bg-[#15151B]"
                    >
                      <option value="09:00 AM">09:00 AM - Buổi Sáng</option>
                      <option value="11:00 AM">11:00 AM - Buổi Sáng</option>
                      <option value="02:00 PM">02:00 PM - Buổi Chiều</option>
                      <option value="04:00 PM">04:00 PM - Buổi Chiều</option>
                      <option value="07:00 PM">07:00 PM - Buổi Tối VIP</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                    Ghi chú địa điểm hoặc yêu cầu đặc biệt
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="VD: Yêu cầu đưa xe đến biệt thự tại Vinhomes Riverside, lái thử tuyến đại lộ..."
                    className="lux-input text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-lux-gold w-full py-4 text-xs tracking-[0.2em]"
                >
                  {submitting ? 'ĐANG KHỞI TẠO LỊCH HẸN VIP...' : 'XÁC NHẬN ĐẶT LỊCH LÁI THỬ TẬN NHÀ'}
                </button>
              </form>
            </div>
          ) : (
            /* Success confirmation */
            <div className="bg-[#0E0E12] border border-[#D4AF37]/40 rounded-lg p-10 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="font-serif-lux text-3xl font-bold text-white">
                  Đã Đặt Lịch Lái Thử Thành Công!
                </h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Trợ lý VIP Concierge LuxeMotors sẽ gọi điện thoại xác nhận trong vòng 15 phút tới để sắp xếp chuyên xế đưa xe đến tận dinh thự của bạn.
                </p>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <button onClick={() => navigate('/cars')} className="btn-lux-gold px-8 py-3">
                  Tiếp tục xem Showroom
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Chatbot />
      <Footer />
    </div>
  );
}