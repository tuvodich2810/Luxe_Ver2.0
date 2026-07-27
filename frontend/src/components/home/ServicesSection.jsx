import React from 'react';
import { Shield, Sparkles, Compass, Key, Cpu, Headphones } from 'lucide-react';

export default function ServicesSection() {
  const services = [
    {
      icon: Key,
      title: 'Đặc Quyền Lái Thử Tận Dinh Thự',
      desc: 'Đội ngũ Concierge vận chuyển siêu xe bằng xe chuyên dụng đến tận dinh thự khách hàng phục vụ lái thử 24/7.',
    },
    {
      icon: Cpu,
      title: 'Bespoke Personalization',
      desc: 'Cá nhân hóa khoang nội thất, phối màu sơn cá thể hóa Ad Personam / Tailor Made độc quyền từ nhà máy.',
    },
    {
      icon: Shield,
      title: 'Bảo Hành & Đội Ngũ Kỹ Thuật Quốc Tế',
      desc: 'Kỹ sư được đào tạo và cấp chứng chỉ trực tiếp từ Ferrari Maranello & Sant’Agata Bolognese.',
    },
    {
      icon: Compass,
      title: 'Đổi Xe & Ký Gửi Siêu Xe Uy Tín',
      desc: 'Thẩm định 160 điểm kỹ thuật chính xác, định giá siêu xe minh bạch, thủ tục ký gửi sang tên nhanh chóng trong ngày.',
    },
  ];

  return (
    <section className="py-24 bg-[#0A0A0E] border-t border-white/5 relative">
      <div className="lux-container space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="lux-eyebrow justify-center">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            UNMATCHED LUXURY PRIVILEGES
          </div>
          <h2 className="font-serif-lux text-4xl sm:text-5xl font-bold text-white">
            Đặc Quyền Dành Cho <span className="lux-gradient-gold-text italic">Chủ Sở Hữu VIP</span>
          </h2>
          <p className="text-xs text-slate-400">
            Chúng tôi không chỉ trao chìa khóa một chiếc siêu xe, chúng tôi mang đến chuẩn mực sống đỉnh cao.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="lux-card p-8 space-y-4 bg-[#0E0E12] border border-white/10 hover:border-[#D4AF37] transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-[#070709] transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif-lux text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}