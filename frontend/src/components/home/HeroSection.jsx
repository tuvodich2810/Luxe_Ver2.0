import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  PhoneCall,
  Zap,
  Clock,
} from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 'ferrari-sf90',
    indexNum: '01',
    brand: 'FERRARI',
    model: 'SF90 STRADALE',
    tag: 'HYPERCAR HYBRID',
    power: '1,000 HP',
    accel: '2.5s (0-100 km/h)',
    speed: '340 km/h',
    desc: 'Đỉnh cao cơ khí Maranello kết hợp hệ dẫn động 3 mô-tơ điện cùng động cơ V8 Twin-Turbo.',
    price: '34.500.000.000 ₫',
    image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=95&w=2560',
  },
  {
    id: 'rolls-royce-phantom',
    indexNum: '02',
    brand: 'ROLLS-ROYCE',
    model: 'PHANTOM VIII',
    tag: 'ULTRA LUXURY SEDAN',
    power: '563 HP',
    accel: '5.3s (0-100 km/h)',
    speed: '250 km/h',
    desc: 'Bảo tàng nghệ thuật di động với trần sao Starlight Headliner và khoang thương gia biệt lập.',
    price: '48.000.000.000 ₫',
    image: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&q=95&w=2560',
  },
  {
    id: 'lamborghini-revuelto',
    indexNum: '03',
    brand: 'LAMBORGHINI',
    model: 'REVUELTO',
    tag: 'V12 HPEV SUPERCAR',
    power: '1,015 HP',
    accel: '2.5s (0-100 km/h)',
    speed: '350 km/h',
    desc: 'Siêu xe V12 Hybrid Plug-in đầu tiên của Sant’Agata Bolognese với khung gầm Monofuselage Carbon.',
    price: '43.600.000.000 ₫',
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=95&w=2560',
  },
  {
    id: 'porsche-gt3-rs',
    indexNum: '04',
    brand: 'PORSCHE',
    model: '911 GT3 RS',
    tag: 'TRACK WEISSACH',
    power: '525 HP',
    accel: '3.2s (0-100 km/h)',
    speed: '296 km/h',
    desc: 'Vũ khí đường đua hợp pháp với cánh gió thủy lực DRS và hệ thống treo khí động học thông minh.',
    price: '19.800.000.000 ₫',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=95&w=2560',
  },
];

