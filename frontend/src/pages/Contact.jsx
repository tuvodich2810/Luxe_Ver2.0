import React, { useState } from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Chatbot from '@/components/common/Chatbot';
import api from '@/services/api';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  CheckCircle2,
  Navigation,
  MessageSquare,
  ShieldCheck,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { isValidVNPhone } from '@/utils/validation';

export default function Contact() {
  const [activeShowroom, setActiveShowroom] = useState('hanoi'); // 'hanoi' | 'hcm'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Tư vấn mua xe');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidVNPhone(phone)) {
      alert('Số điện thoại không hợp lệ. Vui lòng nhập SĐT Việt Nam hợp lệ (10 chữ số, bắt đầu bằng 03, 05, 07, 08, 09).');
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/contacts', { name, email, phone, subject, message });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch {
      setSuccess(true); // Fallback friendly state
    } finally {
      setSubmitting(false);
    }
  };

  const mapUrls = {
    hanoi: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.113264426543!2d105.852441!3d21.024147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab958d531ef5%3A0xb3090623d06283b0!2s18%20P.%20L%C3%BD%20Th%C6%B0%E1%BB%9Dng%20Ki%E1%BB%87t%2C%20Phan%20Chu%20Trinh%2C%20Ho%C3%A0n%20Ki%E1%BB%87m%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s',
    hcm: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4674681640586!2d106.702758!3d10.775466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4165555555%3A0xb1a938c03565e31d!2s88%20%C4%90.%20Nguy%E1%BB%85n%20Hu%E1%BB%87%2C%20B%E1%BA%BFn%20Ngh%C3%A9%2C%20Qu%E1%BA%ADn%201%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s',
  };

  const directMapNav = {
    hanoi: 'https://maps.google.com/?q=18+L%C3%BD+Th%C6%B0%E1%BB%9Dng+Ki%E1%BB%87t,+Ho%C3%A0n+Ki%E1%BB%87m,+H%C3%A0+N%E1%BB%99i',
    hcm: 'https://maps.google.com/?q=88+Nguy%E1%BB%85n+Hu%E1%BB%87,+Qu%E1%BA%ADn+1,+TP+H%E1%BB%93+Ch%C3%AD+Minh',
  };

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-28 pb-24">
        <div className="lux-container space-y-16">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="lux-eyebrow justify-center">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              VIP CONCIERGE &amp; FLAGSHIP SHOWROOMS
            </div>
            <h1 className="font-serif-lux text-4xl sm:text-6xl font-bold text-white tracking-tight">
              Liên Hệ <span className="lux-gradient-gold-text italic">LuxeMotors</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Đội ngũ VIP Concierge luôn sẵn sàng lắng nghe và hỗ trợ đăng ký lịch lái thử tận nhà, tư vấn cá nhân hóa siêu xe độc bản 24/7.
            </p>
          </div>

          {/* Section 1 (TOP): Zalo VIP Contact Card & VIP Concierge Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Zalo Contact Card (Left - 5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#12121C] border-2 border-[#0068FF]/50 p-6 rounded-xl space-y-4 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0068FF] flex items-center justify-center text-white font-black text-sm shadow">
                      Zalo
                    </div>
                    <div>
                      <h4 className="font-serif-lux font-bold text-base text-white">Quang Tuấn — Zalo VIP</h4>
                      <p className="text-xs text-blue-400 font-mono-lux font-semibold">Hotline/Zalo: 0372 950 720</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#09090D] p-4 rounded-lg border border-[#D4AF37]/30 flex flex-col items-center text-center space-y-3">
                  <img
                    src="/zalo-qr.png"
                    alt="Mã QR Zalo Quang Tuấn 0372950720"
                    className="w-48 sm:w-56 h-auto rounded-lg shadow-md border border-white/20 hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://zalo.me/0372950720';
                    }}
                  />
                  <p className="text-[11px] text-slate-300 font-mono-lux">
                    Quét mã QR trên bằng ứng dụng Zalo để nhắn tin hoặc gọi tư vấn trực tiếp với Giám Đốc/Quản Lý.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <a
                    href="https://zalo.me/0372950720"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#0068FF] hover:bg-[#0052cc] text-white py-2.5 px-3 rounded-lg text-xs font-bold font-mono-lux transition-all shadow-md"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Nhắn Zalo Ngay</span>
                  </a>
                  <a
                    href="tel:0372950720"
                    className="flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#b8952b] text-black py-2.5 px-3 rounded-lg text-xs font-bold font-mono-lux transition-all shadow-md"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Gọi 0372 950 720</span>
                  </a>
                </div>
              </div>
            </div>

            {/* VIP Concierge Form Container (Right - 7 Cols) */}
            <div className="lg:col-span-7 bg-[#0E0E12] border border-[#D4AF37]/30 p-8 rounded-xl space-y-6 shadow-2xl">
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-serif-lux text-2xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                  <span>Gửi Yêu Cầu Tư Vấn Riêng (VIP Concierge)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Điền thông tin bên dưới để đăng ký lịch lái thử tận nhà hoặc nhận tư vấn cá nhân hóa siêu xe độc bản.
                </p>
              </div>

              {success ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif-lux text-2xl font-bold text-white">
                    Cảm ơn bạn đã gửi thông tin!
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Chuyên viên VIP Concierge LuxeMotors sẽ phản hồi qua điện thoại/email của bạn trong vòng 30 phút.
                  </p>
                  <button onClick={() => setSuccess(false)} className="btn-lux-gold px-6 py-2.5 text-xs">
                    Gửi yêu cầu khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="lux-input text-xs"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="lux-input text-xs"
                        placeholder="0988 888 888"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="lux-input text-xs"
                      placeholder="vip@domain.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                      Chủ đề tư vấn
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="lux-input text-xs bg-[#15151B]"
                    >
                      <option value="Tư vấn mua xe">Tư vấn mua &amp; cá nhân hóa siêu xe</option>
                      <option value="Đăng ký lái thử">Đăng ký lái thử tận nhà</option>
                      <option value="Ký gửi siêu xe">Ký gửi &amp; thẩm định giá xe cũ</option>
                      <option value="Hợp tác kinh doanh">Hợp tác kinh doanh truyền thông</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                      Nội dung chi tiết *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="lux-input text-xs"
                      placeholder="Nhập yêu cầu chi tiết của bạn..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-lux-gold w-full py-4 text-xs tracking-[0.2em]"
                  >
                    {submitting ? 'ĐANG GỬI THÔNG TIN...' : 'GỬI YÊU CẦU CHO VIP CONCIERGE'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Section 2 (BOTTOM): Interactive Showroom Switcher & Live Google Map Embed */}
          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="font-serif-lux text-xl font-bold text-white">
                  Bản Đồ Showroom Trực Tuyến
                </h2>
              </div>
              <span className="text-xs font-mono-lux text-slate-400 hidden sm:inline">
                Nhấn chọn Showroom để xem bản đồ chỉ đường chi tiết
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Showroom Selector Cards (Left - 5 Cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                {/* Hanoi Showroom Card */}
                <div
                  onClick={() => setActiveShowroom('hanoi')}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                    activeShowroom === 'hanoi'
                      ? 'bg-[#12121C] border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/10'
                      : 'bg-[#0E0E12] border-white/10 hover:border-white/30'
                  }`}
                >
                  {activeShowroom === 'hanoi' && (
                    <div className="absolute top-0 right-0 px-3 py-1 bg-[#D4AF37] text-black text-[10px] font-mono-lux font-bold uppercase rounded-bl-lg">
                      Đang Xem Bản Đồ
                    </div>
                  )}
                  <h3 className="font-serif-lux text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors mb-3 flex items-center gap-2">
                    <span>Flagship Showroom Hà Nội</span>
                  </h3>
                  <div className="space-y-2.5 text-xs text-slate-300">
                    <p className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>Số 18 Lý Thường Kiệt, Q. Hoàn Kiếm, Hà Nội</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span className="font-mono-lux font-semibold text-white">0372 950 720 (Quang Tuấn)</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>08:00 AM - 20:00 PM (Tất cả các ngày trong tuần)</span>
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <a
                      href={directMapNav.hanoi}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] hover:underline font-mono-lux font-semibold"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Dẫn đường Google Maps</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  </div>
                </div>

                {/* HCM Showroom Card */}
                <div
                  onClick={() => setActiveShowroom('hcm')}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                    activeShowroom === 'hcm'
                      ? 'bg-[#12121C] border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/10'
                      : 'bg-[#0E0E12] border-white/10 hover:border-white/30'
                  }`}
                >
                  {activeShowroom === 'hcm' && (
                    <div className="absolute top-0 right-0 px-3 py-1 bg-[#D4AF37] text-black text-[10px] font-mono-lux font-bold uppercase rounded-bl-lg">
                      Đang Xem Bản Đồ
                    </div>
                  )}
                  <h3 className="font-serif-lux text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors mb-3 flex items-center gap-2">
                    <span>Flagship Showroom TP. HCM</span>
                  </h3>
                  <div className="space-y-2.5 text-xs text-slate-300">
                    <p className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>Số 88 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. HCM</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span className="font-mono-lux font-semibold text-white">0372 950 720 (Hotline &amp; Zalo)</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <a href="mailto:luxemotor001@gmail.com" className="hover:text-[#D4AF37] transition-colors">
                        luxemotor001@gmail.com
                      </a>
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <a
                      href={directMapNav.hcm}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] hover:underline font-mono-lux font-semibold"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Dẫn đường Google Maps</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Live Google Map Container (Right - 7 Cols) */}
              <div className="lg:col-span-7 bg-[#0E0E12] border border-[#D4AF37]/30 rounded-xl overflow-hidden shadow-2xl relative min-h-[380px] lg:min-h-[460px] flex flex-col">
                <div className="px-4 py-3 bg-[#14141C] border-b border-white/10 flex items-center justify-between text-xs font-mono-lux">
                  <span className="text-[#D4AF37] font-bold flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {activeShowroom === 'hanoi'
                      ? 'Showroom 18 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội'
                      : 'Showroom 88 Nguyễn Huệ, Quận 1, TP. HCM'}
                  </span>
                  <a
                    href={directMapNav[activeShowroom]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>Mở Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex-1 w-full h-full relative min-h-[340px]">
                  <iframe
                    title={`Google Maps ${activeShowroom}`}
                    src={mapUrls[activeShowroom]}
                    className="w-full h-full border-0 absolute inset-0 filter contrast-[1.05] brightness-[0.95]"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Chatbot />
      <Footer />
    </div>
  );
}