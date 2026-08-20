import api from './api';

const orderService = {
  // ==========================================
  // USER: Lấy đơn hàng của user hiện tại
  // ==========================================
  getMyOrders: async (params = {}) => {
    const response = await api.get('/orders/my-orders', {
      params,
    });

    return response;
  },

  // ==========================================
  // ADMIN: Lấy tất cả đơn hàng
  // ==========================================
  getAllOrders: async (params = {}) => {
    const response = await api.get('/orders', {
      params,
    });

    return response;
  },

  // ==========================================
  // USER: Tạo đơn hàng
  // ==========================================
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);

    return response;
  },

  // ==========================================
  // USER: Hủy đơn hàng
  // ==========================================
  cancelOrder: async (orderId) => {
    const response = await api.patch(
      `/orders/${orderId}/cancel`
    );

    return response;
  },

  // ==========================================
  // Lấy chi tiết đơn hàng
  // ==========================================
  getOrderById: async (orderId) => {
    const response = await api.get(
      `/orders/${orderId}`
    );

    return response;
  },

  // ==========================================
  // ADMIN: Cập nhật trạng thái
  // ==========================================
  updateOrderStatus: async (orderId, data) => {
    const response = await api.patch(
      `/orders/${orderId}/status`,
      data
    );

    return response;
  },

  // ==========================================
  // PAYOS: Tạo Payment Link & QR Động
  // ==========================================
  createPayOSPaymentLink: async (orderId) => {
    const response = await api.post(`/orders/${orderId}/create-payment-link`);
    return response;
  },

  // ==========================================
  // PAYOS: Polling Trạng Thái Thanh Toán
  // ==========================================
  getPaymentStatus: async (orderId) => {
    const response = await api.get(`/orders/${orderId}/payment-status`);
    return response;
  },

  // ==========================================
  // Tương thích Navbar cũ
  // Không dùng localStorage nữa
  // ==========================================
  getOrders: async () => {
    try {
      const token = localStorage.getItem('luxe_token');
      if (!token) return [];
      const response = await api.get('/orders/my-orders');
      return response?.data || [];
    } catch (error) {
      return [];
    }
  },
};

export default orderService;