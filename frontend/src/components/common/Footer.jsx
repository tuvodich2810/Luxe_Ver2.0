import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Phone, Mail, ArrowRight, ShieldCheck, Award, Clock } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#050507] border-t border-[#D4AF37]/20 pt-20 pb-10 text-slate-400 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#D4AF37]/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="lux-container relative z-10">
        {/* Top VIP Privileges Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-16 border-b border-white/10">
          <div className="flex items-start gap-4 p-5 rounded bg-[#0E0E12] border border-white/5 hover:border-[#D4AF37]/30 transition-all">
            <div className="p-3 rounded bg-[#D4AF37]/10 text-[#D4AF37]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif-lux text-lg text-white font-medium">Bảo Hành Chính Hãng 5 Năm</h4>
              <p className="text-xs text-slate-400 mt-1">Đầy đủ tiêu chuẩn bảo hành từ hãng siêu xe toàn cầu.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded bg-[#0E0E12] border border-white/5 hover:border-[#D4AF37]/30 transition-all">
            <div className="p-3 rounded bg-[#D4AF37]/10 text-[#D4AF37]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif-lux text-lg text-white font-medium">Đại Lý Ủy Quyền Độc Quyền</h4>
              <p className="text-xs text-slate-400 mt-1">Nhập khẩu chính ngạch các phiên bản giới hạn Limited Edition.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded bg-[#0E0E12] border border-white/5 hover:border-[#D4AF37]/30 transition-all">
            <div className="p-3 rounded bg-[#D4AF37]/10 text-[#D4AF37]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif-lux text-lg text-white font-medium">Dịch Vụ Lái Thử Tận Nhà 24/7</h4>
              <p className="text-xs text-slate-400 mt-1">Đưa xe đến tận dinh thự khách hàng phục vụ lái thử.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 py-16 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <span className="font-serif-lux text-2xl font-bold tracking-wider text-white">
                LUXE<span className="text-[#D4AF37] italic">MOTORS</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              LuxeMotors là điểm đến hàng đầu dành cho giới thượng lưu đam mê tốc độ và sự hoàn mỹ.
              Chúng tôi cung cấp những mẫu Hypercar, Supercar và Luxury SUV chính hãng từ Ferrari, Lamborghini, Porsche, Rolls-Royce và Bentley.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-mono-lux text-xs uppercase tracking-widest text-white mb-6">
              Bộ Sưu Tập
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <Link to="/cars?category=hypercar" className="hover:text-[#D4AF37] transition-colors">
                  Dòng Hypercar Giới Hạn
                </Link>
              </li>
              <li>
                <Link to="/cars?category=supercar" className="hover:text-[#D4AF37] transition-colors">
                  Supercar Thể Thao
                </Link>
              </li>
              <li>
                <Link to="/cars?category=suv" className="hover:text-[#D4AF37] transition-colors">
                  Luxury SUV Thượng Lưu
                </Link>
              </li>
              <li>
                <Link to="/cars?status=available" className="hover:text-[#D4AF37] transition-colors">
                  Xe Có Sẵn Giao Ngay
                </Link>
              </li>
            </ul>
          </div>

          {/* Showroom Hubs */}
          <div>
            <h4 className="font-mono-lux text-xs uppercase tracking-widest text-white mb-6">
              Flagship Showrooms
            </h4>
            <div className="space-y-4 text-xs">
              <div>
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> Hà Nội Flagship
                </p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Số 18 Lý Thường Kiệt, Q. Hoàn Kiếm, Hà Nội
                </p>
              </div>
              <div>
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> Hồ Chí Minh Flagship
                </p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Số 88 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh
                </p>
              </div>
            </div>
          </div>

          {/* Concierge Hotline */}
          <div>
            <h4 className="font-mono-lux text-xs uppercase tracking-widest text-white mb-6">
              VIP Concierge
            </h4>
            <div className="space-y-3 text-xs">
              <a href="tel:1900888999" className="flex items-center gap-2 text-white hover:text-[#D4AF37] transition-colors">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-mono-lux font-bold text-sm">1900 888 999</span>
              </a>
              <a href="mailto:vip@luxemotors.vn" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <span>vip@luxemotors.vn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 LuxeMotors Vietnam. All Rights Reserved. Designed with UI/UX Pro Max Standard.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-slate-300">Chính sách bảo mật</Link>
            <Link to="#" className="hover:text-slate-300">Điều khoản dịch vụ</Link>
            <Link to="#" className="hover:text-slate-300">Bảo hành & Bảo dưỡng</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}