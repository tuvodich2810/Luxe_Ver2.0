import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import Navbar  from '@/components/common/Navbar';
import Footer  from '@/components/common/Footer';
import CarCard from '@/components/cars/CarCard';
import Button  from '@/components/common/Button';
import { useFavorites } from '@/hooks/useFavorites';
import api from '@/services/api';

const Arrow = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor"
    strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
  </svg>
);

/* ─── Hero ───────────────────────────────────── */
function HeroSection() {
  const ref       = useRef(null);
  const ghostRef  = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY  = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    const el = ghostRef.current;
    if (!el) return;
    const move = (e) => {
      const xPct = (e.clientX / window.innerWidth  - 0.5) * 28;
      const yPct = (e.clientY / window.innerHeight - 0.5) * 14;
      gsap.to(el, { x: xPct, y: yPct, duration: 1.6, ease: 'power2.out' });
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <section ref={ref} style={{
      position: 'relative', height: '100vh', minHeight: 680,
      overflow: 'hidden', background: 'var(--black)',
      display: 'flex', alignItems: 'center',
    }}>
      {/* Background parallax */}
      <motion.div style={{ position: 'absolute', inset: '-10%', y: imgY }}>
        <img
          src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2400&auto=format"
          alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.38 }}
        />
      </motion.div>

      {/* Gradients */}
      <div style={{ position: 'absolute', inset: 0,
        background: 'linear-gradient(to right,rgba(10,10,10,0.95) 0%,rgba(10,10,10,0.55) 55%,transparent 100%)' }}/>
      <div style={{ position: 'absolute', inset: 0,
        background: 'linear-gradient(to top,rgba(10,10,10,0.9) 0%,transparent 50%)' }}/>

      {/* Ghost text */}
      <div ref={ghostRef} style={{
        position: 'absolute', right: '4%', bottom: '8%',
        pointerEvents: 'none', userSelect: 'none', overflow: 'hidden',
      }}>
        <span style={{
          fontFamily: 'Cormorant Garamond', fontWeight: 700,
          fontSize: 'clamp(80px,14vw,200px)', lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(201,169,110,0.07)',
        }}>AVENTADOR</span>
      </div>

      {/* Content */}
      <motion.div style={{ position: 'relative', zIndex: 2, width: '100%', y: textY, opacity }}
        className="lux-container">
        <div style={{ maxWidth: 600 }}>
          <motion.p className="eyebrow mb-5"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}>
            Bộ sưu tập 2024 — Đặc biệt
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'Cormorant Garamond',
              fontSize: 'clamp(3rem,7vw,6rem)',
              fontWeight: 300, lineHeight: 0.95,
              letterSpacing: '-0.02em', color: 'var(--white)', marginBottom: 24,
            }}>
            Đỉnh cao<br/>
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>nghệ thuật</em><br/>
            chuyển động
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            style={{
              fontSize: 15, fontWeight: 300, lineHeight: 1.75,
              color: 'var(--silver)', marginBottom: 36, maxWidth: 480,
            }}>
            Khám phá bộ sưu tập siêu xe hàng đầu thế giới. Từ Lamborghini
            đến Ferrari, mỗi chiếc xe là một tác phẩm nghệ thuật.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/cars">
              <Button variant="primary" size="lg" iconRight={<Arrow />}>
                Khám phá bộ sưu tập
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">Tư vấn miễn phí</Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{
              display: 'flex', gap: 40, marginTop: 56,
              paddingTop: 40, borderTop: '1px solid var(--border)',
            }}>
            {[
              { v: '150+',   l: 'Xe trong kho' },
              { v: '50+',    l: 'Thương hiệu'  },
              { v: '2,000+', l: 'Khách hàng'   },
            ].map(({ v, l }) => (
              <div key={l}>
                <p style={{
                  fontFamily: 'Cormorant Garamond', fontSize: 32,
                  fontWeight: 300, color: 'var(--white)', lineHeight: 1,
                }}>{v}</p>
                <p className="eyebrow text-lux-muted mt-1.5" style={{ fontSize: 9 }}>{l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        style={{
          position: 'absolute', bottom: 36, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        }}>
        <span className="eyebrow text-lux-muted" style={{ fontSize: 8 }}>Cuộn xuống</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 1, height: 44,
            background: 'linear-gradient(to bottom,var(--gold),transparent)',
          }}
        />
      </motion.div>
    </section>
  );
}

