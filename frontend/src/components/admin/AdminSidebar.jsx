import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const MENU = [
  { href:'/admin',              label:'Tổng quan',   d:'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href:'/admin/cars',         label:'Quản lý xe',  d:'M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { href:'/admin/brands',       label:'Thương hiệu', d:'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
  { href:'/admin/appointments', label:'Lịch hẹn',    d:'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { href:'/admin/orders',       label:'Đơn hàng',    d:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { href:'/admin/users',        label:'Người dùng',  d:'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9.95-10.13a4 4 0 11-7.9 0 4 4 0 017.9 0z' },
];

export default function AdminSidebar() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <aside style={{
      width: 220, flexShrink: 0,
      background: 'var(--dark)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', minHeight: '100vh',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 22, height: 22, position: 'relative', flexShrink: 0 }}>
            <div style={{
              position: 'absolute', inset: 0,
              border: '1px solid var(--gold)', transform: 'rotate(45deg)',
            }} />
            <div style={{ position: 'absolute', inset: 4, background: 'var(--gold)' }} />
          </div>
          <span style={{
            fontFamily: 'Helvetica Neue', fontSize: 16, fontWeight: 300,
            letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--white)',
          }}>
            Luxe<span style={{ color: 'var(--gold)' }}>Admin</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px' }}>
        {MENU.map(item => {
          const active = item.href === '/admin'
            ? location.pathname === '/admin'
            : location.pathname.startsWith(item.href);
          return (
            <Link key={item.href} to={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 20,
              padding: '15px 12px', marginBottom: 2,
              fontFamily: 'Space Grotesk',
              fontSize: 16, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: active ? 'var(--gold)' : 'var(--muted)',
              background: active ? 'rgba(201,169,110,0.06)' : 'transparent',
              borderLeft: `2px solid ${active ? 'var(--gold)' : 'transparent'}`,
              transition: 'all .2s', textDecoration: 'none',
            }}>
              <svg width="14" height="14" fill="none" stroke="currentColor"
                strokeWidth="1.5" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.d} />
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32,
            background: 'var(--mid)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 40, color: 'var(--gold)', fontFamily: 'Space Grotesk', flexShrink: 0,
          }}>
            {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{
              fontSize: 16, color: 'var(--white)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {user?.fullName}
            </p>
            <p style={{
              fontFamily: 'Space Grotesk', fontSize: 14,
              color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              Admin
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}