import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import carService from '@/services/carService';
import CarCard from '../cars/CarCard';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';

const CATEGORY_TABS = [
  { label: 'TẤT CẢ SIÊU XE', value: 'ALL' },
  { label: 'HYPERCAR', value: 'hypercar' },
  { label: 'SUPERCAR', value: 'supercar' },
  { label: 'LUXURY SEDAN', value: 'luxury_sedan' },
  { label: 'GRAND TOURER', value: 'grand_tourer' },
];

export default function FeaturedCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const params = { limit: 12 };
        if (activeCategory !== 'ALL') {
          params.category = activeCategory;
        }
        const res = await carService.getCars(params);
        if (res?.data && res.data.length > 0) {
          setCars(res.data);
        } else {
          setCars([]);
        }
      } catch {
        setCars([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, [activeCategory]);

  return (
    <section className="py-24 bg-[#070709] relative overflow-hidden">
      <div className="lux-container space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="lux-eyebrow">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              EXCLUSIVELY CURATED SHOWROOM
            </div>
            <h2 className="font-serif-lux text-4xl sm:text-5xl font-bold text-white">
              Bộ Sưu Tập <span className="lux-gradient-gold-text italic">Siêu Xe Thượng Lưu</span>
            </h2>
            <p className="text-xs text-slate-400 max-w-lg">
              Tuyển tập những siêu phẩm tốc độ độc bản đã có mặt sẵn sàng giao ngay tại Showroom LuxeMotors.
            </p>
          </div>

          {/* Category Tabs (Exactly matching Image 2) */}
          <div className="flex flex-wrap gap-2.5">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveCategory(tab.value)}
                className={`px-5 py-3 rounded text-xs font-mono-lux tracking-widest uppercase border transition-all duration-300 ${
                  activeCategory === tab.value
                    ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37] font-bold shadow-lg shadow-[#D4AF37]/10'
                    : 'border-white/15 bg-[#0E0E12] text-slate-300 hover:text-white hover:border-white/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cars Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
            <span className="text-xs font-mono-lux text-slate-400 uppercase tracking-widest">
              Đang tải danh mục xe...
            </span>
          </div>
        ) : cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-3 bg-[#0E0E12] border border-white/10 rounded-lg">
            <p className="font-serif-lux text-xl text-slate-300">Chưa có xe thuộc danh mục này trong kho</p>
            <button
              onClick={() => setActiveCategory('ALL')}
              className="btn-lux-gold px-6 py-2 text-xs"
            >
              Xem tất cả siêu xe
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center pt-8">
          <Link to="/cars" className="btn-lux-gold px-10 py-4 text-xs tracking-[0.25em]">
            <span>XEM TOÀN BỘ SHOWROOM 100+ SIÊU XE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}