/* ─── Featured Cars ──────────────────────────── */
function FeaturedCars() {
  const [cars,    setCars]    = useState([]);
  const [loading, setLoading] = useState(true);
  const { isFavorited, isPending, toggleFavorite } = useFavorites();

  useEffect(() => {
    api.get('/cars/featured?limit=6')
      .then(r => setCars(r.data || []))
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section style={{ padding: '96px 0', background: 'var(--black)' }}>
      <div className="lux-container">
        <div style={{
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between', gap: 16, marginBottom: 56,
        }}>
          <div>
            <motion.p className="eyebrow mb-4"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              Đặc sắc của chúng tôi
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.1 }}
              style={{
                fontFamily: 'Cormorant Garamond',
                fontSize: 'clamp(2rem,4vw,3.5rem)',
                fontWeight: 300, color: 'var(--white)',
              }}>
              Xe nổi bật
            </motion.h2>
          </div>
          <Link to="/cars?isFeatured=true">
            <Button variant="ghost" size="sm" iconRight={<Arrow />}>Xem tất cả</Button>
          </Link>
        </div>

        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)', gap: 20,
          }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="lux-card" style={{ overflow: 'hidden' }}>
                <div className="skeleton" style={{ aspectRatio: '16/9' }} />
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="skeleton" style={{ height: 9, width: '40%' }} />
                  <div className="skeleton" style={{ height: 22, width: '70%' }} />
                  <div className="skeleton" style={{ height: 12, width: '50%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 20,
          }}>
            {cars.map((car, i) => (
              <CarCard key={car._id} car={car} index={i}
                isFavorited={isFavorited(car._id)}
                isFavoritePending={isPending(car._id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Brands ─────────────────────────────────── */
function BrandsSection() {
  const [brands, setBrands] = useState([]);
  const FALLBACK = ['Lamborghini','Ferrari','Porsche','Bugatti',
                    'McLaren','Rolls-Royce','Bentley','Aston Martin'];

  useEffect(() => {
    api.get('/brands?featured=true')
      .then(r => {
        if (r.data?.length) setBrands(r.data);
        else setBrands(FALLBACK.map((n, i) => ({ _id: String(i), name: n, logo: '' })));
      })
      .catch(() =>
        setBrands(FALLBACK.map((n, i) => ({ _id: String(i), name: n, logo: '' })))
      );
  }, []);

  return (
    <section style={{
      padding: '80px 0', background: 'var(--card)',
      borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
    }}>
      <div className="lux-container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="eyebrow mb-3">Đối tác chính thức</p>
          <h2 style={{
            fontFamily: 'Cormorant Garamond',
            fontSize: 'clamp(1.8rem,3vw,2.8rem)',
            fontWeight: 300, color: 'var(--white)',
          }}>
            Thương hiệu hàng đầu
          </h2>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
          gap: 1, background: 'var(--border)',
        }}>
          {brands.map((b, i) => (
            <motion.div key={b._id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}>
              <Link to={`/cars?brand=${b._id}`}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--card)', height: 96,
                  cursor: 'pointer', transition: 'background .25s',
                }}
                className="group hover:bg-lux-mid">
                {b.logo ? (
                  <img src={b.logo} alt={b.name} style={{
                    maxHeight: 32, maxWidth: 100, objectFit: 'contain',
                    opacity: 0.5, transition: 'opacity .3s', filter: 'grayscale(1)',
                  }} className="group-hover:opacity-100 group-hover:grayscale-0"/>
                ) : (
                  <span style={{
                    fontFamily: 'Space Grotesk', fontSize: 11,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: 'var(--muted)', transition: 'color .25s',
                  }} className="group-hover:text-lux-gold">
                    {b.name}
                  </span>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Services ───────────────────────────────── */
function ServicesSection() {
  const SVCS = [
    {
      icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
      title: 'Xem xe thực tế',
      desc: 'Đặt lịch hẹn để được trải nghiệm và lái thử siêu xe tại showroom.',
    },
    {
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      title: 'Bảo hành chính hãng',
      desc: 'Tất cả xe được bảo hành chính hãng và kiểm tra kỹ thuật 100 điểm.',
    },
    {
      icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
      title: 'Hỗ trợ tài chính',
      desc: 'Giải pháp tài chính linh hoạt, lãi suất ưu đãi, thủ tục 24 giờ.',
    },
    {
      icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
      title: 'Hậu mãi trọn đời',
      desc: 'Đội ngũ chăm sóc 24/7, sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi.',
    },
  ];

  return (
    <section style={{
      padding: '96px 0', background: 'var(--black)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, right: 0, width: '50%', height: '100%',
        background: 'radial-gradient(ellipse at right center,rgba(201,169,110,0.04) 0%,transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div className="lux-container" style={{ position: 'relative' }}>
        <div style={{ maxWidth: 520, marginBottom: 64 }}>
          <p className="eyebrow mb-4">Tại sao chọn chúng tôi</p>
          <h2 style={{
            fontFamily: 'Cormorant Garamond',
            fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 300, color: 'var(--white)',
          }}>
            Trải nghiệm{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>đẳng cấp</em>
          </h2>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 2, background: 'var(--border)',
        }}>
          {SVCS.map((s, i) => (
            <motion.div key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'flex', gap: 20, padding: '32px 28px',
                background: 'var(--black)', transition: 'background .25s',
              }}
              className="group hover:bg-lux-mid">
              <div style={{
                flexShrink: 0, width: 44, height: 44,
                border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--gold)', transition: 'all .25s',
              }} className="group-hover:bg-lux-gold/10 group-hover:border-lux-gold/40">
                <svg width="18" height="18" fill="none" stroke="currentColor"
                  strokeWidth="1" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                </svg>
              </div>
              <div>
                <h3 style={{
                  fontFamily: 'Cormorant Garamond', fontSize: 20,
                  fontWeight: 300, color: 'var(--white)',
                  marginBottom: 8, transition: 'color .25s',
                }} className="group-hover:text-lux-gold">
                  {s.title}
                </h3>
                <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.7, color: 'var(--muted)' }}>
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Banner ─────────────────────────────── */
function CTABanner() {
  return (
    <section style={{
      position: 'relative', overflow: 'hidden',
      background: 'var(--card)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      padding: '80px 0',
    }}>
      <img
        src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=60&w=1800&auto=format"
        alt="" style={{
          position: 'absolute', inset: 0, width: '100%',
          height: '100%', objectFit: 'cover', opacity: 0.1,
        }}
      />
      <div className="lux-container" style={{ position: 'relative', textAlign: 'center' }}>
        <motion.p className="eyebrow mb-4"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          Sẵn sàng trải nghiệm?
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.1 }}
          style={{
            fontFamily: 'Cormorant Garamond',
            fontSize: 'clamp(2rem,5vw,4rem)',
            fontWeight: 300, color: 'var(--white)',
            marginBottom: 28, lineHeight: 1.1,
          }}>
          Tìm chiếc xe hoàn hảo<br/>của bạn ngay hôm nay
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.2 }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/cars">
            <Button variant="primary" size="lg" iconRight={<Arrow />}>Xem bộ sưu tập</Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" size="lg">Liên hệ tư vấn</Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedCars />
        <BrandsSection />
        <ServicesSection />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}