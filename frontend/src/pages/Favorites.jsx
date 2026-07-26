import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar  from '@/components/common/Navbar';
import Footer  from '@/components/common/Footer';
import CarCard from '@/components/cars/CarCard';
import Button  from '@/components/common/Button';
import { useFavorites } from '@/hooks/useFavorites';
import api from '@/services/api';

export default function Favorites() {
  const [cars,    setCars]    = useState([]);
  const [loading, setLoading] = useState(true);
  const { isFavorited, isPending, toggleFavorite } = useFavorites();

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/favorites');
      setCars((res.data || []).filter(f => f.car).map(f => f.car));
    } catch { setCars([]); }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => { fetchFavorites(); }, [fetchFavorites]);

  const handleToggle = async (carId) => {
    const result = await toggleFavorite(carId);
    if (result?.success && !result.isFavorited) {
      setCars(prev => prev.filter(c => c._id !== carId));
    }
    return result;
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, background: 'var(--black)', minHeight: '100vh' }}>

        <div style={{ padding: '48px 0 36px', borderBottom: '1px solid var(--border)' }}>
          <div className="lux-container">
            <p className="eyebrow mb-3">Bộ sưu tập cá nhân</p>
            <div style={{
              display: 'flex', alignItems: 'flex-end',
              justifyContent: 'space-between', gap: 12,
            }}>
              <h1 style={{
                fontFamily: 'Cormorant Garamond',
                fontSize: 'clamp(2rem,4vw,3rem)',
                fontWeight: 300, color: 'var(--white)',
              }}>
                Xe yêu thích
              </h1>
              {!loading && (
                <p style={{
                  fontFamily: 'Space Grotesk', fontSize: 11,
                  color: 'var(--muted)', letterSpacing: '0.1em',
                }}>
                  {cars.length} xe
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="lux-container" style={{ padding: '40px 40px 80px' }}>
          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 18,
            }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="lux-card" style={{ overflow: 'hidden' }}>
                  <div className="skeleton" style={{ aspectRatio: '16/9' }} />
                  <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="skeleton" style={{ height: 9,  width: '35%' }} />
                    <div className="skeleton" style={{ height: 20, width: '65%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : cars.length > 0 ? (
            <motion.div layout style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 18,
            }}>
              <AnimatePresence>
                {cars.map((car, i) => (
                  <motion.div key={car._id} layout
                    exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.25 } }}>
                    <CarCard car={car} index={i}
                      isFavorited={isFavorited(car._id)}
                      isFavoritePending={isPending(car._id)}
                      onToggleFavorite={handleToggle}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <svg width="48" height="48" fill="none" stroke="currentColor"
                strokeWidth="1" viewBox="0 0 24 24"
                style={{ color: 'rgba(255,255,255,0.1)', margin: '0 auto 16px' }}>
                <path d="M12 21s-6.7-4.35-9.3-8.2C.8 9.94 1.4 6.2 4.4 4.7
                         c2.3-1.15 4.8-.3 6.1 1.5l1.5 2 1.5-2
                         c1.3-1.8 3.8-2.65 6.1-1.5
                         3 1.5 3.6 5.24 1.7 8.1C18.7 16.65 12 21 12 21z"/>
              </svg>
              <p style={{
                fontFamily: 'Cormorant Garamond', fontSize: 32,
                fontWeight: 300, color: 'rgba(255,255,255,0.18)', marginBottom: 12,
              }}>
                Chưa có xe yêu thích nào
              </p>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 28 }}>
                Nhấn biểu tượng trái tim trên các mẫu xe bạn quan tâm
              </p>
              <Link to="/cars">
                <Button variant="primary" size="md">Khám phá bộ sưu tập</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}