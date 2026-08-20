import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  Sparkles,
  ChevronDown,
  Search,
  ShieldCheck,
  CreditCard,
  Car,
  Wrench,
  PhoneCall,
  X,
  MessageSquare,
} from 'lucide-react';

const FAQ_CATEGORIES = [
  { id: 'all', label: 'Tất Cả', icon: HelpCircle },
  { id: 'drive', label: 'Lái Thử & Giao Xe', icon: Car },
  { id: 'payment', label: 'Giá Bán & Cọc VietQR', icon: CreditCard },
  { id: 'warranty', label: 'Bảo Hành & NDA', icon: ShieldCheck },
  { id: 'service', label: 'Bespoke & Cứu Hộ', icon: Wrench },
];

const FAQS = [
  {
    id: 'q1',
    category: 'drive',
    question: 'Luxe Motors phân phối những dòng siêu xe nào và nguồn gốc có đảm bảo không?',
    answer:
      'Luxe Motors chuyên phân phối các dòng Hypercar, Supercar và SUV siêu sang chính hãng nhập khẩu nguyên chiếc từ Ferrari, Lamborghini, Rolls-Royce, Porsche, McLaren, Bentley, Aston Martin, Mercedes-Maybach. 100% xe đều có đầy đủ tờ khai hải quan, chứng nhận CO/CQ và kiểm định 150 hạng mục kỹ thuật nghiêm ngặt.',
  },
  {
    id: 'q2',
    category: 'drive',
    question: 'Dịch vụ Lái thử tận nhà (Home Concierge Test Drive) diễn ra như thế nào?',
    answer:
      'Quý khách chỉ cần truy cập trang Đặt Lịch Lái Thử (/appointment), chọn mẫu xe mong muốn và điền số điện thoại. Đội ngũ chuyên xe sàn phẳng của Luxe Motors sẽ vận chuyển siêu xe đến tận tư gia hoặc khu đô thị để Quý khách trải nghiệm thực tế.',
  },
  {
    id: 'q3',
    category: 'payment',
    question: 'Giá niêm yết trên website tính bằng tiền tệ nào và đã bao gồm thuế chưa?',
    answer:
      '100% giá bán hiển thị trên hệ thống Luxe Motors đều được niêm yết chuẩn bằng Việt Nam Đồng (VNĐ ₫), đã bao gồm thuế nhập khẩu, thuế tiêu thụ đặc biệt và thuế giá trị gia tăng (VAT) theo quy định của pháp luật.',
  },
  {
    id: 'q4',
    category: 'payment',
    question: 'Quy trình đặt cọc giữ xe trực tuyến qua Napas VietQR diễn ra thế nào?',
    answer:
      'Tại trang chi tiết xe, Quý khách nhấn "Đặt Cọc Giữ Xe", chọn tỷ lệ cọc (10%, 20% hoặc 30%). Hệ thống sẽ tạo mã QR động ngân hàng VietinBank Napas 247. Sau khi chuyển khoản thành công, hệ thống tự động khóa xe trong kho và xuất biên lai xác nhận.',
  },
  {
    id: 'q5',
    category: 'payment',
    question: 'Showroom có hỗ trợ chính sách mua xe trả góp hoặc tài chính doanh nghiệp không?',
    answer:
      'Có. Luxe Motors hợp tác cùng các ngân hàng đối tác quốc tế và hàng đầu Việt Nam (VietinBank, Techcombank, VIB, Shinhan Bank...) hỗ trợ gói vay ưu đãi lên tới 70% giá trị xe với lãi suất cố định, thẩm định hồ sơ VIP trong vòng 24 giờ.',
  },
  {
    id: 'q6',
    category: 'drive',
    question: 'Thời gian bàn giao xe sau khi hoàn tất hợp đồng đặt cọc là bao lâu?',
    answer:
      'Đối với các mẫu xe có sẵn trong kho (In-stock), Luxe Motors bàn giao ngay trong vòng 24 - 48 giờ tại Showroom hoặc vận chuyển bằng xe chuyên dụng đến tận nhà. Với phiên bản cá nhân hóa Bespoke đặt hàng nhà máy, thời gian từ 3 đến 6 tháng.',
  },
  {
    id: 'q7',
    category: 'warranty',
    question: 'Chính sách bảo hành và bảo dưỡng hậu mãi tại Luxe Motors gồm những quyền lợi gì?',
    answer:
      'Mọi siêu xe đều được hưởng chính sách Bảo Hành 05 Năm Chính Hãng, miễn phí bảo dưỡng định kỳ trong 3 năm đầu, dịch vụ cứu hộ khẩn cấp Flatbed Towing 24/7 trên toàn quốc và thẻ thành viên Câu lạc bộ Luxe VIP Club.',
  },
  {
    id: 'q8',
    category: 'warranty',
    question: 'Thông tin cá nhân và tài sản của tôi có được bảo mật tuyệt đối không?',
    answer:
      'Tuyệt đối an toàn. Luxe Motors áp dụng tiêu chuẩn bảo mật mã hóa SSL 256-bit và ký kết Thỏa thuận bảo mật thông tin (NDA) pháp lý với mọi khách hàng. Toàn bộ hình ảnh bàn giao xe chỉ được công bố khi có sự đồng ý bằng văn bản của Quý khách.',
  },
  {
    id: 'q9',
    category: 'service',
    question: 'Luxe Motors có cung cấp dịch vụ may đo cá nhân hóa (Bespoke Customization) không?',
    answer:
      'Có. Chúng tôi cung cấp dịch vụ đặt may đo Bespoke trọn gói: từ màu sơn độc bản Matte/Metallic, ốp sợi carbon khí động học, bọc da Alcantara cao cấp, thêu chữ ký/gia huy trên ghế đến hệ thống ống xả hiệu năng cao Akrapovič/Novitec.',
  },
  {
    id: 'q10',
    category: 'service',
    question: 'Nếu xe gặp sự cố kỹ thuật trên đường, tôi cần liên hệ ai để được cứu hộ khẩn cấp?',
    answer:
      'Quý khách chỉ cần bấm gọi trực tiếp Hotline VIP Cứu Hộ 24/7: 0372 950 720. Đội ngũ kỹ thuật viên chuyên trách và xe cứu hộ sàn phẳng chuyên dụng sẽ có mặt ngay lập tức để hỗ trợ Quý khách trên toàn quốc.',
  },
];

