import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar  from '@/components/common/Navbar';
import Footer  from '@/components/common/Footer';
import CarCard from '@/components/cars/CarCard';
import Button  from '@/components/common/Button';
import { useFavorites } from '@/hooks/useFavorites';
import api from '@/services/api';

const SORT_OPTS = [
  { v: '-createdAt', l: 'Mới nhất'       },
  { v: 'price',      l: 'Giá tăng dần'   },
  { v: '-price',     l: 'Giá giảm dần'   },
  { v: '-views',     l: 'Xem nhiều nhất' },
];

const CATS = [
  { v: '',            l: 'Tất cả'     },
  { v: 'supercar',    l: 'Supercar'   },
  { v: 'hypercar',    l: 'Hypercar'   },
  { v: 'suv',         l: 'SUV'        },
  { v: 'sedan',       l: 'Sedan'      },
  { v: 'coupe',       l: 'Coupe'      },
  { v: 'convertible', l: 'Convertible'},
];

const CONDS = [
  { v: '',          l: 'Tất cả'   },
  { v: 'new',       l: 'Xe mới'   },
  { v: 'used',      l: 'Đã dùng'  },
  { v: 'certified', l: 'Certified'},
];

/* ─── Sidebar Filter ─────────────────────────── */
function Sidebar({ filters, brands, onChange, onReset }) {
  const set = (k, v) => onChange({ ...filters, [k]: v });

  return (
    <aside style={{ width: 230, flexShrink: 0 }}>
      <div style={{
        position: 'sticky', top: 88,
        background: 'var(--card)', border: '1px solid var(--border)', padding: 24,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: 24,
        }}>
          <p className="eyebrow">Bộ lọc</p>
          <button onClick={onReset}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: 9, padding: 0 }}>
            Xóa tất cả
          </button>
        </div>

        {/* Search */}
        <div style={{ marginBottom: 20 }}>
          <label className="lux-label">Tìm kiếm</label>
          <input className="lux-input"
            value={filters.search || ''}
            onChange={e => set('search', e.target.value)}
            placeholder="Tên xe, model..."
          />
        </div>

        {/* Brand */}
        <div style={{ marginBottom: 20 }}>
          <label className="lux-label">Thương hiệu</label>
          <select className="lux-select lux-input"
            value={filters.brand || ''}
            onChange={e => set('brand', e.target.value)}>
            <option value="">Tất cả</option>
            {brands.map(b => (
              <option key={b._id} value={b._id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div style={{ marginBottom: 20 }}>
          <label className="lux-label" style={{ marginBottom: 10 }}>Loại xe</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {CATS.map(c => (
              <button key={c.v}
                onClick={() => set('category', c.v)}
                className={`btn btn-sm ${filters.category === c.v ? 'btn-gold' : 'btn-outline'}`}
                style={{ padding: '7px 12px', fontSize: 9 }}>
                {c.l}
              </button>
            ))}
          </div>
        </div>

        {/* Condition */}
        <div style={{ marginBottom: 20 }}>
          <label className="lux-label" style={{ marginBottom: 10 }}>Tình trạng</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {CONDS.map(c => (
              <button key={c.v}
                onClick={() => set('condition', c.v)}
                className={`btn btn-sm ${filters.condition === c.v ? 'btn-gold' : 'btn-outline'}`}
                style={{ padding: '7px 12px', fontSize: 9 }}>
                {c.l}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="lux-label">Khoảng giá (VNĐ)</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
            <div>
              <label className="lux-label" style={{ fontSize: 8 }}>Từ</label>
              <input className="lux-input" type="number"
                value={filters.minPrice || ''}
                onChange={e => set('minPrice', e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <label className="lux-label" style={{ fontSize: 8 }}>Đến</label>
              <input className="lux-input" type="number"
                value={filters.maxPrice || ''}
                onChange={e => set('maxPrice', e.target.value)}
                placeholder="∞"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ─── Page ───────────────────────────────────── */
export default function CarList() {
  const [searchParams] = useSearchParams();
  const [cars,    setCars]    = useState([]);
  const [meta,    setMeta]    = useState(null);
  const [brands,  setBrands]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort,    setSort]    = useState('-createdAt');
  const [page,    setPage]    = useState(1);
  const [filters, setFilters] = useState({
    search:     searchParams.get('search')    || '',
    brand:      searchParams.get('brand')     || '',
    category:   searchParams.get('category')  || '',
    condition:  searchParams.get('condition') || '',
    minPrice:   searchParams.get('minPrice')  || '',
    maxPrice:   searchParams.get('maxPrice')  || '',
    isFeatured: searchParams.get('isFeatured')|| '',
  });
  const { isFavorited, isPending, toggleFavorite } = useFavorites();

  useEffect(() => {
    api.get('/brands')
      .then(r => setBrands(r.data || []))
      .catch(() => {});
  }, []);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const clean = Object.fromEntries(
        Object.entries({ ...filters, sort, page, limit: 12 })
          .filter(([, v]) => v !== '')
      );
      const res = await api.get('/cars', { params: clean });
      setCars(res.data || []);
      setMeta(res.meta);
    } catch { setCars([]); }
    finally  { setLoading(false); }
  }, [filters, sort, page]);

  useEffect(() => {
    fetchCars();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchCars]);

  const handleReset = () => {
    setFilters({
      search: '', brand: '', category: '',
      condition: '', minPrice: '', maxPrice: '', isFeatured: '',
    });
    setPage(1);
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--black)' }}>

        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border)', padding: '40px 0 32px' }}>
          <div className="lux-container">
            <p className="eyebrow mb-2">Danh mục xe</p>
            <div style={{
              display: 'flex', alignItems: 'flex-end',
              justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
            }}>
              <h1 style={{
                fontFamily: 'Cormorant Garamond',
                fontSize: 'clamp(2rem,4vw,3rem)',
                fontWeight: 300, color: 'var(--white)',
              }}>
                Bộ sưu tập xe
              </h1>
              {meta && (
                <p style={{
                  fontFamily: 'Space Grotesk', fontSize: 11,
                  color: 'var(--muted)', letterSpacing: '0.1em',
                }}>
                  {meta.total} xe
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="lux-container" style={{ padding: '32px 40px' }}>
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>

            {/* Sidebar */}
            <Sidebar
              filters={filters} brands={brands}
              onChange={f => { setFilters(f); setPage(1); }}
              onReset={handleReset}
            />

            {/* Main */}
            <div style={{ flex: 1, minWidth: 0 }}>

              {/* Sort */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                {SORT_OPTS.map(o => (
                  <button key={o.v}
                    onClick={() => { setSort(o.v); setPage(1); }}
                    className={`btn btn-sm ${sort === o.v ? 'btn-primary' : 'btn-outline'}`}>
                    {o.l}
                  </button>
                ))}
              </div>

              {/* Grid */}
              {loading ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 18,
                }}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="lux-card" style={{ overflow: 'hidden' }}>
                      <div className="skeleton" style={{ aspectRatio: '16/9' }} />
                      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div className="skeleton" style={{ height: 9,  width: '35%' }} />
                        <div className="skeleton" style={{ height: 20, width: '65%' }} />
                        <div className="skeleton" style={{ height: 11, width: '45%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {cars.length > 0 ? (
                    <motion.div key="grid"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 18,
                      }}>
                      {cars.map((car, i) => (
                        <CarCard key={car._id} car={car} index={i}
                          isFavorited={isFavorited(car._id)}
                          isFavoritePending={isPending(car._id)}
                          onToggleFavorite={toggleFavorite}
                        />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div key="empty"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ textAlign: 'center', padding: '80px 0' }}>
                      <p style={{
                        fontFamily: 'Cormorant Garamond', fontSize: 36,
                        fontWeight: 300, color: 'rgba(255,255,255,0.15)', marginBottom: 12,
                      }}>
                        Không tìm thấy xe
                      </p>
                      <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>
                        Hãy thử thay đổi bộ lọc
                      </p>
                      <Button variant="outline" size="sm" onClick={handleReset}>
                        Xóa bộ lọc
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <div style={{
                  display: 'flex', justifyContent: 'center',
                  gap: 6, marginTop: 40,
                }}>
                  <Button variant="outline" size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}>
                    ← Trước
                  </Button>
                  {[...Array(meta.totalPages)].map((_, i) => (
                    <button key={i}
                      onClick={() => setPage(i + 1)}
                      className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                      style={{ minWidth: 40 }}>
                      {i + 1}
                    </button>
                  ))}
                  <Button variant="outline" size="sm"
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage(p => p + 1)}>
                    Tiếp →
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}