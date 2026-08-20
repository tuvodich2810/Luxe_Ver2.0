import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, X, ExternalLink, ShieldCheck } from 'lucide-react';

export default function ZaloWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '0372950720';
  const displayPhone = '0372 950 720';
  const zaloUrl = 'https://id.zalo.me/account/login?continue=https%3A%2F%2Fzalo.me%2Fpc';

  return (
    <>
      {/* Floating Zalo Container — Placed right next to Chatbot (right-24) */}
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
                  <div className="w-8 h-8 rounded-full bg-[#0068FF] flex items-center justify-center font-black text-white text-xs shadow-md">
                    Z
                  </div>
                  <div>
                    <h3 className="font-serif-lux font-bold text-sm text-white flex items-center gap-1.5">
                      <span>Quang Tuấn</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono-lux">Tư Vấn VIP Supercar &amp; Concierge</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* QR Code Card Display */}
              <div className="bg-[#12121A] border border-[#D4AF37]/30 rounded-xl p-4 flex flex-col items-center space-y-3 shadow-inner">
                <div className="relative group">
                  <img
                    src="/zalo-qr.png"
                    alt="Mã QR Zalo Quang Tuấn 0372950720"
                    className="w-52 sm:w-60 h-auto rounded-lg shadow-lg border border-white/20 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center pointer-events-none">
                    <span className="text-[11px] font-mono-lux text-white bg-black/80 px-2.5 py-1 rounded border border-[#D4AF37]/50">
                      Mở Zalo Quét QR
                    </span>
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <p className="text-xs font-mono-lux text-[#D4AF37] font-bold">
                    Hotline / Zalo: {displayPhone}
                  </p>
                  <p className="text-[11px] text-slate-300 font-mono-lux">
                    Email: <a href="mailto:luxemotor001@gmail.com" className="text-amber-300 underline">luxemotor001@gmail.com</a>
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Mở ứng dụng Zalo bấm nút Quét QR để kết bạn trực tiếp
                  </p>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 bg-[#0068FF] hover:bg-[#0052cc] text-white py-2.5 px-3 rounded-lg text-xs font-bold font-mono-lux transition-all shadow-lg hover:shadow-blue-500/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat Zalo</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                </a>

                <a
                  href={`tel:${phoneNumber}`}
                  className="flex items-center justify-center gap-1.5 bg-[#D4AF37] hover:bg-[#b8952b] text-black py-2.5 px-3 rounded-lg text-xs font-bold font-mono-lux transition-all shadow-lg hover:shadow-amber-500/20"
                >
                  <Phone className="w-4 h-4" />
                  <span>Gọi {displayPhone}</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Circular Floating Trigger Icon (Matching Hình 2 & Placed right next to Chatbot) */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Liên hệ Zalo Quang Tuấn 0372950720"
          className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-2xl relative border ${
            isOpen
              ? 'bg-[#14141C] text-blue-400 border-blue-500/40'
              : 'bg-gradient-to-tr from-[#0052CC] via-[#0068FF] to-[#0084FF] text-white border-blue-400/50 shadow-blue-500/30'
          }`}
          title="Chat Zalo & Quét QR (Quang Tuấn - 0372.950.720)"
        >
          {/* Animated Pulsing Ring */}
          <span className="absolute -inset-1 rounded-full bg-blue-500/30 animate-ping pointer-events-none" />

          {/* Icon representation matching Zalo circle */}
          <div className="w-8 h-8 rounded-full bg-white text-[#0068FF] font-black text-sm flex items-center justify-center shadow-md font-sans">
            Z
          </div>
        </motion.button>
      </div>
    </>
  );
}
