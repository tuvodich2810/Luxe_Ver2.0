import api from './api';

export const brandService = {
  getBrands: async (featured = false) => {
    const res = await api.get('/brands', { params: { featured } });
    return res;
  },
  getBrandById: async (id) => {
    const res = await api.get(`/brands/${id}`);
    return res;
  },
  createBrand: async (brandData) => {
    const res = await api.post('/brands', brandData);
    return res;
  },
  updateBrand: async (id, brandData) => {
    const res = await api.put(`/brands/${id}`, brandData);
    return res;
  },
  deleteBrand: async (id) => {
    const res = await api.delete(`/brands/${id}`);
    return res;
  },
};

export default brandService;
