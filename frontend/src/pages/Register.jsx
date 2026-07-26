import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/common/Button';

export default function Register() {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp'); return;
    }
    if (form.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự'); return;
    }
    setLoading(true); setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex' }}>

      {/* Left — Image */}
      <div style={{
        flex: 1, position: 'relative', overflow: 'hidden', display: 'none',
      }} className="lg:block">
        <img
          src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format"
          alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to left,var(--black),transparent)',
        }} />
        <div style={{ position: 'absolute', bottom: 64, right: 48, textAlign: 'right' }}>
          <p style={{
            fontFamily: 'Cormorant Garamond',
            fontSize: 'clamp(2.5rem,5vw,4rem)',
            fontWeight: 300, color: 'var(--white)', lineHeight: 1.1,
          }}>
            Trải nghiệm<br/>
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>khác biệt</em>
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '48px 64px',
      }}>
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center',
          gap: 10, marginBottom: 48,
        }}>
          <div style={{ width: 26, height: 26, position: 'relative', flexShrink: 0 }}>
            <div style={{
              position: 'absolute', inset: 0,
              border: '1px solid var(--gold)', transform: 'rotate(45deg)',
            }} />
            <div style={{ position: 'absolute', inset: 5, background: 'var(--gold)' }} />
          </div>
          <span style={{
            fontFamily: 'Helvetica Neue', fontSize: 13, fontWeight: 300,
            letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--white)',
          }}>
            Luxe<span style={{ color: 'var(--gold)' }}>Motors</span>
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: 400, width: '100%' }}>

          <p className="eyebrow mb-4">Thành viên mới</p>
          <h1 style={{
            fontFamily: 'Cormorant Garamond',
            fontSize: 'clamp(2rem,4vw,2.8rem)',
            fontWeight: 300, color: 'var(--white)', marginBottom: 8,
          }}>
            Đăng ký
          </h1>
          <p style={{
            fontSize: 14, color: 'var(--muted)',
            fontWeight: 300, marginBottom: 32,
          }}>
            Đã có tài khoản?{' '}
            <Link to="/login" style={{ color: 'var(--gold)' }}>Đăng nhập</Link>
          </p>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              style={{
                fontSize: 13, color: '#F87171',
                background: 'rgba(248,113,113,0.06)',
                border: '1px solid rgba(248,113,113,0.2)',
                padding: '12px 16px', marginBottom: 20,
              }}>
              {error}
            </motion.p>
          )}

          <form onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label className="lux-label">Họ và tên *</label>
              <input className="lux-input" required
                value={form.fullName}
                onChange={e => set('fullName', e.target.value)}
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div>
              <label className="lux-label">Email *</label>
              <input className="lux-input" type="email" required
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="lux-label">Số điện thoại</label>
              <input className="lux-input" type="tel"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder="0901 234 567"
              />
            </div>
            <div>
              <label className="lux-label">Mật khẩu *</label>
              <input className="lux-input" type="password" required
                value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder="Ít nhất 6 ký tự"
              />
            </div>
            <div>
              <label className="lux-label">Xác nhận mật khẩu *</label>
              <input className="lux-input" type="password" required
                value={form.confirmPassword}
                onChange={e => set('confirmPassword', e.target.value)}
                placeholder="Nhập lại mật khẩu"
              />
            </div>
            <Button type="submit" variant="primary" size="lg" full
              loading={loading} style={{ marginTop: 8 }}>
              Tạo tài khoản
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}