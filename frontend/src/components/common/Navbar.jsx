import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Button from './Button';

const NAV = [
  { href: '/cars',    label: 'Bộ sưu tập' },
  { href: '/contact', label: 'Liên hệ' },
];

const Arrow = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
  </svg>
);

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [userDropOpen, setUserDropOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserDropOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      {/* ── Desktop nav ── */}
      <header className={`lux-nav ${scrolled ? 'scrolled' : ''}`}>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 relative flex-shrink-0">
            <div className="absolute inset-0 border border-lux-gold rotate-45
                            transition-transform duration-700 group-hover:rotate-[135deg]" />
            <div className="absolute inset-[5px] bg-lux-gold" />
          </div>
          <span style={{
            fontFamily: 'Helvetica Neue', fontSize: 14, fontWeight: 300,
            letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--white)',
          }}>
            Luxe<span style={{ color: 'var(--gold)' }}>Motors</span>
          </span>
        </Link>

        {/* Center links */}
        <nav className="hidden md:flex items-center gap-10">
          {NAV.map(l => (
            <Link key={l.href} to={l.href}
              className="btn btn-ghost btn-sm"
              style={location.pathname.startsWith(l.href) ? { color: 'var(--gold)' } : {}}>
              {l.label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link to="/favorites"
              className="btn btn-ghost btn-sm"
              style={location.pathname === '/favorites' ? { color: 'var(--gold)' } : {}}>
              Yêu thích
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="btn btn-ghost btn-sm"
              style={{ color: 'var(--muted)' }}>
              Admin
            </Link>
          )}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropOpen(v => !v)}
                className="flex items-center gap-2.5 btn btn-outline btn-sm"
              >
                <span className="w-5 h-5 bg-lux-gold text-black flex items-center
                                 justify-center text-[9px] font-medium flex-shrink-0">
                  {user?.fullName?.charAt(0)?.toUpperCase()}
                </span>
                <span>{user?.fullName?.split(' ').pop()}</span>
                <svg width="10" height="10" fill="none" stroke="currentColor"
                  strokeWidth="2" viewBox="0 0 24 24"
                  className={`transition-transform duration-200 ${userDropOpen ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <AnimatePresence>
                {userDropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full mt-2 w-48
                               bg-lux-dark border border-lux-border z-50"
                  >
                    {[
                      { href: '/favorites', label: 'Xe yêu thích'     },
                      { href: '/orders',    label: 'Đơn hàng của tôi' },
                    ].map(item => (
                      <Link key={item.href} to={item.href}
                        className="block px-5 py-3 eyebrow text-lux-silver
                                   hover:text-lux-gold hover:bg-white/[0.03]
                                   transition-colors border-b border-lux-border"
                        style={{ fontSize: 9 }}>
                        {item.label}
                      </Link>
                    ))}
                    <button onClick={handleLogout}
                      className="w-full text-left px-5 py-3 eyebrow text-lux-silver
                                 hover:text-red-400 hover:bg-white/[0.03] transition-colors"
                      style={{ fontSize: 9 }}>
                      Đăng xuất
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Đăng nhập</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" iconRight={<Arrow />}>Đăng ký</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 ml-auto"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Menu"
        >
          {[0, 1, 2].map(i => (
            <motion.span key={i}
              className="block h-px bg-lux-white origin-center"
              animate={
                mobileOpen
                  ? i === 0 ? { rotate: 45, y: 8, width: 24 }
                  : i === 1 ? { opacity: 0, scaleX: 0 }
                  :           { rotate: -45, y: -8, width: 24 }
                  : { rotate: 0, y: 0, opacity: 1, width: i === 1 ? 16 : 24 }
              }
              style={{ width: i === 1 ? 16 : 24 }}
            />
          ))}
        </button>
      </header>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-lux-black flex flex-col pt-20 px-8 pb-10"
          >
            <nav className="flex flex-col gap-1 flex-1 pt-8">
              {NAV.map((l, i) => (
                <motion.div key={l.href}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 + 0.1 }}>
                  <Link to={l.href} style={{
                    fontFamily: 'Cormorant Garamond',
                    fontSize: 'clamp(2rem,8vw,3.5rem)',
                    fontWeight: 300, color: 'var(--white)',
                  }}>
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              {isAuthenticated && (
                <>
                  <Link to="/favorites" style={{ fontFamily:'Cormorant Garamond', fontSize:'clamp(2rem,8vw,3.5rem)', fontWeight:300, color:'var(--white)' }}>
                    Yêu thích
                  </Link>
                  <Link to="/orders" style={{ fontFamily:'Cormorant Garamond', fontSize:'clamp(2rem,8vw,3.5rem)', fontWeight:300, color:'var(--white)' }}>
                    Đơn hàng
                  </Link>
                </>
              )}
            </nav>
            <div className="border-t border-lux-border pt-8 flex flex-col gap-3">
              {isAuthenticated ? (
                <Button variant="outline" full onClick={handleLogout}>Đăng xuất</Button>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" full>Đăng nhập</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" full>Đăng ký ngay</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}