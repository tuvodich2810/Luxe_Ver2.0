import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Chatbot from '@/components/common/Chatbot';
import CarGallery from '@/components/cars/CarGallery';
import PurchaseModal from '@/components/cars/PurchaseModal';
import CarCard from '@/components/cars/CarCard';
import carService from '@/services/carService';
import favoriteService from '@/services/favoriteService';
import {
  Sparkles,
  Heart,
  Shield,
  Calendar,
  Gauge,
  Zap,
  ArrowLeft,
  CheckCircle2,
  PhoneCall,
  Share2,
  Loader2,
} from 'lucide-react';

const FALLBACK_CAR = {
  _id: 'c1',
  name: 'Ferrari SF90 Stradale Assetto Fiorano',
  brand: { name: 'Ferrari' },
  price: 625000,
  year: 2026,
  horsePower: 1000,
  acceleration: '2.5s',
  topSpeed: '340 km/h',
  engine: '4.0L V8 Twin-Turbo + 3 Electric Motors',
  transmission: '8-Speed Dual Clutch',
  fuelType: 'Plug-in Hybrid',
  category: 'Hypercar',
  status: 'available',
  description:
    'SF90 Stradale là siêu xe thương mại đầu tiên của Ferrari được trang bị cấu trúc Plug-in Hybrid (PHEV), kết hợp động cơ V8 tăng áp kép trứ danh cùng 3 mô-tơ điện mang lại tổng công suất chạm ngưỡng 1.000 mã lực.',
  images: [
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200',
  ],
};

