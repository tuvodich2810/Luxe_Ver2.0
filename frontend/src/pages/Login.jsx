import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/common/Button';

export default function Login() {
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from = location.state?.from?.pathname || '/';

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex' }}>

      {/* Left — Form */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '48px 64px',
      }}>
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center',
          gap: 10, marginBottom: 56,
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

          <p className="eyebrow mb-4">Tài khoản</p>
          <h1 style={{
            fontFamily: 'Cormorant Garamond',
            fontSize: 'clamp(2rem,4vw,2.8rem)',
            fontWeight: 300, color: 'var(--white)', marginBottom: 8,
          }}>
            Đăng nhập
          </h1>
          <p style={{
            fontSize: 14, color: 'var(--muted)',
            fontWeight: 300, marginBottom: 36,
          }}>
            Chưa có tài khoản?{' '}
            <Link to="/register" style={{ color: 'var(--gold)' }}>Đăng ký ngay</Link>
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
            style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label className="lux-label">Email</label>
              <input className="lux-input" type="email" required
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="lux-label">Mật khẩu</label>
              <input className="lux-input" type="password" required
                value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" variant="primary" size="lg" full
              loading={loading} style={{ marginTop: 12 }}>
              Đăng nhập
            </Button>
          </form>
        </motion.div>
      </div>

      {/* Right — Image */}
      <div style={{
        flex: 1, position: 'relative', overflow: 'hidden',
        display: 'none',
      }} className="lg:block">
        <img
          src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format"
          alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right,var(--black),transparent)',
        }} />
        <div style={{ position: 'absolute', bottom: 64, left: 48 }}>
          <p style={{
            fontFamily: 'Cormorant Garamond',
            fontSize: 'clamp(2.5rem,5vw,4rem)',
            fontWeight: 300, color: 'var(--white)', lineHeight: 1.1,
          }}>
            Tốc độ<br/>
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>và đẳng cấp</em>
          </p>
        </div>
      </div>
    </div>
  );
}