export default function FAQModal({ isOpen, onClose, onOpenChat }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState(['q1', 'q2']);

  const toggleFAQ = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFAQs = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchCategory =
        selectedCategory === 'all' || faq.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        faq.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1050] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="bg-[#0D0D12] border border-[#D4AF37]/40 rounded-t-3xl sm:rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl relative z-10 overflow-hidden font-sans"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-[#14141E] via-[#101018] to-[#14141E] border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono-lux text-[#D4AF37] uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> LUXE MOTORS FAQ CENTER
                  </span>
                  <h3 className="font-serif-lux text-lg sm:text-xl font-bold text-white">
                    Câu Hỏi <span className="lux-gradient-gold-text italic">Thường Gặp</span>
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search & Filter Categories */}
            <div className="p-4 bg-[#0A0A0F] border-b border-white/5 space-y-3 shrink-0">
              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo giá bán, cọc VietQR, bảo hành 5 năm, lái thử..."
                  className="w-full bg-[#14141A] border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:border-[#D4AF37] outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {FAQ_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono-lux flex items-center gap-1 transition-all whitespace-nowrap ${
                        isSelected
                          ? 'bg-[#D4AF37] text-black font-bold shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                          : 'bg-[#14141A] text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Questions List */}
            <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq) => {
                  const isOpenItem = openIds.includes(faq.id);
                  return (
                    <div
                      key={faq.id}
                      className={`border rounded-xl transition-all overflow-hidden ${
                        isOpenItem
                          ? 'bg-[#14141E] border-[#D4AF37]/40 shadow'
                          : 'bg-[#0E0E14] border-white/5 hover:border-white/15'
                      }`}
                    >
                      <button
                        onClick={() => toggleFAQ(faq.id)}
                        className="w-full p-3.5 text-left flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <span className="font-serif-lux text-xs sm:text-sm font-bold text-white pr-2 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" />
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                            isOpenItem ? 'rotate-180 text-[#D4AF37]' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isOpenItem && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-white/5">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-slate-500 text-xs font-mono-lux">
                  Không tìm thấy câu hỏi phù hợp với "{searchQuery}"
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="p-3.5 bg-[#09090D] border-t border-white/10 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <span className="text-[11px] text-slate-400 font-mono-lux flex items-center gap-1">
                <PhoneCall className="w-3 h-3 text-[#D4AF37]" /> Hotline: <strong className="text-white">0372 950 720</strong>
              </span>

              <div className="flex items-center gap-2">
                {onOpenChat && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenChat();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono-lux flex items-center gap-1.5 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Hỏi Trợ Lý AI Chat
                  </button>
                )}
                <a
                  href="https://id.zalo.me/account/login?continue=https%3A%2F%2Fzalo.me%2Fpc"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#0068FF] hover:bg-[#0055D4] text-white text-xs font-mono-lux font-semibold transition-all shadow-md"
                >
                  <span>Chat Zalo</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
