import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// ===================================
// Nút yêu thích tái sử dụng
// size: 'sm' (trên card) | 'lg' (trên trang chi tiết)
// ===================================
const FavoriteButton = ({ carId, isFavorited, isPending, onToggle, size = 'sm', className = '' }) => {
  const navigate = useNavigate();

  const handleClick = async (e) => {
    // Ngăn sự kiện click lan ra Link cha (CarCard bọc trong <Link>)
    e.preventDefault();
    e.stopPropagation();

    const result = await onToggle(carId);

    if (result?.requireAuth) {
      navigate('/login');
    }
  };

  const sizeClasses = {
    sm: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      whileTap={{ scale: 0.85 }}
      aria-label={isFavorited ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
      aria-pressed={isFavorited}
      className={[
        sizeClasses[size],
        'flex items-center justify-center transition-colors duration-300',
        'bg-black/50 backdrop-blur-sm border',
        isFavorited
          ? 'border-gold/60 text-gold'
          : 'border-white/15 text-white hover:border-white/40',
        isPending ? 'opacity-60 cursor-wait' : 'cursor-pointer',
        className,
      ].join(' ')}
    >
      {/* ===================================
          Icon trái tim với animation "pop" khi chuyển trạng thái
          key={isFavorited} buộc Framer Motion remount lại để chạy animation mỗi lần đổi
          =================================== */}
      <motion.svg
        key={isFavorited ? 'filled' : 'outline'}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        className={iconSizeClasses[size]}
        viewBox="0 0 24 24"
        fill={isFavorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={isFavorited ? 0 : 1.5}
      >
        <path d="M12 21s-6.7-4.35-9.3-8.2C.8 9.94 1.4 6.2 4.4 4.7c2.3-1.15 4.8-.3 6.1 1.5l1.5 2 1.5-2c1.3-1.8 3.8-2.65 6.1-1.5 3 1.5 3.6 5.24 1.7 8.1C18.7 16.65 12 21 12 21z" />
      </motion.svg>
    </motion.button>
  );
};

export default FavoriteButton;