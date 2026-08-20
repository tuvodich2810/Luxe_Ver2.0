/**
 * LUXE MOTORS - HỆ THỐNG CHẤM ĐIỂM DỮ LIỆU KHÁCH HÀNG (LEAD SCORING ENGINE)
 * Thang điểm chuẩn: 100 điểm
 * Phân loại: HOT (>= 70đ) | WARM (40 - 69đ) | COLD (< 40đ)
 */

export const LEAD_TIERS = {
  HOT: {
    label: 'HOT',
    fullName: 'Khách Hàng Ưu Tiên Cao (HOT)',
    minScore: 70,
    emoji: '🔴',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/40',
    badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/40',
    barColor: 'bg-rose-500',
    slaAction: 'Chuyên viên VIP gọi lại trong vòng 15 PHÚT',
  },
  WARM: {
    label: 'WARM',
    fullName: 'Khách Hàng Tiềm Năng (WARM)',
    minScore: 40,
    emoji: '🟡',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/40',
    badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/40',
    barColor: 'bg-amber-500',
    slaAction: 'Chuyên viên tư vấn gọi điện trong vòng 2 GIỜ',
  },
  COLD: {
    label: 'COLD',
    fullName: 'Khách Hàng Tìm Hiểu (COLD)',
    minScore: 0,
    emoji: '🔵',
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/40',
    badgeClass: 'bg-slate-500/15 text-slate-400 border-slate-500/40',
    barColor: 'bg-slate-500',
    slaAction: 'Nạp vào hệ thống Email Nurturing tự động',
  },
};

/**
 * Tính toán điểm chi tiết cho từng trường thông tin khách hàng
 * @param {Object} contact - Bản ghi khách hàng từ MongoDB/Form
 * @returns {Object} Kết quả chấm điểm chi tiết và xếp loại
 */
