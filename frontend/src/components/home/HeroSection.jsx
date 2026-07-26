import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

const HeroSection = () => {
  const containerRef = useRef(null);
  const ghostTextRef = useRef(null);

  // ===================================
  // GSAP: Ghost text parallax on mousemove
  // ===================================
  useEffect(() => {
    const container = containerRef.current;
    const ghostText = ghostTextRef.current;
    if (!container || !ghostText) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY, currentTarget } = e;
      const { width, height } = currentTarget.getBoundingClientRect();

      // Tính toán offset dựa trên vị trí chuột
      const xPercent = (clientX / width - 0.5) * 30;
      const yPercent = (clientY / height - 0.5) * 15;

      gsap.to(ghostText, {
        x: xPercent,
        y: yPercent,
        duration: 1.5,
        ease: 'power2.out',
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation variants cho text
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[700px] flex items-center overflow-hidden bg-black"
    >
      {/* ===================================
          Background Image
          =================================== */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2940&auto=format"
          alt="Siêu xe cao cấp"
          className="w-full h-full object-cover object-center opacity-40"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* ===================================
          Ghost Text (Signature element)
          Chữ model xe cực lớn làm background
          =================================== */}
      <div
        ref={ghostTextRef}
        className="absolute inset-0 flex items-center justify-end pr-8 overflow-hidden pointer-events-none select-none"
      >
        <span
          className="font-display font-bold leading-none"
          style={{
            fontSize: 'clamp(100px, 20vw, 280px)',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(201, 169, 110, 0.06)',
            userSelect: 'none',
          }}
        >
          URUS
        </span>
      </div>

      {/* ===================================
          Content
          =================================== */}
      <div className="container-luxury relative z-10">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <motion.p
            initial="hidden"
            animate="visible"
            custom={0.2}
            variants={textVariants}
            className="eyebrow mb-6"
          >
            Bộ sưu tập 2024 — Đặc biệt
          </motion.p>

          {/* Heading chính */}
          <motion.h1
            initial="hidden"
            animate="visible"
            custom={0.4}
            variants={textVariants}
            className="heading-display text-white mb-6"
            style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)' }}
          >
            Đỉnh cao{' '}
            <span className="italic text-gradient-gold">nghệ thuật</span>
            <br />
            chuyển động
          </motion.h1>

          {/* Mô tả */}
          <motion.p
            initial="hidden"
            animate="visible"
            custom={0.6}
            variants={textVariants}
            className="text-silver text-lg font-light leading-relaxed mb-10 max-w-xl"
          >
            Khám phá bộ sưu tập siêu xe hàng đầu thế giới. Từ Lamborghini đến Ferrari, từ Porsche đến Rolls-Royce — mỗi chiếc xe là một tác phẩm nghệ thuật.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.8}
            variants={textVariants}
            className="flex flex-wrap gap-4"
          >
            <Link to="/cars" className="btn-primary">
              Khám phá bộ sưu tập
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link to="/contact" className="btn-ghost">
              Tư vấn miễn phí
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={1}
            variants={textVariants}
            className="flex gap-12 mt-16 pt-12 border-t border-white/10"
          >
            {[
              { value: '150+', label: 'Xe trong kho' },
              { value: '50+', label: 'Thương hiệu' },
              { value: '2,000+', label: 'Khách hàng' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl font-light text-white">{stat.value}</p>
                <p className="text-xs text-silver uppercase tracking-wider mt-1 font-label">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ===================================
          Scroll indicator
          =================================== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="eyebrow text-[9px] text-silver/60">Cuộn xuống</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-12 bg-gradient-to-b from-gold/50 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;