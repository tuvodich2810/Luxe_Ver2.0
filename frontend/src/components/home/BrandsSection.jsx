import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import brandService from '@/services/brandService';
import { ArrowRight, Crown } from 'lucide-react';

const FEATURED_BRANDS = [
  { name: 'Ferrari', origin: 'Maranello, Ý', count: '5 Mẫu Xe' },
  { name: 'Lamborghini', origin: 'Sant’Agata, Ý', count: '4 Mẫu Xe' },
  { name: 'Rolls-Royce', origin: 'Goodwood, Anh', count: '3 Mẫu Xe' },
  { name: 'Bentley', origin: 'Crewe, Anh', count: '2 Mẫu Xe' },
  { name: 'Porsche', origin: 'Stuttgart, Đức', count: '3 Mẫu Xe' },
  { name: 'McLaren', origin: 'Woking, Anh', count: '2 Mẫu Xe' },
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
    <section className="py-20 bg-[#07070B] border-t border-white/10 relative overflow-hidden">
      <div className="lux-container space-y-10">
        {/* Section Header - Tối giản & Sang trọng */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono-lux text-[#D4AF37] uppercase tracking-[0.2em]">
              <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
              EXCLUSIVELY AUTHORIZED BRANDS
            </div>
            <h2 className="font-serif-lux text-3xl sm:text-4xl font-bold text-white">
              Thương Hiệu <span className="lux-gradient-gold-text italic">Độc Bản</span>
            </h2>
          </div>

          <Link
            to="/cars"
            className="inline-flex items-center gap-2 text-xs font-mono-lux text-[#D4AF37] hover:text-white transition-colors tracking-widest uppercase font-semibold"
          >
            <span>XEM TẤT CẢ SIÊU XE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Minimalist Ultra-Luxury Brand Grid (Không có chữ cái A, B, F tròn thô kệch) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayList.slice(0, 6).map((brand) => (
            <Link
              key={brand._id || brand.name}
              to={`/cars?brand=${brand._id || brand.name}`}
              className="group p-6 rounded-lg bg-[#0D0D12] border border-white/10 hover:border-[#D4AF37] transition-all duration-300 flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden"
            >
              {/* Subtle top gold accent line on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <h3 className="font-serif-lux text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors tracking-wide">
                {brand.name}
              </h3>

              <p className="text-[10px] font-mono-lux text-slate-400 uppercase tracking-widest">
                {brand.origin || 'Đại lý chính hãng'}
              </p>

              <span className="text-[9px] font-mono-lux text-[#D4AF37]/80 pt-1 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                Xem bộ sưu tập →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}