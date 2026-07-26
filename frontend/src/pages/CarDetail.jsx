import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar  from '@/components/common/Navbar';
import Footer  from '@/components/common/Footer';
import CarCard from '@/components/cars/CarCard';
import Badge   from '@/components/common/Badge';
import Button  from '@/components/common/Button';
import { formatPrice, formatPriceShort } from '@/utils/formatPrice';
import { useAuth }      from '@/context/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';
import { sendAppointmentForm, sendOrderForm, sendContactForm } from '@/services/sheetsService';
import api from '@/services/api';

const CAT_LABEL = {
  supercar:'Supercar', hypercar:'Hypercar', suv:'SUV',
  sedan:'Sedan', coupe:'Coupe', convertible:'Convertible',
};

const TIME_SLOTS = [
  '09:00','09:30','10:00','10:30','11:00','11:30',
  '14:00','14:30','15:00','15:30','16:00','16:30',
];

const DEPOSIT_PCTS = [10, 20, 30, 50];

const PAYMENT_METHODS = [
  { v: 'bank_transfer', l: 'Chuyển khoản ngân hàng' },
  { v: 'cash',          l: 'Tiền mặt'               },
  { v: 'installment',   l: 'Trả góp'                },
];

/* ─── Icons ──────────────────────────────────── */
const HeartIcon = ({ filled }) => (
  <svg width="16" height="16"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M12 21s-6.7-4.35-9.3-8.2C.8 9.94 1.4 6.2 4.4 4.7
             c2.3-1.15 4.8-.3 6.1 1.5l1.5 2 1.5-2
             c1.3-1.8 3.8-2.65 6.1-1.5
             3 1.5 3.6 5.24 1.7 8.1C18.7 16.65 12 21 12 21z"/>
  </svg>
);

const CalIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor"
    strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5
         a2 2 0 00-2 2v12a2 2 0 002 2z"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor"
    strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
  </svg>
);

