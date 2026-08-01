import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import Button from '@/components/common/Button';
import ImageUploader from '@/components/admin/ImageUploader';
import { formatPriceShort } from '@/utils/formatPrice';
import api from '@/services/api';

const EMPTY_FORM = {
  name: '', brand: '', model: '', year: new Date().getFullYear(),
  price: '', category: 'supercar', condition: 'new', description: '',
  excerpt: '', images: [],
  specifications: { horsepower: '', acceleration: '', topSpeed: '', engine: '', transmission: '' },
  isFeatured: false, inStock: true,
};

const AdminCars = () => {
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // ===================================
  // Fetch danh sách xe và thương hiệu
  // ===================================
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [carsRes, brandsRes] = await Promise.all([
        api.get('/cars?limit=50'),
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

  // ===================================
  // Mở modal tạo mới
  // ===================================
  const handleOpenCreate = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setError('');
    setIsModalOpen(true);
  };

  // ===================================
  // Mở modal chỉnh sửa
  // ===================================
  const handleOpenEdit = (car) => {
    setFormData({
      name: car.name,
      brand: car.brand?._id || '',
      model: car.model,
      year: car.year,
      price: car.price,
      category: car.category,
      condition: car.condition,
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
      isFeatured: car.isFeatured,
      inStock: car.inStock,
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

  const handleAddGalleryImage = (url) => {
    if (!url) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { url, alt: prev.name, isMain: false }],
    }));
  };

  const handleRemoveGalleryImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const mainImage = formData.images.find((img) => img.isMain);
    if (!mainImage) {
      setError('Vui lòng tải lên ảnh chính của xe');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        year: Number(formData.year),
        images: formData.images.filter((img) => img.url),
      };

      if (editingId) {
        await api.put(`/cars/${editingId}`, payload);
      } else {
        await api.post('/cars', payload);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.message || 'Lưu thất bại');
    } finally {
      setIsSaving(false);
    }
  };

  // ===================================
  // Xóa xe
  // ===================================
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa xe này?')) return;
    try {
      await api.delete(`/cars/${id}`);
      fetchData();
    } catch (err) {
      alert(err.message || 'Xóa thất bại');
    }
  };

  const mainImageUrl = formData.images.find((img) => img.isMain)?.url || '';
  const galleryImages = formData.images.filter((img) => !img.isMain);

  // Cấu hình cột bảng
  const columns = [
    {
      key: 'image',
      label: 'Ảnh',
      render: (car) => (
        <img
          src={car.mainImage || '/placeholder-car.jpg'}
          alt={car.name}
          className="w-20 h-14 object-cover"
        />
      ),
    },
    { key: 'name', label: 'Tên xe' },
    { key: 'brand', label: 'Thương hiệu', render: (car) => car.brand?.name || '—' },
    { key: 'year', label: 'Năm' },
    { key: 'price', label: 'Giá', render: (car) => formatPriceShort(car.price) },
    {
      key: 'isFeatured',
      label: 'Nổi bật',
      render: (car) => (car.isFeatured ? '✓' : '—'),
    },
    {
      key: 'inStock',
      label: 'Trạng thái',
      render: (car) => (
        <span className={car.inStock ? 'text-emerald-400' : 'text-red-400'}>
          {car.inStock ? 'Còn hàng' : 'Hết hàng'}
        </span>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />

      <div className="flex-1">
        <AdminHeader title="Quản lý xe" />

        <main className="p-8">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-silver text-sm">{cars.length} xe trong hệ thống</p>
            <Button onClick={handleOpenCreate}>+ Thêm xe mới</Button>
          </div>

          {/* Table */}
          <DataTable
            columns={columns}
            data={cars}
            isLoading={isLoading}
            emptyMessage="Chưa có xe nào, hãy thêm xe đầu tiên"
            actions={(car) => (
              <>
                <button
                  onClick={() => handleOpenEdit(car)}
                  className="px-3 py-1.5 text-xs font-label text-gold hover:bg-gold/10 transition-colors"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(car._id)}
                  className="px-3 py-1.5 text-xs font-label text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Xóa
                </button>
              </>
            )}
          />
        </main>
      </div>

      {/* ===================================
          Modal Form
          =================================== */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-graphite border border-white/10 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8">
                <h3 className="font-display text-2xl font-light text-white mb-6">
                  {editingId ? 'Chỉnh sửa xe' : 'Thêm xe mới'}
                </h3>

                {error && (
                  <div className="mb-5 px-5 py-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSave} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-silver mb-2">Tên xe *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        required
                        className="input-luxury w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-silver mb-2">Model *</label>
                      <input
                        type="text"
                        value={formData.model}
                        onChange={(e) => setFormData((p) => ({ ...p, model: e.target.value }))}
                        required
                        className="input-luxury w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-silver mb-2">Thương hiệu *</label>
                      <select
                        value={formData.brand}
                        onChange={(e) => setFormData((p) => ({ ...p, brand: e.target.value }))}
                        required
                        className="input-luxury w-full"
                      >
                        <option value="">Chọn</option>
                        {brands.map((b) => (
                          <option key={b._id} value={b._id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-silver mb-2">Năm *</label>
                      <input
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData((p) => ({ ...p, year: e.target.value }))}
                        required
                        className="input-luxury w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-silver mb-2">Giá (VNĐ) *</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                        required
                        className="input-luxury w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-silver mb-2">Loại xe</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                        className="input-luxury w-full"
                      >
                        {['supercar', 'hypercar', 'suv', 'sedan', 'coupe', 'convertible'].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-silver mb-2">Tình trạng</label>
                      <select
                        value={formData.condition}
                        onChange={(e) => setFormData((p) => ({ ...p, condition: e.target.value }))}
                        className="input-luxury w-full"
                      >
                        <option value="new">Mới</option>
                        <option value="used">Đã dùng</option>
                        <option value="certified">Certified</option>
                      </select>
                    </div>
                  </div>

                  <ImageUploader value={mainImageUrl} onChange={handleMainImageChange} label="Ảnh chính *" />

                  <div>
                    <label className="block text-xs text-silver mb-2">Ảnh phụ (gallery)</label>
                    <div className="grid grid-cols-3 gap-3">
                      {galleryImages.map((img, index) => (
                        <div key={index} className="relative group aspect-car bg-black/40 border border-white/10 overflow-hidden">
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(formData.images.indexOf(img))}
                            className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-400 font-label text-xs"
                          >
                            Xóa
                          </button>
                        </div>
                      ))}
                      {galleryImages.length < 5 && (
                        <div className="aspect-car">
                          <ImageUploader value="" onChange={handleAddGalleryImage} label="" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-silver mb-2">Mô tả ngắn</label>
                    <input
                      type="text"
                      value={formData.excerpt}
                      onChange={(e) => setFormData((p) => ({ ...p, excerpt: e.target.value }))}
                      className="input-luxury w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-silver mb-2">Mô tả chi tiết</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                      rows={3}
                      className="input-luxury w-full resize-none"
                    />
                  </div>

                  {/* Specifications */}
                  <div className="border-t border-white/10 pt-5">
                    <p className="eyebrow text-[10px] mb-4">Thông số kỹ thuật</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-silver mb-2">Mã lực (HP)</label>
                        <input
                          type="number"
                          value={formData.specifications.horsepower}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              specifications: { ...p.specifications, horsepower: e.target.value },
                            }))
                          }
                          className="input-luxury w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-silver mb-2">0-100 (giây)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.specifications.acceleration}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              specifications: { ...p.specifications, acceleration: e.target.value },
                            }))
                          }
                          className="input-luxury w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-silver mb-2">Tốc độ tối đa</label>
                        <input
                          type="number"
                          value={formData.specifications.topSpeed}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              specifications: { ...p.specifications, topSpeed: e.target.value },
                            }))
                          }
                          className="input-luxury w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex gap-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData((p) => ({ ...p, isFeatured: e.target.checked }))}
                        className="accent-gold"
                      />
                      <span className="text-sm text-silver">Xe nổi bật</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.inStock}
                        onChange={(e) => setFormData((p) => ({ ...p, inStock: e.target.checked }))}
                        className="accent-gold"
                      />
                      <span className="text-sm text-silver">Còn hàng</span>
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4 border-t border-white/10">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 justify-center"
                    >
                      Hủy
                    </Button>
                    <Button type="submit" isLoading={isSaving} className="flex-1 justify-center">
                      {editingId ? 'Cập nhật' : 'Thêm xe'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCars;