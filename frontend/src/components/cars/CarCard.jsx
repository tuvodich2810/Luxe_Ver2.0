import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Badge  from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { formatPriceShort } from '@/utils/formatPrice';

const HeartIcon = ({ filled }) => (
  <svg width="14" height="14" fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M12 21s-6.7-4.35-9.3-8.2C.8 9.94 1.4 6.2 4.4 4.7c2.3-1.15
             4.8-.3 6.1 1.5l1.5 2 1.5-2c1.3-1.8 3.8-2.65 6.1-1.5
             3 1.5 3.6 5.24 1.7 8.1C18.7 16.65 12 21 12 21z"/>
  </svg>
);

const Arrow = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor"
    strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M17 8l4 4m0 0l-4 4m4-4H3"/>
  </svg>
);

const PLACEHOLDER = 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&auto=format';

export default function CarCard({
  car, index = 0,
  isFavorited, isFavoritePending, onToggleFavorite,
}) {
  const {
    _id, slug, name, model, year, brand,
    price, salePrice, mainImage, images,
    category, condition, specifications,
    isFeatured, inStock,
  } = car;

  const carUrl     = `/cars/${slug || _id}`;
  const imageUrl   = mainImage || images?.[0]?.url || PLACEHOLDER;
  const finalPrice = salePrice && salePrice < price ? salePrice : price;
  const hasDiscount= !!(salePrice && salePrice < price);

  const handleFav = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (onToggleFavorite) {
      const res = await onToggleFavorite(_id);
      if (res?.requireAuth) window.location.href = '/login';
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.55, delay: (index % 3) * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="lux-card hover-gold group"
    >
      <Link to={carUrl} className="block">

        {/* Image */}
        <div className="relative overflow-hidden bg-lux-mid"
          style={{ aspectRatio: '16/9' }}>
          <motion.img
            src={imageUrl} alt={name} loading="lazy"
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            onError={e => { e.target.src = PLACEHOLDER; }}
          />

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50
                          via-transparent to-transparent opacity-0
                          group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges — top left */}
          <div className="absolute top-3.5 left-3.5 flex gap-2 flex-wrap">
            {isFeatured   && <Badge variant="featured">Nổi bật</Badge>}
            {!inStock     && <Badge variant="danger">Hết hàng</Badge>}
            {hasDiscount  && (
              <Badge variant="gold">
                -{Math.round(((price - salePrice) / price) * 100)}%
              </Badge>
            )}
          </div>

          {/* Favorite button — top right */}
          {onToggleFavorite && (
            <motion.button
              type="button" onClick={handleFav}
              disabled={isFavoritePending}
              whileTap={{ scale: 0.82 }}
              aria-label={isFavorited ? 'Bỏ yêu thích' : 'Yêu thích'}
              className={`btn btn-icon absolute top-3.5 right-3.5
                          bg-black/50 backdrop-blur-sm
                          ${isFavorited ? 'active' : ''}`}
            >
              <motion.span
                key={isFavorited ? 'f' : 'u'}
                initial={{ scale: 0.5 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 14 }}
              >
                <HeartIcon filled={isFavorited} />
              </motion.span>
            </motion.button>
          )}

          {/* Hover CTA */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4
                          opacity-0 group-hover:opacity-100 translate-y-2
                          group-hover:translate-y-0 transition-all duration-400">
            <Button variant="primary" size="sm" iconRight={<Arrow />}>
              Xem chi tiết
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          {/* Brand + year + condition */}
          <div className="flex items-center justify-between mb-2.5">
            <span className="eyebrow text-lux-muted" style={{ fontSize: 9 }}>
              {brand?.name || '—'}&nbsp;&nbsp;·&nbsp;&nbsp;{year}
            </span>
            <Badge variant={
              condition === 'new'       ? 'new'     :
              condition === 'certified' ? 'certified': 'used'
            }>
              {condition === 'new' ? 'Mới' : condition === 'certified' ? 'Certified' : 'Đã dùng'}
            </Badge>
          </div>

          {/* Name */}
          <h3 className="font-display text-xl font-light text-lux-white
                         mb-0.5 line-clamp-1
                         group-hover:text-lux-gold transition-colors duration-300">
            {name}
          </h3>
          <p className="text-sm text-lux-muted mb-4 font-light">{model}</p>

          {/* Quick specs */}
          {specifications && (
            <div className="grid grid-cols-3 gap-0 mb-4 pt-4 border-t border-lux-border">
              {[
                { v: specifications.horsepower,                           u: 'HP'   },
                { v: specifications.acceleration ? `${specifications.acceleration}s` : null, u: '0–100' },
                { v: specifications.topSpeed,                             u: 'km/h' },
              ].map((s, i) => s.v && (
                <div key={i}
                  className={`text-center ${i === 1 ? 'border-x border-lux-border' : ''}`}>
                  <p className="font-label text-base font-medium text-lux-white">{s.v}</p>
                  <p className="eyebrow text-lux-muted" style={{ fontSize: 8 }}>{s.u}</p>
                </div>
              ))}
            </div>
          )}

          {/* Price + arrow */}
          <div className="flex items-end justify-between">
            <div>
              <p style={{
                fontFamily: 'Cormorant Garamond', fontSize: 22,
                fontWeight: 300, color: 'var(--gold)',
              }}>
                {formatPriceShort(finalPrice)}
              </p>
              {hasDiscount && (
                <p className="text-xs text-lux-muted line-through mt-0.5">
                  {formatPriceShort(price)}
                </p>
              )}
            </div>
            <div className="w-9 h-9 border border-lux-border flex items-center
                            justify-center text-lux-muted
                            group-hover:border-lux-gold group-hover:text-lux-gold
                            transition-all duration-300">
              <Arrow />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}