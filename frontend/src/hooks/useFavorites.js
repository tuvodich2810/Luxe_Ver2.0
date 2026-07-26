import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

export const useFavorites = () => {
  const { isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [isLoading,   setIsLoading]   = useState(true);
  const [pendingIds,  setPendingIds]  = useState(new Set());

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavoriteIds(new Set()); setIsLoading(false); return;
    }
    try {
      const res = await api.get('/favorites');
      const ids = (res.data || []).filter(f => f.car).map(f => f.car._id);
      setFavoriteIds(new Set(ids));
    } catch { setFavoriteIds(new Set()); }
    finally  { setIsLoading(false); }
  }, [isAuthenticated]);

  useEffect(() => { fetchFavorites(); }, [fetchFavorites]);

  const toggleFavorite = useCallback(async (carId) => {
    if (!isAuthenticated) return { requireAuth: true };
    if (pendingIds.has(carId)) return { success: false };

    const wasFav = favoriteIds.has(carId);
    setFavoriteIds(prev => {
      const s = new Set(prev); wasFav ? s.delete(carId) : s.add(carId); return s;
    });
    setPendingIds(prev => new Set(prev).add(carId));

    try {
      if (wasFav) await api.delete(`/favorites/${carId}`);
      else        await api.post(`/favorites/${carId}`);
      return { success: true, isFavorited: !wasFav };
    } catch (err) {
      setFavoriteIds(prev => {
        const s = new Set(prev); wasFav ? s.add(carId) : s.delete(carId); return s;
      });
      return { success: false, error: err.message };
    } finally {
      setPendingIds(prev => {
        const s = new Set(prev); s.delete(carId); return s;
      });
    }
  }, [isAuthenticated, favoriteIds, pendingIds]);

  return {
    favoriteIds, isLoading,
    isFavorited: useCallback(id => favoriteIds.has(id), [favoriteIds]),
    isPending:   useCallback(id => pendingIds.has(id),  [pendingIds]),
    toggleFavorite,
    refetch: fetchFavorites,
  };
};

export default useFavorites;