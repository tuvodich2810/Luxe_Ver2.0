const PayOSModule = require('@payos/node');
const PayOS = typeof PayOSModule === 'function' ? PayOSModule : (PayOSModule.default || PayOSModule.PayOS || PayOSModule);
const crypto = require('crypto');
const {
  PAYOS_CLIENT_ID,
  PAYOS_API_KEY,
  PAYOS_CHECKSUM_KEY,
  FRONTEND_URL,
} = require('../config/env');

// Khởi tạo instance PayOS SDK
const payos = new PayOS(
  PAYOS_CLIENT_ID || 'dummy_client_id',
  PAYOS_API_KEY || 'dummy_api_key',
  PAYOS_CHECKSUM_KEY || 'dummy_checksum_key'
);

/**
 * Tạo link thanh toán & mã QR động từ PayOS
 * @param {Object} order - Document đơn hàng từ MongoDB
 * @returns {Promise<Object>} Data gồm checkoutUrl, qrCode, paymentLinkId...
 */
const createPaymentLink = async (order) => {
  // PayOS yêu cầu orderCode kiểu Number duy nhất
  const orderCode = order.payosOrderCode || Number(String(Date.now()).slice(-8));

  const description = `Coc xe ${order.carSnapshot?.name || ''}`.slice(0, 25); // Tối đa 25 ký tự

  const body = {
    orderCode,
    amount: Math.round(order.depositAmount),
    description,
    cancelUrl: `${FRONTEND_URL}/orders?status=cancelled&orderCode=${orderCode}`,
    returnUrl: `${FRONTEND_URL}/orders?status=success&orderCode=${orderCode}`,
  };

  try {
    const paymentLinkRes = await payos.createPaymentLink(body);
    return {
      orderCode,
      paymentLinkId: paymentLinkRes.paymentLinkId,
      checkoutUrl: paymentLinkRes.checkoutUrl,
      qrCodeUrl: paymentLinkRes.qrCode,
      status: paymentLinkRes.status,
    };
  } catch (error) {
    console.error('❌ PayOS createPaymentLink Error:', error.message);
    throw new Error(`Lỗi tạo cổng thanh toán PayOS: ${error.message}`);
  }
};

/**
 * Xác thực Webhook Signature của PayOS (Chống giả mạo request)
 * @param {Object} webhookBody - Body gửi từ PayOS webhook
 * @returns {Object} Data đã được xác thực giải mã từ PayOS
 */
const verifyWebhookData = (webhookBody) => {
  try {
    // Sử dụng hàm verifyPaymentWebhookData chính thức của SDK
    const verifiedData = payos.verifyPaymentWebhookData(webhookBody);
    return verifiedData;
  } catch (error) {
    console.error('❌ PayOS Webhook Signature Invalid:', error.message);
    // Fallback tự tính HMAC SHA256 nếu SDK ném exception
    if (webhookBody && webhookBody.data && webhookBody.signature) {
      const data = webhookBody.data;
      const sortedKeys = Object.keys(data).sort();
      const signData = sortedKeys
        .map((key) => `${key}=${data[key] !== null && data[key] !== undefined ? data[key] : ''}`)
        .join('&');

      const expectedSignature = crypto
        .createHmac('sha256', PAYOS_CHECKSUM_KEY || '')
        .update(signData)
        .digest('hex');

      if (expectedSignature === webhookBody.signature) {
        return data;
      }
    }
    throw new Error('Chữ ký Webhook PayOS không hợp lệ (Signature Mismatch)');
  }
};

/**
 * Truy vấn trạng thái thanh toán từ PayOS theo orderCode
 * @param {number} orderCode - Mã orderCode dạng số
 */
const getPaymentLinkInformation = async (orderCode) => {
  try {
    return await payos.getPaymentLinkInformation(orderCode);
  } catch (error) {
    console.error('❌ PayOS getPaymentLinkInformation Error:', error.message);
    throw error;
  }
};

module.exports = {
  payos,
  createPaymentLink,
  verifyWebhookData,
  getPaymentLinkInformation,
};
