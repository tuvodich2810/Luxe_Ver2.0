const PayOSModule = require('@payos/node');
const PayOS = PayOSModule.PayOS || PayOSModule.default || PayOSModule;
const crypto = require('crypto');
const {
  PAYOS_CLIENT_ID,
  PAYOS_API_KEY,
  PAYOS_CHECKSUM_KEY,
  FRONTEND_URL,
} = require('../config/env');

const isConfigured = Boolean(
  PAYOS_CLIENT_ID &&
  PAYOS_API_KEY &&
  PAYOS_CHECKSUM_KEY &&
  PAYOS_CLIENT_ID !== 'your_payos_client_id_here'
);

let payos = null;

try {
  payos = new PayOS({
    clientId: isConfigured ? PAYOS_CLIENT_ID : 'dummy_client_id',
    apiKey: isConfigured ? PAYOS_API_KEY : 'dummy_api_key',
    checksumKey: isConfigured ? PAYOS_CHECKSUM_KEY : 'dummy_checksum_key',
  });
} catch (initErr) {
  console.warn('⚠️ PayOS SDK Init Warning (Chế độ mô phỏng / Mock Mode):', initErr.message);
  payos = null;
}

/**
 * Tạo link thanh toán & mã QR động từ PayOS
 * @param {Object} order - Document đơn hàng từ MongoDB
 * @returns {Promise<Object>} Data gồm checkoutUrl, qrCode, paymentLinkId...
 */
const createPaymentLink = async (order) => {
  // PayOS yêu cầu orderCode kiểu Number duy nhất
  const orderCode = order.payosOrderCode || Number(String(Date.now()).slice(-8));
  const description = `Coc xe ${order.carSnapshot?.name || ''}`.slice(0, 25);
  const clientUrl = FRONTEND_URL || 'https://luxe-ver2-0.vercel.app';

  const body = {
    orderCode,
    amount: Math.round(order.depositAmount || 0),
    description,
    cancelUrl: `${clientUrl}/orders?status=cancelled&orderCode=${orderCode}`,
    returnUrl: `${clientUrl}/orders?status=success&orderCode=${orderCode}`,
  };

  // Nếu chưa cấu hình PayOS thật hoặc SDK không khởi tạo được, trả về Mock/VietQR Link an toàn
  if (!isConfigured || !payos) {
    console.log(`ℹ️ PayOS chưa cấu hình API Key thật, tạo VietQR Payment Link cho Order #${orderCode}`);
    return {
      orderCode,
      paymentLinkId: `mock_pl_${orderCode}`,
      checkoutUrl: `${clientUrl}/orders?status=success&orderCode=${orderCode}`,
      qrCodeUrl: `https://img.vietqr.io/image/MB-0372950720-compact2.png?amount=${Math.round(order.depositAmount)}&addInfo=LuxeMotors+Coc+${orderCode}`,
      status: 'PENDING',
    };
  }

  try {
    // Hỗ trợ cả @payos/node v2 (paymentRequests.create) và v1 (createPaymentLink)
    let paymentLinkRes;
    if (payos.paymentRequests && typeof payos.paymentRequests.create === 'function') {
      paymentLinkRes = await payos.paymentRequests.create(body);
    } else if (typeof payos.createPaymentLink === 'function') {
      paymentLinkRes = await payos.createPaymentLink(body);
    } else {
      throw new Error('Phương thức tạo PaymentLink của PayOS SDK không khả dụng');
    }

    return {
      orderCode,
      paymentLinkId: paymentLinkRes.paymentLinkId || paymentLinkRes.id,
      checkoutUrl: paymentLinkRes.checkoutUrl,
      qrCodeUrl: paymentLinkRes.qrCode,
      status: paymentLinkRes.status,
    };
  } catch (error) {
    console.error('❌ PayOS createPaymentLink Error:', error.message);
    // Fallback QR code VietQR để không làm gián đoạn trải nghiệm người dùng
    return {
      orderCode,
      paymentLinkId: `fallback_${orderCode}`,
      checkoutUrl: `${clientUrl}/orders?orderCode=${orderCode}`,
      qrCodeUrl: `https://img.vietqr.io/image/MB-0372950720-compact2.png?amount=${Math.round(order.depositAmount)}&addInfo=LuxeMotors+Coc+${orderCode}`,
      status: 'PENDING',
    };
  }
};

/**
 * Xác thực Webhook Signature của PayOS (Chống giả mạo request)
 * @param {Object} webhookBody - Body gửi từ PayOS webhook
 * @returns {Object} Data đã được xác thực giải mã từ PayOS
 */
const verifyWebhookData = (webhookBody) => {
  if (!webhookBody) {
    throw new Error('Dữ liệu Webhook rỗng');
  }

  try {
    if (payos && payos.webhooks && typeof payos.webhooks.verify === 'function') {
      return payos.webhooks.verify(webhookBody);
    }
    if (payos && typeof payos.verifyPaymentWebhookData === 'function') {
      return payos.verifyPaymentWebhookData(webhookBody);
    }
  } catch (error) {
    console.warn('PayOS SDK verify thất bại, thử giải mã HMAC thủ công:', error.message);
  }

  // Fallback tự tính HMAC SHA256
  if (webhookBody && webhookBody.data && webhookBody.signature) {
    const data = webhookBody.data;
    const sortedKeys = Object.keys(data).sort();
    const signData = sortedKeys
      .map((key) => `${key}=${data[key] !== null && data[key] !== undefined ? data[key] : ''}`)
      .join('&');

    const expectedSignature = crypto
      .createHmac('sha256', PAYOS_CHECKSUM_KEY || 'dummy_checksum_key')
      .update(signData)
      .digest('hex');

    if (expectedSignature === webhookBody.signature || !isConfigured) {
      return data;
    }
  }

  if (!isConfigured && webhookBody.data) {
    return webhookBody.data;
  }

  throw new Error('Chữ ký Webhook PayOS không hợp lệ (Signature Mismatch)');
};

/**
 * Truy vấn trạng thái thanh toán từ PayOS theo orderCode
 * @param {number} orderCode - Mã orderCode dạng số
 */
const getPaymentLinkInformation = async (orderCode) => {
  if (!isConfigured || !payos) {
    return { status: 'PENDING', orderCode };
  }
  try {
    if (payos.paymentRequests && typeof payos.paymentRequests.get === 'function') {
      return await payos.paymentRequests.get(orderCode);
    }
    if (typeof payos.getPaymentLinkInformation === 'function') {
      return await payos.getPaymentLinkInformation(orderCode);
    }
    return { status: 'PENDING', orderCode };
  } catch (error) {
    console.error('❌ PayOS getPaymentLinkInformation Error:', error.message);
    throw error;
  }
};

module.exports = {
  payos,
  isConfigured,
  createPaymentLink,
  verifyWebhookData,
  getPaymentLinkInformation,
};
