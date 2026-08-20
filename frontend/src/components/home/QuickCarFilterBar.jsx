import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Sparkles, Car, Shield, ArrowRight } from 'lucide-react';

export default function QuickCarFilterBar() {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (selectedBrand) queryParams.set('brand', selectedBrand);
    if (selectedCategory) queryParams.set('category', selectedCategory);
    if (selectedPrice) queryParams.set('priceRange', selectedPrice);

    navigate(`/cars?${queryParams.toString()}`);
  };

  return (
    <section className="relative z-30 -mt-10 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="bg-[#0D0D14]/95 border border-[#D4AF37]/40 rounded-2xl p-4 sm:p-6 shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        {/* Top Header Tag */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs font-mono-lux">
          <span className="text-[#D4AF37] flex items-center gap-1.5 uppercase font-bold tracking-widest text-[10px] sm:text-xs">
            <Sparkles className="w-3.5 h-3.5" /> BỘ LỌC TÌM KIẾM SIÊU XE NHANH
          </span>
          <span className="text-slate-400 text-[10px] sm:text-xs hidden sm:inline-block">
            100% Niêm Yết Chuẩn Giá VNĐ (₫) • Giao Ngay
          </span>
        </div>

        {/* Filter Inputs Form */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
          {/* 1. Chọn Thương Hiệu */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono-lux text-slate-400 uppercase tracking-wider block">
              1. Thương Hiệu
            </label>
            <div className="bg-[#14141E] border border-white/10 rounded-xl px-3 py-2.5 flex items-center gap-2 focus-within:border-[#D4AF37] transition-all">
              <Car className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-transparent text-xs font-sans text-white outline-none cursor-pointer"
              >
                <option value="" className="bg-[#14141E] text-slate-300">Tất Cả Thương Hiệu</option>
                <option value="Ferrari" className="bg-[#14141E] text-white">Ferrari</option>
                <option value="Lamborghini" className="bg-[#14141E] text-white">Lamborghini</option>
                <option value="Rolls-Royce" className="bg-[#14141E] text-white">Rolls-Royce</option>
                <option value="Porsche" className="bg-[#14141E] text-white">Porsche</option>
                <option value="Bentley" className="bg-[#14141E] text-white">Bentley</option>
                <option value="McLaren" className="bg-[#14141E] text-white">McLaren</option>
                <option value="Aston Martin" className="bg-[#14141E] text-white">Aston Martin</option>
                <option value="Bugatti" className="bg-[#14141E] text-white">Bugatti</option>
              </select>
            </div>
          </div>

          {/* 2. Phân Khúc Siêu Xe */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono-lux text-slate-400 uppercase tracking-wider block">
              2. Phân Khúc Xe
            </label>
            <div className="bg-[#14141E] border border-white/10 rounded-xl px-3 py-2.5 flex items-center gap-2 focus-within:border-[#D4AF37] transition-all">
              <SlidersHorizontal className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-transparent text-xs font-sans text-white outline-none cursor-pointer"
              >
                <option value="" className="bg-[#14141E] text-slate-300">Tất Cả Phân Khúc</option>
                <option value="hypercar" className="bg-[#14141E] text-white">Hypercar (1,000+ HP)</option>
                <option value="supercar" className="bg-[#14141E] text-white">Supercar Thể Thao</option>
                <option value="luxury_sedan" className="bg-[#14141E] text-white">Sedan Siêu Sang</option>
                <option value="grand_tourer" className="bg-[#14141E] text-white">Grand Tourer (GT)</option>
              </select>
            </div>
          </div>

          {/* 3. Mức Giá Ngân Sách */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono-lux text-slate-400 uppercase tracking-wider block">
              3. Ngân Sách Đầu Tư
            </label>
            <div className="bg-[#14141E] border border-white/10 rounded-xl px-3 py-2.5 flex items-center gap-2 focus-within:border-[#D4AF37] transition-all">
              <Shield className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="w-full bg-transparent text-xs font-sans text-white outline-none cursor-pointer"
              >
                <option value="" className="bg-[#14141E] text-slate-300">Tất Cả Mức Giá</option>
                <option value="under20" className="bg-[#14141E] text-white">Dưới 20 Tỷ ₫</option>
                <option value="20to40" className="bg-[#14141E] text-white">20 - 40 Tỷ ₫</option>
                <option value="above40" className="bg-[#14141E] text-white">Trên 40 Tỷ ₫ (Hypercar)</option>
              </select>
            </div>
          </div>

          {/* 4. Nút Tìm Kiếm */}
          <div className="space-y-1 sm:col-span-2 lg:col-span-1 pt-3 sm:pt-0">
            <label className="text-[10px] font-mono-lux text-transparent select-none hidden lg:block">
              Tìm Kiếm
            </label>
            <button
              type="submit"
              className="w-full btn-lux-gold py-3 px-4 rounded-xl text-xs font-mono-lux font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 hover:brightness-110 active:scale-98 transition-all"
            >
              <Search className="w-4 h-4" />
              <span>Tìm Siêu Xe Ngay</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
