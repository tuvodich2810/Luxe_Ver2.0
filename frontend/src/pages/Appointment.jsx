import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Chatbot from '@/components/common/Chatbot';
import { useAuth } from '@/context/AuthContext';
import carService from '@/services/carService';
import appointmentService from '@/services/appointmentService';
import { isValidVNPhone } from '@/utils/validation';
import MyAppointments from './MyAppointments';
import {
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  Clock,
  Car as CarIcon,
} from 'lucide-react';

export default function Appointment() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Nếu URL là /appointment/my -> Hiển thị trực tiếp trang lịch hẹn cá nhân
  if (carId === 'my') {
    return <MyAppointments />;
  }

  const [car, setCar] = useState(null);
  const [allCars, setAllCars] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState('');

  const [visitorName, setVisitorName] = useState(user?.fullName || '');
  const [visitorPhone, setVisitorPhone] = useState(user?.phone || '');
  const [visitorEmail, setVisitorEmail] = useState(user?.email || '');

  // Mặc định chọn ngày hôm sau
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [appointmentDate, setAppointmentDate] = useState(tomorrowStr);
  const [timeSlot, setTimeSlot] = useState('10:00');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    if (user) {
      setVisitorName((prev) => prev || user.fullName || '');
      setVisitorPhone((prev) => prev || user.phone || '');
      setVisitorEmail((prev) => prev || user.email || '');
    }
  }, [user]);

  // Load danh sách tất cả các xe từ MongoDB để đổ vào dropdown
  useEffect(() => {
    const loadCars = async () => {
      try {
        const res = await carService.getCars({ limit: 50 });
        const carList = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];

        setAllCars(carList);

        if (carList.length > 0) {
          let target = null;

          if (carId && carId !== 'my') {
            // Tìm xe trùng ID hoặc slug trong danh sách
            target = carList.find(
              (c) => String(c._id) === String(carId) || c.slug === carId
            );

            // Nếu không có trong danh sách 50 xe, thử gọi API đơn lẻ
            if (!target) {
              try {
                const singleRes = await carService.getCarByIdOrSlug(carId);
                target = singleRes?.data || (singleRes?.name ? singleRes : null);
              } catch (e) {
                console.warn('ID xe không khớp, tự động chọn xe khả dụng đầu tiên');
              }
            }
          }

          // Fallback xe đầu tiên nếu không tìm thấy xe theo ID
          const finalCar = target || carList[0];
          setCar(finalCar);
          setSelectedCarId(String(finalCar._id));
        }
      } catch (err) {
        console.error('Lỗi nạp danh sách xe:', err);
      }
    };

    loadCars();
  }, [carId]);

  const handleSelectCarChange = (e) => {
    const id = e.target.value;
    setSelectedCarId(id);
    const chosen = allCars.find((c) => String(c._id) === String(id));
    if (chosen) setCar(chosen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Vui lòng đăng nhập để đăng ký lịch hẹn lái thử.');
      navigate('/login');
      return;
    }

    if (!isValidVNPhone(visitorPhone)) {
      alert('Số điện thoại không hợp lệ. Vui lòng nhập SĐT Việt Nam hợp lệ (10 chữ số, bắt đầu bằng 03, 05, 07, 08, 09).');
      return;
    }

    const targetCarId = selectedCarId || car?._id;
    if (!targetCarId) {
      alert('Vui lòng chọn mẫu siêu xe muốn trải nghiệm.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        car: targetCarId,
        visitorName,
        visitorPhone,
        visitorEmail,
        appointmentDate,
        timeSlot,
        notes,
      };

      const res = await appointmentService.createAppointment(payload);

      if (res?.success || res?.data || res?._id) {
        setSuccessData(res.data || res);
      } else {
        alert(res?.message || 'Đặt lịch thất bại');
      }
    } catch (error) {
      console.error(error);
      alert(error.message || 'Không thể kết nối tới máy chủ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-28 pb-24">
        <div className="lux-container max-w-3xl space-y-10">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-xs font-mono-lux text-slate-400 hover:text-[#D4AF37] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>

            <button
              onClick={() => navigate('/appointment/my')}
              className="text-xs font-mono-lux text-[#D4AF37] hover:underline flex items-center gap-1"
            >
              <span>Xem lịch hẹn của tôi</span>
              <span>→</span>
            </button>
          </div>

          {!successData ? (
            <div className="bg-[#0E0E12] border border-[#D4AF37]/30 rounded-lg p-8 space-y-8 shadow-2xl">
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

              {/* Selector Xe Đăng Ký */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono-lux uppercase tracking-wider text-[#D4AF37] font-semibold">
                  Mẫu Siêu Xe Muốn Đăng Ký Lái Thử *
                </label>
                <select
                  value={selectedCarId}
                  onChange={handleSelectCarChange}
                  className="w-full bg-[#15151B] border border-[#D4AF37]/40 rounded-lg px-4 py-3 text-xs text-white outline-none focus:border-[#D4AF37] shadow-inner"
                >
                  {allCars.length === 0 && (
                    <option value="">-- Đang tải danh sách siêu xe... --</option>
                  )}
                  {allCars.map((c) => {
                    let numP = c.price || 0;
                    if (numP > 0 && numP < 50000000) numP = numP * 25000;
                    const priceVND = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numP);
                    return (
                      <option key={c._id} value={c._id} className="bg-[#15151B] text-white">
                        {c.name} ({typeof c.brand === 'object' ? c.brand?.name : c.brand || 'Luxe'}) - {priceVND}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Box Preview Xe Được Chọn */}
              {car && (
                <div className="flex items-center gap-4 p-4 rounded-lg bg-[#15151B] border border-white/10">
                  <img
                    src={
                      car.mainImage ||
                      car.images?.[0]?.url ||
                      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=200'
                    }
                    alt={car.name}
                    className="w-24 h-16 object-cover rounded border border-white/10"
                  />
                  <div className="flex-1">
                    <span className="text-[10px] font-mono-lux text-[#D4AF37] uppercase tracking-wider">
                      {typeof car.brand === 'object' ? car.brand?.name : car.brand || 'Luxe Motors'}
                    </span>
                    <h4 className="font-serif-lux text-lg text-white font-bold">{car.name}</h4>
                    <p className="text-xs font-mono-lux text-emerald-400">
                      {(() => {
                        let numP = car.price || 0;
                        if (numP > 0 && numP < 50000000) numP = numP * 25000;
                        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numP);
                      })()}
                    </p>
                  </div>
                  {/* Stock Badge */}
                  <div className="shrink-0">
                    {car.stockCount > 0 ? (
                      <span className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                        <span className="font-mono-lux text-xl font-bold text-emerald-400">{car.stockCount}</span>
                        <span className="text-[9px] font-mono-lux text-emerald-400/70 uppercase tracking-widest">Còn lại</span>
                      </span>
                    ) : (car.inStock === false || car.stockCount === 0) ? (
                      <span className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/40">
                        <span className="text-[10px] font-mono-lux text-rose-400 font-bold uppercase tracking-widest">Hết hàng</span>
                      </span>
                    ) : (
                      <span className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30">
                        <span className="text-[9px] font-mono-lux text-[#D4AF37] uppercase tracking-widest">Liên hệ</span>
                        <span className="text-[9px] font-mono-lux text-[#D4AF37]/70">để xác nhận</span>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Out-of-stock warning banner */}
              {car && (car.stockCount === 0 || car.inStock === false) && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-rose-500/10 border border-rose-500/30">
                  <span className="text-rose-400 text-lg">⚠️</span>
                  <div>
                    <p className="text-rose-400 font-mono-lux text-xs font-bold">Mẫu xe này hiện đã hết hàng</p>
                    <p className="text-rose-400/70 text-[11px] mt-0.5">Quý khách có thể đăng ký nhận thông báo khi có hàng mới về, hoặc chọn mẫu xe khác phù hợp.</p>
                  </div>
                </div>
              )}

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
                      placeholder="VD: Nguyễn Văn Minh"
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
                      placeholder="VD: 0918889999"
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
                      min={new Date().toISOString().split('T')[0]}
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
                      <option value="09:00">09:00 AM - Buổi Sáng</option>
                      <option value="10:00">10:00 AM - Buổi Sáng</option>
                      <option value="11:00">11:00 AM - Buổi Sáng</option>
                      <option value="14:00">02:00 PM - Buổi Chiều</option>
                      <option value="15:30">03:30 PM - Buổi Chiều</option>
                      <option value="16:30">04:30 PM - Buổi Chiều VIP</option>
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
                    placeholder="VD: Yêu cầu đưa xe đến biệt thự tại Vinhomes Thảo Điền..."
                    className="lux-input text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || car?.stockCount === 0 || car?.inStock === false}
                  className={`w-full py-4 text-xs tracking-[0.2em] font-mono-lux font-bold ${
                    (car?.stockCount === 0 || car?.inStock === false)
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed rounded-sm'
                      : 'btn-lux-gold'
                  }`}
                >
                  {car?.stockCount === 0 || car?.inStock === false
                    ? 'XE NÀY ĐÃ HẾT HÀNG — VUI LÒNG CHỌN XE KHÁC'
                    : submitting
                    ? 'ĐANG KHỞI TẠO LỊCH HẸN VIP...'
                    : 'XÁC NHẬN ĐẶT LỊCH LÁI THỬ TẬN NHÀ'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-[#0E0E12] border border-[#D4AF37]/40 rounded-lg p-10 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h2 className="font-serif-lux text-3xl font-bold text-white">
                  Đã Đặt Lịch Lái Thử Thành Công!
                </h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Trợ lý VIP Concierge LuxeMotors sẽ gọi điện thoại xác nhận trong thời gian ngắn nhất để sắp xếp xe vận chuyển tới điểm hẹn.
                </p>
              </div>

              <div className="flex justify-center gap-4 pt-4 flex-wrap">
                <button onClick={() => navigate('/cars')} className="btn-lux-gold px-8 py-3">
                  Tiếp tục xem Showroom
                </button>

                <button onClick={() => navigate('/appointment/my')} className="btn btn-outline px-8 py-3">
                  Xem lịch hẹn của tôi
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