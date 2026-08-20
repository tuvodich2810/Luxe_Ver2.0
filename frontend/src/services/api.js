import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('luxe_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res.data,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh')) {
        localStorage.removeItem('luxe_token');
        localStorage.removeItem('luxe_user');
        return Promise.reject(new Error(err.response?.data?.message || 'Phiên làm việc đã hết hạn'));
      }

      // Nếu người dùng chưa từng đăng nhập (không có token), không thử refresh
      const existingToken = localStorage.getItem('luxe_token');
      if (!existingToken) {
        return Promise.reject(new Error(err.response?.data?.message || 'Bạn chưa đăng nhập, vui lòng đăng nhập để tiếp tục'));
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((e) => Promise.reject(e));
      }

      isRefreshing = true;

      try {
        const refreshRes = await axios.post(
          `${import.meta.env.VITE_API_URL || '/api'}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshRes.data?.token || refreshRes.data?.data?.token;

        if (newAccessToken) {
          localStorage.setItem('luxe_token', newAccessToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          return api(originalRequest);
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem('luxe_token');
        localStorage.removeItem('luxe_user');
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(
      new Error(err.response?.data?.message || err.message || 'Lỗi kết nối')
    );
  }
);

export default api;