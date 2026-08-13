import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Download, Clock, ShieldCheck, Sparkles, RefreshCw, ExternalLink, AlertTriangle } from 'lucide-react';
import orderService from '@/services/orderService';

export default function VietQRBankCard({
  depositAmountVND = 0,
  orderCode = '',
  orderId = '',
  initialCheckoutUrl = '',
  initialQrCodeUrl = '',
  initialDepositExpiredAt = null,
  onPaymentConfirmed,
}) {
  const [copiedField, setCopiedField] = useState(null);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 phút đếm ngược
  const [isVerifying, setIsVerifying] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState(initialCheckoutUrl);
  const [qrCodeUrl, setQrCodeUrl] = useState(initialQrCodeUrl);
  const [payosOrderCode, setPayosOrderCode] = useState(orderCode);
  const pollingTimerRef = useRef(null);

  const cleanAmount = Math.round(depositAmountVND || 0);
  const codeToUse = payosOrderCode || orderCode || (orderId ? `LUXE${orderId.slice(-6).toUpperCase()}` : 'LUXEMOTORS');

  // QR Image URL: Ưu tiên QR động PayOS
  const qrImageUrl =
    qrCodeUrl ||
    `https://img.vietqr.io/image/vietinbank-108879666470-compact2.png?amount=${cleanAmount}&addInfo=${encodeURIComponent(codeToUse)}&accountName=${encodeURIComponent('DANG QUANG TUAN')}`;

  // 1. Tải PayOS Link nếu chưa có
  useEffect(() => {
    if (orderId && (!checkoutUrl || !qrCodeUrl)) {
      const initPayOS = async () => {
        try {
          const res = await orderService.createPayOSPaymentLink(orderId);
          if (res?.data) {
            setCheckoutUrl(res.data.checkoutUrl || '');
            setQrCodeUrl(res.data.qrCodeUrl || '');
            if (res.data.payosOrderCode) setPayosOrderCode(res.data.payosOrderCode);
          }
        } catch (err) {
          console.error('Lỗi khởi tạo PayOS Link:', err.message);
        }
      };
      initPayOS();
    }
  }, [orderId, checkoutUrl, qrCodeUrl]);

  // 2. Realtime Polling kiểm tra tiền về
  useEffect(() => {
    if (!orderId || isConfirmed || isExpired) return;

    const checkStatus = async () => {
      try {
        setIsVerifying(true);
        const res = await orderService.getPaymentStatus(orderId);
        const data = res?.data || res;

        if (data?.paymentStatus === 'deposit_paid' || data?.orderStatus === 'confirmed') {
          setIsConfirmed(true);
          if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
          if (onPaymentConfirmed) onPaymentConfirmed();
        } else if (data?.isExpired || data?.orderStatus === 'cancelled') {
          setIsExpired(true);
          if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
        }
      } catch (err) {
        console.error('Polling error:', err.message);
      } finally {
        setIsVerifying(false);
      }
    };

    // Chạy kiểm tra ngay lập tức
    checkStatus();

    // Lặp lại mỗi 4 giây
    pollingTimerRef.current = setInterval(checkStatus, 4000);

    return () => {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, [orderId, isConfirmed, isExpired, onPaymentConfirmed]);

  // 3. Đếm ngược thời gian giữ cọc
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatVND = (num) => {
    if (!num) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `PayOS_LuxeMotors_${codeToUse}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      window.open(qrImageUrl, '_blank');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-5 font-sans">
      {/* Timer & Security Status Banner */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs font-mono-lux">
        <div className="flex items-center gap-2 text-slate-300">
          <Clock className="w-4 h-4 text-[#D4AF37] animate-pulse" />
          <span>Thời gian giữ cọc siêu xe:</span>
        </div>
        <span className={`font-bold text-sm tracking-wider ${isExpired ? 'text-rose-400' : 'text-[#D4AF37]'}`}>
          {isExpired ? 'ĐÃ HẾT HẠN' : formatTime(timeLeft)}
        </span>
      </div>

      {/* THẺ MÃ QR THANH TOÁN DỘNG PAYOS */}
      <div className="relative p-6 rounded-[2rem] bg-gradient-to-b from-[#EEF4FF] via-[#F5F8FF] to-[#E5EDFF] border border-white shadow-2xl shadow-blue-900/20 text-slate-800 transition-all duration-300">
        <div className="relative space-y-4 text-center">
          
          {/* Header Logos Row */}
          <div className="flex items-center justify-between px-2 pt-1 pb-2">
            <div className="flex items-center gap-1.5 font-bold text-[#00529C]">
              <span className="font-sans text-sm font-extrabold tracking-tight text-[#0054A6]">
                PayOS Gateway
              </span>
            </div>
            <div className="flex items-center gap-1 font-bold text-[11px] text-[#0054A6]">
              <span className="italic font-serif">napas</span>
              <span className="text-[#EE0000] font-mono">247</span>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-md border border-blue-100 mx-auto inline-block relative group">
            {isConfirmed ? (
              <div className="w-52 h-52 sm:w-56 sm:h-56 flex flex-col items-center justify-center gap-3 bg-emerald-50 rounded-lg text-emerald-600">
                <ShieldCheck className="w-16 h-16 text-emerald-500 animate-bounce" />
                <span className="font-bold text-sm font-mono-lux text-center px-4">
                  ĐÃ XÁC NHẬN THANH TOÁN THÀNH CÔNG!
                </span>
              </div>
            ) : isExpired ? (
              <div className="w-52 h-52 sm:w-56 sm:h-56 flex flex-col items-center justify-center gap-2 bg-rose-50 rounded-lg text-rose-500">
                <AlertTriangle className="w-12 h-12" />
                <span className="font-bold text-xs font-mono-lux text-center px-2">
                  MÃ QR ĐÃ HẾT HẠN
                </span>
              </div>
            ) : (
              <img
                src={qrImageUrl}
                alt={`PayOS QR Code ${codeToUse}`}
                className="w-52 h-52 sm:w-56 sm:h-56 object-contain rounded-lg mx-auto"
              />
            )}
          </div>

          {/* Account Details */}
          <div className="space-y-1 pt-1">
            <h3 className="font-sans font-extrabold text-base sm:text-lg text-[#0F172A] uppercase tracking-wide">
              LUXE MOTORS SHOWROOM
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-700">
              Nội dung: <span className="font-mono font-bold text-[#0054A6]">{codeToUse}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Copy Actions Card */}
      <div className="bg-[#15151B] border border-white/10 rounded-xl p-4 space-y-3 font-mono-lux text-xs">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="text-slate-400">Số tiền đặt cọc:</span>
          <div className="flex items-center gap-2">
            <span className="text-[#D4AF37] font-bold text-sm">{formatVND(cleanAmount)}</span>
            <button
              type="button"
              onClick={() => handleCopy(cleanAmount.toString(), 'amount')}
              className="p-1.5 rounded bg-white/10 hover:bg-[#D4AF37] text-slate-200 hover:text-black transition-all"
            >
              {copiedField === 'amount' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400">Nội dung chuyển khoản:</span>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded border border-[#D4AF37]/30">
              {codeToUse}
            </span>
            <button
              type="button"
              onClick={() => handleCopy(codeToUse, 'orderCode')}
              className="p-1.5 rounded bg-white/10 hover:bg-[#D4AF37] text-slate-200 hover:text-black transition-all"
            >
              {copiedField === 'orderCode' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Realtime Status Indicator & Checkout Link */}
      <div className="space-y-3">
        {checkoutUrl && !isConfirmed && !isExpired && (
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-lg btn-lux-gold font-mono-lux text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
          >
            <ExternalLink className="w-4 h-4 text-black" />
            <span>Mở Cổng Thanh Toán PayOS Trong Tab Mới</span>
          </a>
        )}

        <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono-lux">
          <div className="flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 text-[#D4AF37] ${isVerifying ? 'animate-spin' : ''}`} />
            <span className="text-slate-300">Tự động kiểm tra tiền về (Realtime):</span>
          </div>
          <span className={`font-bold ${isConfirmed ? 'text-emerald-400' : isExpired ? 'text-rose-400' : 'text-slate-400'}`}>
            {isConfirmed ? 'Đã Nhận Cọc' : isExpired ? 'Đã Hủy' : 'Đang Chờ...'}
          </span>
        </div>

        {isConfirmed && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center font-mono-lux flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Xác nhận thành công! Xe đã được giữ kho và ghi nhận hợp đồng cọc.</span>
          </div>
        )}
      </div>
    </div>
  );
}
