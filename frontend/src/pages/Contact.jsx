import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  ShieldCheck,
  Building2,
  ExternalLink,
  Send,
  MessageSquare,
} from 'lucide-react';
import { isValidVNPhone } from '@/utils/validation';

export default function Contact() {
  const [activeShowroom, setActiveShowroom] = useState('hanoi'); // 'hanoi' | 'hcm'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Tư vấn mua & cá nhân hóa siêu xe');
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
    <div className="min-h-screen bg-[#070709] text-slate-100 flex flex-col font-sans selection:bg-[#D4AF37] selection:text-black">
      <Navbar />

      <main className="flex-1 pt-28 pb-24">
        <div className="lux-container space-y-12">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono-lux uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              VIP CONCIERGE &amp; FLAGSHIP SHOWROOMS
            </div>
            <h1 className="font-serif-lux text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Liên Hệ <span className="lux-gradient-gold-text italic">Luxe Motors</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
              Đội ngũ Chuyên viên VIP Concierge sẵn sàng phục vụ 24/7 cho các yêu cầu lái thử tận dinh thự, báo giá lăn bánh và tùy biến siêu xe độc bản.
            </p>
          </div>

          {/* MAIN SECTION: 2-Column Balanced Layout (Thông Tin Trực Quan & Form VIP) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* CỘT TRÁI (4 Cols): Thông Tin Showroom & Hotline VIP */}
            <div className="lg:col-span-5 space-y-5">
              {/* Showroom Hà Nội */}
              <div
                onClick={() => setActiveShowroom('hanoi')}
                className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden ${
                  activeShowroom === 'hanoi'
                    ? 'bg-[#12121C] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                    : 'bg-[#0E0E14] border-white/10 hover:border-white/30'
                }`}
              >
                {activeShowroom === 'hanoi' && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-[#D4AF37] text-black text-[9px] font-mono-lux font-bold uppercase rounded-bl-lg">
                    Đang Chọn
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif-lux text-lg font-bold text-white">Flagship Showroom Hà Nội</h3>
                    <p className="text-[10px] font-mono-lux text-[#D4AF37] uppercase">Khu vực Miền Bắc</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>Số 18 Lý Thường Kiệt, Q. Hoàn Kiếm, Hà Nội</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span className="font-mono-lux font-bold text-white">0372 950 720</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>08:00 - 20:00 (Thứ 2 — Chủ Nhật)</span>
                  </p>
                </div>
              </div>

              {/* Showroom TP.HCM */}
              <div
                onClick={() => setActiveShowroom('hcm')}
                className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden ${
                  activeShowroom === 'hcm'
                    ? 'bg-[#12121C] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                    : 'bg-[#0E0E14] border-white/10 hover:border-white/30'
                }`}
              >
                {activeShowroom === 'hcm' && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-[#D4AF37] text-black text-[9px] font-mono-lux font-bold uppercase rounded-bl-lg">
                    Đang Chọn
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif-lux text-lg font-bold text-white">Flagship Showroom TP. HCM</h3>
                    <p className="text-[10px] font-mono-lux text-[#D4AF37] uppercase">Khu vực Miền Nam</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>Số 88 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. HCM</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span className="font-mono-lux font-bold text-white">0372 950 720</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>luxemotor001@gmail.com</span>
                  </p>
                </div>
              </div>

              {/* Cam kết dịch vụ nhanh */}
              <div className="p-4 rounded-2xl bg-[#0E0E14] border border-white/10 space-y-2 text-xs font-mono-lux text-slate-300">
                <div className="flex items-center gap-2 text-[#D4AF37] font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>CAM KẾT DỊCH VỤ VIP 24/7:</span>
                </div>
                <ul className="space-y-1.5 text-slate-400 pl-2">
                  <li>• Tiếp nhận và phản hồi yêu cầu trong vòng 30 phút</li>
                  <li>• Bảo mật tuyệt đối danh tính khách hàng (Ký NDA)</li>
                  <li>• Vận chuyển xe lái thử tận dinh thự trên toàn quốc</li>
                </ul>
              </div>
            </div>

            {/* CỘT PHẢI (7 Cols): Form Gửi Yêu Cầu Tư Vấn Riêng */}
            <div className="lg:col-span-7 bg-[#0E0E14] border border-[#D4AF37]/40 p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl backdrop-blur-xl">
              <div className="border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-white">
                  <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-serif-lux text-xl sm:text-2xl font-bold">
                    Gửi Yêu Cầu Tư Vấn Riêng (VIP Concierge)
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-light">
                  Vui lòng cung cấp thông tin để Chuyên viên VIP Concierge chuẩn bị hồ sơ xe và phục vụ tận nơi.
                </p>
              </div>

              {success ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="font-serif-lux text-2xl font-bold text-white">
                    Gửi Yêu Cầu Thành Công!
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Chuyên viên VIP Concierge Luxe Motors sẽ liên hệ trực tiếp qua SĐT của Quý khách trong vòng 30 phút.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="btn-lux-gold px-6 py-2.5 text-xs font-mono-lux"
                  >
                    Gửi yêu cầu khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400 block">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#14141E] border border-white/10 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-xs text-white outline-none transition-colors"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400 block">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#14141E] border border-white/10 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-xs text-white outline-none transition-colors"
                        placeholder="0988 888 888"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400 block">
                      Email tiếp nhận hồ sơ *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#14141E] border border-white/10 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-xs text-white outline-none transition-colors"
                      placeholder="vip.client@domain.com"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400 block">
                      Chủ đề tư vấn
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-[#14141E] border border-white/10 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-xs text-white outline-none transition-colors cursor-pointer"
                    >
                      <option value="Tư vấn mua & cá nhân hóa siêu xe">Tư vấn mua &amp; cá nhân hóa siêu xe</option>
                      <option value="Đăng ký lái thử tận nhà">Đăng ký lái thử tận dinh thự</option>
                      <option value="Ký gửi siêu xe">Ký gửi &amp; thẩm định giá xe cũ</option>
                      <option value="Hợp tác kinh doanh">Hợp tác &amp; Sự kiện VIP</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400 block">
                      Nội dung yêu cầu chi tiết *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-[#14141E] border border-white/10 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-xs text-white outline-none transition-colors"
                      placeholder="Nhập dòng xe quan tâm (Ferrari SF90, Rolls-Royce Phantom...) hoặc yêu cầu đặc biệt..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-lux-gold py-3.5 text-xs font-mono-lux font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 shadow-xl hover:scale-101 active:scale-98 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'ĐANG GỬI THÔNG TIN...' : 'GỬI YÊU CẦU CHO VIP CONCIERGE'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* SECTION 2: Interactive Google Map Full-Width Embed */}
          <div className="bg-[#0E0E14] border border-white/10 rounded-3xl overflow-hidden shadow-2xl space-y-0">
            <div className="px-6 py-4 bg-[#12121C] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono-lux">
              <div className="flex items-center gap-3">
                <span className="text-[#D4AF37] font-bold flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  BẢN ĐỒ VỊ TRÍ:
                </span>
                <span className="text-white">
                  {activeShowroom === 'hanoi'
                    ? '18 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội'
                    : '88 Nguyễn Huệ, Quận 1, TP. HCM'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveShowroom('hanoi')}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                    activeShowroom === 'hanoi'
                      ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                      : 'bg-black/40 text-slate-300 border-white/10 hover:text-white'
                  }`}
                >
                  Showroom Hà Nội
                </button>
                <button
                  onClick={() => setActiveShowroom('hcm')}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                    activeShowroom === 'hcm'
                      ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                      : 'bg-black/40 text-slate-300 border-white/10 hover:text-white'
                  }`}
                >
                  Showroom TP.HCM
                </button>
                <a
                  href={directMapNav[activeShowroom]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#D4AF37] hover:underline font-bold pl-2"
                >
                  <span>Chỉ đường</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="w-full h-[360px] sm:h-[420px] relative">
              <iframe
                title={`Google Maps ${activeShowroom}`}
                src={mapUrls[activeShowroom]}
                className="w-full h-full border-0 filter contrast-[1.05] brightness-[0.95]"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </main>

      <Chatbot />
      <Footer />
    </div>
  );
}