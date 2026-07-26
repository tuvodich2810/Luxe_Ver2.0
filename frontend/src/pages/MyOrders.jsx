import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar  from '@/components/common/Navbar';
import Footer  from '@/components/common/Footer';
import Badge   from '@/components/common/Badge';
import Button  from '@/components/common/Button';
import { formatPrice, formatPriceShort } from '@/utils/formatPrice';
import api from '@/services/api';

const STATUS = {
  pending:    { l: 'Chờ xác nhận', v: 'used'      },
  confirmed:  { l: 'Đã xác nhận',  v: 'certified' },
  processing: { l: 'Đang xử lý',   v: 'default'   },
  delivered:  { l: 'Đã giao xe',   v: 'new'       },
  cancelled:  { l: 'Đã hủy',       v: 'danger'    },
};

export default function MyOrders() {
  const [orders,     setOrders]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try { const r = await api.get('/orders/my'); setOrders(r.data || []); }
    catch { setOrders([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleCancel = async (id) => {
    if (!window.confirm('Hủy đơn hàng này?')) return;
    setCancelling(id);
    try {
      await api.delete(`/orders/${id}`);
      setOrders(prev => prev.map(o =>
        o._id === id ? { ...o, orderStatus: 'cancelled' } : o
      ));
    } catch (e) { alert(e.message || 'Hủy thất bại'); }
    finally { setCancelling(null); }
  };

  const canCancel = (status) => ['pending', 'confirmed'].includes(status);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, background: 'var(--black)', minHeight: '100vh' }}>

        <div style={{ padding: '48px 0 36px', borderBottom: '1px solid var(--border)' }}>
          <div className="lux-container">
            <p className="eyebrow mb-3">Lịch sử giao dịch</p>
            <h1 style={{
              fontFamily: 'Cormorant Garamond',
              fontSize: 'clamp(2rem,4vw,3rem)',
              fontWeight: 300, color: 'var(--white)',
            }}>
              Đơn hàng của tôi
            </h1>
          </div>
        </div>

        <div className="lux-container"
          style={{ padding: '40px 40px 80px', maxWidth: 900 }}>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton"
                  style={{ height: 120, background: 'var(--card)' }} />
              ))}
            </div>
          ) : orders.length > 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column',
              gap: 2, background: 'var(--border)',
            }}>
              {orders.map((o, i) => {
                const cfg = STATUS[o.orderStatus] || STATUS.pending;
                return (
                  <motion.div key={o._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    style={{
                      display: 'flex', gap: 20, padding: '24px 28px',
                      background: 'var(--black)', alignItems: 'center',
                    }}>

                    {/* Thumbnail */}
                    <div style={{
                      width: 100, height: 64,
                      background: 'var(--card)', overflow: 'hidden', flexShrink: 0,
                    }}>
                      <img
                        src={
                          o.carSnapshot?.image ||
                          o.car?.mainImage ||
                          'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=200'
                        }
                        alt={o.carSnapshot?.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'flex', alignItems: 'flex-start',
                        justifyContent: 'space-between', gap: 12, marginBottom: 8,
                      }}>
                        <div>
                          <p className="eyebrow text-lux-gold mb-1"
                            style={{ fontSize: 9 }}>
                            {o.orderNumber}
                          </p>
                          <p style={{ fontSize: 16, fontWeight: 300, color: 'var(--white)' }}>
                            {o.carSnapshot?.name || o.car?.name}
                          </p>
                        </div>
                        <Badge variant={cfg.v}>{cfg.l}</Badge>
                      </div>
                      <div style={{
                        display: 'flex', gap: 24,
                        fontSize: 12, color: 'var(--muted)',
                      }}>
                        <span>
                          Tổng:{' '}
                          <strong style={{ color: 'var(--silver)' }}>
                            {formatPriceShort(o.totalAmount)}
                          </strong>
                        </span>
                        <span>
                          Cọc:{' '}
                          <strong style={{ color: 'var(--gold)' }}>
                            {formatPrice(o.depositAmount)}
                          </strong>
                        </span>
                        <span>{new Date(o.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>

                    {/* Cancel */}
                    {canCancel(o.orderStatus) && (
                      <button
                        onClick={() => handleCancel(o._id)}
                        disabled={cancelling === o._id}
                        className="btn btn-danger btn-sm"
                        style={{ flexShrink: 0 }}>
                        {cancelling === o._id ? 'Đang hủy...' : 'Hủy đơn'}
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{
                fontFamily: 'Cormorant Garamond', fontSize: 32,
                fontWeight: 300, color: 'rgba(255,255,255,0.15)', marginBottom: 12,
              }}>
                Chưa có đơn hàng nào
              </p>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 28 }}>
                Khám phá bộ sưu tập và đặt mua chiếc xe mơ ước
              </p>
              <Link to="/cars">
                <Button variant="primary" size="md">Khám phá ngay</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}