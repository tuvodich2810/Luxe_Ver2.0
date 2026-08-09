import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROLES_CONFIG } from '@/config/rolesConfig';

const MENU_CONFIG = {
  admin: [
    { href: '/admin', label: 'Tổng quan Admin', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { href: '/admin/crm', label: 'CRM Doanh thu', d: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { href: '/admin/contacts', label: 'Yêu cầu liên hệ', d: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { href: '/admin/cars', label: 'Quản lý xe', d: 'M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { href: '/admin/brands', label: 'Thương hiệu', d: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
    { href: '/admin/appointments', label: 'Lịch hẹn Concierge', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { href: '/admin/orders', label: 'Đơn cọc xe', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { href: '/admin/users', label: 'Phân quyền User', d: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9.95-10.13a4 4 0 11-7.9 0 4 4 0 017.9 0z' },
  ],
  giam_doc: [
    { href: '/director', label: 'Tổng quan Giám Đốc', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { href: '/admin/crm', label: 'Báo cáo Doanh thu', d: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { href: '/admin/contacts', label: 'Dữ liệu Khách hàng', d: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { href: '/admin/orders', label: 'Phê duyệt đơn hàng', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  ],
  quan_ly: [
    { href: '/manager', label: 'Tổng quan Quản lý', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { href: '/admin/cars', label: 'Kho xe & Tồn kho', d: 'M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { href: '/admin/brands', label: 'Hãng xe', d: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
    { href: '/admin/contacts', label: 'Phân bổ Khách hàng', d: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { href: '/admin/appointments', label: 'Lịch hẹn', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { href: '/admin/orders', label: 'Duyệt báo giá & cọc', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  ],
  sales: [
    { href: '/sales', label: 'Giao diện Sales', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { href: '/admin/contacts', label: 'Khách hàng của tôi', d: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { href: '/admin/appointments', label: 'Lịch hẹn cá nhân', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { href: '/admin/orders', label: 'Tạo đơn đặt cọc', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  ],
  cskh: [
    { href: '/cskh', label: 'Trung tâm CSKH', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { href: '/admin/appointments', label: 'Lịch hẹn Concierge', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { href: '/admin/contacts', label: 'Gọi chăm sóc KH', d: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ],
};

export default function AdminSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const roleKey = user?.role || 'admin';
  const roleConfig = ROLES_CONFIG[roleKey] || ROLES_CONFIG.admin;
  const menuList = MENU_CONFIG[roleKey] || MENU_CONFIG.admin;

  return (
    <aside
      style={{
        width: 230,
        flexShrink: 0,
        background: '#09090D',
        borderRight: '1px solid rgba(212,175,55,0.25)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 22, height: 22, position: 'relative', flexShrink: 0 }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                border: '1px solid #D4AF37',
                transform: 'rotate(45deg)',
              }}
            />
            <div style={{ position: 'absolute', inset: 4, background: '#D4AF37' }} />
          </div>
          <span
            style={{
              fontFamily: 'Helvetica Neue, sans-serif',
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
            }}
          >
            Luxe<span style={{ color: '#D4AF37' }}>Control</span>
          </span>
        </Link>
      </div>

      {/* Nav Strictly Filtered By Role */}
      <nav style={{ flex: 1, padding: '12px 8px' }}>
        {menuList.map((item) => {
          const active =
            item.href === '/admin' || item.href === '/cskh' || item.href === '/sales' || item.href === '/manager' || item.href === '/director'
              ? location.pathname === item.href
              : location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '12px 14px',
                marginBottom: 4,
                borderRadius: 6,
                fontFamily: 'Space Grotesk, monospace',
                fontSize: 13,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: active ? '#D4AF37' : '#94A3B8',
                background: active ? 'rgba(212,175,55,0.12)' : 'transparent',
                borderLeft: `3px solid ${active ? '#D4AF37' : 'transparent'}`,
                transition: 'all .2s',
                textDecoration: 'none',
                fontWeight: active ? 700 : 500,
              }}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
                style={{ flexShrink: 0 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={item.d} />
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'rgba(212,175,55,0.15)',
              border: '1px solid rgba(212,175,55,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 'bold',
              color: '#D4AF37',
              fontFamily: 'Space Grotesk, monospace',
              flexShrink: 0,
            }}
          >
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#FFFFFF',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                margin: 0,
              }}
            >
              {user?.fullName}
            </p>
            <p
              style={{
                fontFamily: 'Space Grotesk, monospace',
                fontSize: 10,
                color: '#D4AF37',
                letterSpacing: '0.05em',
                margin: 0,
                fontWeight: 600,
              }}
            >
              {roleConfig.label.split(' ')[0]}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}