import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Sparkles, X, ShieldCheck, ArrowRight, CheckCircle2, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function RegisterWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      {/* Floating Register Container — Placed right next to Chatbot (right-24) */}
      <div className="fixed bottom-6 right-24 z-[1000] flex flex-col items-end pointer-events-auto">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed bottom-24 right-4 sm:right-24 z-[1001] bg-[#09090E] border border-[#D4AF37]/40 shadow-2xl rounded-2xl p-5 w-80 sm:w-96 text-white space-y-4 overflow-hidden backdrop-blur-xl"
            >
              {/* Gold Top Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37]" />

              {/* Header Close */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] flex items-center justify-center font-black text-[#0E0E12] text-xs shadow-md">
                    <Sparkles className="w-4 h-4 text-[#0E0E12]" />
                  </div>
                  <div>
                    <h3 className="font-serif-lux font-bold text-sm text-white flex items-center gap-1.5">
                      <span>Đăng Ký Thành Viên VIP</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono-lux">Trải Nghiệm Độc Quyền Supercar Showroom</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content Box */}
              {isAuthenticated ? (
                <div className="bg-[#12121A] border border-[#D4AF37]/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-sm border border-[#D4AF37]/40">
                      {user?.fullName?.charAt(0) || 'VIP'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{user?.fullName}</p>
                      <p className="text-[10px] text-emerald-400 font-mono-lux flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Đã đăng ký thành viên VIP
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Chào mừng quý khách trở lại! Bạn có thể xem lịch hẹn hoặc duyệt bộ sưu tập siêu xe độc quyền ngay bây giờ.
                  </p>
                  <div className="pt-1 flex gap-2">
                    <Link
                      to="/cars"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 text-center bg-[#D4AF37] text-black py-2 rounded-lg text-xs font-bold font-mono-lux hover:bg-[#b8952b] transition-all"
                    >
                      Duyệt Bộ Sưu Tập Xe
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-[#12121A] border border-[#D4AF37]/30 rounded-xl p-4 space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-200">Nhận quyền truy cập xem bảng giá & thông số siêu xe giới hạn.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-200">Đặt lịch xem xe & lái thử VIP ưu tiên tại Showroom.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-200">Tư vấn 1:1 cùng Giám đốc & Chuyên gia Concierge.</p>
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11] text-[#070709] py-2.5 px-4 rounded-lg text-xs font-bold font-mono-lux hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/20"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Đăng Ký Tài Khoản VIP Ngay</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                    </Link>
                    <div className="text-center">
                      <span className="text-[11px] text-slate-400">Đã có tài khoản? </span>
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="text-[11px] text-[#D4AF37] underline font-semibold hover:text-white"
                      >
                        Đăng nhập
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Circular Floating Trigger Icon */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Đăng Ký Trải Nghiệm VIP Luxe Motors"
          className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-2xl relative border ${
            isOpen
              ? 'bg-[#14141C] text-[#D4AF37] border-[#D4AF37]/60'
              : 'bg-gradient-to-tr from-[#61460B] via-[#AA7C11] to-[#D4AF37] text-black border-[#F3E5AB]/60 shadow-[#D4AF37]/30'
          }`}
          title="Đăng Ký Trải Nghiệm & Thành Viên VIP"
        >
          {/* Animated Pulsing Ring */}
          <span className="absolute -inset-1 rounded-full bg-[#D4AF37]/30 animate-ping pointer-events-none" />

          {/* Icon representation */}
          <div className="w-8 h-8 rounded-full bg-[#0E0E12] text-[#D4AF37] font-black text-sm flex items-center justify-center shadow-md">
            <UserPlus className="w-4 h-4" />
          </div>
        </motion.button>
      </div>
    </>
  );
}
