import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Chatbot from '@/components/common/Chatbot';
import CarCard from '@/components/cars/CarCard';
import favoriteService from '@/services/favoriteService';
import { Heart, Sparkles, Trash2, ArrowRight } from 'lucide-react';

export default function Favorites() {
  const [favorites, setFavorites] = useState(favoriteService.getFavorites());

  useEffect(() => {
    const handleUpdate = (e) => {
      setFavorites(e.detail || []);
    };
    window.addEventListener('luxe_favorites_updated', handleUpdate);
    return () => window.removeEventListener('luxe_favorites_updated', handleUpdate);
  }, []);

  const handleClearAll = () => {
    localStorage.removeItem('luxe_favorites');
    setFavorites([]);
    window.dispatchEvent(new CustomEvent('luxe_favorites_updated', { detail: [] }));
  };

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-28 pb-24">
        <div className="lux-container space-y-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <div className="lux-eyebrow">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                SAVED VEHICLES
              </div>
              <h1 className="font-serif-lux text-4xl sm:text-5xl font-bold text-white">
                Danh Sách <span className="lux-gradient-gold-text italic">Xe Yêu Thích</span>
              </h1>
              <p className="text-xs text-slate-400">
                Lưu giữ những chiếc siêu xe bạn yêu thích để dễ dàng so sánh thông số và đăng ký lái thử.
              </p>
            </div>

            {favorites.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 text-xs font-mono-lux text-rose-400 hover:text-rose-300 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa toàn bộ khỏi danh sách</span>
              </button>
            )}
          </div>

          {/* Favorites List */}
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center space-y-6 bg-[#0E0E12] border border-white/10 rounded-lg max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#15151B] border border-white/10 text-slate-500 mx-auto flex items-center justify-center">
                <Heart className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif-lux text-2xl font-bold text-white">
                  Chưa Có Siêu Xe Nào Trong Bộ Sưu Tập
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Hãy lướt qua Showroom và bấm vào biểu tượng trái tim trên các mẫu xe bạn ưng ý.
                </p>
              </div>

              <Link to="/cars" className="btn-lux-gold px-8 py-3">
                <span>Khám phá Showroom ngay</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </main>

      <Chatbot />
      <Footer />
    </div>
  );
}