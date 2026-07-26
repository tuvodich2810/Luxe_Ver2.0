import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar  from '@/components/common/Navbar';
import Footer  from '@/components/common/Footer';
import Button  from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';
import { sendAppointmentForm } from '@/services/sheetsService';
import api from '@/services/api';

const SLOTS = [
  '09:00','09:30','10:00','10:30','11:00','11:30',
  '14:00','14:30','15:00','15:30','16:00','16:30',
];

const CheckIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor"
    strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
  </svg>
);

export default function Appointment() {
  const { carId }  = useParams();
  const navigate   = useNavigate();
  const { user }   = useAuth();

  const [car,        setCar]        = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done,       setDone]       = useState(false);
  const [error,      setError]      = useState('');
  const [form,       setForm]       = useState({
    appointmentDate: '',
    timeSlot:        '',
    visitorName:     user?.fullName || '',
    visitorPhone:    user?.phone    || '',
    visitorEmail:    user?.email    || '',
    notes:           '',
  });

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError(''); };

  useEffect(() => {
    api.get(`/cars/${carId}`)
      .then(r  => setCar(r.data))
      .catch(() => navigate('/cars'))
      .finally(() => setLoading(false));
  }, [carId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.appointmentDate || !form.timeSlot) {
      setError('Vui lòng chọn ngày và khung giờ.'); return;
    }
    if (new Date(form.appointmentDate) <= new Date()) {
      setError('Ngày hẹn phải là ngày trong tương lai.'); return;
    }
    setSubmitting(true); setError('');
    try {
      await api.post('/appointments', { car: carId, ...form });
      sendAppointmentForm(form, car?.name);
      setDone(true);
    } catch (err) {
      setError(err.message || 'Đặt lịch thất bại.');
    } finally { setSubmitting(false); }
  };

  if (loading) return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh', background: 'var(--black)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 64,
      }}>
        <div style={{
          width: 40, height: 40, border: '1px solid var(--gold)',
          animation: 'spin 1s linear infinite', transform: 'rotate(45deg)',
        }} />
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, background: 'var(--black)', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ padding: '48px 0 36px', borderBottom: '1px solid var(--border)' }}>
          <div className="lux-container">
            <p className="eyebrow mb-3">Đặt lịch xem xe</p>
            <h1 style={{
              fontFamily: 'Cormorant Garamond',
              fontSize: 'clamp(2rem,4vw,3rem)',
              fontWeight: 300, color: 'var(--white)',
            }}>
              Lên lịch trải nghiệm
            </h1>
          </div>
        </div>

        <div className="lux-container" style={{ padding: '40px 40px 80px' }}>
          {!done ? (
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 40 }}>

              {/* Car info */}
              {car && (
                <div style={{ position: 'sticky', top: 88 }}>
                  <div style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)', overflow: 'hidden',
                  }}>
                    <div style={{ aspectRatio: '16/9', background: 'var(--mid)' }}>
                      <img
                        src={car.mainImage || 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600'}
                        alt={car.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ padding: 20 }}>
                      <p className="eyebrow text-lux-muted mb-1" style={{ fontSize: 8 }}>
                        {car.brand?.name}
                      </p>
                      <p style={{
                        fontFamily: 'Cormorant Garamond', fontSize: 20,
                        fontWeight: 300, color: 'var(--white)', marginBottom: 4,
                      }}>
                        {car.name}
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--muted)' }}>
                        {car.model} · {car.year}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}
                style={{
                  display: 'flex', flexDirection: 'column',
                  gap: 20, maxWidth: 520,
                }}>
                {error && (
                  <p style={{
                    fontSize: 13, color: '#F87171',
                    background: 'rgba(248,113,113,0.06)',
                    border: '1px solid rgba(248,113,113,0.2)',
                    padding: '12px 16px',
                  }}>
                    {error}
                  </p>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label className="lux-label">Họ và tên *</label>
                    <input className="lux-input" required
                      value={form.visitorName}
                      onChange={e => set('visitorName', e.target.value)}
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <label className="lux-label">Số điện thoại *</label>
                    <input className="lux-input" required
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
                  <input className="lux-input" type="date" required
                    value={form.appointmentDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => set('appointmentDate', e.target.value)}
                    style={{ colorScheme: 'dark' }}
                  />
                </div>

                <div>
                  <label className="lux-label" style={{ marginBottom: 10 }}>Khung giờ *</label>
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8,
                  }}>
                    {SLOTS.map(s => (
                      <button key={s} type="button"
                        onClick={() => set('timeSlot', s)}
                        className={`btn btn-sm ${form.timeSlot === s ? 'btn-gold' : 'btn-outline'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="lux-label">Ghi chú</label>
                  <textarea className="lux-textarea lux-input" rows={4}
                    value={form.notes}
                    onChange={e => set('notes', e.target.value)}
                    placeholder="Yêu cầu đặc biệt..."
                  />
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <Link to={`/cars/${car?.slug || carId}`} style={{ flex: 1 }}>
                    <Button variant="outline" size="lg" full>Quay lại</Button>
                  </Link>
                  <Button type="submit" variant="primary" size="lg"
                    loading={submitting} style={{ flex: 2 }}>
                    Xác nhận đặt lịch
                  </Button>
                </div>
              </form>
            </div>

          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              style={{
                maxWidth: 480, margin: '0 auto',
                textAlign: 'center', padding: '48px 0',
              }}>
              <div style={{
                width: 56, height: 56,
                border: '1px solid var(--gold)',
                background: 'rgba(201,169,110,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--gold)', margin: '0 auto 24px',
              }}>
                <CheckIcon />
              </div>
              <p className="eyebrow mb-3">Đặt lịch thành công</p>
              <h2 style={{
                fontFamily: 'Cormorant Garamond', fontSize: 32,
                fontWeight: 300, color: 'var(--white)', marginBottom: 12,
              }}>
                Cảm ơn bạn!
              </h2>
              <p style={{
                fontSize: 14, color: 'var(--silver)',
                fontWeight: 300, lineHeight: 1.75, marginBottom: 32,
              }}>
                Nhân viên sẽ liên hệ xác nhận lịch hẹn xem{' '}
                <strong style={{ color: 'var(--white)' }}>{car?.name}</strong>{' '}
                trong vòng 2 giờ làm việc.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <Link to="/cars">
                  <Button variant="outline" size="md">Xem thêm xe</Button>
                </Link>
                <Link to="/">
                  <Button variant="primary" size="md">Về trang chủ</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}