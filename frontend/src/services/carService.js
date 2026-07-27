import api from './api';

export const carService = {
  getCars: async (params = {}) => {
    const res = await api.get('/cars', { params });
    return res;
  },
  getFeaturedCars: async (limit = 6) => {
    const res = await api.get('/cars/featured', { params: { limit } });
    return res;
  },
  getCarByIdOrSlug: async (idOrSlug) => {
    const res = await api.get(`/cars/${idOrSlug}`);
    return res;
  },
  getRelatedCars: async (id) => {
    const res = await api.get(`/cars/${id}/related`);
    return res;
  },
  createCar: async (carData) => {
    const res = await api.post('/cars', carData);
    return res;
  },
  updateCar: async (id, carData) => {
    const res = await api.put(`/cars/${id}`, carData);
    return res;
  },
  deleteCar: async (id) => {
    const res = await api.delete(`/cars/${id}`);
    return res;
  },
};

export default carService;
