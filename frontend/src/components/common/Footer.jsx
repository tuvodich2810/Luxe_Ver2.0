import { Link } from 'react-router-dom';

const LINKS = {
  'Bộ sưu tập': [
    { l: 'Supercar',     h: '/cars?category=supercar' },
    { l: 'SUV hạng sang',h: '/cars?category=suv'      },
    { l: 'Sedan',        h: '/cars?category=sedan'    },
    { l: 'Coupe',        h: '/cars?category=coupe'    },
  ],
  'Dịch vụ': [
    { l: 'Đặt lịch xem xe',  h: '/cars'    },
    { l: 'Tư vấn tài chính', h: '/contact' },
    { l: 'Bảo hiểm xe',      h: '/contact' },
    { l: 'Bảo hành',         h: '/contact' },
  ],
  'Công ty': [
    { l: 'Giới thiệu', h: '/about'   },
    { l: 'Liên hệ',    h: '/contact' },
    { l: 'Tuyển dụng', h: '/careers' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-lux-dark border-t border-lux-border">
      <div className="lux-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="w-6 h-6 relative flex-shrink-0">
                <div className="absolute inset-0 border border-lux-gold rotate-45" />
                <div className="absolute inset-[4px] bg-lux-gold" />
              </div>
              <span style={{
                fontFamily: 'Helvetica Neue', fontSize: 13, fontWeight: 300,
                letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--white)',
              }}>
                Luxe<span style={{ color: 'var(--gold)' }}>Motors</span>
              </span>
            </Link>
            <p className="text-lux-muted text-sm font-light leading-relaxed mb-6 max-w-xs">
              Điểm đến của những tâm hồn đam mê tốc độ và đẳng cấp.
              Showroom siêu xe hàng đầu Việt Nam.
            </p>
            <div className="space-y-2.5 text-sm text-lux-silver font-light">
              <p>268 Trần Hưng Đạo, Quận 1, TP.HCM</p>
              <a href="tel:+84901234567"
                className="block hover:text-lux-gold transition-colors">
                +84 (90) 123 4567
              </a>
              <a href="mailto:hello@luxemotors.vn"
                className="block hover:text-lux-gold transition-colors">
                hello@luxemotors.vn
              </a>
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <p className="eyebrow mb-5">{title}</p>
              <ul className="space-y-3">
                {links.map(({ l, h }) => (
                  <li key={l}>
                    <Link to={h}
                      className="text-sm text-lux-muted hover:text-lux-white
                                 transition-colors font-light">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-lux-border">
        <div className="lux-container py-5 flex flex-col sm:flex-row
                        items-center justify-between gap-3">
          <p className="eyebrow text-lux-muted" style={{ fontSize: 9 }}>
            © {new Date().getFullYear()} Luxe Motors. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Chính sách bảo mật', 'Điều khoản sử dụng'].map(t => (
              <Link key={t} to="/"
                className="eyebrow text-lux-muted hover:text-lux-silver transition-colors"
                style={{ fontSize: 9 }}>
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}