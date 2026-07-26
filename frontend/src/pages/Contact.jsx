import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar  from '@/components/common/Navbar';
import Footer  from '@/components/common/Footer';
import Button  from '@/components/common/Button';
import { sendContactForm } from '@/services/sheetsService';

const CheckIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor"
    strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
  </svg>
);

export default function Contact() {
  const [form,    setForm]    = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await sendContactForm(form);
    setLoading(false);
    setDone(true);
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, background: 'var(--black)', minHeight: '100vh' }}>

        {/* Hero */}
        <section style={{ padding: '72px 0 56px', borderBottom: '1px solid var(--border)' }}>
          <div className="lux-container">
            <motion.p className="eyebrow mb-4"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              Liên hệ
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                fontFamily: 'Cormorant Garamond',
                fontSize: 'clamp(2.5rem,6vw,5rem)',
                fontWeight: 300, lineHeight: 0.95,
                color: 'var(--white)', maxWidth: 700,
              }}>
              Hãy để chúng tôi{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>đồng hành</em>{' '}
              cùng bạn
            </motion.h1>
          </div>
        </section>

        {/* Content */}
        <section className="lux-container" style={{ padding: '64px 40px 96px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>

            {/* Info cards */}
            <div>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: 1, background: 'var(--border)', marginBottom: 48,
              }}>
                {[
                  { l: 'Hotline',      v: '+84 (90) 123 4567',              href: 'tel:+84901234567'           },
                  { l: 'Email',        v: 'hello@luxemotors.vn',            href: 'mailto:hello@luxemotors.vn' },
                  { l: 'Showroom',     v: '268 Trần Hưng Đạo, Q.1, TP.HCM', href: null },
                  { l: 'Giờ làm việc',v: 'Thứ 2 – CN: 9:00 – 19:00',      href: null },
                ].map(({ l, v, href }) => (
                  <div key={l} style={{ background: 'var(--card)', padding: '28px 24px' }}>
                    <p className="eyebrow text-lux-muted mb-2" style={{ fontSize: 8 }}>{l}</p>
                    {href ? (
                      <a href={href}
                        style={{ fontSize: 14, fontWeight: 300, color: 'var(--white)' }}
                        className="hover:text-lux-gold transition-colors">
                        {v}
                      </a>
                    ) : (
                      <p style={{ fontSize: 14, fontWeight: 300, color: 'var(--white)' }}>{v}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div style={{
                height: 240, background: 'var(--card)',
                border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <p className="eyebrow text-lux-muted" style={{ fontSize: 9 }}>
                  Bản đồ showroom
                </p>
              </div>
            </div>

            {/* Form */}
            {!done ? (
              <form onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label className="lux-label">Họ và tên *</label>
                  <input className="lux-input" required
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label className="lux-label">Email *</label>
                    <input className="lux-input" type="email" required
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      placeholder="email@domain.com"
                    />
                  </div>
                  <div>
                    <label className="lux-label">Số điện thoại</label>
                    <input className="lux-input" type="tel"
                      value={form.phone}
                      onChange={e => set('phone', e.target.value)}
                      placeholder="0901 234 567"
                    />
                  </div>
                </div>
                <div>
                  <label className="lux-label">Nội dung *</label>
                  <textarea className="lux-textarea lux-input" required rows={6}
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    placeholder="Câu hỏi hoặc yêu cầu của bạn..."
                  />
                </div>
                <Button type="submit" variant="primary" size="lg" full loading={loading}>
                  Gửi liên hệ
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(201,169,110,0.25)',
                  background: 'rgba(201,169,110,0.04)',
                  padding: 48, textAlign: 'center',
                }}>
                <div style={{
                  width: 52, height: 52,
                  border: '1px solid var(--gold)',
                  background: 'rgba(201,169,110,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--gold)', marginBottom: 20,
                }}>
                  <CheckIcon />
                </div>
                <p className="eyebrow mb-3">Đã gửi thành công</p>
                <p style={{
                  fontSize: 14, color: 'var(--silver)',
                  fontWeight: 300, lineHeight: 1.7,
                }}>
                  Chúng tôi đã nhận được liên hệ của bạn<br/>
                  và sẽ phản hồi trong thời gian sớm nhất.
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}