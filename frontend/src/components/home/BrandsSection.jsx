import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '@/services/api';

// Fallback brands nếu API chưa có data
const FALLBACK_BRANDS = [
  { _id: '1', name: 'Lamborghini', logo: '' },
  { _id: '2', name: 'Ferrari', logo: '' },
  { _id: '3', name: 'Porsche', logo: '' },
  { _id: '4', name: 'Bugatti', logo: '' },
  { _id: '5', name: 'McLaren', logo: '' },
  { _id: '6', name: 'Rolls-Royce', logo: '' },
  { _id: '7', name: 'Bentley', logo: '' },
  { _id: '8', name: 'Aston Martin', logo: '' },
];

const BrandsSection = () => {
  const [brands, setBrands] = useState(FALLBACK_BRANDS);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await api.get('/brands?featured=true');
        if (response.data?.length > 0) {
          setBrands(response.data);
        }
      } catch {
        // Dùng fallback
      }
    };
    fetchBrands();
  }, []);

  return (
    <section className="section-padding bg-graphite">
      <div className="container-luxury">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="eyebrow mb-4"
          >
            Đối tác chính thức
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="heading-display text-white"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            Thương hiệu hàng đầu
          </motion.h2>
        </div>

        {/* Brands grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
          {brands.map((brand, index) => (
            <motion.div
              key={brand._id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/cars?brand=${brand._id}`}
                className="flex items-center justify-center bg-graphite hover:bg-black/50 transition-colors duration-300 p-8 group h-28"
              >
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-h-10 max-w-[120px] object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 opacity-50 group-hover:opacity-100"
                  />
                ) : (
                  <span className="font-display text-lg font-light text-silver/50 group-hover:text-gold transition-colors duration-300 tracking-wider">
                    {brand.name}
                  </span>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;