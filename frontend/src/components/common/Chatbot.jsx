import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendContactForm } from '@/services/sheetsService';
import { sendMessage as sendChatMessage } from '@/services/chatService';

/* ─── Icons ──────────────────────────────────── */
const ChatIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor"
    strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03
         8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512
         15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor"
    strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor"
    strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
  </svg>
);

const BotAvatar = () => (
  <div style={{
    width: 28, height: 28, background: 'var(--gold)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  }}>
    <svg width="14" height="14" fill="none" stroke="black"
      strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0
           0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
    </svg>
  </div>
);

/* ─── Hệ thống prompt ────────────────────────── */
const SYSTEM_PROMPT = `Bạn là trợ lý tư vấn bán xe của Luxe Motors — showroom siêu xe cao cấp hàng đầu Việt Nam.

NHIỆM VỤ:
1. Tư vấn về xe: thông số, giá cả, so sánh các dòng xe, đặc điểm nổi bật
2. Hỗ trợ đặt lịch xem xe và đặt mua xe
3. Ghi nhận thông tin khách hàng quan tâm
4. Trả lời câu hỏi về dịch vụ, bảo hành, tài chính

PHONG CÁCH:
- Lịch sự, chuyên nghiệp, ngắn gọn
- Dùng tiếng Việt tự nhiên
- Không dài dòng — tối đa 3-4 câu mỗi tin nhắn
- Đề xuất hành động cụ thể

CÁC DÒNG XE TRONG KHO (ví dụ):
- Lamborghini Urus, Huracán, Aventador SVJ
- Ferrari F8 Tributo, SF90 Stradale, Roma
- Porsche 911 GT3, Cayenne Turbo, Taycan
- McLaren 720S, Artura
- Rolls-Royce Phantom, Ghost, Cullinan
- Bentley Continental GT, Bentayga

THÔNG TIN SHOWROOM:
- Địa chỉ: 268 Trần Hưng Đạo, Quận 1, TP.HCM
- Hotline: +84 (90) 123 4567
- Giờ: Thứ 2 – Chủ nhật 9:00 – 19:00

KHI KHÁCH MUỐN ĐẶT LỊCH hoặc TƯ VẤN THÊM:
- Hỏi tên và số điện thoại để nhân viên liên hệ lại
- Sau khi có đủ tên + SĐT, xác nhận và nói đã ghi nhận

QUAN TRỌNG: Khi phát hiện khách để lại tên và SĐT trong hội thoại, hãy luôn kết thúc bằng chuỗi JSON đặc biệt này (ẩn trong response):
[LEAD:{"name":"TÊN","phone":"SĐT","interest":"MÔ TẢ NGẮN"}]`;

/* ─── Gọi Claude API ─────────────────────────── */

/* ─── Quick reply suggestions ────────────────── */
const QUICK_REPLIES = [
  'Tôi muốn xem xe Lamborghini',
  'Giá xe Porsche 911 bao nhiêu?',
  'Tôi muốn đặt lịch xem xe',
  'Có hỗ trợ trả góp không?',
  'Xe Ferrari nào đang có sẵn?',
];

/* ─── Main Chatbot Component ─────────────────── */
export default function Chatbot() {
  const [isOpen,    setIsOpen]    = useState(false);
  const [messages,  setMessages]  = useState([
    {
      role: 'assistant',
      content: 'Xin chào! Tôi là trợ lý tư vấn của **Luxe Motors**. 🏎️\n\nTôi có thể giúp bạn tìm hiểu về bộ sưu tập siêu xe, giá cả, hoặc đặt lịch xem xe trực tiếp tại showroom.\n\nBạn quan tâm đến dòng xe nào?',
      id: 'init',
    },
  ]);
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [leadSaved, setLeadSaved] = useState(false);
  const [unread,    setUnread]    = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  /* Scroll to bottom khi có tin mới */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* Focus input khi mở */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setUnread(0);
    }
  }, [isOpen]);

  /* ─── Parse lead từ response của Claude ─── */
  const extractLead = useCallback((text) => {
    const match = text.match(/\[LEAD:(.*?)\]/s);
    if (!match) return null;
    try { return JSON.parse(match[1]); }
    catch { return null; }
  }, []);

  /* ─── Xóa LEAD tag khỏi text hiển thị ─── */
  const cleanText = (text) =>
    text.replace(/\[LEAD:.*?\]/s, '').trim();

  /* ─── Gửi message ─── */
  const sendMessage = useCallback(async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    setInput('');
    setLoading(true);

    /* Thêm message của user */
    const userMsg = { role: 'user', content: userText, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);

    try {
      /* Build conversation history cho Claude (bỏ qua id) */
      const history = messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: cleanText(m.content) }));

      history.push({ role: 'user', content: userText });

      const result = await sendChatMessage(userText);

        const rawResponse = result.reply;

      /* Kiểm tra có lead không */
      const lead = extractLead(rawResponse);
      if (lead && !leadSaved) {
        setLeadSaved(true);
        /* Ghi vào Google Sheets */
        sendContactForm({
          name:     lead.name    || '',
          phone:    lead.phone   || '',
          email:    '',
          interest: lead.interest|| 'Tư vấn qua chatbot',
          message:  `Lead từ chatbot: ${lead.interest || ''}`,
        }, 'Chatbot').catch(console.error);
      }

      const displayText = cleanText(rawResponse);
      const botMsg = {
        role:    'assistant',
        content: displayText,
        id:      Date.now() + 1,
      };

      setMessages(prev => [...prev, botMsg]);

      /* Tăng unread nếu cửa sổ đang đóng */
      if (!isOpen) setUnread(n => n + 1);

    } catch {
      setMessages(prev => [...prev, {
        role:    'assistant',
        content: 'Xin lỗi, kết nối bị gián đoạn. Vui lòng thử lại hoặc gọi hotline **+84 (90) 123 4567**.',
        id:      Date.now() + 1,
        isError: true,
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, isOpen, leadSaved, extractLead]);

  /* Enter to send */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* ─── Render markdown đơn giản ─── */
  const renderText = (text) => {
    return text
      .split('\n')
      .map((line, i) => {
        /* Bold */
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <span key={i}>
            {parts.map((part, j) =>
              j % 2 === 1
                ? <strong key={j} style={{ color: 'var(--gold)', fontWeight: 500 }}>{part}</strong>
                : part
            )}
            {i < text.split('\n').length - 1 && <br />}
          </span>
        );
      });
  };

  return (
    <>
      {/* ── Toggle button ── */}
      <motion.button
        onClick={() => setIsOpen(v => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Mở chatbot tư vấn"
        style={{
          position:   'fixed',
          bottom:     32,
          right:      32,
          zIndex:     1000,
          width:      56,
          height:     56,
          background: isOpen ? 'var(--dark)' : 'var(--gold)',
          border:     `1px solid ${isOpen ? 'var(--border)' : 'var(--gold)'}`,
          display:    'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor:     'pointer',
          color:      isOpen ? 'var(--silver)' : 'var(--black)',
          transition: 'all .3s',
          boxShadow:  isOpen ? 'none' : '0 8px 32px rgba(201,169,110,0.35)',
        }}>
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0,   opacity: 1 }}
              exit={{    rotate:  90, opacity: 0 }}
              transition={{ duration: 0.2 }}>
              <CloseIcon />
            </motion.span>
          ) : (
            <motion.span key="chat"
              initial={{ rotate:  90, opacity: 0 }}
              animate={{ rotate: 0,   opacity: 1 }}
              exit={{    rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}>
              <ChatIcon />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        {!isOpen && unread > 0 && (
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            style={{
              position:   'absolute',
              top:        -6, right:  -6,
              width:      20, height: 20,
              background: '#F87171',
              borderRadius: '50%',
              fontSize:   10,
              fontFamily: 'Space Grotesk',
              color:      'white',
              display:    'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
            }}>
            {unread}
          </motion.span>
        )}
      </motion.button>

      {/* ── Chat window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position:   'fixed',
              bottom:     100,
              right:      32,
              zIndex:     999,
              width:      380,
              height:     560,
              background: 'var(--dark)',
              border:     '1px solid var(--border)',
              display:    'flex',
              flexDirection: 'column',
              boxShadow:  '0 24px 64px rgba(0,0,0,0.6)',
              overflow:   'hidden',
            }}>

            {/* Header */}
            <div style={{
              padding:       '16px 20px',
              borderBottom:  '1px solid var(--border)',
              display:       'flex',
              alignItems:    'center',
              gap:           12,
              background:    'var(--black)',
              flexShrink:    0,
            }}>
              <BotAvatar />
              <div style={{ flex: 1 }}>
                <p style={{
                  fontFamily: 'Space Grotesk', fontSize: 12,
                  fontWeight: 500, color: 'var(--white)',
                  letterSpacing: '0.05em',
                }}>
                  Luxe Motors Assistant
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                  <span style={{
                    width: 5, height: 5,
                    background: '#34D399', borderRadius: '50%',
                    animation: 'pulse 2s infinite',
                  }} />
                  <span style={{
                    fontFamily: 'Space Grotesk', fontSize: 9,
                    color: 'var(--muted)', letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}>
                    Trực tuyến
                  </span>
                </div>
              </div>
              {leadSaved && (
                <span style={{
                  fontFamily: 'Space Grotesk', fontSize: 8,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: 'var(--gold)', background: 'rgba(201,169,110,0.1)',
                  border: '1px solid rgba(201,169,110,0.25)',
                  padding: '3px 8px',
                }}>
                  Đã ghi nhận
                </span>
              )}
            </div>

            {/* Messages */}
            <div style={{
              flex:       1,
              overflowY:  'auto',
              padding:    '16px 16px 8px',
              display:    'flex',
              flexDirection: 'column',
              gap:        12,
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--gold) var(--mid)',
            }}>
              {messages.map(msg => (
                <motion.div key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    display:    'flex',
                    gap:        8,
                    alignItems: 'flex-start',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  }}>

                  {/* Avatar */}
                  {msg.role === 'assistant' && <BotAvatar />}

                  {/* Bubble */}
                  <div style={{
                    maxWidth:     '78%',
                    padding:      '10px 14px',
                    background:   msg.role === 'user'
                      ? 'var(--gold)'
                      : msg.isError
                        ? 'rgba(248,113,113,0.08)'
                        : 'var(--mid)',
                    border:       msg.role === 'assistant'
                      ? msg.isError
                        ? '1px solid rgba(248,113,113,0.2)'
                        : '1px solid var(--border)'
                      : 'none',
                    fontSize:     13,
                    fontWeight:   300,
                    lineHeight:   1.65,
                    color:        msg.role === 'user' ? 'var(--black)' : 'var(--silver)',
                    fontFamily:   'Helvetica Neue, Arial, sans-serif',
                  }}>
                    {msg.role === 'user'
                      ? msg.content
                      : renderText(msg.content)
                    }
                  </div>
                </motion.div>
              ))}

              {/* Loading dots */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <BotAvatar />
                  <div style={{
                    padding:    '12px 16px',
                    background: 'var(--mid)',
                    border:     '1px solid var(--border)',
                    display:    'flex', gap: 5, alignItems: 'center',
                  }}>
                    {[0, 1, 2].map(i => (
                      <motion.span key={i}
                        style={{
                          width: 5, height: 5,
                          background: 'var(--gold)',
                          borderRadius: '50%',
                          display: 'block',
                        }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1.2, repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            {messages.length === 1 && (
              <div style={{
                padding:    '0 16px 10px',
                display:    'flex',
                gap:        6,
                flexWrap:   'wrap',
                flexShrink: 0,
              }}>
                {QUICK_REPLIES.map(q => (
                  <button key={q}
                    onClick={() => sendMessage(q)}
                    disabled={loading}
                    style={{
                      padding:      '5px 12px',
                      background:   'transparent',
                      border:       '1px solid rgba(201,169,110,0.3)',
                      color:        'var(--gold)',
                      fontFamily:   'Space Grotesk',
                      fontSize:     9,
                      letterSpacing:'0.12em',
                      textTransform:'uppercase',
                      cursor:       'pointer',
                      transition:   'all .2s',
                      whiteSpace:   'nowrap',
                    }}
                    onMouseEnter={e => {
                      e.target.style.background = 'rgba(201,169,110,0.08)';
                      e.target.style.borderColor = 'var(--gold)';
                    }}
                    onMouseLeave={e => {
                      e.target.style.background = 'transparent';
                      e.target.style.borderColor = 'rgba(201,169,110,0.3)';
                    }}>
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input area */}
            <div style={{
              padding:      '12px 16px',
              borderTop:    '1px solid var(--border)',
              display:      'flex',
              gap:          10,
              alignItems:   'flex-end',
              background:   'var(--black)',
              flexShrink:   0,
            }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                placeholder="Nhập câu hỏi của bạn..."
                rows={1}
                style={{
                  flex:          1,
                  background:    'var(--mid)',
                  border:        '1px solid var(--border)',
                  color:         'var(--white)',
                  fontFamily:    'Helvetica Neue, Arial, sans-serif',
                  fontSize:      13,
                  fontWeight:    300,
                  padding:       '10px 14px',
                  resize:        'none',
                  outline:       'none',
                  lineHeight:    1.5,
                  maxHeight:     100,
                  overflow:      'auto',
                  transition:    'border-color .25s',
                  borderRadius:  0,
                }}
                onFocus={e  => { e.target.style.borderColor = 'rgba(201,169,110,0.5)'; }}
                onBlur={e   => { e.target.style.borderColor = 'var(--border)'; }}
                onInput={e  => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
                }}
              />
              <motion.button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                whileTap={{ scale: 0.9 }}
                style={{
                  width:      40,
                  height:     40,
                  background: input.trim() && !loading ? 'var(--gold)' : 'var(--mid)',
                  border:     `1px solid ${input.trim() && !loading ? 'var(--gold)' : 'var(--border)'}`,
                  display:    'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor:     input.trim() && !loading ? 'pointer' : 'not-allowed',
                  color:      input.trim() && !loading ? 'var(--black)' : 'var(--muted)',
                  transition: 'all .25s',
                  flexShrink: 0,
                }}>
                <SendIcon />
              </motion.button>
            </div>

            {/* Footer note */}
            <div style={{
              padding:    '6px 16px 10px',
              background: 'var(--black)',
              flexShrink: 0,
            }}>
              <p style={{
                fontFamily:    'Space Grotesk',
                fontSize:      8,
                color:         'var(--muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textAlign:     'center',
              }}>
                Powered by Claude AI · Luxe Motors © 2024
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse animation cho status dot */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </>
  );
}