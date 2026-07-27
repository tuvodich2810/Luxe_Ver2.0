import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Chatbot from '@/components/common/Chatbot';
import CarCard from '@/components/cars/CarCard';
import CarFilter from '@/components/cars/CarFilter';
import carService from '@/services/carService';
import brandService from '@/services/brandService';
import { Sparkles, Grid, List, Loader2 } from 'lucide-react';

const MOCK_CAR_CATALOG = [
  {
    _id: 'c1',
    name: 'Ferrari SF90 Stradale Assetto Fiorano',
    brand: { name: 'Ferrari' },
    price: 625000,
    year: 2026,
    horsePower: 1000,
    acceleration: '2.5s',
    transmission: '8-Speed Dual Clutch',
    category: 'Hypercar',
    status: 'available',
    mainImage: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800',
  },
  {
    _id: 'c2',
    name: 'Lamborghini Revuelto V12 Hybrid',
    brand: { name: 'Lamborghini' },
    price: 608000,
    year: 2026,
    horsePower: 1015,
    acceleration: '2.5s',
    transmission: '8-Speed Dual Clutch',
    category: 'Hypercar',
    status: 'available',
    mainImage: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=800',
  },
  {
    _id: 'c3',
    name: 'Porsche 911 GT3 RS Weissach Package',
    brand: { name: 'Porsche' },
    price: 312000,
    year: 2026,
    horsePower: 525,
    acceleration: '3.2s',
    transmission: '7-Speed PDK',
    category: 'Supercar',
    status: 'available',
    mainImage: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800',
  },
  {
    _id: 'c4',
    name: 'Rolls-Royce Spectre Electric Super Coupe',
    brand: { name: 'Rolls-Royce' },
    price: 420000,
    year: 2026,
    horsePower: 584,
    acceleration: '4.5s',
    transmission: 'Single Speed EV',
    category: 'Luxury Sedan',
    status: 'available',
    mainImage: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&q=80&w=800',
  },
  {
    _id: 'c5',
    name: 'Aston Martin Valkyrie F1 Edition',
    brand: { name: 'Aston Martin' },
    price: 3500000,
    year: 2026,
    horsePower: 1160,
    acceleration: '2.3s',
    transmission: '7-Speed Paddle Shift',
    category: 'Hypercar',
    status: 'available',
    mainImage: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=800',
  },
  {
    _id: 'c6',
    name: 'Bentley Continental GT Speed V8',
    brand: { name: 'Bentley' },
    price: 298000,
    year: 2026,
    horsePower: 659,
    acceleration: '3.5s',
    transmission: '8-Speed Dual Clutch',
    category: 'Grand Tourer',
    status: 'available',
    mainImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800',
  },
];

export default function CarList() {
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    brand: searchParams.get('brand') || '',
    category: searchParams.get('category') || '',
    sort: '-createdAt',
  });

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await brandService.getBrands();
        if (res?.data) setBrands(res.data);
      } catch {}
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const res = await carService.getCars(filters);
        if (res?.data && res.data.length > 0) {
          setCars(res.data);
        } else {
          // Apply local filter on fallback catalog if DB is empty
          let list = [...MOCK_CAR_CATALOG];
          if (filters.search) {
            list = list.filter((c) =>
              c.name.toLowerCase().includes(filters.search.toLowerCase())
            );
          }
          if (filters.category) {
            list = list.filter((c) => c.category === filters.category);
          }
          setCars(list);
        }
      } catch {
        setCars(MOCK_CAR_CATALOG);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, [filters]);

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-28 pb-24">
        <div className="lux-container space-y-10">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="lux-eyebrow justify-center">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              EXCLUSIVE SHOWROOM INVENTORY
            </div>
            <h1 className="font-serif-lux text-4xl md:text-6xl font-bold text-white">
              Bộ Sưu Tập <span className="lux-gradient-gold-text italic">Siêu Xe Chính Hãng</span>
            </h1>
            <p className="text-xs text-slate-400">
              Khám phá danh mục siêu xe nhập khẩu nguyên chiếc. Đầy đủ giấy tờ hải quan, sẵn sàng giao xe tận dinh thự.
            </p>
          </div>

          {/* Filter Bar */}
          <CarFilter
            filters={filters}
            onChange={setFilters}
            onReset={() =>
              setFilters({ search: '', brand: '', category: '', sort: '-createdAt' })
            }
            brands={brands}
          />

          {/* Catalog Status Bar */}
          <div className="flex items-center justify-between text-xs font-mono-lux text-slate-400 border-b border-white/10 pb-4">
            <span>
              Hiển thị <strong className="text-[#D4AF37]">{cars.length}</strong> siêu xe phù hợp
            </span>
          </div>

          {/* Catalog Grid */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
              <span className="text-xs font-mono-lux text-slate-400 uppercase tracking-widest">
                Đang kết nối kho xe LuxeMotors...
              </span>
            </div>
          ) : cars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4 border border-dashed border-white/10 rounded-md">
              <p className="font-serif-lux text-2xl text-slate-300">Không tìm thấy siêu xe phù hợp</p>
              <button
                onClick={() =>
                  setFilters({ search: '', brand: '', category: '', sort: '-createdAt' })
                }
                className="btn-lux-gold px-6 py-2.5 text-xs"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          )}
        </div>
      </main>

      <Chatbot />
      <Footer />
    </div>
  );
}