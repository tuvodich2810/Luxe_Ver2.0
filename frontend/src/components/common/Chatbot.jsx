import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { sendContactForm } from '@/services/sheetsService';
import { sendMessage as sendChatMessage } from '@/services/chatService';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  PhoneCall,
  Bot,
  ChevronRight,
} from 'lucide-react';

/* ─── Quick reply suggestions ────────────────── */
const QUICK_REPLIES = [
  { label: '🏎️ Giá xe Ferrari & Lamborghini', text: 'Cho tôi biết giá bán lăn bánh của xe Ferrari và Lamborghini đang có sẵn?' },
  { label: '📝 Tôi muốn đặt lịch xem xe', text: 'Tôi muốn đặt lịch đăng ký lái thử siêu xe tận nhà.' },
  { label: '💳 Thủ tục cọc & Trả góp', text: 'Chính sách đặt cọc và hỗ trợ trả góp siêu xe như thế nào?' },
  { label: '🛡️ Bảo hành & Ký gửi', text: 'Chính sách bảo hành chính hãng và thủ tục ký gửi siêu xe?' },
];

export default function Chatbot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Xin chào quý khách! Tôi là **Trợ Lý VIP Concierge** của **Luxe Motors**. 🏎️\n\nTôi có thể hỗ trợ thông tin chi tiết về bộ sưu tập siêu xe, giá lăn bánh, chính sách cọc và đặt lịch lái thử tận nơi.\n\nQuý khách quan tâm đến dịch vụ hoặc dòng siêu xe nào?',
      id: 'init',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  /* Scroll to bottom khi có tin mới */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  /* Focus input khi mở */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setUnread(0);
    }
  }, [isOpen]);

  /* Parse lead từ response của AI */
  const extractLead = useCallback((text) => {
    const match = text.match(/\[LEAD:(.*?)\]/s);
    if (!match) return null;
    try {
      return JSON.parse(match[1]);
    } catch {
      return null;
    }
  }, []);

  /* Xóa LEAD tag ẩn */
  const cleanText = (text) => text.replace(/\[LEAD:.*?\]/s, '').trim();

  /* Lưu lead trực tiếp vào MongoDB Atlas ngầm */
  const saveLeadToMongoDB = async (name, phone, interest) => {
    try {
      await api.post('/contacts', {
        name: name || 'Khách Vãng Lai từ Chatbot',
        phone: phone || '',
        email: '',
        subject: interest || 'Đơn chốt từ AI Chatbot',
        message: `Khách hàng chốt đơn/đặt lịch qua AI Chatbot: ${interest || 'Xem xe'}`,
      });
    } catch (err) {
      console.error('Lỗi tự động lưu lead từ Chatbot:', err);
    }
  };

  /* Gửi message */
  const sendMessage = useCallback(
    async (text) => {
      const userText = (text || input).trim();
      if (!userText || loading) return;

      setInput('');
      setLoading(true);

      // Kiểm tra nếu người dùng tự gõ SĐT trong câu chat
      const phoneMatch = userText.match(/(03|05|07|08|09|02)+[0-9]{8,9}/);
      if (phoneMatch) {
        saveLeadToMongoDB('Khách VIP Chatbot', phoneMatch[0], userText);
      }

      const userMsg = { role: 'user', content: userText, id: Date.now() };
      setMessages((prev) => [...prev, userMsg]);

      try {
        const result = await sendChatMessage(userText);
        const rawResponse = result.reply;

        /* Kiểm tra có lead và validate số điện thoại */
        const lead = extractLead(rawResponse);
        if (lead?.phone) {
          saveLeadToMongoDB(lead.name || 'Khách VIP Chatbot', lead.phone, lead.interest || userText);
        }

        const displayText = cleanText(rawResponse);
        const botMsg = {
          role: 'assistant',
          content: displayText,
          id: Date.now() + 1,
        };

        setMessages((prev) => [...prev, botMsg]);

        if (!isOpen) setUnread((n) => n + 1);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'Xin lỗi quý khách, kết nối hiện đang gián đoạn. Vui lòng truy cập **trang liên hệ** của chúng tôi hoặc gọi Hotline **0372 950 720** để được hỗ trợ.',
            id: Date.now() + 1,
            isError: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, isOpen, extractLead]
  );

  /* Enter to send */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderFormattedText = (text) => {
    return text.split('\n').map((line, lineIdx) => {
      // Regex detect URL links
      const urlRegex = /(https?:\/\/[^\s]+|\/contact|\/cars)/g;
      const parts = line.split(urlRegex);

      return (
        <span key={lineIdx} className="block leading-relaxed">
          {parts.map((part, partIdx) => {
            // Any /contact path or full URL containing /contact → open in new tab
            if (
              part === '/contact' ||
              part.includes('/contact') ||
              part === 'http://localhost:5173/contact' ||
              part === 'https://luxe-ver2-0.vercel.app/contact'
            ) {
              return (
                <a
                  key={partIdx}
                  href="https://luxe-ver2-0.vercel.app/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D4AF37] font-bold underline hover:brightness-125 transition-all inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30"
                >
                  <span>luxemotors.vn/contact</span>
                </a>
              );
            }
            if (
              part === '/cars' ||
              part === 'http://localhost:5173/cars' ||
              part === 'https://luxe-ver2-0.vercel.app/cars'
            ) {
              return (
                <a
                  key={partIdx}
                  href="https://luxe-ver2-0.vercel.app/cars"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D4AF37] font-bold underline hover:brightness-125 transition-all inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30"
                >
                  <span>luxemotors.vn/cars</span>
                </a>
              );
            }
            if (part.startsWith('http://') || part.startsWith('https://')) {
              return (
                <a
                  key={partIdx}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D4AF37] font-bold underline hover:brightness-125 transition-all mx-1"
                >
                  {part}
                </a>
              );
            }

            // Bold markdown format **text**
            const boldParts = part.split(/(\*\*.*?\*\*)/g);
            return boldParts.map((subPart, subIdx) =>
              subPart.startsWith('**') && subPart.endsWith('**') ? (
                <strong key={subIdx} className="text-[#D4AF37] font-semibold">
                  {subPart.slice(2, -2)}
                </strong>
              ) : (
                subPart
              )
            );
          })}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Mở chatbot tư vấn VIP Concierge"
        className={`fixed bottom-6 right-6 z-[1000] w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-2xl ${
          isOpen
            ? 'bg-[#14141C] text-slate-300 border border-white/20'
            : 'bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#997A15] text-black shadow-[#D4AF37]/30 border border-[#D4AF37]'
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageSquare className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        {!isOpen && unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-mono-lux font-bold rounded-full flex items-center justify-center border border-black shadow"
          >
            {unread}
          </motion.span>
        )}
      </motion.button>

      {/* Main Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 sm:right-8 z-[999] w-[calc(100vw-32px)] sm:w-[430px] h-[600px] bg-[#0A0A0F] border border-[#D4AF37]/40 rounded-2xl flex flex-col shadow-2xl overflow-hidden font-sans backdrop-blur-2xl"
          >
            {/* Header section */}
            <div className="p-4 bg-gradient-to-r from-[#111118] via-[#0E0E14] to-[#111118] border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-lux font-bold text-white text-sm tracking-wide flex items-center gap-1.5">
                    LUXE MOTORS <span className="text-[#D4AF37] italic">AI CONCIERGE</span>
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono-lux text-slate-400 uppercase tracking-wider">
                      Trực tuyến 24/7
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="tel:0372950720"
                  title="Gọi Hotline VIP Concierge (0372 950 720)"
                  className="p-2 rounded bg-white/5 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#D4AF37]/30">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 items-start ${
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className="max-w-[85%] space-y-2">
                    <div
                      className={`px-4 py-3 rounded-2xl text-xs space-y-1 shadow-md ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#997A15] text-black font-medium rounded-tr-none'
                          : msg.isError
                          ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-tl-none'
                          : 'bg-[#14141E] border border-white/10 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.role === 'user' ? msg.content : renderFormattedText(msg.content)}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2.5 items-center"
                >
                  <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="px-4 py-3 bg-[#14141E] border border-white/10 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" />
                    <span
                      className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                    <span
                      className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Chips */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
                {QUICK_REPLIES.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(q.text)}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-full bg-[#151520] hover:bg-[#D4AF37] text-slate-300 hover:text-black border border-[#D4AF37]/30 text-[11px] font-mono-lux whitespace-nowrap transition-all shrink-0 flex items-center gap-1 group"
                  >
                    <span>{q.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <div className="p-3 bg-[#0F0F16] border-t border-white/10 flex items-center gap-2 shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                placeholder="Hỏi về siêu xe, giá bán, đặt lịch..."
                className="flex-1 bg-[#161622] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 transition-all"
              />

              <button
                type="button"
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-black font-bold flex items-center justify-center shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Footer Tag */}
            <div className="py-2 px-4 bg-[#0A0A0F] border-t border-white/5 text-center text-[10px] font-mono-lux text-slate-500 shrink-0 flex items-center justify-between">
              <span>Luxe Motors AI Concierge</span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/contact');
                }}
                className="text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Trang Đặt Lịch Contact</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}