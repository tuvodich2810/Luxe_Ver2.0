import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Phone,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronLeft,
  CheckCircle2,
  ShieldCheck,
  Crown,
} from 'lucide-react';

import { isValidVNPhone } from '@/utils/validation';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Điền mẫu nhanh
  const fillSample = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setFullName('Nguyễn Hoàng Nam');
    setEmail(`khach.vip${randomNum}@gmail.com`);
    setPhone('0988776655');
    setPassword('123456');
    setConfirmPassword('123456');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (phone && !isValidVNPhone(phone)) {
      setError('Số điện thoại không hợp lệ. Vui lòng nhập SĐT Việt Nam hợp lệ (10 chữ số, bắt đầu bằng 03, 05, 07, 08, 09).');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không trùng khớp');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu bảo mật phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    try {
      await register({ fullName, email, phone, password });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  // Tính độ mạnh mật khẩu đơn giản
  const getPasswordStrength = () => {
    if (!password) return { label: '', color: '' };
    if (password.length < 6) return { label: 'Mật khẩu yếu', color: 'text-rose-400 bg-rose-500/20' };
    if (password.length >= 8) return { label: 'Mật khẩu rất mạnh', color: 'text-emerald-400 bg-emerald-500/20' };
    return { label: 'Mật khẩu vừa phải', color: 'text-amber-400 bg-amber-500/20' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-[#070709] flex text-slate-100 font-sans relative overflow-hidden">
      {/* Dynamic Ambient Blur Lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Left Split Showcase Banner */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black overflow-hidden items-center justify-center p-12">
        <img
          src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1600"
          alt="LuxeMotors Supercar Showcase"
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
            JOIN THE LUXURY CLUB
          </div>

          <h2 className="font-serif-lux text-5xl font-bold text-white leading-tight">
            Gia Nhập Câu Lạc Bộ <br />
            <span className="lux-gradient-gold-text italic">Thành Viên VIP LuxeMotors</span>
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed font-light">
            Đăng ký để nhận thông báo ưu tiên siêu xe bản giới hạn vừa cập cảng, nhận tư vấn 1-1 từ Chuyên viên cao cấp và đặt cọc xe trực tuyến nhanh chóng.
          </p>

          <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2.5 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Ưu đãi đặt cọc trực tuyến chỉ từ 10% giá trị siêu xe</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Đặc quyền lái thử tận biệt thự / dinh thự riêng</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Bảo mật thông tin khách hàng tuyệt đối</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Form Container */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 md:p-16 bg-[#09090D] relative z-10 overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono-lux text-slate-400 hover:text-[#D4AF37] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Về Trang Chủ</span>
          </Link>

          <button
            type="button"
            onClick={fillSample}
            className="px-3 py-1 bg-[#1A1A24] border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black rounded text-[11px] font-mono-lux transition-all"
          >
            ⚡ Điền Mẫu Nhanh
          </button>
        </div>

        {/* Main Form Body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto space-y-6 my-auto py-6"
        >
          <div className="space-y-2">
            <h1 className="font-serif-lux text-3xl sm:text-4xl font-bold text-white">
              Đăng Ký Thành Viên VIP
            </h1>
            <p className="text-xs text-slate-400">
              Tạo tài khoản cá nhân để bắt đầu hành trình cùng LuxeMotors.
            </p>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-300">
                Họ và Tên Đầy Đủ *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#13131A] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 transition-all"
                  placeholder="Ví dụ: Nguyễn Văn Minh"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-300">
                  Địa Chỉ Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#13131A] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 transition-all"
                    placeholder="vip@domain.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-300">
                  Số Điện Thoại *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#13131A] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 transition-all"
                    placeholder="0918889999"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-300">
                  Mật Khẩu *
                </label>
                {strength.label && (
                  <span className={`text-[10px] font-mono-lux px-2 py-0.5 rounded ${strength.color}`}>
                    {strength.label}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#13131A] border border-white/10 rounded-lg pl-10 pr-10 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 transition-all"
                  placeholder="Từ 6 ký tự trở lên"
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

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-300">
                Xác Nhận Mật Khẩu *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#13131A] border border-white/10 rounded-lg pl-10 pr-10 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 transition-all"
                  placeholder="Nhập lại mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-lux-gold w-full py-3.5 text-xs font-mono-lux tracking-[0.2em] font-bold rounded-lg shadow-lg shadow-[#D4AF37]/10 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'ĐANG KÍCH HOẠT TÀI KHOẢN...' : 'HOÀN TẤT ĐĂNG KÝ VIP'}
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/5">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-[#D4AF37] font-semibold hover:underline">
              Đăng nhập ngay
            </Link>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-[11px] font-mono-lux text-slate-500 text-center">
          © 2026 LuxeMotors. Đảm bảo bảo mật thông tin thành viên tuyệt đối.
        </div>
      </div>
    </div>
  );
}