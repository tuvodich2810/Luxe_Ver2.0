import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import ImageUploader from '@/components/admin/ImageUploader';
import api from '@/services/api';
import { Plus, Search, Globe, Calendar, ExternalLink, Edit2, Trash2 } from 'lucide-react';

const EMPTY_FORM = {
  name: '',
  country: '',
  establishedYear: '',
  description: '',
  website: '',
  logo: '',
  bannerImage: '',
  isFeatured: false,
};

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');

  const fetchBrands = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/brands');
      setBrands(response.data || response || []);
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
      establishedYear: brand.establishedYear || brand.foundedYear || '',
      description: brand.description || '',
      website: brand.website || '',
      logo: brand.logo || '',
      bannerImage: brand.bannerImage || '',
      isFeatured: !!brand.isFeatured,
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
        establishedYear: formData.establishedYear ? Number(formData.establishedYear) : undefined,
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

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Xóa thương hiệu "${name}" khỏi hệ thống?`)) return;
    try {
      await api.delete(`/brands/${id}`);
      fetchBrands();
    } catch (err) {
      alert(err?.message || 'Xóa thất bại');
    }
  };

  const s = String(search || '').toLowerCase();
  const filteredBrands = brands.filter(
    (b) =>
      !s ||
      b.name?.toLowerCase().includes(s) ||
      b.country?.toLowerCase().includes(s)
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#070709', color: '#E2E8F0' }}>
      <AdminSidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminHeader title="Quản Lý Thương Hiệu Siêu Xe" />

        <main style={{ padding: '32px 36px', flex: 1 }} className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="eyebrow text-[#D4AF37] text-[10px] tracking-[0.2em] font-mono-lux uppercase">
                AUTOMOTIVE BRAND PARTNERSHIPS
              </span>
              <h1 className="font-serif-lux text-3xl font-bold text-white mt-1">
                Danh Sách Thương Hiệu <span className="text-[#D4AF37] italic">Độc Quyền</span>
              </h1>
            </div>

            <button
              onClick={handleOpenCreate}
              className="btn-lux-gold px-5 py-2.5 text-xs flex items-center gap-2 font-mono-lux uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              Thêm Hãng Xe Mới
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-[#0E0E12] border border-white/10 p-4 rounded-lg flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm thương hiệu theo tên, quốc gia..."
                className="w-full bg-[#14141A] border border-white/10 rounded pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-[#D4AF37] outline-none"
              />
            </div>
            <p className="text-xs font-mono-lux text-slate-400">
              Tổng số: <strong className="text-[#D4AF37]">{filteredBrands.length}</strong> hãng xe
            </p>
          </div>

          {/* Brands Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-44 bg-[#0E0E12] border border-white/5 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBrands.map((brand) => (
                <motion.div
                  key={brand._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0E0E12] border border-white/10 hover:border-[#D4AF37]/40 rounded-lg p-6 space-y-4 relative group transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-12 bg-black/60 border border-white/10 rounded p-1 flex items-center justify-center overflow-hidden">
                      <img
                        src={brand.logo || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=200'}
                        alt={brand.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(brand)}
                        className="p-2 bg-[#16161E] text-slate-300 hover:text-[#D4AF37] rounded transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(brand._id, brand.name)}
                        className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif-lux text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                      {brand.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {brand.description || 'Thương hiệu siêu xe cao cấp hàng đầu thế giới.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px] font-mono-lux text-slate-400">
                    <div className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-[#D4AF37]" />
                      <span>{brand.country || 'Ý'}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>EST. {brand.establishedYear || brand.foundedYear || '1939'}</span>
                    </div>

                    {brand.website && (
                      <a
                        href={brand.website}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[#D4AF37] hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Trang chủ</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal Edit/Create Brand */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0E0E12] border border-[#D4AF37]/30 max-w-lg w-full rounded-lg overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-serif-lux text-xl font-bold text-white">
                  {editingId ? 'Chỉnh Sửa Thương Hiệu' : 'Thêm Hãng Xe Mới'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-slate-300 mb-1">Tên Hãng Xe *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    required
                    placeholder="Ví dụ: Ferrari"
                    className="w-full bg-[#14141A] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1">Quốc Gia Xuất Xứ</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData((p) => ({ ...p, country: e.target.value }))}
                      placeholder="Ví dụ: Italy / Germany"
                      className="w-full bg-[#14141A] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Năm Thành Lập</label>
                    <input
                      type="number"
                      value={formData.establishedYear}
                      onChange={(e) => setFormData((p) => ({ ...p, establishedYear: e.target.value }))}
                      placeholder="1939"
                      className="w-full bg-[#14141A] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Website Chính Thức</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData((p) => ({ ...p, website: e.target.value }))}
                    placeholder="https://www.ferrari.com"
                    className="w-full bg-[#14141A] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <ImageUploader
                  value={formData.logo}
                  onChange={(url) => setFormData((p) => ({ ...p, logo: url }))}
                  label="Logo Hãng Xe (URL / Upload)"
                />

                <div>
                  <label className="block text-slate-300 mb-1">Mô Tả Thương Hiệu</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                    rows={3}
                    placeholder="Lịch sử và thành tựu của hãng siêu xe..."
                    className="w-full bg-[#14141A] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#D4AF37] resize-none"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-transparent text-slate-400 text-xs font-mono-lux"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-lux-gold px-5 py-2 text-xs font-mono-lux"
                  >
                    {isSaving ? 'Đang Lưu...' : 'Lưu Thương Hiệu'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
