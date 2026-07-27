import api from './api';

export const appointmentService = {
  createAppointment: async (data) => {
    const res = await api.post('/appointments', data);
    return res;
  },
  getMyAppointments: async () => {
    const res = await api.get('/appointments/my');
    return res;
  },
  getAllAppointments: async (params = {}) => {
    const res = await api.get('/appointments', { params });
    return res;
  },
  updateStatus: async (id, statusData) => {
    const res = await api.put(`/appointments/${id}`, statusData);
    return res;
  },
  cancelAppointment: async (id, cancelReason) => {
    const res = await api.delete(`/appointments/${id}`, { data: { cancelReason } });
    return res;
  },
};

export default appointmentService;
