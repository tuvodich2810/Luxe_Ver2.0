const ORDERS_KEY = 'luxe_orders';

export const orderService = {
  getOrders: () => {
    try {
      const data = localStorage.getItem(ORDERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  createOrder: (orderData) => {
    const orders = orderService.getOrders();
    const newOrder = {
      _id: 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      orderDate: new Date().toISOString(),
      status: 'pending_confirmation',
      paymentStatus: 'deposit_paid',
      ...orderData
    };
    const updated = [newOrder, ...orders];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('luxe_orders_updated', { detail: updated }));
    return newOrder;
  },

  cancelOrder: (orderId) => {
    const orders = orderService.getOrders();
    const updated = orders.map(ord => ord._id === orderId ? { ...ord, status: 'cancelled' } : ord);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('luxe_orders_updated', { detail: updated }));
    return updated;
  }
};

export default orderService;
