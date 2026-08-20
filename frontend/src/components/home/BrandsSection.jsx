import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import brandService from '@/services/brandService';
import { ArrowRight, Crown, Sparkles, ChevronRight } from 'lucide-react';

const FEATURED_BRANDS = [
  { name: 'Ferrari', origin: 'Maranello, Ý', count: '5 Mẫu Xe', tag: 'Prancing Horse', bgImage: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=600' },
  { name: 'Lamborghini', origin: 'Sant’Agata, Ý', count: '4 Mẫu Xe', tag: 'Raging Bull', bgImage: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=600' },
  { name: 'Rolls-Royce', origin: 'Goodwood, Anh', count: '3 Mẫu Xe', tag: 'Spirit of Ecstasy', bgImage: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&q=80&w=600' },
  { name: 'Porsche', origin: 'Stuttgart, Đức', count: '4 Mẫu Xe', tag: 'Driven by Dreams', bgImage: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=600' },
  { name: 'Bentley', origin: 'Crewe, Anh', count: '2 Mẫu Xe', tag: 'Extraordinary Journey', bgImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600' },
  { name: 'McLaren', origin: 'Woking, Anh', count: '2 Mẫu Xe', tag: 'Fearlessly Forward', bgImage: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=600' },
];

export default function BrandsSection() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await brandService.getBrands(true);
        if (res?.data && res.data.length > 0) {
          setBrands(res.data);
        } else {
          setBrands(FEATURED_BRANDS);
        }
      } catch {
        setBrands(FEATURED_BRANDS);
      }
    };
    fetchBrands();
  }, []);

  const displayList = brands.length > 0 ? brands : FEATURED_BRANDS;

  return (
    <section className="py-20 bg-[#07070B] border-t border-white/5 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[200px] bg-[#D4AF37]/5 blur-[120px] pointer-events-none" />

      <div className="lux-container space-y-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono-lux text-[#D4AF37] uppercase tracking-[0.2em]">
              <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
              EXCLUSIVELY AUTHORIZED LUXURY BRANDS
            </div>
            <h2 className="font-serif-lux text-3xl sm:text-4xl font-bold text-white">
              Thương Hiệu <span className="lux-gradient-gold-text italic">Độc Bản Chính Hãng</span>
            </h2>
          </div>

          <Link
            to="/cars"
            className="inline-flex items-center gap-2 text-xs font-mono-lux text-[#D4AF37] hover:text-white transition-colors tracking-widest uppercase font-semibold"
          >
            <span>TẤT CẢ THƯƠNG HIỆU</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Brand Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {displayList.slice(0, 6).map((brand, idx) => {
            const fallbackInfo = FEATURED_BRANDS[idx] || FEATURED_BRANDS[0];
            return (
              <Link
                key={brand._id || brand.name}
                to={`/cars?search=${encodeURIComponent(brand.name)}`}
                className="group p-5 rounded-xl bg-[#0E0E14] border border-white/10 hover:border-[#D4AF37] transition-all duration-300 flex flex-col justify-between text-center space-y-3 relative overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:-translate-y-1"
              >
                {/* Top Gold Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-1">
                  <span className="text-[9px] font-mono-lux text-[#D4AF37] uppercase tracking-widest block">
                    {brand.country || fallbackInfo.origin}
                  </span>
                  <h3 className="font-serif-lux text-lg sm:text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors tracking-wide">
                    {brand.name}
                  </h3>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono-lux text-slate-400 group-hover:text-white transition-colors">
                  <span>{fallbackInfo.count}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37] transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}