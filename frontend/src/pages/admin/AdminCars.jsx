import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import ImageUploader from '@/components/admin/ImageUploader';
import api from '@/services/api';
import {
  Search,
  Plus,
  Car,
  CheckCircle2,
  AlertCircle,
  Star,
  Filter,
  Boxes,
  Layers,
  PackageCheck,
  PackageX,
} from 'lucide-react';

const EMPTY_FORM = {
  name: '',
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  price: '',
  stockCount: 1,
  category: 'supercar',
  condition: 'new',
  description: '',
  excerpt: '',
  images: [],
  specifications: {
    horsepower: '',
    acceleration: '',
    topSpeed: '',
    engine: '',
    transmission: '',
  },
  isFeatured: false,
  inStock: true,
};

export default function AdminCars() {
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [carsRes, brandsRes] = await Promise.all([
        api.get('/cars?limit=100'),
        api.get('/brands'),
      ]);
      setCars(carsRes.data || []);
      setBrands(brandsRes.data || []);
    } catch {
      setCars([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Bộ lọc tìm kiếm
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchSearch =
        !search ||
        car.name?.toLowerCase().includes(search.toLowerCase()) ||
        car.model?.toLowerCase().includes(search.toLowerCase());
      const matchBrand =
        !selectedBrand || car.brand?._id === selectedBrand || car.brand === selectedBrand;
      const matchCategory = !selectedCategory || car.category === selectedCategory;
      return matchSearch && matchBrand && matchCategory;
    });
  }, [cars, search, selectedBrand, selectedCategory]);

  // Tính toán chỉ số thống kê kho xe
  const totalStockUnits = useMemo(() => {
    return cars.reduce((acc, c) => acc + (c.stockCount ?? (c.inStock ? 1 : 0)), 0);
  }, [cars]);

  const inStockModels = useMemo(() => {
    return cars.filter((c) => (c.stockCount ?? (c.inStock ? 1 : 0)) > 0).length;
  }, [cars]);

  const outOfStockModels = useMemo(() => {
    return cars.filter((c) => (c.stockCount ?? (c.inStock ? 1 : 0)) === 0).length;
  }, [cars]);

  const handleOpenCreate = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (car) => {
    setFormData({
      name: car.name,
      brand: car.brand?._id || car.brand || '',
      model: car.model,
      year: car.year,
      price: car.price,
      stockCount: car.stockCount ?? (car.inStock ? 1 : 0),
      category: car.category || 'supercar',
      condition: car.condition || 'new',
      description: car.description || '',
      excerpt: car.excerpt || '',
      images: car.images || [],
      specifications: {
        horsepower: car.specifications?.horsepower || '',
        acceleration: car.specifications?.acceleration || '',
        topSpeed: car.specifications?.topSpeed || '',
        engine: car.specifications?.engine || '',
        transmission: car.specifications?.transmission || '',
      },
      isFeatured: !!car.isFeatured,
      inStock: car.inStock !== false,
    });
    setEditingId(car._id);
    setError('');
    setIsModalOpen(true);
  };

  const handleMainImageChange = (url) => {
    setFormData((prev) => {
      const otherImages = prev.images.filter((img) => !img.isMain);
      const newImages = url
        ? [{ url, alt: prev.name, isMain: true }, ...otherImages]
        : otherImages;
      return { ...prev, images: newImages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.brand || !formData.price) {
      setError('Vui lòng điền các trường bắt buộc (*)');
      return;
    }

    setIsSaving(true);
    setError('');

    const payload = {
      ...formData,
      stockCount: Number(formData.stockCount) || 0,
      inStock: Number(formData.stockCount) > 0,
    };

    try {
      if (editingId) {
        await api.put(`/cars/${editingId}`, payload);
      } else {
        await api.post('/cars', payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu xe');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa siêu xe này khỏi hệ thống kho?')) return;
    try {
      await api.delete(`/cars/${id}`);
      fetchData();
    } catch {
      alert('Không thể xóa xe');
    }
  };

  const mainImageUrl = useMemo(() => {
    const main = formData.images.find((img) => img.isMain);
    return main ? main.url : formData.images[0]?.url || '';
  }, [formData.images]);

  const columns = [
    {
      key: 'image',
      label: 'Ảnh đại diện',
      render: (car) => (
        <div className="w-14 h-10 rounded overflow-hidden bg-black/40 border border-white/10 relative">
          <img
            src={
              car.mainImage ||
              car.images?.[0]?.url ||
              'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=200'
            }
            alt={car.name}
            className="w-full h-full object-cover"
          />
          {car.isFeatured && (
            <span className="absolute top-0.5 right-0.5 bg-[#D4AF37] text-black text-[9px] p-0.5 rounded">
              <Star className="w-2.5 h-2.5 fill-current" />
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Tên xe & Động cơ',
      render: (car) => (
        <div>
          <p className="font-semibold text-white text-xs">{car.name}</p>
          <p className="text-[10px] text-slate-400 font-mono-lux">
            {car.model} ({car.year})
          </p>
        </div>
      ),
    },
    {
      key: 'brand',
      label: 'Thương hiệu',
      render: (car) => (
        <span className="px-2 py-0.5 bg-[#16161D] border border-white/10 rounded text-[11px] text-[#D4AF37] font-mono-lux">
          {car.brand?.name || 'Luxe'}
        </span>
      ),
    },
    {
      key: 'price',
      label: 'Giá niêm yết (VNĐ)',
      render: (car) => (
        <span className="font-mono-lux font-bold text-white text-xs">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(car.price)}
        </span>
      ),
    },
    {
      key: 'stockCount',
      label: 'Số lượng trong kho',
      render: (car) => {
        const qty = car.stockCount ?? (car.inStock ? 1 : 0);
        return (
          <div className="flex items-center gap-1.5 font-mono-lux">
            <span
              className={`px-2.5 py-1 rounded text-xs font-bold border ${
                qty > 0
                  ? 'bg-amber-500/10 text-[#D4AF37] border-[#D4AF37]/30'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}
            >
              {qty} chiếc
            </span>
          </div>
        );
      },
    },
    {
      key: 'inStock',
      label: 'Trạng thái',
      render: (car) => {
        const qty = car.stockCount ?? (car.inStock ? 1 : 0);
        const isAvail = qty > 0;
        return (
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono-lux flex items-center gap-1 w-max ${
              isAvail
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
          >
            {isAvail ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
            {isAvail ? 'Còn hàng' : 'Hết hàng'}
          </span>
        );
      },
    },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#070709', color: '#E2E8F0' }}>
      <AdminSidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminHeader title="Quản Lý Kho Siêu Xe" />

        <main style={{ padding: '32px 36px', flex: 1 }} className="space-y-6">
          {/* Top Bar Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="eyebrow text-[#D4AF37] text-[10px] tracking-[0.2em] font-mono-lux uppercase">
                SHOWROOM INVENTORY MANAGEMENT
              </span>
              <h1 className="font-serif-lux text-3xl font-bold text-white mt-1">
                Danh Sách Siêu Xe <span className="text-[#D4AF37] italic">Showroom</span>
              </h1>
            </div>

            <button
              onClick={handleOpenCreate}
              className="btn-lux-gold px-5 py-2.5 text-xs flex items-center gap-2 font-mono-lux uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              Thêm Xe Mới
            </button>
          </div>

          {/* Stat KPI Cards - Thống kê tồn kho */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0E0E12] border border-white/10 rounded-lg p-4 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono-lux">
                <span>Tổng Mẫu Xe</span>
                <Layers className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <p className="font-mono-lux text-2xl font-bold text-white">{cars.length}</p>
              <span className="text-[10px] text-slate-500">Mẫu xe niêm yết</span>
            </div>

            <div className="bg-[#0E0E12] border border-[#D4AF37]/30 rounded-lg p-4 space-y-1">
              <div className="flex items-center justify-between text-[#D4AF37] text-xs font-mono-lux">
                <span>Tổng Số Lượng Tồn Kho</span>
                <Boxes className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <p className="font-mono-lux text-2xl font-bold text-[#D4AF37]">{totalStockUnits}</p>
              <span className="text-[10px] text-[#D4AF37]/70">Chiếc xe thực tế trong kho</span>
            </div>

            <div className="bg-[#0E0E12] border border-white/10 rounded-lg p-4 space-y-1">
              <div className="flex items-center justify-between text-emerald-400 text-xs font-mono-lux">
                <span>Mẫu Xe Còn Hàng</span>
                <PackageCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="font-mono-lux text-2xl font-bold text-emerald-400">{inStockModels}</p>
              <span className="text-[10px] text-slate-500">Mẫu xe sẵn sàng giao</span>
            </div>

            <div className="bg-[#0E0E12] border border-white/10 rounded-lg p-4 space-y-1">
              <div className="flex items-center justify-between text-rose-400 text-xs font-mono-lux">
                <span>Mẫu Xe Hết Hàng</span>
                <PackageX className="w-4 h-4 text-rose-400" />
              </div>
              <p className="font-mono-lux text-2xl font-bold text-rose-400">{outOfStockModels}</p>
              <span className="text-[10px] text-slate-500">Cần nhập thêm</span>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-[#0E0E12] border border-white/10 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm xe theo tên, model..."
                className="w-full bg-[#14141A] border border-white/10 rounded pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-[#D4AF37] outline-none"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-[#14141A] border border-white/10 px-3 py-2 rounded text-xs">
                <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="bg-transparent border-none text-slate-200 outline-none text-xs cursor-pointer"
                >
                  <option value="">Tất cả Thương hiệu</option>
                  {brands.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 bg-[#14141A] border border-white/10 px-3 py-2 rounded text-xs">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent border-none text-slate-200 outline-none text-xs cursor-pointer"
                >
                  <option value="">Tất cả Loại xe</option>
                  <option value="supercar">Supercar</option>
                  <option value="hypercar">Hypercar</option>
                  <option value="suv">SUV</option>
                  <option value="luxury_sedan">Sedan</option>
                  <option value="convertible">Convertible</option>
                </select>
              </div>
            </div>
          </div>

          {/* DataTable */}
          <DataTable
            columns={columns}
            data={filteredCars}
            isLoading={isLoading}
            emptyMessage="Không tìm thấy siêu xe nào phù hợp"
            actions={(car) => (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(car)}
                  className="px-3 py-1 bg-[#1A1A22] border border-white/10 hover:border-[#D4AF37] text-slate-300 hover:text-[#D4AF37] text-[11px] font-mono-lux rounded transition-colors"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(car._id)}
                  className="px-3 py-1 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-[11px] font-mono-lux rounded transition-colors"
                >
                  Xóa
                </button>
              </div>
            )}
          />
        </main>
      </div>

      {/* Modal Form Editor */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0E0E12] border border-[#D4AF37]/30 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#14141A]">
                <h3 className="font-serif-lux text-lg font-bold text-white">
                  {editingId ? 'Chỉnh Sửa Thông Tin Siêu Xe' : 'Thêm Siêu Xe Mới Vào Kho'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded">
                    {error}
                  </div>
                )}

                <form id="carForm" onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 mb-1">Tên Siêu Xe *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        required
                        placeholder="Ví dụ: Ferrari SF90 Stradale"
                        className="w-full bg-[#14141A] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Model *</label>
                      <input
                        type="text"
                        value={formData.model}
                        onChange={(e) => setFormData((p) => ({ ...p, model: e.target.value }))}
                        required
                        placeholder="Ví dụ: SF90 Stradale"
                        className="w-full bg-[#14141A] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-300 mb-1">Thương Hiệu *</label>
                      <select
                        value={formData.brand}
                        onChange={(e) => setFormData((p) => ({ ...p, brand: e.target.value }))}
                        required
                        className="w-full bg-[#14141A] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#D4AF37]"
                      >
                        <option value="">Chọn Thương Hiệu</option>
                        {brands.map((b) => (
                          <option key={b._id} value={b._id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Năm Sản Xuất *</label>
                      <input
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData((p) => ({ ...p, year: e.target.value }))}
                        required
                        className="w-full bg-[#14141A] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Giá Niêm Yết (VNĐ) *</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                        required
                        placeholder="Ví dụ: 34500000000"
                        className="w-full bg-[#14141A] border border-white/10 rounded px-3 py-2 text-white font-mono-lux outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 mb-1">Phân Loại Xe</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                        className="w-full bg-[#14141A] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#D4AF37]"
                      >
                        <option value="supercar">Supercar (Siêu Xe)</option>
                        <option value="hypercar">Hypercar (Đỉnh Cấp)</option>
                        <option value="suv">SUV Hạng Sang</option>
                        <option value="luxury_sedan">Sedan Thương Gia</option>
                        <option value="convertible">Mui Trần (Convertible)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#D4AF37] font-semibold mb-1">
                        Số Lượng Xe Trong Kho (Chiếc) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.stockCount}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10) || 0;
                          setFormData((p) => ({
                            ...p,
                            stockCount: val,
                            inStock: val > 0,
                          }));
                        }}
                        required
                        className="w-full bg-[#14141A] border border-[#D4AF37]/50 rounded px-3 py-2 text-white font-mono-lux font-bold outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData((p) => ({ ...p, isFeatured: e.target.checked }))}
                        className="accent-[#D4AF37]"
                      />
                      <span>Xe Nổi Bật Trang Chủ</span>
                    </label>
                  </div>

                  <ImageUploader
                    value={mainImageUrl}
                    onChange={handleMainImageChange}
                    label="Ảnh Chính Hiển Thị (Main Image) *"
                  />

                  <div>
                    <label className="block text-slate-300 mb-1">Mô Tả Ngắn (Excerpt)</label>
                    <input
                      type="text"
                      value={formData.excerpt}
                      onChange={(e) => setFormData((p) => ({ ...p, excerpt: e.target.value }))}
                      placeholder="Một dòng tóm tắt ấn tượng về siêu xe..."
                      className="w-full bg-[#14141A] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </form>
              </div>

              <div className="p-4 bg-[#14141A] border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-transparent text-slate-400 hover:text-white text-xs font-mono-lux"
                >
                  Hủy
                </button>
                <button
                  form="carForm"
                  type="submit"
                  disabled={isSaving}
                  className="btn-lux-gold px-5 py-2 text-xs font-mono-lux"
                >
                  {isSaving ? 'Đang Lưu...' : 'Lưu Thông Tin Xe'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}