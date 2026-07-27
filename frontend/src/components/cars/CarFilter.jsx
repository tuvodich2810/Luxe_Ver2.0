import React from 'react';
import { Search, Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';

export default function CarFilter({
  filters,
  onChange,
  onReset,
  brands = [],
}) {
  const categories = [
    { label: 'Hypercar', value: 'hypercar' },
    { label: 'Supercar', value: 'supercar' },
    { label: 'Luxury Sedan', value: 'luxury_sedan' },
    { label: 'Grand Tourer', value: 'grand_tourer' },
  ];

  return (
    <div className="bg-[#0E0E12] border border-[#D4AF37]/20 rounded-md p-6 space-y-6 shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="font-mono-lux text-xs uppercase tracking-widest text-white font-semibold">
            Bộ Lọc Showroom Đa Chiều
          </h3>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs font-mono-lux text-slate-400 hover:text-[#D4AF37] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
            Từ khóa xe (Tên, Model, Động cơ...)
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="VD: Chiron, SF90, Phantom, GT3..."
              value={filters.search || ''}
              onChange={(e) => onChange({ ...filters, search: e.target.value })}
              className="lux-input pl-9 text-xs"
            />
          </div>
        </div>

        {/* Brand Dropdown */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
            Thương hiệu
          </label>
          <select
            value={filters.brand || ''}
            onChange={(e) => onChange({ ...filters, brand: e.target.value })}
            className="lux-input text-xs appearance-none bg-[#15151B]"
          >
            <option value="">Tất cả thương hiệu</option>
            {brands.map((b) => (
              <option key={b._id || b.name} value={b._id || b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Dropdown */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
            Phân loại dòng xe
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            className="lux-input text-xs appearance-none bg-[#15151B]"
          >
            <option value="">Tất cả kiểu dáng</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
            Sắp xếp theo
          </label>
          <select
            value={filters.sort || ''}
            onChange={(e) => onChange({ ...filters, sort: e.target.value })}
            className="lux-input text-xs appearance-none bg-[#15151B]"
          >
            <option value="-createdAt">Mới nhất trong kho</option>
            <option value="price_asc">Giá từ thấp đến cao</option>
            <option value="price_desc">Giá từ cao đến thấp</option>
            <option value="-year">Năm sản xuất mới nhất</option>
          </select>
        </div>
      </div>
    </div>
  );
}