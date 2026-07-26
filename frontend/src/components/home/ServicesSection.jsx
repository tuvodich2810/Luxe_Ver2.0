import { motion } from 'framer-motion';

const SERVICES = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    title: 'Xem xe thực tế',
    description: 'Đặt lịch hẹn để được trải nghiệm và lái thử siêu xe tại showroom của chúng tôi.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Bảo hành chính hãng',
    description: 'Tất cả xe đều được bảo hành chính hãng và kiểm tra kỹ thuật 100 điểm trước khi giao.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Hỗ trợ tài chính',
    description: 'Giải pháp tài chính linh hoạt với lãi suất ưu đãi, thủ tục nhanh chóng trong 24 giờ.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: 'Hậu mãi trọn đời',
    description: 'Đội ngũ chăm sóc khách hàng 24/7, sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi.',
  },
];

const ServicesSection = () => {
  return (
    <section className="section-padding bg-black relative overflow-hidden">
      {/* Background decorative */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full opacity-5"
        style={{
          background: 'radial-gradient(ellipse at right center, #C9A96E 0%, transparent 60%)',
        }}
      />

      <div className="container-luxury relative">
        {/* Header */}
        <div className="max-w-xl mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="eyebrow mb-4"
          >
            Tại sao chọn chúng tôi
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="heading-display text-white"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            Trải nghiệm{' '}
            <span className="italic text-gold">đẳng cấp</span>
          </motion.h2>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="group flex gap-6 p-8 bg-graphite border border-white/5 hover:border-gold/20 transition-colors duration-500"
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-14 h-14 border border-gold/20 flex items-center justify-center text-gold group-hover:bg-gold/10 group-hover:border-gold/40 transition-all duration-300">
                {service.icon}
              </div>

              {/* Content */}
              <div>
                <h3 className="font-display text-xl font-light text-white mb-3 group-hover:text-gold transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-silver text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;