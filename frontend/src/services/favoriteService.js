const FAVORITES_KEY = 'luxe_favorites';

export const favoriteService = {
  getFavorites: () => {
    try {
      const data = localStorage.getItem(FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isFavorite: (carId) => {
    const favorites = favoriteService.getFavorites();
    return favorites.some(car => car._id === carId || car.id === carId);
  },

  toggleFavorite: (car) => {
    const favorites = favoriteService.getFavorites();
    const index = favorites.findIndex(item => item._id === car._id || item.id === car._id);
    let updated;
    if (index >= 0) {
      updated = favorites.filter(item => (item._id !== car._id && item.id !== car._id));
    } else {
      updated = [car, ...favorites];
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('luxe_favorites_updated', { detail: updated }));
    return updated;
  },

  removeFavorite: (carId) => {
    const favorites = favoriteService.getFavorites();
    const updated = favorites.filter(item => item._id !== carId && item.id !== carId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('luxe_favorites_updated', { detail: updated }));
    return updated;
  }
};

export default favoriteService;
