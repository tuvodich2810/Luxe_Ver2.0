import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import brandService from '@/services/brandService';
import { Sparkles, ArrowRight, Award } from 'lucide-react';

const FALLBACK_BRANDS = [
  { _id: 'b1', name: 'Ferrari', origin: 'Ý (Italy)', logo: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=400' },
  { _id: 'b2', name: 'Lamborghini', origin: 'Ý (Italy)', logo: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=400' },
  { _id: 'b3', name: 'Porsche', origin: 'Đức (Germany)', logo: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=400' },
  { _id: 'b4', name: 'Rolls-Royce', origin: 'Anh (UK)', logo: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&q=80&w=400' },
  { _id: 'b5', name: 'Bentley', origin: 'Anh (UK)', logo: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=400' },
  { _id: 'b6', name: 'McLaren', origin: 'Anh (UK)', logo: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=400' },
];

export default function BrandsSection() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await brandService.getBrands(true);
        if (res?.data && res.data.length > 0) {
          setBrands(res.data);
        } else {
          setBrands(FALLBACK_BRANDS);
        }
      } catch {
        setBrands(FALLBACK_BRANDS);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  return (
    <section className="py-24 bg-[#0A0A0E] border-t border-white/5 relative overflow-hidden">
      <div className="lux-container space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="lux-eyebrow">
              <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
              AUTHORIZED PARTNERS
            </div>
            <h2 className="font-serif-lux text-4xl sm:text-5xl font-bold text-white">
              Thương Hiệu <span className="lux-gradient-gold-text italic">Huyền Thoại</span>
            </h2>
            <p className="text-xs text-slate-400 max-w-lg">
              Đối tác nhập khẩu và phân phối ủy quyền chính hãng từ các tập đoàn siêu xe danh giá bậc nhất thế giới.
            </p>
          </div>

          <Link to="/cars" className="btn-lux-ghost">
            <span>Tất cả thương hiệu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand._id || brand.name}
              to={`/cars?brand=${brand._id || brand.name}`}
              className="lux-card group p-6 flex flex-col items-center justify-center text-center space-y-3 bg-[#0E0E12] border border-white/10 hover:border-[#D4AF37] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-[#15151B] border border-white/10 flex items-center justify-center text-[#D4AF37] font-serif-lux font-bold text-lg group-hover:scale-110 transition-transform">
                {brand.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-serif-lux text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                  {brand.name}
                </h4>
                <p className="text-[10px] font-mono-lux text-slate-500 uppercase">
                  {brand.origin || 'Đại lý ủy quyền'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}