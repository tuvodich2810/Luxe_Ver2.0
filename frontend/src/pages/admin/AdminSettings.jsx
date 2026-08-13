import { useState } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import {
  User,
  Lock,
  Shield,
  CheckCircle2,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
} from 'lucide-react';

export default function AdminSettings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile state
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [savingPw, setSavingPw] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwMsg('');
    setPwErr('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwErr('Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }
    if (newPassword.length < 6) {
      setPwErr('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwErr('Mật khẩu xác nhận không khớp.');
      return;
    }

    setSavingPw(true);
    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
      setPwMsg('Đổi mật khẩu thành công!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwErr(err?.response?.data?.message || 'Không thể đổi mật khẩu. Mật khẩu hiện tại có thể không đúng.');
    } finally {
      setSavingPw(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Thông Tin Cá Nhân', icon: User },
    { id: 'password', label: 'Đổi Mật Khẩu', icon: Lock },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#070709', color: '#E2E8F0' }}>
      <AdminSidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminHeader title="Cài Đặt Tài Khoản" />

        <main style={{ padding: '32px 36px', flex: 1 }} className="space-y-8 max-w-3xl">
          {/* Header */}
          <div className="border-b border-white/10 pb-6">
            <span className="text-[10px] font-mono-lux text-[#D4AF37] tracking-[0.2em] uppercase">
              ACCOUNT SETTINGS
            </span>
            <h1 className="font-serif-lux text-3xl font-bold text-white mt-1">
              Cài Đặt <span className="text-[#D4AF37] italic">&amp; Bảo Mật</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Quản lý thông tin tài khoản và bảo mật của bạn.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-white/10">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-mono-lux uppercase tracking-wider transition-all border-b-2 -mb-px ${
                    activeTab === tab.id
                      ? 'text-[#D4AF37] border-[#D4AF37]'
                      : 'text-slate-400 border-transparent hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Current user info card */}
              <div className="bg-[#0E0E12] border border-white/10 rounded-lg p-6 space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#D4AF37]/15 border-2 border-[#D4AF37]/40 flex items-center justify-center text-2xl font-bold text-[#D4AF37] font-serif-lux">
                    {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-serif-lux text-xl font-bold text-white">{user?.fullName || '—'}</p>
                    <p className="text-xs font-mono-lux text-[#D4AF37] uppercase tracking-widest mt-0.5">{user?.role?.toUpperCase() || 'USER'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                      Họ và Tên
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.fullName || ''}
                      readOnly
                      className="w-full bg-[#14141A] border border-white/10 rounded px-3 py-2.5 text-xs text-white outline-none cursor-not-allowed opacity-70"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                      Vai Trò Hệ Thống
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.role?.toUpperCase() || ''}
                      readOnly
                      className="w-full bg-[#14141A] border border-white/10 rounded px-3 py-2.5 text-xs text-[#D4AF37] outline-none cursor-not-allowed opacity-70"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.email || ''}
                      readOnly
                      className="w-full bg-[#14141A] border border-white/10 rounded px-3 py-2.5 text-xs text-white outline-none cursor-not-allowed opacity-70"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                      Số Điện Thoại
                    </label>
                    <input
                      type="tel"
                      defaultValue={user?.phone || 'Chưa cập nhật'}
                      readOnly
                      className="w-full bg-[#14141A] border border-white/10 rounded px-3 py-2.5 text-xs text-white outline-none cursor-not-allowed opacity-70"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded bg-[#D4AF37]/5 border border-[#D4AF37]/20 text-xs text-slate-400">
                  <Shield className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>Thông tin cá nhân được quản lý bởi Admin hệ thống. Liên hệ Admin để cập nhật thông tin.</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <form onSubmit={handleChangePassword} className="bg-[#0E0E12] border border-white/10 rounded-lg p-6 space-y-5">
                <h3 className="font-serif-lux text-lg font-bold text-white">Thay Đổi Mật Khẩu</h3>

                {/* Current Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                    Mật Khẩu Hiện Tại *
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-[#14141A] border border-white/15 rounded px-3 py-2.5 pr-10 text-xs text-white outline-none focus:border-[#D4AF37] transition-colors"
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent((v) => !v)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-[#D4AF37]"
                    >
                      {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                    Mật Khẩu Mới * (tối thiểu 6 ký tự)
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#14141A] border border-white/15 rounded px-3 py-2.5 pr-10 text-xs text-white outline-none focus:border-[#D4AF37] transition-colors"
                      placeholder="Nhập mật khẩu mới"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-[#D4AF37]"
                    >
                      {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                    Xác Nhận Mật Khẩu Mới *
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full bg-[#14141A] border rounded px-3 py-2.5 text-xs text-white outline-none focus:border-[#D4AF37] transition-colors ${
                      confirmPassword && confirmPassword !== newPassword
                        ? 'border-rose-500/60'
                        : 'border-white/15'
                    }`}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  {confirmPassword && confirmPassword !== newPassword && (
                    <p className="text-[10px] text-rose-400 font-mono-lux">Mật khẩu xác nhận không khớp</p>
                  )}
                </div>

                {/* Feedback Messages */}
                {pwErr && (
                  <div className="flex items-center gap-2 p-3 rounded bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {pwErr}
                  </div>
                )}
                {pwMsg && (
                  <div className="flex items-center gap-2 p-3 rounded bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    {pwMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={savingPw}
                  className="btn-lux-gold px-6 py-2.5 text-xs font-mono-lux flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  {savingPw ? 'Đang lưu...' : 'Lưu Mật Khẩu Mới'}
                </button>
              </form>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
