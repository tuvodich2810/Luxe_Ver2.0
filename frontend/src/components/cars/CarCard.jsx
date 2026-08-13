import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import favoriteService from '@/services/favoriteService';
import { Heart, ArrowUpRight } from 'lucide-react';

export default function CarCard({ car }) {
  const [isFav, setIsFav] = useState(favoriteService.isFavorite(car?._id));

  if (!car) return null;

  const handleToggleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    favoriteService.toggleFavorite(car);
    setIsFav(!isFav);
  };

  const formatPrice = (price) => {
    if (!price) return 'Liên hệ';
    let numPrice = typeof price === 'number' ? price : parseFloat(String(price).replace(/[^0-9.]/g, ''));
    if (isNaN(numPrice)) return price;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numPrice);
  };

  // Robust Image URL Extractor
  const getImageUrl = (item) => {
    if (typeof item?.mainImage === 'string' && item.mainImage.startsWith('http')) {
      return item.mainImage;
    }
    if (Array.isArray(item?.images) && item.images.length > 0) {
      const mainObj = item.images.find((img) => img && img.isMain);
      const target = mainObj || item.images[0];
      if (typeof target === 'string') return target;
      if (target && typeof target.url === 'string') return target.url;
    }
    return 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800';
  };

  const mainImg = getImageUrl(car);
  const brandName = typeof car.brand === 'object' ? car.brand?.name : car.brand || 'LuxeMotors';

  // Extract specs from MongoDB nested specifications object
  const hp = car.specifications?.horsepower || car.horsePower || 720;
  const accel = car.specifications?.acceleration
    ? `${car.specifications.acceleration}s`
    : car.acceleration || '2.9s';
  const trans = car.specifications?.transmission || car.transmission || 'Tự động';

  return (
    <div className="lux-card group relative flex flex-col justify-between overflow-hidden rounded-md bg-[#0E0E12] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-500">
      {/* Top Image Box */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-black/60">
        <img
          src={mainImg}
          alt={car.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out filter contrast-[1.05]"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800';
          }}
        />

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E12] via-transparent to-black/40" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
          <span className="lux-badge lux-badge-gold">
            {car.year || '2026'}
          </span>
          <span className="lux-badge bg-black/70 text-slate-200 border border-white/20 uppercase">
            {car.category ? car.category.replace('_', ' ') : 'Supercar'}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleFav}
          className={`absolute top-3 right-3 z-10 p-2.5 rounded-full transition-all duration-300 ${
            isFav
              ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40 shadow-lg shadow-rose-500/20'
              : 'bg-black/60 text-slate-400 hover:text-white border border-white/20'
          }`}
          title={isFav ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <span className="font-mono-lux text-[10px] uppercase tracking-widest text-[#D4AF37] block">
            {brandName}
          </span>
          <Link to={`/cars/${car._id || car.slug}`}>
            <h3 className="font-serif-lux text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1 mt-0.5">
              {car.name}
            </h3>
          </Link>
        </div>

        {/* Quick Specs Grid (100% synced with MongoDB specifications) */}
        <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded bg-[#15151B] border border-white/5 text-[11px] font-mono-lux text-slate-300">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[9px] text-slate-500 uppercase tracking-wider">Công suất</span>
            <span className="font-semibold text-white mt-0.5">{hp} HP</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center border-x border-white/10">
            <span className="text-[9px] text-slate-500 uppercase tracking-wider">0-100 km/h</span>
            <span className="font-semibold text-[#D4AF37] mt-0.5">{accel}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[9px] text-slate-500 uppercase tracking-wider">Hộp số</span>
            <span className="font-semibold text-white mt-0.5 truncate max-w-full">{trans}</span>
          </div>
        </div>

        {/* Price & Action Button */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div>
            <span className="text-[10px] text-slate-400 font-mono-lux block">Giá Niêm Yết</span>
            <span className="font-serif-lux text-xl font-bold text-[#D4AF37]">
              {formatPrice(car.price)}
            </span>
          </div>

          <Link
            to={`/cars/${car._id || car.slug}`}
            className="p-2.5 rounded bg-[#15151B] border border-white/10 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#070709] text-white transition-all"
            title="Xem chi tiết"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}