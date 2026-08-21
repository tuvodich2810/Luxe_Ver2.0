import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { sendContactForm } from '@/services/sheetsService';
import { sendMessage as sendChatMessage } from '@/services/chatService';
import FAQModal from './FAQModal';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  PhoneCall,
  Bot,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

/* ─── Quick reply suggestions ────────────────── */
const QUICK_REPLIES = [
  { label: '🏎️ Giá Ferrari & Lamborghini 2026', text: 'Cho tôi biết danh sách và giá lăn bánh của siêu xe Ferrari và Lamborghini đang có sẵn tại showroom?' },
  { label: '📝 Đặt Lịch Lái Thử Tận Nhà', text: 'Tôi muốn đăng ký lịch lái thử siêu xe riêng tại nhà (Home Concierge Test Drive).' },
  { label: '💳 Quy Trình Đặt Cọc VietQR', text: 'Quy trình đặt cọc giữ xe trực tuyến và bảo đảm thanh toán qua PayOS VietQR thế nào?' },
  { label: '✨ May Đo Bespoke & Bảo Hành 5 Năm', text: 'Chính sách may đo cá nhân hóa Bespoke và gói bảo dưỡng 5 sao của showroom?' },
];

export default function Chatbot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
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

  /* Hàm phản hồi thông minh Offline khi chưa kết nối Backend */
  const getOfflineConciergeReply = (userText) => {
    const q = (userText || '').toLowerCase();

    if (q.includes('ferrari') || q.includes('sf90') || q.includes('f8') || q.includes('roma') || q.includes('296')) {
      return `Tại Luxe Motors, chúng tôi đang có sẵn siêu phẩm **Ferrari SF90 Stradale 2026** (1.000 HP, Động cơ V8 Twin-Turbo Plug-in Hybrid) với giá niêm yết **34.500.000.000 VNĐ**.\n\nNgoài ra showroom hỗ trợ nhập khẩu may đo Bespoke cho các dòng **Ferrari 296 GTB, 812 GTS, Roma Spider** theo yêu cầu.\n\nQuý khách vui lòng để lại Số điện thoại hoặc truy cập /contact để nhận tư vấn riêng ạ!`;
    }

    if (q.includes('lamborghini') || q.includes('urus') || q.includes('revuelto') || q.includes('huracan') || q.includes('aventador')) {
      return `Bộ sưu tập **Lamborghini** đẳng cấp tại Luxe Motors:\n- **Lamborghini Revuelto V12 HPEV** (1.015 HP): Giá từ ~**45.000.000.000 VNĐ**\n- **Lamborghini Urus Performante** (666 HP): Giá từ ~**18.500.000.000 VNĐ**\n\nShowroom hỗ trợ đặt lịch lái thử tận nơi (Home Concierge Test Drive) và may đo nội thất cá nhân hóa. Quý khách vui lòng để lại SĐT hoặc truy cập /contact nhé!`;
    }

    if (q.includes('rolls') || q.includes('royce') || q.includes('phantom') || q.includes('ghost') || q.includes('cullinan')) {
      return `Bộ sưu tập **Rolls-Royce** tại Luxe Motors:\n- **Rolls-Royce Phantom Series II** (V12 6.75L Twin-Turbo): Giá từ **75.000.000.000 VNĐ**\n- **Rolls-Royce Cullinan Black Badge**\n- **Rolls-Royce Ghost Extended**\n\nXe đi kèm gói bảo hành 5 năm chính hãng và dịch vụ bảo dưỡng tận nhà 24/7. Quý khách vui lòng để lại Họ tên & SĐT để Concierge liên hệ trực tiếp ạ!`;
    }

    if (q.includes('porsche') || q.includes('911') || q.includes('gt3') || q.includes('taycan') || q.includes('panamera')) {
      return `Dòng xe **Porsche** tại Luxe Motors:\n- **Porsche 911 GT3 RS 2026** (525 HP, N/A 4.0L): Giá từ **19.800.000.000 VNĐ**\n- **Porsche Taycan Turbo S / 911 Turbo S**\n\nXe có sẵn giao ngay, hỗ trợ làm thủ tục bấm biển số VIP và giao xe tận nhà trên toàn quốc. Quý khách để lại SĐT hoặc liên hệ /contact để được hỗ trợ tốt nhất!`;
    }

    if (q.includes('giá') || q.includes('bảng giá') || q.includes('bao nhiêu') || q.includes('chi phí') || q.includes('lăn bánh') || q.includes('tiền')) {
      return `Bảng giá một số dòng siêu xe tiêu biểu tại Luxe Motors:\n- **Ferrari SF90 Stradale**: 34.500.000.000 VNĐ\n- **Lamborghini Revuelto**: 45.000.000.000 VNĐ\n- **Rolls-Royce Phantom VIII**: 75.000.000.000 VNĐ\n- **Porsche 911 GT3 RS**: 19.800.000.000 VNĐ\n\nQuý khách có thể xem đầy đủ hơn tại mục /cars hoặc gọi Hotline **0372 950 720** để nhận báo giá lăn bánh chi tiết!`;
    }

    if (q.includes('lái thử') || q.includes('đặt lịch') || q.includes('test drive') || q.includes('hẹn') || q.includes('xem xe')) {
      return `Dịch vụ **Lái Thử Tận Nhà (Home Concierge Test Drive)** của Luxe Motors mang siêu xe đến tận cửa nhà hoặc biệt thự của quý khách kèm chuyên viên hướng dẫn kỹ thuật 1-kèm-1.\n\nQuý khách vui lòng để lại **Họ Tên & Số Điện Thoại** tại đây hoặc điền form tại /contact, chuyên viên Concierge sẽ xác nhận lịch trong vòng 15 phút!`;
    }

    if (q.includes('cọc') || q.includes('đặt cọc') || q.includes('vietqr') || q.includes('payos') || q.includes('thanh toán')) {
      return `Chính sách đặt cọc tại Luxe Motors:\n1. Mức cọc giữ xe tiêu chuẩn: **10% - 20%** giá trị hợp đồng.\n2. Thanh toán bảo mật qua cổng **PayOS VietQR** quét mã tự động xác nhận tức thì.\n3. Hợp đồng điện tử kèm cam kết hoàn cọc 100% trong 7 ngày nếu xe không đúng mô tả.\n\nHotline hỗ trợ tài chính & hợp đồng: **0372 950 720**.`;
    }

    if (q.includes('bảo hành') || q.includes('bảo dưỡng') || q.includes('bespoke') || q.includes('chính sách')) {
      return `Chính sách đặc quyền dành cho Khách Hàng VIP Luxe Motors:\n- **Bảo hành 5 năm** không giới hạn số km.\n- **Cứu hộ chuyên dụng 24/7** bằng xe sàn trượt thủy lực trên toàn quốc.\n- May đo cá nhân hóa **Bespoke** (màu sơn độc bản, nội thất da Alcantara thêu tên riêng).\n- Phòng chờ VIP Lounge và đặc quyền tham gia CLB Siêu Xe Luxe Club.`;
    }

    if (q.includes('địa chỉ') || q.includes('ở đâu') || q.includes('showroom') || q.includes('hotline') || q.includes('liên hệ')) {
      return `Thông tin liên hệ Showroom Siêu Xe **Luxe Motors**:\n- **Địa chỉ:** 18 Lý Thường Kiệt, Q. Hoàn Kiếm, Hà Nội\n- **Hotline VIP (24/7):** 0372 950 720\n- **Email:** tuankwan2810@gmail.com\n- **Website:** /contact\n\nShowroom mở cửa đón tiếp khách VIP từ 08:30 - 21:30 hàng ngày!`;
    }

    return `Kính chào quý khách! Em là **Trợ Lý AI VIP Concierge** của Luxe Motors. 🏎️\n\nEm có thể hỗ trợ quý khách thông tin chi tiết về bộ sưu tập siêu xe **Ferrari, Lamborghini, Rolls-Royce, Porsche**, giá bán lăn bánh, đăng ký lái thử tận nơi hoặc thủ tục cọc xe trực tuyến.\n\nQuý khách quan tâm đến mẫu xe nào hoặc muốn em hỗ trợ điều gì ạ? (Hotline 24/7: **0372 950 720** hoặc /contact)`;
  };

  /* Lưu lead trực tiếp vào MongoDB Atlas ngầm & backup LocalStorage */
  const saveLeadToMongoDB = async (name, phone, interest) => {
    try {
      // Lưu offline vào LocalStorage trước
      const savedLeads = JSON.parse(localStorage.getItem('luxe_chatbot_leads') || '[]');
      savedLeads.push({ name, phone, interest, time: new Date().toISOString() });
      localStorage.setItem('luxe_chatbot_leads', JSON.stringify(savedLeads));

      await api.post('/contacts', {
        name: name || 'Khách VIP từ Chatbot',
        phone: phone || '',
        email: '',
        subject: interest || 'Đơn chốt từ AI Chatbot',
        message: `Khách hàng chốt đơn/đặt lịch qua AI Chatbot: ${interest || 'Xem xe'}`,
      });
    } catch (err) {
      console.warn('Lưu lead vào MongoDB thất bại, đã backup LocalStorage:', err?.message || err);
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
      } catch (err) {
        console.warn('Backend chat API offline, đang kích hoạt Trợ Lý Concierge dự phòng:', err?.message || err);
        const fallbackContent = getOfflineConciergeReply(userText);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: fallbackContent,
            id: Date.now() + 1,
          },
        ]);
        if (!isOpen) setUnread((n) => n + 1);
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
      {/* Cụm Phím Trợ Năng Nổi VIP Concierge Xếp Dọc (Zalo -> FAQ -> AI Chatbot) */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-[1000] flex flex-col items-center gap-2.5 sm:gap-3">
        {/* 1. NÚT CHAT ZALO VIP */}
        <motion.a
          href="https://id.zalo.me/account/login?continue=https%3A%2F%2Fzalo.me%2Fpc"
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.1, x: -3 }}
          whileTap={{ scale: 0.95 }}
          title="Mở Zalo Chat VIP (Zalo PC)"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0068FF] hover:bg-[#0055D4] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(0,104,255,0.45)] border border-white/30 transition-all relative group cursor-pointer"
        >
          {/* Subtle Ring Animation */}
          <span className="absolute inset-0 rounded-full bg-[#0068FF] opacity-30 animate-ping pointer-events-none" />

          {/* Biểu Tượng Zalo */}
          <svg viewBox="0 0 48 48" className="w-7 h-7 sm:w-8 sm:h-8 relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M24 4C12.95 4 4 12.5 4 23C4 28.6 6.8 33.6 11.2 36.9L9 44L16.6 40.8C18.9 41.6 21.4 42 24 42C35.05 42 44 33.5 44 23C44 12.5 35.05 4 24 4Z"
              fill="#0068FF"
            />
            <path
              d="M24 4C12.95 4 4 12.5 4 23C4 28.6 6.8 33.6 11.2 36.9L9 44L16.6 40.8C18.9 41.6 21.4 42 24 42C35.05 42 44 33.5 44 23C44 12.5 35.05 4 24 4Z"
              stroke="white"
              strokeWidth="1.2"
            />
            <text
              x="50%"
              y="56%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#FFFFFF"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="900"
              fontSize="12.5px"
              letterSpacing="-0.3px"
            >
              Zalo
            </text>
          </svg>

          {/* Tooltip Hover Hiện Bên Trái */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-[#0A0A0F] border border-white/20 text-[10px] font-mono-lux text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl">
            Chat Zalo (Zalo PC)
          </span>
        </motion.a>

        {/* 2. NÚT CÂU HỎI THƯỜNG GẶP (FAQ MODAL) */}
        <motion.button
          onClick={() => setIsFAQOpen(true)}
          whileHover={{ scale: 1.1, x: -3 }}
          whileTap={{ scale: 0.95 }}
          title="Xem Câu Hỏi Thường Gặp (FAQ)"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#12121C] hover:bg-[#1A1A28] text-[#D4AF37] border border-[#D4AF37]/50 flex items-center justify-center shadow-[0_4px_20px_rgba(212,175,55,0.2)] transition-all relative group cursor-pointer"
        >
          <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 text-[#D4AF37]" />
          <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-[#D4AF37] text-black text-[9px] font-mono-lux font-black rounded-full shadow">
            FAQ
          </span>

          {/* Tooltip Hover Hiện Bên Trái */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-[#0A0A0F] border border-white/20 text-[10px] font-mono-lux text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl">
            Câu Hỏi Thường Gặp (FAQ)
          </span>
        </motion.button>

        {/* 3. NÚT AI CHATBOT VIP CONCIERGE (HÌNH 2) */}
        <motion.button
          onClick={() => setIsOpen((v) => !v)}
          whileHover={{ scale: 1.1, x: -3 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Mở chatbot tư vấn VIP Concierge"
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-2xl relative group ${
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

          {/* Tooltip Hover Hiện Bên Trái */}
          {!isOpen && (
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-[#0A0A0F] border border-white/20 text-[10px] font-mono-lux text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl">
              Trợ Lý AI VIP
            </span>
          )}
        </motion.button>
      </div>

      {/* Modal Câu Hỏi Thường Gặp (FAQ Modal) */}
      <FAQModal
        isOpen={isFAQOpen}
        onClose={() => setIsFAQOpen(false)}
        onOpenChat={() => setIsOpen(true)}
      />

      {/* Main Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-4 sm:right-24 z-[999] w-[calc(100vw-32px)] sm:w-[430px] h-[600px] bg-[#0A0A0F] border border-[#D4AF37]/40 rounded-2xl flex flex-col shadow-2xl overflow-hidden font-sans backdrop-blur-2xl"
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