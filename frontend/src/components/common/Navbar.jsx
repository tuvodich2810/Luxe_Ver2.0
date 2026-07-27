import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import favoriteService from '@/services/favoriteService';
import orderService from '@/services/orderService';
import {
  Car,
  Heart,
  Calendar,
  ShoppingBag,
  User,
  LogOut,
  Shield,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [favCount, setFavCount] = useState(favoriteService.getFavorites().length);
  const [orderCount, setOrderCount] = useState(orderService.getOrders().length);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleFavChange = (e) => setFavCount(e.detail?.length || 0);
    const handleOrderChange = (e) => setOrderCount(e.detail?.length || 0);

    window.addEventListener('luxe_favorites_updated', handleFavChange);
    window.addEventListener('luxe_orders_updated', handleOrderChange);

    return () => {
      window.removeEventListener('luxe_favorites_updated', handleFavChange);
      window.removeEventListener('luxe_orders_updated', handleOrderChange);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#070709]/90 backdrop-blur-xl border-b border-[#D4AF37]/20 py-3 shadow-2xl shadow-black/80'
          : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent py-5'
      }`}
    >
      <div className="lux-container flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-[#D4AF37] via-[#AA7C11] to-[#61460B] p-[1px] shadow-lg shadow-[#D4AF37]/10 transition-transform duration-500 group-hover:scale-105">
            <div className="w-full h-full bg-[#0E0E12] flex items-center justify-center rounded-[1px]">
              <Sparkles className="w-5 h-5 text-[#D4AF37] transition-transform duration-500 group-hover:rotate-12" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-serif-lux text-2xl font-bold tracking-wider text-white group-hover:text-[#D4AF37] transition-colors">
              LUXE<span className="text-[#D4AF37] font-normal italic">MOTORS</span>
            </span>
            <span className="font-mono-lux text-[9px] tracking-[0.3em] text-slate-400 uppercase -mt-1">
              Supercar Showroom
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`font-mono-lux text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
              isActive('/')
                ? 'text-[#D4AF37] font-semibold border-b border-[#D4AF37] pb-1'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Trang chủ
          </Link>
          <Link
            to="/cars"
            className={`font-mono-lux text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
              isActive('/cars')
                ? 'text-[#D4AF37] font-semibold border-b border-[#D4AF37] pb-1'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Bộ bộ sưu tập Xe
          </Link>
          <Link
            to="/contact"
            className={`font-mono-lux text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
              isActive('/contact')
                ? 'text-[#D4AF37] font-semibold border-b border-[#D4AF37] pb-1'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Showroom & Liên hệ
          </Link>
        </nav>

        {/* Action Controls & Profile */}
        <div className="hidden md:flex items-center gap-5">
          {/* Wishlist Button */}
          <Link
            to="/favorites"
            className="relative p-2.5 rounded-full bg-[#15151B] border border-white/10 hover:border-[#D4AF37]/40 text-slate-300 hover:text-[#D4AF37] transition-all"
            title="Xe yêu thích"
          >
            <Heart className="w-4 h-4" />
            {favCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D4AF37] text-[#070709] text-[9px] font-bold flex items-center justify-center">
                {favCount}
              </span>
            )}
          </Link>

          {/* Orders Tracker Button */}
          {isAuthenticated && (
            <Link
              to="/orders"
              className="relative p-2.5 rounded-full bg-[#15151B] border border-white/10 hover:border-[#D4AF37]/40 text-slate-300 hover:text-[#D4AF37] transition-all"
              title="Đơn cọc xe của tôi"
            >
              <ShoppingBag className="w-4 h-4" />
              {orderCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {orderCount}
                </span>
              )}
            </Link>
          )}

          {/* User Profile / Auth State */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#15151B] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-white text-xs font-mono-lux transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <span className="max-w-[100px] truncate">{user?.fullName || 'Thành viên'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-[#0E0E12] border border-[#D4AF37]/25 rounded-md shadow-2xl p-2 z-50 backdrop-blur-2xl">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs font-medium text-white truncate">{user?.fullName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                    {isAdmin && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-[#D4AF37]/20 text-[#D4AF37] text-[9px] font-mono-lux rounded border border-[#D4AF37]/30">
                        ADMINISTRATOR
                      </span>
                    )}
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded text-xs text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      Trang Quản Trị (Admin)
                    </Link>
                  )}

                  <Link
                    to="/appointment/my"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded text-xs text-slate-300 hover:bg-white/5 transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Lịch hẹn xem xe
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded text-xs text-slate-300 hover:bg-white/5 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                    Đơn hàng cọc xe
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs text-rose-400 hover:bg-rose-500/10 transition-colors mt-1 border-t border-white/5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn-lux-outline px-5 py-2.5">
                Đăng nhập
              </Link>
              <Link to="/register" className="btn-lux-gold px-5 py-2.5">
                Tải trải nghiệm
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0E] border-b border-[#D4AF37]/20 p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-mono-lux uppercase text-slate-200 py-2 border-b border-white/5"
          >
            Trang chủ
          </Link>
          <Link
            to="/cars"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-mono-lux uppercase text-slate-200 py-2 border-b border-white/5"
          >
            Bộ sưu tập Xe
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-mono-lux uppercase text-slate-200 py-2 border-b border-white/5"
          >
            Showroom & Liên hệ
          </Link>
          <Link
            to="/favorites"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-mono-lux uppercase text-slate-200 py-2 border-b border-white/5 flex justify-between"
          >
            <span>Xe yêu thích</span>
            {favCount > 0 && <span className="text-[#D4AF37] font-bold">({favCount})</span>}
          </Link>

          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-mono-lux text-[#D4AF37] py-2 border-b border-white/5"
                >
                  Quản trị Admin
                </Link>
              )}
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-mono-lux text-slate-200 py-2 border-b border-white/5"
              >
                Đơn cọc của tôi
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="text-sm font-mono-lux text-rose-400 text-left py-2"
              >
                Đăng xuất ({user?.fullName})
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-lux-outline text-center"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-lux-gold text-center"
              >
                Tải trải nghiệm
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}