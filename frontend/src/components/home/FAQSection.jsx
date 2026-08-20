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
} from 'lucide-react';

const FAQ_CATEGORIES = [
  { id: 'all', label: 'Tất Cả Câu Hỏi', icon: HelpCircle },
  { id: 'drive', label: 'Lái Thử & Giao Xe', icon: Car },
  { id: 'payment', label: 'Giá Bán & Cọc VietQR', icon: CreditCard },
  { id: 'warranty', label: 'Bảo Hành & Bảo Mật NDA', icon: ShieldCheck },
  { id: 'service', label: 'Bespoke & Cứu Hộ 24/7', icon: Wrench },
];

const FAQS = [
  {
    id: 'q1',
    category: 'drive',
    question: 'Luxe Motors phân phối những dòng siêu xe nào và nguồn gốc có đảm bảo không?',
    answer:
      'Luxe Motors chuyên phân phối các dòng Hypercar, Supercar và SUV siêu sang chính hãng nhập khẩu nguyên chiếc từ Ferrari, Lamborghini, Rolls-Royce, Porsche, McLaren, Bentley, Aston Martin, Mercedes-Maybach. 100% xe đều có đầy đủ tờ khai hải quan, chứng nhận CO/CQ và được kiểm định 150 hạng mục kỹ thuật nghiêm ngặt.',
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
      'Có. Luxe Motors hợp tác cùng các ngân hàng quốc tế và ngân hàng hàng đầu Việt Nam (VietinBank, Techcombank, VIB, Shinhan Bank...) hỗ trợ gói vay ưu đãi lên tới 70% giá trị xe với lãi suất cố định, thẩm định hồ sơ VIP trong vòng 24 giờ.',
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

export default function FAQSection() {
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
    <section className="py-24 bg-[#09090D] border-t border-white/5 relative">
      <div className="lux-container space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="lux-eyebrow justify-center">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="font-serif-lux text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Câu Hỏi <span className="lux-gradient-gold-text italic">Thường Gặp</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Tổng hợp giải đáp chi tiết về dịch vụ lái thử tận nơi, chính sách thanh toán VietQR, bảo hành 05 năm và cam kết bảo mật thông tin NDA.
          </p>
        </div>

        {/* Search & Categories Bar */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm câu hỏi về giá bán, cọc xe, lái thử, bảo hành 5 năm..."
              className="w-full bg-[#12121A] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-[#D4AF37] outline-none transition-all shadow-inner"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
            {FAQ_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono-lux flex items-center gap-1.5 transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#D4AF37] text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                      : 'bg-[#12121A] text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-4xl mx-auto space-y-3">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className={`border rounded-xl transition-all overflow-hidden ${
                    isOpen
                      ? 'bg-[#12121C] border-[#D4AF37]/40 shadow-lg'
                      : 'bg-[#0E0E14] border-white/5 hover:border-white/15'
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-serif-lux text-base sm:text-lg font-bold text-white pr-2 flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" />
                      {faq.question}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-slate-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[#D4AF37] bg-[#D4AF37]/10' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs font-mono-lux">
              Không tìm thấy câu hỏi nào phù hợp với từ khóa "{searchQuery}"
            </div>
          )}
        </div>

        {/* Hotline Assistance */}
        <div className="text-center pt-4">
          <p className="text-xs text-slate-400">
            Quý khách có câu hỏi riêng biệt? Kết nối trực tiếp với Chuyên viên Concierge qua{' '}
            <a
              href="tel:0372950720"
              className="text-[#D4AF37] font-bold hover:underline font-mono-lux inline-flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3" /> 0372 950 720
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
