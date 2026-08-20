import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  Car,
  CalendarCheck,
  ShieldCheck,
  CreditCard,
  Crown,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';

const JOURNEY_STEPS = [
  {
    step: '01',
    title: 'Khám Phá Siêu Phẩm 4K',
    subtitle: 'Nhận biết & Chiêm ngưỡng',
    desc: 'Lựa chọn bộ sưu tập Hypercar, Supercar và SUV siêu sang được niêm yết chuẩn giá VNĐ (₫) và kiểm tra tình trạng xe có sẵn trong kho thời gian thực.',
    icon: Car,
    tag: 'Digital Gallery',
    linkText: 'Xem Bộ Sưu Tập',
    linkUrl: '/cars',
  },
  {
    step: '02',
    title: 'Trợ Lý AI VIP 24/7',
    subtitle: 'Tư vấn theo ngân sách',
    desc: 'AI Chatbot Concierge phản hồi tức thì về thông số kỹ thuật, công suất mã lực và gợi ý các dòng xe phù hợp với gu thẩm mỹ và phong cách sống.',
    icon: Sparkles,
    tag: 'AI Assistant',
    linkText: 'Trò Chuyện Cùng AI',
    linkUrl: '#',
    isChatTrigger: true,
  },
  {
    step: '03',
    title: 'Lái Thử Tận Nhà Concierge',
    subtitle: 'Trải nghiệm thực tế tại gia',
    desc: 'Đội ngũ chuyên xe sàn phẳng vận chuyển siêu xe trực tiếp đến tận tư gia hoặc khu đô thị để Quý khách cầm lái trải nghiệm riêng tư.',
    icon: CalendarCheck,
    tag: 'Home Concierge',
    linkText: 'Đặt Lịch Lái Thử',
    linkUrl: '/appointment',
  },
  {
    step: '04',
    title: 'Tư Vấn May Đo Bespoke 1:1',
    subtitle: 'Chuyên viên riêng tiếp đón',
    desc: 'Chuyên viên VIP đồng hành tư vấn từng chi tiết da nội thất Alcantara, màu sơn độc bản, trần sao Starlight và phương án tài chính doanh nghiệp.',
    icon: Compass,
    tag: 'Bespoke 1:1',
    linkText: 'Gặp Chuyên Viên',
    linkUrl: '/contact',
  },
  {
    step: '05',
    title: 'Đặt Cọc Napas VietQR',
    subtitle: 'Thanh toán trực tuyến bảo mật',
    desc: 'Khóa giữ xe trong kho tức thì với các mức cọc 10%-20%-30% qua mã VietQR Napas 247 VietinBank an toàn, minh bạch hợp đồng và hóa đơn VAT.',
    icon: CreditCard,
    tag: 'Instant Lock',
    linkText: 'Quy Trình Đặt Cọc',
    linkUrl: '/cars',
  },
  {
    step: '06',
    title: 'Đặc Quyền Luxe VIP Club',
    subtitle: 'Bảo hành 5 năm & Hậu mãi',
    desc: 'Bàn giao xe riêng tư, hưởng gói bảo dưỡng miễn phí chính hãng 05 năm, dịch vụ cứu hộ khẩn cấp 24/7 và vé mời tham dự VIP Track Day.',
    icon: Crown,
    tag: 'VIP Privilege',
    linkText: 'Chính Sách VIP',
    linkUrl: '/contact',
  },
];

export default function CustomerJourneySection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-24 bg-[#070709] border-t border-white/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#D4AF37]/5 blur-[120px] pointer-events-none" />

      <div className="lux-container relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="lux-eyebrow justify-center">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            THE VIP CONCIERGE EXPERIENCE JOURNEY
          </div>
          <h2 className="font-serif-lux text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Hành Trình Trải Nghiệm <span className="lux-gradient-gold-text italic">Đặc Quyền 6 Bước</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Từ khoảnh khắc khám phá đến lễ bàn giao độc bản, Luxe Motors kiến tạo quy trình phục vụ chuẩn mực 1:1, bảo mật danh tính tuyệt đối và tận tâm trên từng điểm chạm.
          </p>
        </div>

        {/* 6-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {JOURNEY_STEPS.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeStep === idx;
            return (
              <motion.div
                key={item.step}
                whileHover={{ y: -5 }}
                onMouseEnter={() => setActiveStep(idx)}
                className={`p-6 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#12121C] border-[#D4AF37]/50 shadow-[0_0_25px_rgba(212,175,55,0.12)]'
                    : 'bg-[#0E0E14] border-white/10 hover:border-white/20'
                }`}
              >
                {/* Gold Accent Line */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37]" />
                )}

                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono-lux text-2xl font-bold text-[#D4AF37]">
                      {item.step}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-lux uppercase bg-white/5 border border-white/10 text-slate-300">
                      {item.tag}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="space-y-1.5">
                    <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-2">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif-lux text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] font-mono-lux text-[#D4AF37] uppercase tracking-wider">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Action */}
                <div className="pt-6 border-t border-white/5 mt-4">
                  <Link
                    to={item.linkUrl}
                    className="inline-flex items-center gap-1.5 text-xs font-mono-lux text-[#D4AF37] hover:text-white transition-colors"
                  >
                    <span>{item.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Banner Callout */}
        <div className="bg-gradient-to-r from-[#12121A] via-[#161622] to-[#12121A] border border-[#D4AF37]/30 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-mono-lux uppercase tracking-widest text-[#D4AF37] flex items-center justify-center sm:justify-start gap-1.5">
              <ShieldCheck className="w-4 h-4" /> CAM KẾT BẢO MẬT PHÁP LÝ NDA &amp; BẢO HÀNH 05 NĂM
            </span>
            <h4 className="font-serif-lux text-2xl font-bold text-white">
              Sẵn Sàng Cầm Lái Siêu Phẩm Của Riêng Bạn?
            </h4>
            <p className="text-xs text-slate-400">
              Đội ngũ Chuyên viên VIP Concierge sẵn sàng mang xe đến tận tư gia trong vòng 24 giờ.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              to="/appointment"
              className="btn-lux-gold px-6 py-3 text-xs font-mono-lux font-bold shadow-lg"
            >
              Đặt Lịch Lái Thử Tận Nhà
            </Link>
            <a
              href="tel:0372950720"
              className="px-5 py-3 rounded border border-white/20 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] text-xs font-mono-lux flex items-center gap-2 transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37]" />
              Hotline: 0372 950 720
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
