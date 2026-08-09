import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  UserCheck,
  ChevronLeft,
  Crown,
} from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  // Nút điền nhanh tài khoản thử nghiệm
  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#070709] flex text-slate-100 font-sans relative overflow-hidden">
      {/* Dynamic Ambient Background Blur Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Left Split Showcase Banner */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black overflow-hidden items-center justify-center p-12">
        <img
          src="https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=1600"
          alt="LuxeMotors Supercar"
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.45] contrast-125 scale-105 transition-transform duration-1000 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-black/40 to-black/80" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-lg space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono-lux uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            MEMBER EXCLUSIVE ACCESS
          </div>

          <h2 className="font-serif-lux text-5xl font-bold text-white leading-tight">
            Trải Nghiệm Đỉnh Cao <br />
            <span className="lux-gradient-gold-text italic">Siêu Xe Hạng Sang</span>
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed font-light">
            Đăng nhập tài khoản để truy cập kho siêu xe cá nhân, quản lý đơn cọc xe trực tuyến và trải nghiệm đặc quyền đặt lịch lái thử tận nơi.
          </p>

          {/* Key Perks list */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Đặc Quyền VIP</p>
                <p className="text-[10px] text-slate-400">Ưu tiên xe nhập mới</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Bảo Mật 256-bit</p>
                <p className="text-[10px] text-slate-400">Mã hóa an toàn tuyệt đối</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Login Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 md:p-16 bg-[#09090D] relative z-10 overflow-y-auto">
        {/* Top Navbar Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono-lux text-slate-400 hover:text-[#D4AF37] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Về Trang Chủ</span>
          </Link>

          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <span className="font-serif-lux text-xl font-bold tracking-wider text-white">
              LUXE<span className="text-[#D4AF37] italic">MOTORS</span>
            </span>
          </Link>
        </div>

        {/* Center Main Card Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto space-y-6 my-auto py-8"
        >
          <div className="space-y-1">
            <h1 className="font-serif-lux text-3xl font-bold text-white">
              Đăng Nhập Tài Khoản
            </h1>
            <p className="text-xs text-slate-400">
              Nhập email và mật khẩu của bạn để tiếp tục.
            </p>
          </div>

          {/* Quick Demo Credentials Bar */}
          <div className="p-3.5 rounded-lg bg-[#14141C] border border-[#D4AF37]/20 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-mono-lux text-[#D4AF37] font-semibold">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Thử nghiệm đăng nhập nhanh (1-Click Fill):</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('admin@luxemotors.com', '123456')}
                className="px-2.5 py-1.5 rounded bg-[#1C1C26] hover:bg-[#D4AF37] hover:text-black border border-white/10 text-[11px] font-mono-lux text-slate-200 transition-all flex items-center gap-1 group"
              >
                <Crown className="w-3 h-3 text-[#D4AF37] group-hover:text-black" />
                <span>Admin (admin@luxemotors.com)</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('minh.nguyen@gmail.com', '123456')}
                className="px-2.5 py-1.5 rounded bg-[#1C1C26] hover:bg-emerald-400 hover:text-black border border-white/10 text-[11px] font-mono-lux text-slate-200 transition-all flex items-center gap-1 group"
              >
                <UserCheck className="w-3 h-3 text-emerald-400 group-hover:text-black" />
                <span>Khách VIP (minh.nguyen)</span>
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form Controls */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-300">
                Địa chỉ Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#13131A] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 transition-all"
                  placeholder="admin@luxemotors.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-300">
                  Mật khẩu bảo mật *
                </label>
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#13131A] border border-white/10 rounded-lg pl-10 pr-10 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-lux-gold w-full py-3.5 text-xs font-mono-lux tracking-[0.2em] font-bold rounded-lg shadow-lg shadow-[#D4AF37]/10 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>ĐANG XÁC THỰC TÀI KHOẢN...</span>
              ) : (
                <>
                  <span>ĐĂNG NHẬP THƯỢNG LƯU</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/5">
            Chưa có tài khoản LuxeMotors?{' '}
            <Link to="/register" className="text-[#D4AF37] font-semibold hover:underline">
              Đăng ký thành viên VIP ngay
            </Link>
          </div>
        </motion.div>

        {/* Footer info */}
        <div className="text-[11px] font-mono-lux text-slate-500 text-center">
          © 2026 LuxeMotors. Hệ thống bảo mật 256-bit SSL mã hóa an toàn.
        </div>
      </div>
    </div>
  );
}