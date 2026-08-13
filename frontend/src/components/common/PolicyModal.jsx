import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, FileText, Award, CheckCircle2, PhoneCall } from 'lucide-react';

const POLICY_DATA = {
  privacy: {
    title: 'Chính Sách Bảo Mật Thông Tin Khách Hàng VIP',
    icon: ShieldCheck,
    subtitle: 'LuxeMotors cam kết bảo mật tuyệt đối 100% dữ liệu cá nhân & giao dịch siêu xe',
    sections: [
      {
        heading: '1. Thu Thập & Bảo Vệ Thông Tin Khách Hàng',
        content: 'Toàn bộ dữ liệu họ tên, số điện thoại, thông tin liên hệ và lịch sử xem xe/cọc xe của Quý khách được mã hóa bằng tiêu chuẩn mã hóa SSL/TLS 256-bit cao nhất. Chúng tôi cam kết tuyệt đối không bao giờ cung cấp, thương mại hóa hay tiết lộ thông tin cá nhân của Quý khách cho bất kỳ bên thứ ba nào ngoại trừ các thủ tục đăng ký quyền sở hữu xe chính chủ theo quy định pháp luật.'
      },
      {
        heading: '2. Quyền Riêng Tư Trong Trải Nghiệm Concierge',
        content: 'Các buổi lái thử tại dinh thự riêng hoặc tư vấn trực tiếp tại Showroom Flagship luôn đảm bảo không gian hoàn toàn riêng tư. Đội ngũ trợ lý Concierge và tài xế đều ký thỏa thuận bảo mật NDA trước khi phục vụ Quý khách.'
      },
      {
        heading: '3. Bảo Mật Giao Dịch Đặt Cọc & Thanh Toán',
        content: 'Thông tin tài khoản ngân hàng, hóa đơn cọc xe và hợp đồng ủy quyền được lưu trữ trên hệ thống máy chủ chứng nhận ISO/IEC 27001, đảm bảo tính pháp lý và an toàn tài chính tuyệt đối.'
      }
    ]
  },
  terms: {
    title: 'Điều Khoản & Điều Kiện Dịch Vụ Showroom',
    icon: FileText,
    subtitle: 'Quy định pháp lý và quy trình phục vụ chuẩn mực 5 sao tại LuxeMotors',
    sections: [
      {
        heading: '1. Quy Trình Đặt Cọc & Giữ Xe',
        content: 'Khi Quý khách xác nhận đặt cọc giữ siêu xe (tối thiểu 10% - 20% giá trị hợp đồng), số khung (VIN) và chiếc xe được chọn sẽ lập tức khóa trực tiếp trên kho hệ thống toàn cầu của LuxeMotors. Xe sẽ không được giới thiệu hay chạy thử cho bất kỳ khách hàng nào khác.'
      },
      {
        heading: '2. Đăng Ký Lái Thử Tận Nhà (Concierge Test Drive)',
        content: 'Dịch vụ vận chuyển xe bằng xe lồng chuyên dụng đến tận dinh thự khách hàng phục vụ 24/7. Khách hàng tham gia lái thử cần sở hữu giấy phép lái xe hợp lệ còn hiệu lực.'
      },
      {
        heading: '3. Bàn Giao Xe & Đăng Ký Chính Chủ',
        content: 'LuxeMotors hỗ trợ trọn gói thủ tục nộp thuế trước bạ, đăng ký biển số VIP/đẹp, lắp đặt phụ kiện độc quyền và vận chuyển giao xe tận nhà bằng lễ bàn giao phủ khăn nhung cao cấp.'
      }
    ]
  },
  warranty: {
    title: 'Chính Sách Bảo Hành & Bảo Dưỡng Đặc Quyền 5 Năm',
    icon: Award,
    subtitle: 'Tiêu chuẩn chăm sóc kỹ thuật toàn cầu dành riêng cho Hypercar & Supercar',
    sections: [
      {
        heading: '1. Gói Bảo Hành Chính Hãng 5 Năm Toàn Cầu',
        content: 'Mọi siêu xe xuất xưởng từ LuxeMotors đều đi kèm gói bảo hành chính hãng 5 năm không giới hạn km. Toàn bộ phụ tùng thay thế 100% nhập khẩu trực tiếp từ nhà máy sản xuất (Maranello - Ý, Sant\'Agata Bolognese - Ý, Goodwood - Anh Quốc).'
      },
      {
        heading: '2. Xe Cứu Hộ Chuyên Dụng 24/7 VIP Rescue',
        content: 'Trường hợp xảy ra sự cố kỹ thuật trên đường, đội ngũ kỹ sư và xe lồng cứu hộ sàn thủy lực 24/7 của LuxeMotors sẽ xuất phát hỗ trợ Quý khách trong vòng 30 phút.'
      },
      {
        heading: '3. Bảo Dưỡng Định Kỳ Tại Dinh Thự',
        content: 'Chuyên viên kỹ thuật trang bị máy chẩn đoán chính hãng có thể tới tận garage nhà Quý khách để thực hiện kiểm tra tổng thể 120 điểm kỹ thuật và bảo dưỡng định kỳ.'
      }
    ]
  }
};

export default function PolicyModal({ isOpen, onClose, policyType = 'privacy' }) {
  const [activeTab, setActiveTab] = useState(policyType);

  if (!isOpen) return null;

  const currentPolicy = POLICY_DATA[activeTab] || POLICY_DATA.privacy;
  const Icon = currentPolicy.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#0E0E12] border border-[#D4AF37]/40 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Modal Header */}
          <div className="p-6 border-b border-white/10 flex items-start justify-between bg-[#14141C] relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono-lux text-[#D4AF37] uppercase tracking-widest block">
                  LUXE MOTORS OFFICIAL POLICY
                </span>
                <h3 className="font-serif-lux text-xl sm:text-2xl font-bold text-white mt-0.5">
                  {currentPolicy.title}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/10 bg-[#09090D] px-6 gap-2 overflow-x-auto">
            {[
              { id: 'privacy', label: 'Bảo Mật Thông Tin', icon: ShieldCheck },
              { id: 'terms', label: 'Điều Khoản Dịch Vụ', icon: FileText },
              { id: 'warranty', label: 'Bảo Hành & Bảo Dưỡng', icon: Award },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-mono-lux uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-[#D4AF37] border-[#D4AF37] font-bold bg-[#D4AF37]/5'
                      : 'text-slate-400 border-transparent hover:text-slate-200'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Policy Body */}
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 text-slate-300">
            <p className="text-xs text-[#D4AF37] font-mono-lux italic border-l-2 border-[#D4AF37] pl-3 py-1 bg-[#D4AF37]/5">
              {currentPolicy.subtitle}
            </p>

            {currentPolicy.sections.map((sec, idx) => (
              <div key={idx} className="space-y-2 bg-[#14141C] p-4 rounded-lg border border-white/5">
                <h4 className="font-serif-lux text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  {sec.heading}
                </h4>
                <p className="text-xs leading-relaxed text-slate-300 font-sans">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-white/10 bg-[#09090D] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-lux">
            <div className="flex items-center gap-2 text-slate-400">
              <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Hỗ trợ VIP 24/7 Hotline: <strong className="text-white">0372 950 720</strong></span>
            </div>
            <button
              onClick={onClose}
              className="btn-lux-gold px-6 py-2 text-xs font-bold"
            >
              Tôi Đã Hiểu &amp; Đóng
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
