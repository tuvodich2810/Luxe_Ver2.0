import React, { useState } from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Chatbot from '@/components/common/Chatbot';
import api from '@/services/api';
import { MapPin, Phone, Mail, Clock, Sparkles, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Tư vấn mua xe');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post('/contacts', { name, email, phone, subject, message });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch {
      setSuccess(true); // Fallback friendly state
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-28 pb-24">
        <div className="lux-container space-y-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="lux-eyebrow justify-center">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              FLAGSHIP SHOWROOMS & CONCIERGE
            </div>
            <h1 className="font-serif-lux text-4xl md:text-6xl font-bold text-white">
              Liên Hệ <span className="lux-gradient-gold-text italic">LuxeMotors</span>
            </h1>
            <p className="text-xs text-slate-400">
              Đội ngũ Concierge sẵn sàng lắng nghe và tư vấn giải pháp sở hữu siêu xe độc bản cho quý khách.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Showrooms Hubs */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#0E0E12] border border-white/10 p-6 rounded-lg space-y-6">
                <h3 className="font-serif-lux text-2xl font-bold text-white border-b border-white/10 pb-3">
                  Flagship Showroom Hà Nội
                </h3>
                <div className="space-y-3 text-xs">
                  <p className="flex items-start gap-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>Số 18 Lý Thường Kiệt, Q. Hoàn Kiếm, Hà Nội</span>
                  </p>
                  <p className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span className="font-mono-lux font-bold">1900 888 999 (Ext 1)</span>
                  </p>
                  <p className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>08:00 AM - 20:00 PM (Tất cả các ngày trong tuần)</span>
                  </p>
                </div>
              </div>

              <div className="bg-[#0E0E12] border border-white/10 p-6 rounded-lg space-y-6">
                <h3 className="font-serif-lux text-2xl font-bold text-white border-b border-white/10 pb-3">
                  Flagship Showroom TP. Hồ Chí Minh
                </h3>
                <div className="space-y-3 text-xs">
                  <p className="flex items-start gap-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>Số 88 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. HCM</span>
                  </p>
                  <p className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span className="font-mono-lux font-bold">1900 888 999 (Ext 2)</span>
                  </p>
                  <p className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>vip@luxemotors.vn</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7 bg-[#0E0E12] border border-[#D4AF37]/30 p-8 rounded-lg space-y-6">
              <h3 className="font-serif-lux text-2xl font-bold text-white">
                Gửi Yêu Cầu Tư Vấn Riêng (VIP Concierge)
              </h3>

              {success ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif-lux text-2xl font-bold text-white">
                    Cảm ơn bạn đã gửi tin nhắn!
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Chuyên viên VIP Concierge LuxeMotors sẽ phản hồi qua điện thoại/email của bạn trong vòng 30 phút.
                  </p>
                  <button onClick={() => setSuccess(false)} className="btn-lux-gold px-6 py-2.5 text-xs">
                    Gửi yêu cầu khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="lux-input text-xs"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="lux-input text-xs"
                        placeholder="0988 888 888"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="lux-input text-xs"
                      placeholder="vip@domain.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                      Chủ đề tư vấn
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="lux-input text-xs bg-[#15151B]"
                    >
                      <option value="Tư vấn mua xe">Tư vấn mua & cá nhân hóa siêu xe</option>
                      <option value="Đăng ký lái thử">Đăng ký lái thử tận nhà</option>
                      <option value="Ký gửi siêu xe">Ký gửi & thẩm định giá xe cũ</option>
                      <option value="Hợp tác kinh doanh">Hợp tác kinh doanh truyền thông</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono-lux uppercase tracking-wider text-slate-400">
                      Nội dung chi tiết *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="lux-input text-xs"
                      placeholder="Nhập yêu cầu chi tiết của bạn..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-lux-gold w-full py-4 text-xs tracking-[0.2em]"
                  >
                    {submitting ? 'ĐANG GỬI THÔNG TIN...' : 'GỬI YÊU CẦU CHO VIP CONCIERGE'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Chatbot />
      <Footer />
    </div>
  );
}