import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Shield, Zap, Compass, ChevronRight } from 'lucide-react';

const HERO_SLIDES = [
  {
    title: 'FERRARI SF90 STRADALE',
    subtitle: 'KỶ NGUYÊN HYBRID 1,000 MA LỰC',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=2000',
    topSpeed: '340 KM/H',
    accel: '2.5s (0-100)',
    price: '$625,000',
  },
  {
    title: 'LAMBORGHINI REVUELTO',
    subtitle: 'V12 PLUG-IN HYBRID SUPER SPORTS',
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=2000',
    topSpeed: '350 KM/H',
    accel: '2.5s (0-100)',
    price: '$608,000',
  },
  {
    title: 'PORSCHE 911 GT3 RS',
    subtitle: 'ĐỈNH CAO KHÍ ĐỘNG HỌC ĐƯỜNG ĐUA',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=2000',
    topSpeed: '296 KM/H',
    accel: '3.2s (0-100)',
    price: '$312,000',
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
      {/* Background Image Carousel with Smooth Fade */}
      {HERO_SLIDES.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
          }`}
          style={{ transitionProperty: 'opacity, transform', transitionDuration: '1.2s' }}
        >
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-black/40 to-black/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/30 to-[#070709]" />
        </div>
      ))}

      {/* Hero Content Overlay */}
      <div className="lux-container relative z-20 py-24 flex flex-col justify-between min-h-[80vh]">
        <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="lux-eyebrow">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            LUXURY AUTOMOTIVE COLLECTION 2026
          </div>

          <h1 className="font-serif-lux text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-none">
            {slide.title.split(' ')[0]}{' '}
            <span className="lux-gradient-gold-text italic font-normal">
              {slide.title.split(' ').slice(1).join(' ')}
            </span>
          </h1>

          <p className="font-mono-lux text-xs md:text-sm tracking-[0.25em] text-slate-300 uppercase">
            {slide.subtitle}
          </p>

          <p className="text-slate-300 text-sm md:text-base max-w-xl font-light leading-relaxed">
            Trải nghiệm tuyệt tác kỹ nghệ cơ khí độc bản. Chúng tôi mang đến cho chủ sở hữu danh giá
            những mẫu xe huyền thoại cùng dịch vụ cá nhân hóa đặc quyền.
          </p>

          {/* Quick Hero Specs Bar */}
          <div className="flex flex-wrap items-center gap-8 pt-4 pb-4 border-y border-white/15 max-w-2xl">
            <div>
              <span className="font-mono-lux text-[10px] text-slate-400 uppercase tracking-widest block">Tốc Độ Tối Đa</span>
              <span className="font-serif-lux text-2xl text-[#D4AF37] font-bold">{slide.topSpeed}</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div>
              <span className="font-mono-lux text-[10px] text-slate-400 uppercase tracking-widest block">Tăng Tốc</span>
              <span className="font-serif-lux text-2xl text-white font-bold">{slide.accel}</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div>
              <span className="font-mono-lux text-[10px] text-slate-400 uppercase tracking-widest block">Giá Tham Chiếu</span>
              <span className="font-serif-lux text-2xl text-[#D4AF37] font-bold">{slide.price}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/cars" className="btn-lux-gold group">
              <span>Khám phá Showroom</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/contact" className="btn-lux-outline">
              Đặt Lịch Lái Thử Tận Nơi
            </Link>
          </div>
        </div>

        {/* Slide Indicators & Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-12">
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

          {/* Hero Counter Stats */}
          <div className="flex items-center gap-8 text-xs font-mono-lux">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-slate-300">100% Nhập Khẩu Chính Hãng</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-slate-300">Giao Xe Tận Nơi Toàn Quốc</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}