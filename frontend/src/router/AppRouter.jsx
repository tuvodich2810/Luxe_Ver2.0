import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ProtectedRoute, AdminRoute, GuestRoute } from './ProtectedRoute';
import ScrollToTop from '@/components/common/ScrollToTop';

const Home              = lazy(() => import('@/pages/Home'));
const CarList           = lazy(() => import('@/pages/CarList'));
const CarDetail         = lazy(() => import('@/pages/CarDetail'));
const Appointment       = lazy(() => import('@/pages/Appointment'));
const Favorites         = lazy(() => import('@/pages/Favorites'));
const MyOrders          = lazy(() => import('@/pages/MyOrders'));
const Contact           = lazy(() => import('@/pages/Contact'));
const Login             = lazy(() => import('@/pages/Login'));
const Register          = lazy(() => import('@/pages/Register'));
const AdminDashboard    = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminCars         = lazy(() => import('@/pages/admin/AdminCars'));
const AdminBrands       = lazy(() => import('@/pages/admin/AdminBrands'));
const AdminUsers        = lazy(() => import('@/pages/admin/AdminUsers'));
const AdminAppointments = lazy(() => import('@/pages/admin/AdminAppointments'));
const AdminOrders       = lazy(() => import('@/pages/admin/AdminOrders'));

const PageLoader = () => (
  <div style={{
    minHeight: '100vh',
    background: '#0A0A0A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 20,
  }}>
    <div style={{
      width: 40, height: 40,
      border: '1px solid #C9A96E',
      animation: 'spin 1s linear infinite',
      transform: 'rotate(45deg)',
    }}/>
    <style>{`@keyframes spin { to { transform: rotate(45deg); } }`}</style>
    <p style={{
      fontFamily: 'Space Grotesk, monospace',
      fontSize: 10,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: '#6B6B6B',
    }}>
      Đang tải...
    </p>
  </div>
);

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/cars"           element={<CarList />} />
          <Route path="/cars/:idOrSlug" element={<CarDetail />} />
          <Route path="/contact"        element={<Contact />} />

          <Route path="/login"
            element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register"
            element={<GuestRoute><Register /></GuestRoute>} />

          <Route path="/appointment/:carId"
            element={<ProtectedRoute><Appointment /></ProtectedRoute>} />
          <Route path="/favorites"
            element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/orders"
            element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />

          <Route path="/admin"
            element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/cars"
            element={<AdminRoute><AdminCars /></AdminRoute>} />
          <Route path="/admin/brands"
            element={<AdminRoute><AdminBrands /></AdminRoute>} />
          <Route path="/admin/users"
            element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/appointments"
            element={<AdminRoute><AdminAppointments /></AdminRoute>} />
          <Route path="/admin/orders"
            element={<AdminRoute><AdminOrders /></AdminRoute>} />

          <Route path="*" element={
            <div style={{
              minHeight: '100vh',
              background: '#0A0A0A',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
            }}>
              <p style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 80,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.1)',
                lineHeight: 1,
              }}>404</p>
              <p style={{ color: '#A0A0A0', fontSize: 14 }}>
                Trang không tồn tại
              </p>
              <a href="/" style={{
                marginTop: 8,
                padding: '12px 28px',
                background: '#C9A96E',
                color: '#0A0A0A',
                fontFamily: 'Space Grotesk, monospace',
                fontSize: 10,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}>
                Về trang chủ
              </a>
            </div>
          }/>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
