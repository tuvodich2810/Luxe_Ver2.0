import api from './api';

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res;
  },
  logout: async () => {
    const res = await api.post('/auth/logout');
    return res;
  },
  updateProfile: async (data) => {
    const res = await api.put('/auth/profile', data);
    return res;
  },
};

export default authService;
