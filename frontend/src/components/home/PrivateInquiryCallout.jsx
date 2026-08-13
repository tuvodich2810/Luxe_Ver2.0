import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Phone, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export default function PrivateInquiryCallout() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#070709] via-[#0E0E14] to-[#070709] border-t border-[#D4AF37]/20 relative overflow-hidden">
      {/* Glow ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="lux-container max-w-5xl relative z-10">
        <div className="bg-[#0A0A0E] border border-[#D4AF37]/30 rounded-2xl p-8 sm:p-12 text-center space-y-8 shadow-2xl backdrop-blur-xl">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono-lux uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              PRIVATE VIP CONCIERGE INQUIRY
            </div>

            <h2 className="font-serif-lux text-3xl sm:text-5xl font-bold text-white leading-tight">
              Tư Vấn & Cá Nhân Hóa <span className="lux-gradient-gold-text italic">Siêu Xe Độc Bản</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
              Quý khách cần báo giá lăn bánh, đăng ký lái thử tận dinh thự hoặc tùy biến khoang nội thất Tailor Made? Đội ngũ Chuyên viên VIP Concierge sẵn sàng phục vụ 24/7.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/contact"
              className="btn-lux-gold px-8 py-4 text-xs font-mono-lux tracking-[0.2em] font-bold flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 w-full sm:w-auto justify-center"
            >
              <span>GỬI YÊU CẦU TƯ VẤN RIÊNG</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="tel:0372950720"
              className="px-8 py-4 rounded-lg bg-[#14141C] border border-white/10 hover:border-[#D4AF37] text-xs font-mono-lux text-white flex items-center gap-2 transition-all w-full sm:w-auto justify-center"
            >
              <Phone className="w-4 h-4 text-[#D4AF37]" />
              <span>HOTLINE VIP: 0372 950 720</span>
            </a>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-8 text-xs font-mono-lux text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              Bảo Mật Thông Tin Khách Hàng 100%
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              Phản Hồi Trong Vòng 30 Phút
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