export default function CarDetail() {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [relatedCars, setRelatedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await carService.getCarByIdOrSlug(idOrSlug);
        if (res?.data) {
          setCar(res.data);
          setIsFav(favoriteService.isFavorite(res.data._id));

          // Fetch related
          try {
            const relRes = await carService.getRelatedCars(res.data._id);
            if (relRes?.data) setRelatedCars(relRes.data);
          } catch {}
        } else {
          setCar(FALLBACK_CAR);
        }
      } catch {
        setCar(FALLBACK_CAR);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [idOrSlug]);

  const handleToggleFav = () => {
    if (!car) return;
    favoriteService.toggleFavorite(car);
    setIsFav(!isFav);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070709] text-[#D4AF37] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin" />
        <span className="font-mono-lux text-xs uppercase tracking-widest text-slate-400">
          Đang tải thông số tuyệt tác siêu xe...
        </span>
      </div>
    );
  }

  const currentCar = car || FALLBACK_CAR;
  const brandName = typeof currentCar.brand === 'object' ? currentCar.brand?.name : currentCar.brand;

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-28 pb-24">
        <div className="lux-container space-y-12">
          {/* Top Breadcrumb & Navigation */}
          <div className="flex items-center justify-between text-xs font-mono-lux text-slate-400">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại Showroom</span>
            </button>

            <div className="flex items-center gap-2 text-slate-500">
              <Link to="/" className="hover:text-slate-300">Trang chủ</Link>
              <span>/</span>
              <Link to="/cars" className="hover:text-slate-300">Siêu xe</Link>
              <span>/</span>
              <span className="text-[#D4AF37]">{currentCar.name}</span>
            </div>
          </div>

          {/* Main Grid Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Gallery & 360 */}
            <div className="lg:col-span-7 space-y-6">
              <CarGallery images={currentCar.images || [currentCar.mainImage]} carName={currentCar.name} />
            </div>

            {/* Right Column: Car Details & Actions */}
            <div className="lg:col-span-5 space-y-8">
              {/* Brand & Name */}
              <div className="space-y-2 border-b border-white/10 pb-6">
                <span className="lux-eyebrow">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {brandName || 'LuxeMotors'}
                </span>
                <h1 className="font-serif-lux text-3xl sm:text-4xl font-bold text-white leading-tight">
                  {currentCar.name}
                </h1>
                <div className="flex items-center gap-3 pt-2">
                  <span className="lux-badge lux-badge-gold">{currentCar.year || '2026'}</span>
                  <span className="lux-badge lux-badge-emerald">Có Sẵn Giao Ngay</span>
                  <span className="lux-badge bg-black/60 text-slate-300 border border-white/20">
                    {currentCar.category || 'Hypercar'}
                  </span>
                </div>
              </div>

              {/* Price Box */}
              <div className="p-6 rounded bg-[#0E0E12] border border-[#D4AF37]/30 space-y-2">
                <span className="text-[10px] font-mono-lux uppercase tracking-widest text-slate-400">
                  Giá Niêm Yết Đã Bao Gồm Thẻ Đặc Quyền VIP
                </span>
                <div className="font-serif-lux text-4xl font-bold text-[#D4AF37]">
                  ${typeof currentCar.price === 'number' ? currentCar.price.toLocaleString() : currentCar.price} USD
                </div>
                <p className="text-[11px] text-slate-400">
                  Đã bao gồm thuế GTGT, hải quan chính ngạch & gói bảo dưỡng 5 năm.
                </p>
              </div>

              {/* Highlight Specs */}
              {(() => {
                const hp = currentCar.specifications?.horsepower || currentCar.horsePower || 1000;
                const accel = currentCar.specifications?.acceleration
                  ? `${currentCar.specifications.acceleration}s`
                  : currentCar.acceleration || '2.5s';
                const topSpd = currentCar.specifications?.topSpeed
                  ? `${currentCar.specifications.topSpeed} km/h`
                  : currentCar.topSpeed || '340 km/h';
                const trans = currentCar.specifications?.transmission || currentCar.transmission || '8-Speed DCT';

                return (
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono-lux">
                    <div className="p-4 rounded bg-[#15151B] border border-white/5 space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase">Công suất động cơ</span>
                      <p className="font-serif-lux text-2xl font-bold text-white">{hp} HP</p>
                    </div>
                    <div className="p-4 rounded bg-[#15151B] border border-white/5 space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase">Tăng tốc 0 - 100 km/h</span>
                      <p className="font-serif-lux text-2xl font-bold text-[#D4AF37]">{accel}</p>
                    </div>
                    <div className="p-4 rounded bg-[#15151B] border border-white/5 space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase">Tốc độ tối đa</span>
                      <p className="font-serif-lux text-2xl font-bold text-white">{topSpd}</p>
                    </div>
                    <div className="p-4 rounded bg-[#15151B] border border-white/5 space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase">Hộp số truyền động</span>
                      <p className="font-serif-lux text-lg font-bold text-white truncate">{trans}</p>
                    </div>
                  </div>
                );
              })()}

              {/* Action Buttons */}
              <div className="space-y-4 pt-2">
                <button
                  onClick={() => setPurchaseModalOpen(true)}
                  className="btn-lux-gold w-full py-4 text-xs tracking-[0.2em]"
                >
                  ĐẶT CỌC GIỮ XE TRỰC TUYẾN
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to={`/appointment/${currentCar._id}`}
                    className="btn-lux-outline w-full justify-center"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Lái thử tận nhà</span>
                  </Link>

                  <button
                    onClick={handleToggleFav}
                    className={`btn-lux-outline w-full justify-center ${
                      isFav ? 'border-rose-500 text-rose-500' : ''
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                    <span>{isFav ? 'Đã yêu thích' : 'Lưu xe này'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Specs Section */}
          <div className="pt-12 border-t border-white/10 space-y-6">
            <h3 className="font-serif-lux text-3xl font-bold text-white">
              Bảng Thông Số Kỹ Thuật Chi Tiết
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono-lux text-xs">
              <div className="space-y-3 bg-[#0E0E12] p-6 rounded border border-white/10">
                <h4 className="text-[#D4AF37] font-bold uppercase tracking-wider border-b border-white/10 pb-2">
                  Động Cơ & Vận Hành
                </h4>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Kiểu động cơ:</span>
                  <span className="text-white font-semibold">{currentCar.engine || 'V8 Twin-Turbo Plug-in Hybrid'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Nhiên liệu:</span>
                  <span className="text-white font-semibold">{currentCar.fuelType || 'Xăng / Điện'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Hệ dẫn động:</span>
                  <span className="text-white font-semibold">4WD (Dẫn động 4 bánh toàn thời gian)</span>
                </div>
              </div>

              <div className="space-y-3 bg-[#0E0E12] p-6 rounded border border-white/10">
                <h4 className="text-[#D4AF37] font-bold uppercase tracking-wider border-b border-white/10 pb-2">
                  Trang Bị & Tiện Nghi
                </h4>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Nội thất:</span>
                  <span className="text-white font-semibold">Da Alcantara & Carbon fiber siêu nhẹ</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Hệ thống âm thanh:</span>
                  <span className="text-white font-semibold">Burmester High-End 3D Surround</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Tình trạng pháp lý:</span>
                  <span className="text-emerald-400 font-semibold">Sẵn sổ đăng kiểm & Hồ sơ hải quan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Purchase Modal */}
      <PurchaseModal
        car={currentCar}
        isOpen={purchaseModalOpen}
        onClose={() => setPurchaseModalOpen(false)}
        onSuccess={() => {
          setPurchaseModalOpen(false);
          navigate('/orders');
        }}
      />

      <Chatbot />
      <Footer />
    </div>
  );
}