export function calculateLeadScore(rawContact = {}) {
  const contact = rawContact || {};
  let identityScore = 0;
  let carScore = 0;
  let intentScore = 0;
  let sourceScore = 0;

  const identityDetails = [];
  const carDetails = [];
  const intentDetails = [];
  const sourceDetails = [];

  // ==========================================
  // 1. NHÓM 1: ĐIỂM ĐỊNH DANH & LIÊN HỆ (Tối đa 25 điểm)
  // ==========================================
  const name = String(contact.name || contact.visitorName || '').trim();
  if (name.length > 2) {
    if (name.split(' ').length >= 2) {
      identityScore += 5;
      identityDetails.push('Họ tên đầy đủ (+5đ)');
    } else {
      identityScore += 3;
      identityDetails.push('Tên gọi (+3đ)');
    }
  }

  const phone = String(contact.phone || contact.visitorPhone || '').trim();
  const cleanPhone = phone.replace(/\s+/g, '');
  if (/(03|05|07|08|09|02)+[0-9]{8,9}\b/.test(cleanPhone)) {
    identityScore += 10;
    identityDetails.push('Số điện thoại hợp lệ (+10đ)');
  } else if (phone.length >= 8) {
    identityScore += 5;
    identityDetails.push('Số điện thoại (+5đ)');
  }

  const email = String(contact.email || contact.visitorEmail || '').trim().toLowerCase();
  if (email && email.includes('@')) {
    const freeDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'yahoo.com.vn'];
    const domain = email.split('@')[1] || '';
    if (domain && !freeDomains.includes(domain)) {
      identityScore += 10;
      identityDetails.push('Email Doanh nghiệp riêng (+10đ)');
    } else {
      identityScore += 5;
      identityDetails.push('Email cá nhân (+5đ)');
    }
  }
  identityScore = Math.min(identityScore, 25);

  // ==========================================
  // 2. NHÓM 2: GIÁ TRỊ & NHU CẦU SIÊU XE (Tối đa 25 điểm)
  // ==========================================
  const carName = typeof contact.car === 'object' && contact.car !== null
    ? (contact.car.name || contact.car.model || '')
    : String(contact.car || '');
  const carText = `${carName} ${contact.interest || ''} ${contact.subject || ''}`.toLowerCase();
  const highTierKeywords = ['sf90', 'revuelto', 'ghost', 'phantom', 'chiron', 'hypercar', 'laferrari', 'svj', '812', 'cullinan'];
  const midTierKeywords = ['gt3', 'continental', '750s', 'maybach', 'db12', 'roma', 'huracan', 'f8', 'artura', 'taycan', '911', 'urus'];

  if (highTierKeywords.some((kw) => carText.includes(kw))) {
    carScore += 15;
    carDetails.push('Dòng Hypercar / Ultra-Luxury > 30 Tỷ (+15đ)');
  } else if (midTierKeywords.some((kw) => carText.includes(kw))) {
    carScore += 10;
    carDetails.push('Dòng Supercar 15 - 30 Tỷ (+10đ)');
  } else if (carText.length > 2) {
    carScore += 5;
    carDetails.push('Có chọn mẫu xe (+5đ)');
  }

  const bespokeKeywords = ['alcantara', 'carbon', 'starlight', 'màu', 'bespoke', 'tùy chọn', 'gói', 'mâm', 'độ', 'may đo', 'weissach', 'track'];
  const allText = `${contact.subject || ''} ${contact.message || ''} ${contact.notes || ''}`.toLowerCase();
  if (bespokeKeywords.some((kw) => allText.includes(kw))) {
    carScore += 10;
    carDetails.push('Yêu cầu cá nhân hóa Bespoke / Màu sơn (+10đ)');
  }
  carScore = Math.min(carScore, 25);

  // ==========================================
  // 3. NHÓM 3: Ý ĐỊNH MUA HÀNG & MỨC ĐỘ KHẨN CẤP (Tối đa 25 điểm)
  // ==========================================
  if (contact.appointmentDate || contact.timeSlot) {
    intentScore += 10;
    intentDetails.push('Đã chọn ngày giờ hẹn cụ thể (+10đ)');
  }

  const highIntentKeywords = ['cọc', 'đặt cọc', 'mua xe', 'hợp đồng', 'chốt', 'thanh toán', 'giao ngay', 'lấy xe', 'giá lăn bánh', 'chuyển tiền', 'đặt lịch'];
  let matchedKeywords = 0;
  highIntentKeywords.forEach((kw) => {
    if (allText.includes(kw)) matchedKeywords++;
  });

  if (matchedKeywords >= 2) {
    intentScore += 10;
    intentDetails.push(`Ý định mua cao (${matchedKeywords} từ khóa) (+10đ)`);
  } else if (matchedKeywords === 1) {
    intentScore += 5;
    intentDetails.push('Có từ khóa giao dịch (+5đ)');
  }

  const message = String(contact.message || contact.notes || '').trim();
  if (message.length >= 30) {
    intentScore += 5;
    intentDetails.push('Nội dung yêu cầu chi tiết >= 30 ký tự (+5đ)');
  }
  intentScore = Math.min(intentScore, 25);

  // ==========================================
  // 4. NHÓM 4: NGUỒN THU THẬP LEAD (Tối đa 25 điểm)
  // ==========================================
  const source = String(contact.source || '').toLowerCase();
  const subject = String(contact.subject || '').toLowerCase();

  if (source.includes('purchasemodal') || source.includes('cọc') || subject.includes('cọc')) {
    sourceScore += 25;
    sourceDetails.push('Cọc xe trực tuyến VietQR (+25đ)');
  } else if (source.includes('appointment') || source.includes('lái thử') || contact.appointmentDate) {
    sourceScore += 20;
    sourceDetails.push('Form Đặt Lịch Lái Thử Concierge (+20đ)');
  } else if (source.includes('hotline') || source.includes('0372950720')) {
    sourceScore += 20;
    sourceDetails.push('Gọi trực tiếp Hotline VIP (+20đ)');
  } else if (source.includes('chatbot') || subject.includes('chatbot') || subject.includes('ai')) {
    sourceScore += 15;
    sourceDetails.push('AI Chatbot Tự Động 24/7 (+15đ)');
  } else {
    sourceScore += 10;
    sourceDetails.push('Form Liên Hệ Trực Tiếp (+10đ)');
  }
  sourceScore = Math.min(sourceScore, 25);

  // ==========================================
  // TỔNG KẾT ĐIỂM
  // ==========================================
  const totalScore = Math.min(identityScore + carScore + intentScore + sourceScore, 100);

  let tierKey = 'COLD';
  if (totalScore >= 70) tierKey = 'HOT';
  else if (totalScore >= 40) tierKey = 'WARM';

  const tierConfig = LEAD_TIERS[tierKey];

  return {
    totalScore,
    tier: tierKey,
    label: tierConfig.label,
    fullName: tierConfig.fullName,
    emoji: tierConfig.emoji,
    color: tierConfig.color,
    bgColor: tierConfig.bgColor,
    borderColor: tierConfig.borderColor,
    badgeClass: tierConfig.badgeClass,
    barColor: tierConfig.barColor,
    slaAction: tierConfig.slaAction,
    breakdown: {
      identity: { score: identityScore, max: 25, details: identityDetails },
      car: { score: carScore, max: 25, details: carDetails },
      intent: { score: intentScore, max: 25, details: intentDetails },
      source: { score: sourceScore, max: 25, details: sourceDetails },
    },
  };
}
