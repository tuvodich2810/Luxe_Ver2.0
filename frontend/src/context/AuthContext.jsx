import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,            setUser]            = useState(null);
  const [isLoading,       setIsLoading]       = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('luxe_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          setIsAuthenticated(true);
        } catch {
          localStorage.removeItem('luxe_token');
          localStorage.removeItem('luxe_user');
        }
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { user: u, token } = res.data;
    localStorage.setItem('luxe_token', token);
    localStorage.setItem('luxe_user', JSON.stringify(u));
    setUser(u); setIsAuthenticated(true);
    return u;
  }, []);

  const register = useCallback(async (formData) => {
    const res = await api.post('/auth/register', formData);
    const { user: u, token } = res.data;
    localStorage.setItem('luxe_token', token);
    localStorage.setItem('luxe_user', JSON.stringify(u));
    setUser(u); setIsAuthenticated(true);
    return u;
  }, []);

  const logout = useCallback(async () => {
    try { await api.post('/auth/logout'); } catch {}
    localStorage.removeItem('luxe_token');
    localStorage.removeItem('luxe_user');
    setUser(null); setIsAuthenticated(false);
  }, []);

  const updateUser = useCallback((u) => {
    setUser(u);
    localStorage.setItem('luxe_user', JSON.stringify(u));
  }, []);

  return (
    <AuthContext.Provider value={{
      user, isLoading, isAuthenticated,
      isAdmin: user?.role === 'admin',
      login, register, logout, updateUser,
    }}>
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