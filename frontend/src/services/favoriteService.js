import api from './api';

const getCurrentUserId = () => {
  try {
    const userStr = localStorage.getItem('luxe_user');
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    return user?._id || user?.id || null;
  } catch {
    return null;
  }
};

const getStorageKey = () => {
  const userId = getCurrentUserId();
  return userId ? `luxe_favorites_${userId}` : null;
};

export const favoriteService = {
  // Lấy danh sách xe yêu thích đã lưu trong cache của tài khoản hiện tại
  getFavorites: () => {
    const storageKey = getStorageKey();
    if (!storageKey) return [];
    try {
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  // Đồng bộ danh sách xe yêu thích từ Backend API về cho tài khoản hiện tại
  fetchFavorites: async () => {
    const token = localStorage.getItem('luxe_token');
    const storageKey = getStorageKey();

    if (!token || !storageKey) {
      // Dọn dẹp key cũ nếu có
      localStorage.removeItem('luxe_favorites');
      window.dispatchEvent(new CustomEvent('luxe_favorites_updated', { detail: [] }));
      return [];
    }

    try {
      const res = await api.get('/favorites');
      const list = res.data || [];
      const cars = list
        .map((item) => (item.car ? { ...item.car, favoriteId: item._id } : item))
        .filter(Boolean);

      localStorage.setItem(storageKey, JSON.stringify(cars));
      // Dọn dẹp legacy global key
      localStorage.removeItem('luxe_favorites');

      window.dispatchEvent(new CustomEvent('luxe_favorites_updated', { detail: cars }));
      return cars;
    } catch (err) {
      console.error('Error fetching favorites:', err);
      return favoriteService.getFavorites();
    }
  },

  // Kiểm tra 1 xe có trong danh sách yêu thích của tài khoản hay không
  isFavorite: (carId) => {
    if (!carId) return false;
    const favorites = favoriteService.getFavorites();
    return favorites.some((car) => car?._id === carId || car?.id === carId);
  },

  // Bật/tắt yêu thích (Toggle)
  toggleFavorite: async (car) => {
    if (!car) return { success: false };
    const token = localStorage.getItem('luxe_token');
    const storageKey = getStorageKey();

    if (!token || !storageKey) {
      return { requireAuth: true };
    }

    const carId = car._id || car.id;
    const favorites = favoriteService.getFavorites();
    const isFav = favorites.some((item) => item._id === carId || item.id === carId);

    let updated;
    if (isFav) {
      updated = favorites.filter((item) => item._id !== carId && item.id !== carId);
    } else {
      updated = [car, ...favorites];
    }

    // Optimistic update
    localStorage.setItem(storageKey, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('luxe_favorites_updated', { detail: updated }));

    try {
      if (isFav) {
        await api.delete(`/favorites/${carId}`);
      } else {
        await api.post(`/favorites/${carId}`);
      }
      return { success: true, isFavorited: !isFav, data: updated };
    } catch (err) {
      // Rollback on error
      localStorage.setItem(storageKey, JSON.stringify(favorites));
      window.dispatchEvent(new CustomEvent('luxe_favorites_updated', { detail: favorites }));
      throw err;
    }
  },

  // Xóa 1 xe khỏi danh sách yêu thích
  removeFavorite: async (carId) => {
    const token = localStorage.getItem('luxe_token');
    const storageKey = getStorageKey();
    if (!token || !storageKey) return [];

    const favorites = favoriteService.getFavorites();
    const updated = favorites.filter((item) => item._id !== carId && item.id !== carId);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('luxe_favorites_updated', { detail: updated }));

    try {
      await api.delete(`/favorites/${carId}`);
    } catch (err) {
      console.error('Error removing favorite from backend:', err);
    }
    return updated;
  },

  // Xóa toàn bộ danh sách xe yêu thích của tài khoản hiện tại
  clearFavorites: async () => {
    const token = localStorage.getItem('luxe_token');
    const storageKey = getStorageKey();

    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
    localStorage.removeItem('luxe_favorites');
    window.dispatchEvent(new CustomEvent('luxe_favorites_updated', { detail: [] }));

    if (token) {
      try {
        await api.delete('/favorites');
      } catch (err) {
        console.error('Error clearing favorites:', err);
      }
    }
    return [];
  },

  // Reset cache khi logout
  clearUserCache: () => {
    localStorage.removeItem('luxe_favorites');
    window.dispatchEvent(new CustomEvent('luxe_favorites_updated', { detail: [] }));
  },
};

export default favoriteService;

