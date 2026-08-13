/**
 * Utility hàm kiểm tra và định dạng dữ liệu đầu vào
 */

/**
 * Kiểm tra Số điện thoại di động Việt Nam hợp lệ (10 chữ số, đầu 03, 05, 07, 08, 09)
 * @param {string} phone 
 * @returns {boolean}
 */
export const isValidVNPhone = (phone) => {
  if (!phone) return false;
  const cleanPhone = phone.replace(/[\s.-]/g, '');
  return /^(03|05|07|08|09)\d{8}$/.test(cleanPhone);
};

/**
 * Kiểm tra Email hợp lệ
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};
