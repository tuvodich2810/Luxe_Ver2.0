import { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader  from '@/components/admin/AdminHeader';
import DataTable    from '@/components/admin/DataTable';
import Badge        from '@/components/common/Badge';
import { formatPriceShort } from '@/utils/formatPrice';
import api from '@/services/api';

const STATUS_FLOW = ['pending','confirmed','processing','delivered'];
const STATUS_CFG  = {
  pending:    { l:'Chờ xử lý',   v:'used'      },
  confirmed:  { l:'Đã xác nhận', v:'certified' },
  processing: { l:'Đang xử lý',  v:'default'   },
  delivered:  { l:'Đã giao',     v:'new'       },
  cancelled:  { l:'Đã hủy',      v:'danger'    },
};

export default function AdminOrders() {
  const [orders,      setOrders]      = useState([]);
  const [meta,        setMeta]        = useState(null);
  const [isLoading,   setIsLoading]   = useState(true);
  const [filterStatus,setFilterStatus]= useState('');
  const [updatingId,  setUpdatingId]  = useState(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = filterStatus ? { orderStatus: filterStatus } : {};
      const res = await api.get('/orders', { params });
      setOrders(res.data || []);
      setMeta(res.meta);
    } catch { setOrders([]); }
    finally  { setIsLoading(false); }
  }, [filterStatus]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleAdvance = async (order) => {
    const idx  = STATUS_FLOW.indexOf(order.orderStatus);
    const next = STATUS_FLOW[idx + 1];
    if (!next) return;
    setUpdatingId(order._id);
    try {
      await api.put(`/orders/${order._id}/status`, { orderStatus: next });
      setOrders(prev =>
        prev.map(o => o._id === order._id ? { ...o, orderStatus: next } : o)
      );
    } catch (e) { alert(e.message || 'Cập nhật thất bại'); }
    finally { setUpdatingId(null); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Hủy đơn hàng này?')) return;
    setUpdatingId(id);
    try {
      await api.put(`/orders/${id}/status`, { orderStatus: 'cancelled' });
      setOrders(prev =>
        prev.map(o => o._id === id ? { ...o, orderStatus: 'cancelled' } : o)
      );
    } catch (e) { alert(e.message || 'Hủy thất bại'); }
    finally { setUpdatingId(null); }
  };

  const FILTER_TABS = [
    { v:'', l:'Tất cả' },
    ...STATUS_FLOW.map(s => ({ v:s, l:STATUS_CFG[s].l })),
    { v:'cancelled', l:'Đã hủy' },
  ];

  const columns = [
    { key:'orderNumber', label:'Mã đơn' },
    { key:'user',  label:'Khách hàng', render:o => o.user?.fullName || '—' },
    { key:'car',   label:'Xe',         render:o => o.carSnapshot?.name || o.car?.name || '—' },
    { key:'deposit',label:'Tiền cọc',  render:o => formatPriceShort(o.depositAmount) },
    { key:'total', label:'Tổng tiền',  render:o => formatPriceShort(o.totalAmount) },
    {
      key:'status', label:'Trạng thái',
      render:o => (
        <Badge variant={STATUS_CFG[o.orderStatus]?.v || 'default'}>
          {STATUS_CFG[o.orderStatus]?.l || o.orderStatus}
        </Badge>
      ),
    },
    {
      key:'date', label:'Ngày tạo',
      render:o => new Date(o.createdAt).toLocaleDateString('vi-VN'),
    },
  ];

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--black)' }}>
      <AdminSidebar />
      <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
        <AdminHeader title="Quản lý đơn hàng" />
        <main style={{ padding:'28px 32px', flex:1 }}>

          {/* Filter + count */}
          <div style={{
            display:'flex', alignItems:'center',
            justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12,
          }}>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {FILTER_TABS.map(tab => (
                <button key={tab.v}
                  onClick={() => setFilterStatus(tab.v)}
                  className={`btn btn-sm
                    ${filterStatus === tab.v ? 'btn-primary' : 'btn-outline'}`}>
                  {tab.l}
                </button>
              ))}
            </div>
            {meta && (
              <p style={{
                fontFamily:'Space Grotesk', fontSize:11,
                color:'var(--muted)', letterSpacing:'0.1em',
              }}>
                {meta.total} đơn
              </p>
            )}
          </div>

          <DataTable
            columns={columns}
            data={orders}
            isLoading={isLoading}
            emptyMessage="Chưa có đơn hàng nào"
            actions={order => {
              const isProcessing  = updatingId === order._id;
              const isFinal       =
                order.orderStatus === 'delivered' ||
                order.orderStatus === 'cancelled';
              const currentIdx    = STATUS_FLOW.indexOf(order.orderStatus);
              const nextStatus    = STATUS_FLOW[currentIdx + 1];

              if (isFinal) return (
                <span style={{
                  fontFamily:'Space Grotesk', fontSize:9,
                  color:'var(--muted)', letterSpacing:'0.1em',
                }}>
                  Hoàn tất
                </span>
              );

              return (
                <>
                  {nextStatus && (
                    <button
                      onClick={() => handleAdvance(order)}
                      disabled={isProcessing}
                      className="btn btn-outline-gold btn-sm">
                      → {STATUS_CFG[nextStatus].l}
                    </button>
                  )}
                  <button
                    onClick={() => handleCancel(order._id)}
                    disabled={isProcessing}
                    className="btn btn-danger btn-sm">
                    Hủy
                  </button>
                </>
              );
            }}
          />
        </main>
      </div>
    </div>
  );
}