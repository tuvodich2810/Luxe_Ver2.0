import api from './api';

const SHEETS_URL = import.meta.env.VITE_SHEETS_URL || '';

const send = async (data) => {
  if (!SHEETS_URL || SHEETS_URL.includes('YOUR_')) {
    console.log('[Sheets DEV]', data);
    return { success: true };
  }
  try {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, v ?? ''));
    await fetch(SHEETS_URL, { method: 'POST', body: fd, mode: 'no-cors' });
    return { success: true };
  } catch (e) {
    console.error('[Sheets]', e);
    return { success: false };
  }
};

export const sendContactForm = async (form, carName = '') => {
  try {
    await api.post('/contacts', {
      name: form.name,
      email: form.email || '',
      phone: form.phone || '',
      message: form.message || '',
      interest: form.interest || '',
      car: carName || '',
    });
    return { success: true };
  } catch (error) {
    console.error('[Contact API]', error);
    return { success: false };
  }
};

export const sendAppointmentForm = (form, carName = '') =>
  send({
    type: 'appointment',
    timestamp: new Date().toLocaleString('vi-VN'),
    car: carName,
    name: form.visitorName,
    phone: form.visitorPhone,
    email: form.visitorEmail || '',
    date: new Date(form.appointmentDate).toLocaleDateString('vi-VN'),
    time: form.timeSlot,
    note: form.notes || '',
  });

export const sendOrderForm = (form, car, depositAmount) =>
  send({
    type: 'order',
    timestamp: new Date().toLocaleString('vi-VN'),
    car: car.name,
    price: new Intl.NumberFormat('vi-VN').format(car.price) + ' đ',
    deposit_pct: (form.depositPercent || '') + '%',
    deposit_amt: new Intl.NumberFormat('vi-VN').format(depositAmount) + ' đ',
    name: form.name || '',
    phone: form.phone || '',
    email: form.email || '',
    payment: form.paymentMethod,
    address: form.deliveryAddress || '',
  });

export default send;
