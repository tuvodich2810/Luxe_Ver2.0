import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import Button from '@/components/common/Button';
import ImageUploader from '@/components/admin/ImageUploader';
import api from '@/services/api';

const EMPTY_FORM = {
  name: '',
  country: '',
  foundedYear: '',
  description: '',
  website: '',
  logo: '',
  bannerImage: '',
  isFeatured: false,
  displayOrder: 0,
};

const AdminBrands = () => {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchBrands = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/brands');
      setBrands(response.data || []);
    } catch {
      setBrands([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleOpenCreate = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (brand) => {
    setFormData({
      name: brand.name,
      country: brand.country || '',
      foundedYear: brand.foundedYear || '',
      description: brand.description || '',
      website: brand.website || '',
      logo: brand.logo || '',
      bannerImage: brand.bannerImage || '',
      isFeatured: brand.isFeatured,
      displayOrder: brand.displayOrder || 0,
    });
    setEditingId(brand._id);
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Tên thương hiệu là bắt buộc');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const payload = {
        ...formData,
        foundedYear: formData.foundedYear ? Number(formData.foundedYear) : undefined,
        displayOrder: Number(formData.displayOrder) || 0,
      };

      if (editingId) {
        await api.put(`/brands/${editingId}`, payload);
      } else {
        await api.post('/brands', payload);
      }

      setIsModalOpen(false);
      fetchBrands();
    } catch (err) {
      setError(err?.message || 'Lưu thất bại, vui lòng thử lại');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (brand) => {
    if (!window.confirm(`Xóa thương hiệu "${brand.name}"?\nCác xe thuộc thương hiệu này sẽ không còn liên kết.`)) return;

    setDeletingId(brand._id);
    try {
      await api.delete(`/brands/${brand._id}`);
      setBrands((prev) => prev.filter((b) => b._id !== brand._id));
    } catch (err) {
      alert(err?.message || 'Xóa thất bại');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFeatured = async (brand) => {
    try {
      await api.put(`/brands/${brand._id}`, { isFeatured: !brand.isFeatured });
      setBrands((prev) =>
        prev.map((b) => (b._id === brand._id ? { ...b, isFeatured: !b.isFeatured } : b))
      );
    } catch (err) {
      alert(err?.message || 'Cập nhật thất bại');
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />

      <div className="flex-1">
        <AdminHeader title="Quản lý thương hiệu" />

        <main className="p-8">
          <div className="flex items-center justify-between mb-8">
            <p className="text-silver text-sm">{brands.length} thương hiệu</p>
            <Button onClick={handleOpenCreate}>+ Thêm thương hiệu</Button>
          </div>

          {isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-40 bg-graphite animate-pulse" />
              ))}
            </div>
          )}

          {!isLoading && brands.length === 0 && (
            <div className="text-center py-32">
              <p className="font-display text-3xl font-light text-white/20 mb-4">
                Chưa có thương hiệu nào
              </p>
              <Button onClick={handleOpenCreate}>Thêm thương hiệu đầu tiên</Button>
            </div>
          )}

          {!isLoading && brands.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {brands
                .slice()
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((brand, index) => (
                  <motion.div
                    key={brand._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="group bg-graphite border border-white/5 hover:border-white/15 transition-colors duration-300"
                  >
                    <div className="aspect-[4/3] bg-black/40 flex items-center justify-center p-6 overflow-hidden">
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="max-h-16 max-w-full object-contain filter brightness-75 group-hover:brightness-100 transition-all duration-300"
                        />
                      ) : (
                        <span className="font-display text-2xl font-light text-white/30 group-hover:text-gold transition-colors duration-300 text-center">
                          {brand.name}
                        </span>
                      )}
                    </div>

                    <div className="p-4 border-t border-white/5">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-label text-sm text-white">{brand.name}</h3>
                        {brand.isFeatured && (
                          <span className="text-[9px] font-label text-gold uppercase tracking-wider">
                            Nổi bật
                          </span>
                        )}
                      </div>
                      {brand.country && (
                        <p className="text-xs text-silver/60 mb-3">
                          {brand.country}
                          {brand.foundedYear ? ` · ${brand.foundedYear}` : ''}
                        </p>
                      )}

                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleOpenEdit(brand)}
                          className="flex-1 py-1.5 font-label text-[10px] uppercase tracking-wider text-silver border border-white/10 hover:border-gold/40 hover:text-gold transition-all duration-200"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(brand)}
                          className={['flex-1 py-1.5 font-label text-[10px] uppercase tracking-wider border transition-all duration-200',
                            brand.isFeatured
                              ? 'border-gold/40 text-gold bg-gold/5'
                              : 'border-white/10 text-silver hover:border-white/30',
                          ].join(' ')}
                        >
                          {brand.isFeatured ? '★ Bỏ ghim' : '☆ Ghim'}
                        </button>
                        <button
                          onClick={() => handleDelete(brand)}
                          disabled={deletingId === brand._id}
                          className="w-full py-1.5 font-label text-[10px] uppercase tracking-wider text-red-400/60 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all duration-200 disabled:opacity-40"
                        >
                          {deletingId === brand._id ? 'Đang xóa...' : 'Xóa'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          )}
        </main>
      </div>

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
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-graphite border border-white/10 max-w-xl w-full my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8">
                <h3 className="font-display text-2xl font-light text-white mb-6">
                  {editingId ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}
                </h3>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5 px-5 py-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSave} className="space-y-5">
                  <div>
                    <label className="block text-xs text-silver mb-2">Tên thương hiệu *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                      required
                      placeholder="Lamborghini, Ferrari..."
                      className="input-luxury w-full"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-silver mb-2">Quốc gia</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData((p) => ({ ...p, country: e.target.value }))}
                        placeholder="Ý, Đức, Anh..."
                        className="input-luxury w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-silver mb-2">Năm thành lập</label>
                      <input
                        type="number"
                        value={formData.foundedYear}
                        onChange={(e) => setFormData((p) => ({ ...p, foundedYear: e.target.value }))}
                        placeholder="1963"
                        min="1800"
                        max={new Date().getFullYear()}
                        className="input-luxury w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-silver mb-2">Website chính thức</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData((p) => ({ ...p, website: e.target.value }))}
                      placeholder="https://www.lamborghini.com"
                      className="input-luxury w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-silver mb-2">Mô tả</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                      rows={3}
                      placeholder="Giới thiệu ngắn về thương hiệu..."
                      className="input-luxury w-full resize-none"
                    />
                  </div>

                  <ImageUploader
                    value={formData.logo}
                    onChange={(url) => setFormData((p) => ({ ...p, logo: url }))}
                    label="Logo thương hiệu"
                  />

                  <ImageUploader
                    value={formData.bannerImage}
                    onChange={(url) => setFormData((p) => ({ ...p, bannerImage: url }))}
                    label="Ảnh banner"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-silver mb-2">Thứ tự hiển thị</label>
                      <input
                        type="number"
                        value={formData.displayOrder}
                        onChange={(e) => setFormData((p) => ({ ...p, displayOrder: e.target.value }))}
                        min="0"
                        className="input-luxury w-full"
                      />
                    </div>
                    <div className="flex items-end pb-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData((p) => ({ ...p, isFeatured: e.target.checked }))}
                          className="accent-gold w-4 h-4"
                        />
                        <span className="text-sm text-silver">Hiển thị trang chủ</span>
                      </label>
                    </div>
                  </div>

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
                      {editingId ? 'Lưu thay đổi' : 'Thêm thương hiệu'}
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

export default AdminBrands;
