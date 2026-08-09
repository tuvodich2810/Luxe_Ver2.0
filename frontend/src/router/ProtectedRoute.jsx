import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/common/Loader';

// Route bắt buộc phải đăng nhập
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <Loader />;
  if (!isAuthenticated)
    return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

// Route phân quyền vai trò nghiêm ngặt theo từng phân hệ trang riêng biệt
export const AdminRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <Loader />;

  if (!isAuthenticated)
    return <Navigate to="/login" state={{ from: location }} replace />;

  const userRole = user?.role || 'user';

  // Điều hướng tự động về đúng trang phân hệ riêng biệt nếu gõ nhầm /admin
  if (location.pathname === '/admin') {
    if (userRole === 'cskh') return <Navigate to="/cskh" replace />;
    if (userRole === 'sales') return <Navigate to="/sales" replace />;
    if (userRole === 'quan_ly') return <Navigate to="/manager" replace />;
    if (userRole === 'giam_doc') return <Navigate to="/director" replace />;
  }

  // Danh sách các chức vụ nội bộ được phép
  const staffRoles = ['admin', 'giam_doc', 'quan_ly', 'sales', 'cskh'];
  if (!staffRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // Kiểm tra quyền riêng biệt theo từng trang nếu có allowedRoles
  if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(userRole)) {
    if (userRole === 'cskh') return <Navigate to="/cskh" replace />;
    if (userRole === 'sales') return <Navigate to="/sales" replace />;
    if (userRole === 'quan_ly') return <Navigate to="/manager" replace />;
    if (userRole === 'giam_doc') return <Navigate to="/director" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

// Route dành cho khách chưa đăng nhập
export const GuestRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <Loader />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
};