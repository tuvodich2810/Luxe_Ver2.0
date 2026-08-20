import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Phone,
  ArrowRight,
  ShieldCheck,
  Clock,
  MapPin,
  CalendarCheck,
  Crown,
  Key,
} from 'lucide-react';

export default function PrivateInquiryCallout() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#070709] via-[#0D0D14] to-[#070709] border-t border-[#D4AF37]/30 relative overflow-hidden">
      {/* Glow ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="lux-container max-w-6xl relative z-10 space-y-10">
        <div className="bg-[#0A0A0F] border border-[#D4AF37]/40 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-2xl space-y-8">
          {/* Header Title */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] font-mono-lux uppercase tracking-widest">
              <Crown className="w-3.5 h-3.5" />
              FLAGSHIP SHOWROOM &amp; 24/7 VIP CONCIERGE
            </div>

            <h2 className="font-serif-lux text-3xl sm:text-5xl font-bold text-white leading-tight">
              Dịch Vụ Tiếp Đón &amp; May Đo <span className="lux-gradient-gold-text italic">Bespoke 1:1</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              Trải nghiệm dịch vụ vận chuyển siêu xe lái thử tận tư gia, tư vấn cá nhân hóa màu sơn độc bản và tiếp đón riêng biệt tại phòng chờ VIP Lounge chuẩn quốc tế.
            </p>
          </div>

          {/* 3 Pillars of Luxury Service */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-[#12121C] border border-white/5 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <h3 className="font-serif-lux text-base font-bold text-white">Lái Thử Tận Dinh Thự</h3>
              <p className="text-xs text-slate-400 font-light">
                Xe sàn phẳng chuyên dụng vận chuyển siêu xe trực tiếp đến tận nhà phục vụ Quý khách lái thử riêng tư 24/7.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#12121C] border border-white/5 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif-lux text-base font-bold text-white">Bảo Hành 5 Năm &amp; NDA</h3>
              <p className="text-xs text-slate-400 font-light">
                Bảo dưỡng miễn phí 5 năm, cứu hộ Flatbed Towing toàn quốc và ký kết Thỏa thuận bảo mật danh tính pháp lý.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#12121C] border border-white/5 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-serif-lux text-base font-bold text-white">02 Flagship Showrooms</h3>
              <p className="text-xs text-slate-400 font-light">
                Hà Nội: 18 Lý Thường Kiệt, Q. Hoàn Kiếm • TP.HCM: 88 Nguyễn Huệ, Quận 1 (Phục vụ 08:30 - 20:00).
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-white/10">
            <Link
              to="/appointment"
              className="btn-lux-gold px-8 py-3.5 text-xs font-mono-lux tracking-[0.2em] font-bold flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 w-full sm:w-auto justify-center"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>ĐẶT LỊCH LÁI THỬ TẬN NHÀ</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="tel:0372950720"
              className="px-7 py-3.5 rounded-xl bg-[#14141C] hover:bg-[#1A1A24] border border-white/20 hover:border-[#D4AF37] text-xs font-mono-lux text-white hover:text-[#D4AF37] flex items-center gap-2 transition-all w-full sm:w-auto justify-center"
            >
              <Phone className="w-4 h-4 text-[#D4AF37]" />
              <span>HOTLINE VIP: 0372 950 720</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
