import api from './api';

const appointmentService = {
  // ==========================================
  // Tạo lịch hẹn
  // ==========================================
  async createAppointment(data) {
    const response = await api.post('/appointments', data);

    // Backend trả:
    // {
    //   success: true,
    //   message: "...",
    //   data: {...}
    // }

    return response.data;
  },

  // ==========================================
  // Lấy lịch hẹn của người đang đăng nhập
  // ==========================================
  async getMyAppointments() {
    const response = await api.get('/appointments/my');
    return response.data;
  },

  // ==========================================
  // Admin lấy tất cả lịch hẹn
  // ==========================================
  async getAllAppointments(params = {}) {
    const response = await api.get('/appointments', {
      params,
    });

    return response.data;
  },

  // ==========================================
  // Admin cập nhật trạng thái
  // ==========================================
  async updateStatus(id, status) {
    const response = await api.put(`/appointments/${id}`, {
      status,
    });

    return response.data;
  },

  // ==========================================
  // Hủy lịch hẹn
  // ==========================================
  async cancelAppointment(id, cancelReason = '') {
    const response = await api.delete(`/appointments/${id}`, {
      data: {
        cancelReason,
      },
    });

    return response.data;
  },
};

export default appointmentService;