const SLIDE_DURATION_MS = 6000;

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    setProgress(0);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    setProgress(0);
  }, []);

  const goToSlide = (idx) => {
    setCurrentSlide(idx);
    setProgress(0);
  };

  // Real-time animation ticker loop (60fps requestAnimationFrame time-based loop)
  useEffect(() => {
    let animationFrameId;
    let lastTime = performance.now();

    const updateTimer = (now) => {
      const delta = now - lastTime;
      lastTime = now;

      if (!isPaused) {
        setProgress((prev) => {
          const nextVal = prev + (delta / SLIDE_DURATION_MS) * 100;
          if (nextVal >= 100) {
            nextSlide();
            return 0;
          }
          return nextVal;
        });
      }

      animationFrameId = requestAnimationFrame(updateTimer);
    };

    animationFrameId = requestAnimationFrame(updateTimer);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, nextSlide]);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section
      className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden pt-20 select-none bg-[#050508]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 
        CINEMATIC REAL-TIME CONTINUOUS MOTION CANVAS
        Hình ảnh luôn chuyển động nhẹ nhàng theo thời gian (Slow Ken-Burns Camera Drift)
      */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="w-full h-full flex"
          style={{
            transform: `translate3d(-${currentSlide * 100}%, 0, 0)`,
            transition: 'transform 1.3s cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'transform',
          }}
        >
          {HERO_SLIDES.map((s, idx) => {
            const isCurrent = idx === currentSlide;
            // Tính toán mức zoom và trượt theo progress thực tế
            const currentScale = isCurrent ? 1.02 + (progress / 100) * 0.06 : 1.08;
            const currentPanX = isCurrent ? -(progress / 100) * 20 : 0;

            return (
              <div
                key={s.id}
                className="w-full h-full flex-shrink-0 relative overflow-hidden"
              >
                <img
                  src={s.image}
                  alt={`${s.brand} ${s.model}`}
                  loading="eager"
                  className="w-full h-full object-cover object-center filter brightness-[0.80] contrast-105"
                  style={{
                    transform: `scale(${currentScale}) translate3d(${currentPanX}px, 0, 0)`,
                    transition: isPaused ? 'transform 0.5s ease-out' : 'transform 0.1s linear',
                    willChange: 'transform',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Ambient Light Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-black/45 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-transparent z-10 pointer-events-none" />
      </div>

      {/* Main Content: Typography & Real-time Live Counters */}
      <div className="lux-container relative z-20 py-12 flex flex-col justify-between min-h-[78vh] space-y-8">
        {/* Compact Typography Area */}
        <div className="max-w-xl space-y-4 pt-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3"
            >
              {/* Category Pill with Real-time Slide Number */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] font-mono-lux uppercase tracking-widest backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                <span className="font-bold">{slide.indexNum} / 04</span>
                <span>•</span>
                <span>{slide.tag}</span>
              </div>

              {/* Smaller, Refined Luxury Title */}
              <h1 className="font-serif-lux text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                {slide.brand}{' '}
                <span className="lux-gradient-gold-text italic font-normal">
                  {slide.model}
                </span>
              </h1>

              {/* Spec Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <span className="px-2.5 py-0.5 rounded bg-black/50 border border-white/15 text-white font-mono-lux text-[11px] font-semibold flex items-center gap-1 backdrop-blur-sm">
                  <Zap className="w-3 h-3 text-[#D4AF37]" /> {slide.power}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-black/50 border border-white/15 text-slate-200 font-mono-lux text-[11px] backdrop-blur-sm">
                  {slide.accel}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-black/50 border border-white/15 text-slate-200 font-mono-lux text-[11px] backdrop-blur-sm">
                  Max: {slide.speed}
                </span>
              </div>

              <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed max-w-lg">
                {slide.desc}
              </p>

              {/* Price Display */}
              <div className="pt-1">
                <span className="text-[10px] font-mono-lux text-slate-400 uppercase tracking-widest block">
                  Giá Niêm Yết Chuẩn VNĐ (Đã Gồm VAT):
                </span>
                <span className="font-serif-lux text-2xl sm:text-3xl text-[#D4AF37] font-bold tracking-wide">
                  {slide.price}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/cars"
              className="btn-lux-gold px-6 py-3 text-xs font-mono-lux font-bold tracking-wider uppercase flex items-center gap-2 shadow-xl hover:scale-102 transition-all"
            >
              <span>KHÁM PHÁ BỘ SƯU TẬP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/appointment"
              className="px-5 py-3 rounded-xl bg-black/50 hover:bg-black/80 border border-white/20 hover:border-[#D4AF37] text-xs font-mono-lux text-white hover:text-[#D4AF37] flex items-center gap-2 transition-all backdrop-blur-md"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>ĐẶT LỊCH LÁI THỬ TẬN NHÀ</span>
            </Link>
          </div>
        </div>

        {/* Real-time Smooth Progress Timeline Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            {/* Prev Button */}
            <button
              onClick={prevSlide}
              className="w-8 h-8 rounded-full bg-black/40 hover:bg-[#D4AF37] border border-white/20 hover:border-[#D4AF37] text-white hover:text-black flex items-center justify-center transition-all cursor-pointer backdrop-blur-md active:scale-90"
              title="Siêu xe trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* 4 Continuous Time Progress Indicators */}
            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((s, idx) => {
                const isCurrent = idx === currentSlide;
                const isPast = idx < currentSlide;
                return (
                  <button
                    key={s.id}
                    onClick={() => goToSlide(idx)}
                    className="relative h-2 rounded-full overflow-hidden bg-white/15 hover:bg-white/30 transition-all cursor-pointer"
                    style={{ width: isCurrent ? '56px' : '20px' }}
                    title={`${s.brand} ${s.model}`}
                  >
                    {/* Fill bar driven continuously in real time */}
                    <div
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFF0A0] shadow-[0_0_8px_rgba(212,175,55,0.9)]"
                      style={{
                        width: isCurrent
                          ? `${progress}%`
                          : isPast
                          ? '100%'
                          : '0%',
                        transition: isCurrent ? 'none' : 'width 0.3s ease',
                      }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="w-8 h-8 rounded-full bg-black/40 hover:bg-[#D4AF37] border border-white/20 hover:border-[#D4AF37] text-white hover:text-black flex items-center justify-center transition-all cursor-pointer backdrop-blur-md active:scale-90"
              title="Siêu xe tiếp theo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Real-time Status */}
          <div className="flex items-center gap-4 text-xs font-mono-lux text-slate-300">
            <span className="flex items-center gap-1.5 text-[#D4AF37]">
              <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              {isPaused ? 'Đang tạm dừng' : 'Tự động trình chiếu 4K'}
            </span>
            <span>•</span>
            <span className="text-slate-300">Giao Xe Tận Dinh Thự</span>
            <span>•</span>
            <a
              href="tel:0372950720"
              className="text-[#D4AF37] hover:underline flex items-center gap-1 font-bold"
            >
              <PhoneCall className="w-3 h-3" /> Hotline: 0372 950 720
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}