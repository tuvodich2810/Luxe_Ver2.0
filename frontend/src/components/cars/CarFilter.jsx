import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/services/api';

const CATEGORIES = [
  { value: '', label: 'Tất cả' },
  { value: 'supercar', label: 'Supercar' },
  { value: 'hypercar', label: 'Hypercar' },
  { value: 'suv', label: 'SUV' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'coupe', label: 'Coupe' },
  { value: 'convertible', label: 'Convertible' },
];

const CONDITIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'new', label: 'Xe mới' },
  { value: 'used', label: 'Xe cũ' },
  { value: 'certified', label: 'Certified' },
];

const CarFilter = ({ initialFilters = {}, onFilterChange }) => {
  const [brands, setBrands] = useState([]);
  const [filters, setFilters] = useState({
    brand: '',
    category: '',
    condition: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    ...initialFilters,
  });

  // Fetch brands cho dropdown
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await api.get('/brands');
        setBrands(response.data || []);
      } catch {
        setBrands([]);
      }
    };
    fetchBrands();
  }, []);

  const handleChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Loại bỏ các filter rỗng trước khi gọi callback
    const cleanFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([, v]) => v !== '' && v !== null)
    );
    onFilterChange(cleanFilters);
  };

  const handleReset = () => {
    const emptyFilters = {
      brand: '', category: '', condition: '',
      minPrice: '', maxPrice: '', search: '',
    };
    setFilters(emptyFilters);
    onFilterChange({});
  };

  return (
    <div className="bg-graphite border border-white/5 p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="eyebrow">Bộ lọc</h3>
        <button
          onClick={handleReset}
          className="font-label text-xs text-silver hover:text-gold transition-colors"
        >
          Xóa tất cả
        </button>
      </div>

      <div className="space-y-6">
        {/* Tìm kiếm */}
        <div>
          <label className="block eyebrow text-[10px] text-silver mb-3">
            Tìm kiếm
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Tên xe, model..."
            className="input-luxury text-sm"
          />
        </div>

        {/* Thương hiệu */}
        <div>
          <label className="block eyebrow text-[10px] text-silver mb-3">
            Thương hiệu
          </label>
          <select
            value={filters.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
            className="input-luxury text-sm appearance-none cursor-pointer"
          >
            <option value="">Tất cả thương hiệu</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Loại xe */}
        <div>
          <label className="block eyebrow text-[10px] text-silver mb-3">
            Loại xe
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleChange('category', cat.value)}
                className={[
                  'px-3 py-1.5 font-label text-[10px] tracking-wider uppercase transition-all duration-200',
                  filters.category === cat.value
                    ? 'bg-gold text-black'
                    : 'border border-white/10 text-silver hover:border-gold/30 hover:text-gold',
                ].join(' ')}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tình trạng */}
        <div>
          <label className="block eyebrow text-[10px] text-silver mb-3">
            Tình trạng
          </label>
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map((cond) => (
              <button
                key={cond.value}
                onClick={() => handleChange('condition', cond.value)}
                className={[
                  'px-3 py-1.5 font-label text-[10px] tracking-wider uppercase transition-all duration-200',
                  filters.condition === cond.value
                    ? 'bg-gold text-black'
                    : 'border border-white/10 text-silver hover:border-gold/30 hover:text-gold',
                ].join(' ')}
              >
                {cond.label}
              </button>
            ))}
          </div>
        </div>

        {/* Khoảng giá */}
        <div>
          <label className="block eyebrow text-[10px] text-silver mb-3">
            Khoảng giá (đồng)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              placeholder="Từ"
              className="input-luxury text-sm"
            />
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              placeholder="Đến"
              className="input-luxury text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarFilter;