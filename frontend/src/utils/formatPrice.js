export const formatPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency', currency: 'VND', minimumFractionDigits: 0,
  }).format(price);
};

export const formatPriceShort = (price) => {
  if (typeof price !== 'number' || isNaN(price)) return 'Liên hệ';
  if (price >= 1_000_000_000)
    return `${(price / 1_000_000_000).toFixed(1).replace(/\.0$/, '')} tỷ ₫`;
  if (price >= 1_000_000)
    return `${Math.round(price / 1_000_000)} triệu ₫`;
  return formatPrice(price);
};

export const calcDiscount = (original, sale) => {
  if (!original || !sale || sale >= original) return 0;
  return Math.round(((original - sale) / original) * 100);
};