/* ─── Appointment Modal ──────────────────────── */
function ApptModal({ car, onClose }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    appointmentDate: '',
    timeSlot:        '',
    visitorName:     user?.fullName || '',
    visitorPhone:    user?.phone    || '',
    visitorEmail:    user?.email    || '',
    notes:           '',
  });
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!form.appointmentDate || !form.timeSlot ||
        !form.visitorName     || !form.visitorPhone) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.'); return;
    }
    setLoading(true); setError('');
    try {
      await api.post('/appointments', { car: car._id, ...form });
      sendAppointmentForm(form, car.name);
      setDone(true);
    } catch (e) { setError(e.message || 'Đặt lịch thất bại.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="lux-modal-overlay" onClick={onClose}>
      <motion.div className="lux-modal"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{    opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}>

        {!done ? (
          <>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'flex-start',
              justifyContent: 'space-between', marginBottom: 28,
            }}>
              <div>
                <p className="eyebrow mb-1.5">Đặt lịch xem xe</p>
                <h3 style={{
                  fontFamily: 'Cormorant Garamond', fontSize: 24,
                  fontWeight: 300, color: 'var(--white)',
                }}>
                  {car.name}
                </h3>
              </div>
              <button onClick={onClose}
                className="btn btn-ghost btn-sm text-lux-muted"
                style={{ padding: '4px 0' }}>✕</button>
            </div>

            {error && (
              <p style={{
                fontSize: 13, color: '#F87171',
                background: 'rgba(248,113,113,0.06)',
                border: '1px solid rgba(248,113,113,0.2)',
                padding: '10px 16px', marginBottom: 16,
              }}>{error}</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label className="lux-label">Họ và tên *</label>
                  <input className="lux-input"
                    value={form.visitorName}
                    onChange={e => set('visitorName', e.target.value)}
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="lux-label">Số điện thoại *</label>
                  <input className="lux-input"
                    value={form.visitorPhone}
                    onChange={e => set('visitorPhone', e.target.value)}
                    placeholder="0901 234 567"
                  />
                </div>
              </div>

              <div>
                <label className="lux-label">Email</label>
                <input className="lux-input" type="email"
                  value={form.visitorEmail}
                  onChange={e => set('visitorEmail', e.target.value)}
                  placeholder="email@domain.com"
                />
              </div>

              <div>
                <label className="lux-label">Ngày hẹn *</label>
                <input className="lux-input" type="date"
                  value={form.appointmentDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => set('appointmentDate', e.target.value)}
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              <div>
                <label className="lux-label" style={{ marginBottom: 10 }}>
                  Khung giờ *
                </label>
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6,
                }}>
                  {TIME_SLOTS.map(t => (
                    <button key={t} type="button"
                      onClick={() => set('timeSlot', t)}
                      className={`btn btn-sm
                        ${form.timeSlot === t ? 'btn-gold' : 'btn-outline'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="lux-label">Ghi chú</label>
                <textarea className="lux-textarea lux-input" rows={3}
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  placeholder="Yêu cầu đặc biệt..."
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <Button variant="outline" size="md" onClick={onClose}
                style={{ flex: 1 }}>Hủy</Button>
              <Button variant="primary" size="md" loading={loading}
                onClick={submit} style={{ flex: 2 }}>
                Xác nhận đặt lịch
              </Button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{
              width: 52, height: 52,
              border: '1px solid var(--gold)',
              background: 'rgba(201,169,110,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--gold)', margin: '0 auto 20px',
            }}>
              <CheckIcon />
            </div>
            <p className="eyebrow mb-3">Đặt lịch thành công</p>
            <h3 style={{
              fontFamily: 'Cormorant Garamond', fontSize: 26,
              fontWeight: 300, color: 'var(--white)', marginBottom: 10,
            }}>
              Cảm ơn bạn!
            </h3>
            <p style={{
              fontSize: 14, color: 'var(--silver)',
              fontWeight: 300, lineHeight: 1.7, marginBottom: 24,
            }}>
              Nhân viên sẽ liên hệ xác nhận trong vòng{' '}
              <strong style={{ color: 'var(--white)' }}>2 giờ</strong> làm việc.
            </p>
            <Button variant="primary" size="md" full onClick={onClose}>Đóng</Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ─── Purchase Modal ─────────────────────────── */
function BuyModal({ car, onClose }) {
  const { user } = useAuth();
  const price = car.salePrice && car.salePrice < car.price
    ? car.salePrice : car.price;

  const [pct,     setPct]     = useState(20);
  const [payment, setPayment] = useState('bank_transfer');
  const [addr,    setAddr]    = useState('');
  const [name,    setName]    = useState(user?.fullName || '');
  const [phone,   setPhone]   = useState(user?.phone    || '');
  const [email,   setEmail]   = useState(user?.email    || '');
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [order,   setOrder]   = useState(null);
  const [error,   setError]   = useState('');

  const deposit = Math.round(price * pct / 100);

  const submit = async () => {
    if (!name || !phone) {
      setError('Vui lòng nhập Họ tên và Số điện thoại.'); return;
    }
    setLoading(true); setError('');
    try {
      const res = await api.post('/orders', {
        car:            car._id,
        depositAmount:  deposit,
        paymentMethod:  payment,
        deliveryAddress:addr,
      });
      sendOrderForm(
        { name, phone, email, paymentMethod: payment,
          deliveryAddress: addr, depositPercent: pct },
        car, deposit
      );
      setOrder(res.data); setDone(true);
    } catch (e) { setError(e.message || 'Tạo đơn thất bại.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="lux-modal-overlay" onClick={onClose}>
      <motion.div className="lux-modal"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{    opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}>

        {!done ? (
          <>
            <div style={{
              display: 'flex', alignItems: 'flex-start',
              justifyContent: 'space-between', marginBottom: 20,
            }}>
              <div>
                <p className="eyebrow mb-1.5">Đặt mua xe</p>
                <h3 style={{
                  fontFamily: 'Cormorant Garamond', fontSize: 22,
                  fontWeight: 300, color: 'var(--white)',
                }}>
                  {car.name}
                </h3>
              </div>
              <button onClick={onClose}
                className="btn btn-ghost btn-sm text-lux-muted"
                style={{ padding: '4px 0' }}>✕</button>
            </div>

            {/* Price display */}
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              background: 'var(--mid)', border: '1px solid var(--border)',
              marginBottom: 20,
            }}>
              <span className="eyebrow text-lux-muted" style={{ fontSize: 9 }}>
                Giá niêm yết
              </span>
              <span style={{
                fontFamily: 'Cormorant Garamond', fontSize: 22,
                fontWeight: 300, color: 'var(--gold)',
              }}>
                {formatPriceShort(price)}
              </span>
            </div>

            {error && (
              <p style={{
                fontSize: 13, color: '#F87171',
                background: 'rgba(248,113,113,0.06)',
                border: '1px solid rgba(248,113,113,0.2)',
                padding: '10px 16px', marginBottom: 16,
              }}>{error}</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Deposit % */}
              <div>
                <label className="lux-label" style={{ marginBottom: 10 }}>
                  Mức đặt cọc
                </label>
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6,
                }}>
                  {DEPOSIT_PCTS.map(p => (
                    <button key={p} type="button"
                      onClick={() => setPct(p)}
                      className={`btn btn-sm ${pct === p ? 'btn-gold' : 'btn-outline'}`}>
                      {p}%
                    </button>
                  ))}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 10, padding: '12px 16px',
                  border: '1px solid rgba(201,169,110,0.25)',
                  background: 'rgba(201,169,110,0.04)',
                }}>
                  <span className="eyebrow text-lux-muted" style={{ fontSize: 9 }}>
                    Số tiền đặt cọc
                  </span>
                  <span style={{
                    fontFamily: 'Space Grotesk', fontSize: 16,
                    fontWeight: 400, color: 'var(--gold)',
                  }}>
                    {formatPrice(deposit)}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label className="lux-label">Họ và tên *</label>
                  <input className="lux-input"
                    value={name} onChange={e => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="lux-label">Số điện thoại *</label>
                  <input className="lux-input"
                    value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="0901 234 567"
                  />
                </div>
              </div>

              <div>
                <label className="lux-label">Email</label>
                <input className="lux-input" type="email"
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="email@domain.com"
                />
              </div>

              <div>
                <label className="lux-label">Phương thức thanh toán</label>
                <select className="lux-select lux-input"
                  value={payment} onChange={e => setPayment(e.target.value)}>
                  {PAYMENT_METHODS.map(m => (
                    <option key={m.v} value={m.v}>{m.l}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="lux-label">Địa chỉ giao xe</label>
                <input className="lux-input"
                  value={addr} onChange={e => setAddr(e.target.value)}
                  placeholder="Số nhà, đường, quận, thành phố"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <Button variant="outline" size="md" onClick={onClose}
                style={{ flex: 1 }}>Hủy</Button>
              <Button variant="gold" size="md" loading={loading}
                onClick={submit} style={{ flex: 2 }}>
                Xác nhận đặt mua
              </Button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{
              width: 52, height: 52,
              border: '1px solid var(--gold)',
              background: 'rgba(201,169,110,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--gold)', margin: '0 auto 20px',
            }}>
              <CheckIcon />
            </div>
            <p className="eyebrow mb-2">Đặt mua thành công</p>
            <h3 style={{
              fontFamily: 'Cormorant Garamond', fontSize: 26,
              fontWeight: 300, color: 'var(--white)', marginBottom: 12,
            }}>
              Cảm ơn bạn!
            </h3>
            {order?.orderNumber && (
              <div style={{
                margin: '0 0 16px',
                padding: '12px 18px',
                background: 'var(--mid)', border: '1px solid var(--border)',
              }}>
                <p className="eyebrow text-lux-muted mb-1" style={{ fontSize: 9 }}>
                  Mã đơn hàng
                </p>
                <p style={{
                  fontFamily: 'Space Grotesk', color: 'var(--gold)',
                  fontSize: 15, letterSpacing: '0.1em',
                }}>
                  {order.orderNumber}
                </p>
              </div>
            )}
            <p style={{
              fontSize: 13, color: 'var(--silver)',
              fontWeight: 300, lineHeight: 1.7, marginBottom: 24,
            }}>
              Chuyên gia sẽ liên hệ trong{' '}
              <strong style={{ color: 'var(--white)' }}>24 giờ</strong>{' '}
              để xác nhận và hướng dẫn đặt cọc.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/orders" style={{ flex: 1 }}>
                <Button variant="outline" full>Xem đơn hàng</Button>
              </Link>
              <Button variant="primary" size="md" onClick={onClose}
                style={{ flex: 1 }}>
                Đóng
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ─── Main CarDetail Page ────────────────────── */
export default function CarDetail() {
  const { idOrSlug } = useParams();
  const navigate     = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isFavorited, isPending, toggleFavorite } = useFavorites();

  const [car,       setCar]       = useState(null);
  const [related,   setRelated]   = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAppt,  setShowAppt]  = useState(false);
  const [showBuy,   setShowBuy]   = useState(false);
  const [thumbIdx,  setThumbIdx]  = useState(0);

  /* Contact form inline (tab 3) */
  const [contact,   setContact]   = useState({
    name: '', phone: '', email: '', interest: '', message: '',
  });
  const [ctSending, setCtSending] = useState(false);
  const [ctDone,    setCtDone]    = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const [carRes, relRes] = await Promise.all([
          api.get(`/cars/${idOrSlug}`),
          api.get(`/cars/${idOrSlug}/related`).catch(() => ({ data: [] })),
        ]);
        setCar(carRes.data);
        setRelated(relRes.data || []);
      } catch { navigate('/cars'); }
      finally { setIsLoading(false); }
    })();
  }, [idOrSlug, navigate]);

  const handleContactSubmit = async () => {
    if (!contact.name || !contact.phone) {
      alert('Vui lòng nhập Họ tên và Số điện thoại.'); return;
    }
    setCtSending(true);
    await sendContactForm(contact, car?.name);
    setCtSending(false);
    setCtDone(true);
  };

  if (isLoading) return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh', background: 'var(--black)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', paddingTop: 64,
      }}>
        <div style={{
          width: 40, height: 40, border: '1px solid var(--gold)',
          animation: 'spin 1s linear infinite', transform: 'rotate(45deg)',
        }} />
      </div>
    </>
  );

  if (!car) return null;

  const displayPrice = car.salePrice && car.salePrice < car.price
    ? car.salePrice : car.price;
  const hasDiscount = !!(car.salePrice && car.salePrice < car.price);

  const allImages = car.images?.length
    ? car.images
    : [{ url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&auto=format', alt: car.name }];

  const TABS = ['overview', 'specifications', 'contact'];
  const TAB_LABELS = {
    overview:       'Mô tả',
    specifications: 'Thông số kỹ thuật',
    contact:        'Để lại thông tin',
  };

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--black)', minHeight: '100vh' }}>

        {/* ── Hero 2-col ── */}
        <section style={{ paddingTop: 64 }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '85vh',
          }}>

            {/* Left — images */}
            <div style={{
              display: 'flex', flexDirection: 'column', background: 'var(--mid)',
            }}>
              {/* Main image */}
              <div style={{ position: 'relative', flex: 1, overflow: 'hidden', minHeight: 400 }}>
                <AnimatePresence mode="wait">
                  <motion.img key={thumbIdx}
                    src={allImages[thumbIdx]?.url}
                    alt={car.name}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    style={{
                      position: 'absolute', inset: 0,
                      width: '100%', height: '100%', objectFit: 'cover',
                    }}
                    onError={e => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&auto=format';
                    }}
                  />
                </AnimatePresence>

                {/* Ghost model name */}
                <div style={{
                  position: 'absolute', bottom: 4, right: 4,
                  pointerEvents: 'none', userSelect: 'none',
                  opacity: 0.06, overflow: 'hidden',
                }}>
                  <span style={{
                    fontFamily: 'Cormorant Garamond', fontWeight: 700,
                    fontSize: 'clamp(60px,12vw,140px)',
                    color: 'var(--white)', lineHeight: 1,
                  }}>
                    {car.model}
                  </span>
                </div>

                {/* Badges */}
                <div style={{
                  position: 'absolute', top: 20, left: 20,
                  display: 'flex', gap: 8, flexWrap: 'wrap',
                }}>
                  {car.isFeatured && <Badge variant="featured">Nổi bật</Badge>}
                  {!car.inStock   && <Badge variant="danger">Hết hàng</Badge>}
                  {hasDiscount    && (
                    <Badge variant="gold">
                      -{Math.round(((car.price - car.salePrice) / car.price) * 100)}%
                    </Badge>
                  )}
                </div>

                {/* Favorite button */}
                <motion.button type="button"
                  whileTap={{ scale: 0.85 }}
                  onClick={async () => {
                    const r = await toggleFavorite(car._id);
                    if (r?.requireAuth) navigate('/login');
                  }}
                  style={{
                    position: 'absolute', top: 20, right: 20,
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(6px)',
                  }}
                  className={`btn btn-icon ${isFavorited(car._id) ? 'active' : ''}`}
                  aria-label="Yêu thích">
                  <motion.span
                    key={isFavorited(car._id) ? 'f' : 'u'}
                    initial={{ scale: 0.5 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 14 }}>
                    <HeartIcon filled={isFavorited(car._id)} />
                  </motion.span>
                </motion.button>
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div style={{
                  display: 'flex', height: 72,
                  borderTop: '1px solid var(--border)',
                }}>
                  {allImages.map((img, i) => (
                    <button key={i}
                      onClick={() => setThumbIdx(i)}
                      style={{
                        flex: 1, overflow: 'hidden', position: 'relative',
                        opacity: thumbIdx === i ? 1 : 0.45,
                        borderRight: i < allImages.length - 1
                          ? '1px solid var(--border)' : 'none',
                        transition: 'opacity .2s',
                        border: 'none', padding: 0, cursor: 'pointer',
                      }}>
                      <img src={img.url} alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {thumbIdx === i && (
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          height: 2, background: 'var(--gold)',
                        }} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right — info */}
            <div style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '52px 48px', borderLeft: '1px solid var(--border)',
              background: 'var(--black)',
            }}>
              {/* Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span style={{
                  display: 'inline-block', width: 6, height: 6,
                  background: car.inStock ? '#34D399' : '#F87171',
                }} />
                <span className="eyebrow text-lux-silver" style={{ fontSize: 9 }}>
                  {car.inStock ? 'Còn hàng' : 'Hết hàng'}
                </span>
              </div>

              <p className="eyebrow text-lux-muted mb-2" style={{ fontSize: 9 }}>
                {car.brand?.name} · {car.year}
              </p>

              <h1 style={{
                fontFamily: 'Cormorant Garamond',
                fontSize: 'clamp(2rem,3.5vw,3.2rem)',
                fontWeight: 300, lineHeight: 1,
                color: 'var(--white)', marginBottom: 6,
              }}>
                {car.name}
              </h1>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                marginBottom: 28, flexWrap: 'wrap',
              }}>
                <p style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 300 }}>
                  {car.model}{car.color ? ` · ${car.color}` : ''}
                </p>
                <Badge variant={car.condition === 'new' ? 'new' : 'used'}>
                  {car.condition === 'new' ? 'Xe mới'
                   : car.condition === 'certified' ? 'Certified' : 'Đã dùng'}
                </Badge>
                {car.category && (
                  <Badge variant="default">{CAT_LABEL[car.category] || car.category}</Badge>
                )}
              </div>

              {/* Price */}
              <div style={{
                padding: '20px 0', marginBottom: 24,
                borderTop: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
              }}>
                <p className="eyebrow text-lux-muted mb-2" style={{ fontSize: 9 }}>
                  Giá niêm yết
                </p>
                <p style={{
                  fontFamily: 'Cormorant Garamond', fontSize: 34,
                  fontWeight: 300, color: 'var(--gold)', lineHeight: 1,
                }}>
                  {formatPriceShort(displayPrice)}
                </p>
                {hasDiscount && (
                  <p style={{
                    fontSize: 13, color: 'var(--muted)',
                    textDecoration: 'line-through', marginTop: 4,
                  }}>
                    {formatPriceShort(car.price)}
                  </p>
                )}
                <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                  Chưa bao gồm thuế và phí đăng ký
                </p>
              </div>

              {/* Quick specs */}
              {car.specifications && (
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
                  gap: 0, marginBottom: 24,
                }}>
                  {[
                    { l: 'Mã lực',  v: car.specifications.horsepower,  u: 'HP'   },
                    { l: '0–100',   v: car.specifications.acceleration, u: 'giây' },
                    { l: 'Vmax',    v: car.specifications.topSpeed,     u: 'km/h' },
                    { l: 'Hộp số',  v: car.specifications.transmission?.split(' ')[0], u: '' },
                  ].map((s, i) => s.v && (
                    <div key={i} style={{
                      paddingRight: i < 3 ? 16 : 0,
                      paddingLeft:  i > 0 ? 16 : 0,
                      borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
                    }}>
                      <p className="eyebrow text-lux-muted mb-1" style={{ fontSize: 8 }}>
                        {s.l}
                      </p>
                      <p style={{
                        fontFamily: 'Space Grotesk', fontSize: 16,
                        fontWeight: 400, color: 'var(--white)',
                      }}>
                        {s.v}
                        <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 3 }}>
                          {s.u}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Action buttons ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {isAuthenticated ? (
                  <Button variant="primary" size="lg" full
                    icon={<CalIcon />} onClick={() => setShowAppt(true)}>
                    Đặt lịch xem xe
                  </Button>
                ) : (
                  <Link to="/login">
                    <Button variant="primary" size="lg" full icon={<CalIcon />}>
                      Đăng nhập để đặt lịch
                    </Button>
                  </Link>
                )}

                {isAuthenticated ? (
                  <Button variant="outline-gold" size="lg" full
                    disabled={!car.inStock}
                    onClick={() => setShowBuy(true)}>
                    {car.inStock ? 'Đặt mua xe · Tư vấn cọc' : 'Hết hàng — Liên hệ'}
                  </Button>
                ) : (
                  <Link to="/login">
                    <Button variant="outline-gold" size="lg" full>
                      Đặt mua xe · Tư vấn cọc
                    </Button>
                  </Link>
                )}

                <Button variant="ghost" size="md"
                  onClick={() => {
                    setActiveTab('contact');
                    document.getElementById('detail-section')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}>
                  Để lại thông tin tư vấn →
                </Button>
              </div>

              {/* Micro info */}
              <div style={{
                display: 'flex', gap: 24, marginTop: 20,
                paddingTop: 20, borderTop: '1px solid var(--border)',
              }}>
                {[
                  { l: 'Bảo hành', v: '36 tháng' },
                  { l: 'Giao xe',  v: '2–4 tuần' },
                  { l: 'Hỗ trợ',  v: 'Trả góp'  },
                ].map(({ l, v }) => (
                  <div key={l}>
                    <p className="eyebrow text-lux-muted mb-1" style={{ fontSize: 8 }}>{l}</p>
                    <p style={{ fontSize: 12, color: 'var(--silver)', fontWeight: 300 }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Tabs ── */}
        <section id="detail-section" className="lux-container"
          style={{ padding: '64px 40px' }}>
          <div className="lux-tabs" style={{ marginBottom: 48 }}>
            {TABS.map(t => (
              <button key={t}
                className={`lux-tab ${activeTab === t ? 'active' : ''}`}
                onClick={() => setActiveTab(t)}>
                {TAB_LABELS[t]}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* Overview */}
            {activeTab === 'overview' && (
              <motion.div key="ov"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <p style={{
                  maxWidth: 640, fontSize: 15, fontWeight: 300,
                  lineHeight: 1.85, color: 'var(--silver)',
                }}>
                  {car.description || car.excerpt || 'Chưa có mô tả cho mẫu xe này.'}
                </p>
                {car.features?.length > 0 && (
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr',
                    gap: 0, marginTop: 36,
                  }}>
                    {car.features.map((f, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '14px 0', borderBottom: '1px solid var(--border)',
                      }}>
                        <span style={{
                          width: 5, height: 5, background: 'var(--gold)', flexShrink: 0,
                        }} />
                        <span style={{ fontSize: 13, color: 'var(--silver)', fontWeight: 300 }}>
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Specifications */}
            {activeTab === 'specifications' && (
              <motion.div key="sp"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <div style={{ maxWidth: 640 }}>
                  {[
                    ['Động cơ',              car.specifications?.engine],
                    ['Dung tích',            car.specifications?.displacement
                                              ? `${car.specifications.displacement} cc` : null],
                    ['Công suất',            car.specifications?.horsepower
                                              ? `${car.specifications.horsepower} HP` : null],
                    ['Mô-men xoắn',          car.specifications?.torque
                                              ? `${car.specifications.torque} Nm` : null],
                    ['Hộp số',               car.specifications?.transmission],
                    ['Hệ dẫn động',          car.specifications?.drivetrain],
                    ['0–100 km/h',           car.specifications?.acceleration
                                              ? `${car.specifications.acceleration} giây` : null],
                    ['Tốc độ tối đa',        car.specifications?.topSpeed
                                              ? `${car.specifications.topSpeed} km/h` : null],
                    ['Nhiên liệu',           car.specifications?.fuelType],
                    ['Tiêu hao nhiên liệu',  car.specifications?.fuelConsumption
                                              ? `${car.specifications.fuelConsumption} L/100km` : null],
                    ['Số chỗ ngồi',          car.specifications?.seats
                                              ? `${car.specifications.seats} chỗ` : null],
                    ['Trọng lượng',          car.specifications?.weight
                                              ? `${car.specifications.weight} kg` : null],
                  ]
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div key={k} style={{
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 0', borderBottom: '1px solid var(--border)',
                      }}>
                        <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 300 }}>
                          {k}
                        </span>
                        <span style={{ fontSize: 13, color: 'var(--white)', fontWeight: 300 }}>
                          {v}
                        </span>
                      </div>
                    ))
                  }
                </div>
              </motion.div>
            )}

            {/* Contact tab */}
            {activeTab === 'contact' && (
              <motion.div key="ct"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>

                  {/* Left info */}
                  <div>
                    <h2 style={{
                      fontFamily: 'Cormorant Garamond',
                      fontSize: 'clamp(1.8rem,3vw,2.8rem)',
                      fontWeight: 300, lineHeight: 1.15,
                      color: 'var(--white)', marginBottom: 16,
                    }}>
                      Để lại thông tin<br/>để được tư vấn
                    </h2>
                    <p style={{
                      fontSize: 14, color: 'var(--silver)',
                      fontWeight: 300, lineHeight: 1.75, marginBottom: 32,
                    }}>
                      Đội ngũ chuyên gia sẽ liên hệ trong vòng 2 giờ làm việc để
                      tư vấn chi tiết về xe, tài chính và lịch trình xem xe.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {[
                        ['Hotline',     '+84 (90) 123 4567'],
                        ['Email',       'hello@luxemotors.vn'],
                        ['Showroom',    '268 Trần Hưng Đạo, Q.1, TP.HCM'],
                        ['Giờ mở cửa', 'Thứ 2 – CN: 9:00 – 19:00'],
                      ].map(([l, v]) => (
                        <div key={l} style={{ display: 'flex', gap: 12 }}>
                          <span className="eyebrow text-lux-muted"
                            style={{ fontSize: 8, width: 80, flexShrink: 0, paddingTop: 2 }}>
                            {l}
                          </span>
                          <span style={{ fontSize: 13, color: 'var(--silver)', fontWeight: 300 }}>
                            {v}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right form */}
                  {!ctDone ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                      <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
                      }}>
                        <div>
                          <label className="lux-label">Họ và tên *</label>
                          <input className="lux-input"
                            value={contact.name}
                            onChange={e => setContact(p => ({ ...p, name: e.target.value }))}
                            placeholder="Nguyễn Văn A"
                          />
                        </div>
                        <div>
                          <label className="lux-label">Số điện thoại *</label>
                          <input className="lux-input"
                            value={contact.phone}
                            onChange={e => setContact(p => ({ ...p, phone: e.target.value }))}
                            placeholder="0901 234 567"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="lux-label">Email</label>
                        <input className="lux-input" type="email"
                          value={contact.email}
                          onChange={e => setContact(p => ({ ...p, email: e.target.value }))}
                          placeholder="email@domain.com"
                        />
                      </div>
                      <div>
                        <label className="lux-label">Quan tâm</label>
                        <select className="lux-select lux-input"
                          value={contact.interest}
                          onChange={e => setContact(p => ({ ...p, interest: e.target.value }))}>
                          <option value="">Chọn mục đích liên hệ</option>
                          <option value="xem_xe">Đặt lịch xem xe</option>
                          <option value="mua_xe">Tư vấn mua xe</option>
                          <option value="tai_chinh">Tư vấn tài chính / Trả góp</option>
                          <option value="khac">Khác</option>
                        </select>
                      </div>
                      <div>
                        <label className="lux-label">Nội dung</label>
                        <textarea className="lux-textarea lux-input" rows={4}
                          value={contact.message}
                          onChange={e => setContact(p => ({ ...p, message: e.target.value }))}
                          placeholder="Câu hỏi hoặc yêu cầu của bạn..."
                        />
                      </div>
                      <Button variant="primary" size="lg" full
                        loading={ctSending} onClick={handleContactSubmit}>
                        Gửi thông tin
                      </Button>
                    </div>
                  ) : (
                    <div style={{
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      padding: 48, textAlign: 'center',
                      border: '1px solid rgba(201,169,110,0.25)',
                      background: 'rgba(201,169,110,0.04)',
                    }}>
                      <div style={{
                        width: 48, height: 48,
                        border: '1px solid var(--gold)',
                        background: 'rgba(201,169,110,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--gold)', marginBottom: 16,
                      }}>
                        <CheckIcon />
                      </div>
                      <p className="eyebrow mb-2">Đã nhận thông tin</p>
                      <p style={{
                        fontSize: 13, color: 'var(--silver)',
                        fontWeight: 300, lineHeight: 1.7,
                      }}>
                        Chuyên gia sẽ liên hệ với bạn<br/>
                        trong vòng 2 giờ làm việc.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── Related cars ── */}
        {related.length > 0 && (
          <section style={{ borderTop: '1px solid var(--border)', padding: '64px 0' }}>
            <div className="lux-container">
              <div style={{
                display: 'flex', alignItems: 'flex-end',
                justifyContent: 'space-between', marginBottom: 40,
              }}>
                <div>
                  <p className="eyebrow mb-3">Có thể bạn quan tâm</p>
                  <h2 style={{
                    fontFamily: 'Cormorant Garamond',
                    fontSize: 'clamp(1.8rem,3vw,2.8rem)',
                    fontWeight: 300, color: 'var(--white)',
                  }}>
                    Xe liên quan
                  </h2>
                </div>
                <Link to="/cars">
                  <Button variant="ghost" size="sm">Xem tất cả →</Button>
                </Link>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 18,
              }}>
                {related.map((c, i) => (
                  <CarCard key={c._id} car={c} index={i}
                    isFavorited={isFavorited(c._id)}
                    isFavoritePending={isPending(c._id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* Modals */}
      <AnimatePresence>
        {showAppt && <ApptModal car={car} onClose={() => setShowAppt(false)} />}
        {showBuy  && <BuyModal  car={car} onClose={() => setShowBuy(false)}  />}
      </AnimatePresence>
    </>
  );
}