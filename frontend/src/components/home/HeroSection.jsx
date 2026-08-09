import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Compass, PhoneCall } from 'lucide-react';

const HERO_SLIDES = [
  {
    title: 'FERRARI SF90 STRADALE',
    subtitle: 'KỶ NGUYÊN HYBRID 1,000 MÃ LỰC ĐỈNH CAO',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=2000',
    topSpeed: '340 KM/H',
    accel: '2.5s (0-100)',
    price: '34.500.000.000 ₫',
  },
  {
    title: 'ROLLS-ROYCE PHANTOM VIII',
    subtitle: 'ĐỈNH CAO THƯƠNG GIA & BẢO TÀNG DI ĐỘNG',
    image: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&q=80&w=2000',
    topSpeed: '250 KM/H',
    accel: '5.3s (0-100)',
    price: '48.000.000.000 ₫',
  },
  {
    title: 'LAMBORGHINI REVUELTO',
    subtitle: 'V12 PLUG-IN HYBRID SUPER SPORTS',
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=2000',
    topSpeed: '350 KM/H',
    accel: '2.5s (0-100)',
    price: '43.600.000.000 ₫',
  },
  {
    title: 'PORSCHE 911 GT3 RS',
    subtitle: 'ĐỈNH CAO KHÍ ĐỘNG HỌC ĐƯỜNG ĐUA',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=2000',
    topSpeed: '296 KM/H',
    accel: '3.2s (0-100)',
    price: '19.800.000.000 ₫',
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Images */}
      {HERO_SLIDES.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
          }`}
          style={{ transitionProperty: 'opacity, transform', transitionDuration: '1.4s' }}
        >
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-black/50 to-black/80" />
        </div>
      ))}

      {/* Hero Main Banner Content */}
      <div className="lux-container relative z-20 py-20 flex flex-col justify-between min-h-[82vh]">
        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono-lux uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            LUXURY SUPERCAR FLAGSHIP SHOWROOM
          </div>

          <h1 className="font-serif-lux text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.05]">
            {slide.title.split(' ')[0]}{' '}
            <span className="lux-gradient-gold-text italic font-normal">
              {slide.title.split(' ').slice(1).join(' ')}
            </span>
          </h1>

          <p className="font-mono-lux text-xs md:text-sm tracking-[0.25em] text-[#D4AF37] uppercase font-semibold">
            {slide.subtitle}
          </p>

          <p className="text-slate-300 text-xs md:text-sm max-w-xl font-light leading-relaxed">
            Dành riêng cho những chủ nhân kiệt xuất. Trải nghiệm tuyệt tác kỹ nghệ cơ khí độc bản và dịch vụ VIP Concierge tận nơi.
          </p>

          {/* Clean Specs Bar */}
          <div className="flex flex-wrap items-center gap-8 pt-4 pb-4 border-y border-white/15 max-w-2xl">
            <div>
              <span className="font-mono-lux text-[10px] text-slate-400 uppercase tracking-widest block">Tốc Độ Tối Đa</span>
              <span className="font-serif-lux text-2xl text-[#D4AF37] font-bold">{slide.topSpeed}</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div>
              <span className="font-mono-lux text-[10px] text-slate-400 uppercase tracking-widest block">Tăng Tốc (0-100)</span>
              <span className="font-serif-lux text-2xl text-white font-bold">{slide.accel}</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div>
              <span className="font-mono-lux text-[10px] text-slate-400 uppercase tracking-widest block">Giá Niêm Yết</span>
              <span className="font-serif-lux text-2xl text-[#D4AF37] font-bold">{slide.price}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/cars" className="btn-lux-gold px-8 py-4 text-xs tracking-wider flex items-center gap-2 group">
              <span>KHÁM PHÁ BỘ SƯU TẬP XE</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/contact" className="btn-lux-outline px-8 py-4 text-xs tracking-wider flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#D4AF37]" />
              <span>LIÊN HỆ TƯ VẤN RIÊNG</span>
            </Link>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8">
          <div className="flex items-center gap-3">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === currentSlide ? 'w-12 bg-[#D4AF37]' : 'w-4 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-6 text-xs font-mono-lux text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              Nhập Khẩu Chính Hãng 100%
            </span>
            <span>•</span>
            <span className="text-slate-300">Giao Xe Tận Nơi Dinh Thự</span>
          </div>
        </div>
      </div>
    </section>
  );
}