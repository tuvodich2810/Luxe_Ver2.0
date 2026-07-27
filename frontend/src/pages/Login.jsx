import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, ArrowRight, ShieldCheck, Lock, Mail, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Email hoặc mật khẩu không chính xác');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] flex text-slate-100 font-sans">
      {/* Left Split Banner */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black overflow-hidden items-center justify-center p-12">
        <img
          src="https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=1600"
          alt="LuxeMotors Supercar"
          className="absolute inset-0 w-full h-full object-cover filter brightness-50 contrast-125 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-black/40 to-black/80" />

        <div className="relative z-10 max-w-lg space-y-6">
          <div className="lux-eyebrow">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            MEMBER EXCLUSIVE ACCESS
          </div>
          <h2 className="font-serif-lux text-5xl font-bold text-white leading-tight">
            Chào Mừng Đến Với <span className="lux-gradient-gold-text italic">LuxeMotors</span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-light">
            Đăng nhập để quản lý bộ sưu tập yêu thích, theo dõi đơn cọc xe trực tuyến và trải nghiệm đặc quyền lái thử siêu xe tận dinh thự.
          </p>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-16 bg-[#09090D]">
        {/* Top Logo */}
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <span className="font-serif-lux text-2xl font-bold tracking-wider text-white">
              LUXE<span className="text-[#D4AF37] italic">MOTORS</span>
            </span>
          </Link>
        </div>

        {/* Form Body */}
        <div className="max-w-md w-full mx-auto space-y-8 my-auto py-12">
          <div className="space-y-2">
            <h1 className="font-serif-lux text-4xl font-bold text-white">Đăng Nhập Tài Khoản</h1>
            <p className="text-xs text-slate-400">
              Nhập thông tin xác thực để truy cập hệ thống thượng lưu.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                Địa chỉ Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="lux-input pl-10 text-xs"
                  placeholder="name@domain.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                  Mật khẩu bảo mật *
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="lux-input pl-10 text-xs"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-lux-gold w-full py-4 text-xs tracking-[0.2em]"
            >
              {loading ? 'ĐANG XÁC THỰC TÀI KHOẢN...' : 'ĐĂNG NHẬP THƯỢNG LƯU'}
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-4">
            Chưa có tài khoản LuxeMotors?{' '}
            <Link to="/register" className="text-[#D4AF37] font-semibold hover:underline">
              Đăng ký thành viên VIP ngay
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-slate-500 text-center">
          © 2026 LuxeMotors. Bảo mật thông tin mã hóa 256-bit SSL.
        </div>
      </div>
    </div>
  );
}