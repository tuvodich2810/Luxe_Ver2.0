import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader  from '@/components/admin/AdminHeader';
import api from '@/services/api';

const StatCard = ({ label, value, delay = 0, href }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
    <Link to={href || '#'} style={{
      display: 'block',
      background: 'var(--card)', border: '1px solid var(--border)',
      padding: '28px 24px', transition: 'border-color .25s',
      textDecoration: 'none',
    }}
      className="hover:border-white/20 group">
      <p className="eyebrow text-lux-muted mb-4" style={{ fontSize: 9 }}>{label}</p>
      <p style={{
        fontFamily: 'Cormorant Garamond', fontSize: 44,
        fontWeight: 300, color: 'var(--white)', lineHeight: 1,
        transition: 'color .25s',
      }} className="group-hover:text-lux-gold">
        {value ?? '—'}
      </p>
    </Link>
  </motion.div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    cars: null, appointments: null, orders: null, users: null,
  });

  useEffect(() => {
    Promise.allSettled([
      api.get('/cars?limit=1'),
      api.get('/appointments?limit=1'),
      api.get('/orders?limit=1'),
      api.get('/users?limit=1'),
    ]).then(([c, a, o, u]) => {
      setStats({
        cars:         c.status === 'fulfilled' ? c.value.meta?.total : '?',
        appointments: a.status === 'fulfilled' ? a.value.meta?.total : '?',
        orders:       o.status === 'fulfilled' ? o.value.meta?.total : '?',
        users:        u.status === 'fulfilled' ? u.value.meta?.total : '?',
      });
    });
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--black)' }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminHeader title="Tổng quan" />
        <main style={{ padding: '32px 36px', flex: 1 }}>

          {/* Stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
            gap: 2, background: 'var(--border)', marginBottom: 32,
          }}>
            <StatCard label="Tổng số xe"   value={stats.cars}         delay={0}    href="/admin/cars"         />
            <StatCard label="Lịch hẹn"     value={stats.appointments} delay={0.07} href="/admin/appointments" />
            <StatCard label="Đơn hàng"     value={stats.orders}       delay={0.14} href="/admin/orders"       />
            <StatCard label="Người dùng"   value={stats.users}        delay={0.21} href="/admin/users"        />
          </div>

          {/* Quick links */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 2, background: 'var(--border)',
          }}>
            {[
              { href:'/admin/cars',         label:'Quản lý xe',    desc:'Thêm, sửa, xóa xe trong bộ sưu tập'     },
              { href:'/admin/brands',       label:'Thương hiệu',   desc:'Quản lý danh sách hãng xe'               },
              { href:'/admin/appointments', label:'Lịch hẹn',      desc:'Xem và xác nhận lịch hẹn khách hàng'    },
              { href:'/admin/orders',       label:'Đơn hàng',      desc:'Theo dõi tiến trình đơn đặt mua'         },
            ].map((item, i) => (
              <motion.div key={item.href}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 + 0.3 }}>
                <Link to={item.href} style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-end', padding: '28px 24px',
                  background: 'var(--black)', transition: 'background .2s',
                  textDecoration: 'none',
                }} className="group hover:bg-lux-mid">
                  <div>
                    <p style={{
                      fontFamily: 'Cormorant Garamond', fontSize: 22,
                      fontWeight: 300, color: 'var(--white)',
                      marginBottom: 6, transition: 'color .2s',
                    }} className="group-hover:text-lux-gold">
                      {item.label}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 300 }}>
                      {item.desc}
                    </p>
                  </div>
                  <svg width="16" height="16" fill="none" stroke="currentColor"
                    strokeWidth="1.5" viewBox="0 0 24 24"
                    style={{ color: 'var(--muted)', flexShrink: 0, transition: 'color .2s' }}
                    className="group-hover:text-lux-gold">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}