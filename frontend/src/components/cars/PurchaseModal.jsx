import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';
import { formatPrice, formatPriceShort } from '@/utils/formatPrice';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { sendOrderForm } from '@/services/sheetsService';

// Các mốc đặt cọc gợi ý (phần trăm giá xe)
const DEPOSIT_PRESETS = [10, 20, 30, 50];

const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Chuyển khoản ngân hàng' },
  { value: 'cash', label: 'Tiền mặt' },
  { value: 'installment', label: 'Trả góp' },
];

const PurchaseModal = ({ car, isOpen, onClose }) => {
  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [depositPercent, setDepositPercent] = useState(20);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Giá hiện tại của xe (ưu tiên giá khuyến mãi)
  const currentPrice = car.salePrice && car.salePrice < car.price ? car.salePrice : car.price;

  // Tính số tiền cọc thực tế từ phần trăm
  const depositAmount = useMemo(
    () => Math.round((currentPrice * depositPercent) / 100),
    [currentPrice, depositPercent]
  );

  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await api.post('/orders', {
        car: car._id,
        depositAmount,
        paymentMethod,
        deliveryAddress,
        notes,
      });

      sendOrderForm(
        {
          name: user?.fullName || '',
          phone: user?.phone || '',
          email: user?.email || '',
          paymentMethod,
          deliveryAddress,
          depositPercent,
        },
        car,
        depositAmount
      );

      setCreatedOrder(response.data);
      setStep('success');
    } catch (err) {
      setError(err.message || 'Tạo đơn hàng thất bại, vui lòng thử lại');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset state khi đóng modal để lần mở sau sạch sẽ
  const handleClose = () => {
    setStep('form');
    setError('');
    setCreatedOrder(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-graphite border border-white/10 max-w-lg w-full my-8 max-h-[90vh] overflow-y-auto"
          >
            {/* ===================================
                STEP: FORM
                =================================== */}
            {step === 'form' && (
              <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <p className="eyebrow text-[10px] mb-2">Đặt mua xe</p>
                    <h3 className="font-display text-2xl font-light text-white">
                      {car.name}
                    </h3>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-silver hover:text-white transition-colors p-1"
                    aria-label="Đóng"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Giá xe */}
                <div className="flex items-center justify-between py-4 px-5 bg-black/40 border border-white/5 mb-8">
                  <span className="font-label text-xs text-silver uppercase tracking-wider">
                    Giá niêm yết
                  </span>
                  <span className="font-display text-2xl font-light text-gold">
                    {formatPriceShort(currentPrice)}
                  </span>
                </div>

                {error && (
                  <div className="mb-6 px-5 py-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* ===================================
                      Chọn % đặt cọc
                      =================================== */}
                  <div>
                    <label className="block eyebrow text-[10px] text-silver mb-3">
                      Số tiền đặt cọc
                    </label>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {DEPOSIT_PRESETS.map((percent) => (
                        <button
                          key={percent}
                          type="button"
                          onClick={() => setDepositPercent(percent)}
                          className={[
                            'py-3 font-label text-sm transition-all duration-200',
                            depositPercent === percent
                              ? 'bg-gold text-black'
                              : 'border border-white/10 text-silver hover:border-gold/40',
                          ].join(' ')}
                        >
                          {percent}%
                        </button>
                      ))}
                    </div>
                    {/* Hiển thị số tiền cọc thực tế quy đổi */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gold/5 border border-gold/20">
                      <span className="text-sm text-silver">Số tiền đặt cọc</span>
                      <span className="font-label text-base font-medium text-gold">
                        {formatPrice(depositAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Phương thức thanh toán */}
                  <div>
                    <label className="block eyebrow text-[10px] text-silver mb-3">
                      Phương thức thanh toán
                    </label>
                    <div className="space-y-2">
                      {PAYMENT_METHODS.map((method) => (
                        <label
                          key={method.value}
                          className={[
                            'flex items-center gap-3 px-4 py-3 border cursor-pointer transition-colors duration-200',
                            paymentMethod === method.value
                              ? 'border-gold/50 bg-gold/5'
                              : 'border-white/10 hover:border-white/20',
                          ].join(' ')}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.value}
                            checked={paymentMethod === method.value}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="accent-gold"
                          />
                          <span className="text-sm text-platinum">{method.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Địa chỉ giao xe */}
                  <div>
                    <label className="block eyebrow text-[10px] text-silver mb-2">
                      Địa chỉ giao xe
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Số nhà, đường, quận, thành phố"
                      className="input-luxury w-full"
                    />
                  </div>

                  {/* Ghi chú */}
                  <div>
                    <label className="block eyebrow text-[10px] text-silver mb-2">
                      Ghi chú thêm
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      placeholder="Yêu cầu đặc biệt..."
                      className="input-luxury w-full resize-none"
                    />
                  </div>

                  <Button type="submit" isLoading={isSubmitting} className="w-full justify-center">
                    Xác nhận đặt mua
                  </Button>

                  <p className="text-center text-xs text-silver/60">
                    Nhân viên tư vấn sẽ liên hệ xác nhận đơn hàng trong vòng 24 giờ
                  </p>
                </form>
              </div>
            )}

            {/* ===================================
                STEP: SUCCESS
                =================================== */}
            {step === 'success' && createdOrder && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-10 text-center"
              >
                <div className="w-16 h-16 border border-gold/30 bg-gold/10 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <p className="eyebrow mb-3">Đặt mua thành công</p>
                <h3 className="font-display text-2xl font-light text-white mb-6">
                  Cảm ơn bạn đã tin tưởng!
                </h3>

                {/* Mã đơn hàng */}
                <div className="bg-black/40 border border-white/5 py-4 px-6 mb-6">
                  <p className="text-xs text-silver uppercase tracking-wider mb-1">Mã đơn hàng</p>
                  <p className="font-label text-lg text-gold tracking-wider">
                    {createdOrder.orderNumber}
                  </p>
                </div>

                <p className="text-silver text-sm mb-8 leading-relaxed">
                  Đơn đặt mua <strong className="text-white">{car.name}</strong> với số tiền cọc{' '}
                  <strong className="text-gold">{formatPrice(depositAmount)}</strong> đã được ghi nhận.
                  Vui lòng kiểm tra mục "Đơn hàng của tôi" để theo dõi tiến trình.
                </p>

                <div className="flex gap-4">
                  <button onClick={handleClose} className="btn-ghost flex-1 justify-center">
                    Đóng
                  </button>
                  <Link to="/orders" className="btn-primary flex-1 justify-center">
                    Xem đơn hàng
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PurchaseModal;