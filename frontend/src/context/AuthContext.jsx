import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import favoriteService from '@/services/favoriteService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('luxe_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          const userData = res.user || res.data?.user || res.data || res;
          setUser(userData);
          setIsAuthenticated(true);
          // Đồng bộ danh sách yêu thích riêng của user này
          favoriteService.fetchFavorites();
        } catch {
          localStorage.removeItem('luxe_token');
          localStorage.removeItem('luxe_user');
          favoriteService.clearUserCache();
        }
      } else {
        favoriteService.clearUserCache();
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const u = res.user || res.data?.user || res.data;
    const token = res.token || res.data?.token;

    if (token) localStorage.setItem('luxe_token', token);
    if (u) localStorage.setItem('luxe_user', JSON.stringify(u));
    setUser(u);
    setIsAuthenticated(true);
    // Đồng bộ danh sách xe yêu thích của tài khoản vừa đăng nhập
    favoriteService.fetchFavorites();
    return u;
  }, []);

  const register = useCallback(async (formData) => {
    const res = await api.post('/auth/register', formData);
    const u = res.user || res.data?.user || res.data;
    const token = res.token || res.data?.token;

    if (token) localStorage.setItem('luxe_token', token);
    if (u) localStorage.setItem('luxe_user', JSON.stringify(u));
    setUser(u);
    setIsAuthenticated(true);
    favoriteService.fetchFavorites();
    return u;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    localStorage.removeItem('luxe_token');
    localStorage.removeItem('luxe_user');
    favoriteService.clearUserCache();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const updateUser = useCallback((u) => {
    setUser(u);
    localStorage.setItem('luxe_user', JSON.stringify(u));
  }, []);

  const isStaffOrExecutive = user && ['admin', 'giam_doc', 'quan_ly', 'sales', 'cskh'].includes(user.role);
  const isAdmin = isStaffOrExecutive; // Cho phép tất cả 5 chức vụ nhân sự/quản trị truy cập hệ thống admin

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        isStaffOrExecutive,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải dùng trong AuthProvider');
  return ctx;
};

export default AuthContext;