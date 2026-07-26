import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import api from '@/services/api';
import CarCard from '@/components/cars/CarCard';
import { useFavorites } from '@/hooks/useFavorites';
const FeaturedCars = () => {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isFavorited, isPending, toggleFavorite } = useFavorites();
  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const response = await api.get('/cars/featured?limit=6');
        setCars(response.data || []);
      } catch {
        // Sử dụng dữ liệu mẫu nếu API lỗi
        setCars([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedCars();
  }, []);

  return (
    <section className="section-padding bg-black">
      <div className="container-luxury">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="eyebrow mb-4"
            >
              Đặc sắc của chúng tôi
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="heading-display text-white"
              style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)' }}
            >
              Xe nổi bật
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link to="/cars?isFeatured=true" className="btn-ghost">
              Xem tất cả
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="car-card animate-pulse">
                <div className="aspect-car bg-graphite" />
                <div className="p-6 space-y-3">
                  <div className="h-3 bg-graphite rounded w-1/3" />
                  <div className="h-6 bg-graphite rounded w-3/4" />
                  <div className="h-4 bg-graphite rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cars Grid */}
        {!isLoading && cars.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car, index) => (
              <CarCard key={car._id} car={car} index={index} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && cars.length === 0 && (
          <div className="text-center py-20">
            <p className="text-silver">Chưa có xe nổi bật nào</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCars;