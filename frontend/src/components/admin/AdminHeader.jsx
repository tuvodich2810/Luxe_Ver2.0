import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROLES_CONFIG } from '@/config/rolesConfig';
import { LogOut, Home } from 'lucide-react';

export default function AdminHeader({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const roleKey = user?.role || 'admin';
  const roleConfig = ROLES_CONFIG[roleKey] || ROLES_CONFIG.admin;

  return (
    <header className="h-16 bg-[#09090D] border-b border-[#D4AF37]/30 px-6 flex items-center justify-between shrink-0 shadow-xl relative z-40">
      {/* Title & Quick Return to Home Link */}
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#15151B] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#070709] transition-all text-xs font-mono-lux font-bold shadow-md cursor-pointer"
          title="Nhấn để về Trang chủ Showroom Luxe Motors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Về Trang Chủ</span>
        </Link>

        <div className="h-4 w-[1px] bg-white/20 hidden sm:block" />

        <h1 className="font-serif-lux text-xl font-bold text-white tracking-wide">
          {title}
        </h1>
        <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono-lux font-bold border ${roleConfig.color}`}>
          {roleConfig.label}
        </span>
      </div>

      {/* Logout Action Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={async () => {
            await logout();
            navigate('/login');
          }}
          className="p-2 px-3.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono-lux transition-all flex items-center gap-1.5"
          title="Đăng xuất khỏi hệ thống"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </header>
  );
}