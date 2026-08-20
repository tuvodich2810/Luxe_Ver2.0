import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import carService from '@/services/carService';
import CarCard from '../cars/CarCard';
import { Sparkles, ArrowRight, Loader2, Crown, Zap, Shield } from 'lucide-react';

const CATEGORY_TABS = [
  { label: 'TẤT CẢ SIÊU XE', value: 'ALL', icon: Crown },
  { label: 'HYPERCAR', value: 'hypercar', icon: Zap },
  { label: 'SUPERCAR', value: 'supercar', icon: Sparkles },
  { label: 'SEDAN THƯƠNG GIA', value: 'luxury_sedan', icon: Shield },
  { label: 'GRAND TOURER', value: 'grand_tourer', icon: Crown },
];

export default function FeaturedCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const params = { limit: 9 };
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
    <section className="py-20 bg-[#070709] relative overflow-hidden border-t border-white/5">
      <div className="lux-container space-y-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <div className="lux-eyebrow">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              EXCLUSIVELY CURATED SHOWROOM
            </div>
            <h2 className="font-serif-lux text-3xl sm:text-5xl font-bold text-white">
              Bộ Sưu Tập <span className="lux-gradient-gold-text italic">Siêu Xe Thượng Lưu</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg">
              Tuyển tập những siêu phẩm tốc độ độc bản đã có mặt sẵn sàng giao ngay tại Showroom Luxe Motors.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeCategory === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveCategory(tab.value)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-mono-lux tracking-wider uppercase border transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'border-[#D4AF37] bg-[#D4AF37] text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                      : 'border-white/10 bg-[#0E0E14] text-slate-300 hover:text-white hover:border-white/30'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cars 3-Column Luxury Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
            <span className="text-xs font-mono-lux text-slate-400 uppercase tracking-widest">
              Đang tải danh mục siêu xe...
            </span>
          </div>
        ) : cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-3 bg-[#0E0E12] border border-white/10 rounded-2xl">
            <p className="font-serif-lux text-xl text-slate-300">Hiện chưa có xe thuộc phân khúc này</p>
            <button
              onClick={() => setActiveCategory('ALL')}
              className="btn-lux-gold px-6 py-2 text-xs"
            >
              Xem tất cả siêu xe
            </button>
          </div>
        )}

        {/* Bottom Navigation Link */}
        <div className="text-center pt-4">
          <Link
            to="/cars"
            className="btn-lux-gold px-10 py-4 text-xs font-mono-lux tracking-[0.2em] font-bold shadow-xl inline-flex items-center gap-2 hover:scale-102 transition-transform"
          >
            <span>XEM TOÀN BỘ SHOWROOM 100+ SIÊU XE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}