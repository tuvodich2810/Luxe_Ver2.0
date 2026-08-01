import { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader  from '@/components/admin/AdminHeader';
import DataTable    from '@/components/admin/DataTable';
import Badge        from '@/components/common/Badge';
import api from '@/services/api';

const STATUS_CFG = {
  pending:   { l:'Chờ xử lý',    v:'used'       },
  confirmed: { l:'Đã xác nhận',  v:'certified'  },
  completed: { l:'Hoàn thành',   v:'new'        },
  cancelled: { l:'Đã hủy',       v:'danger'     },
};

const FILTER_TABS = [
  { v:'',          l:'Tất cả'      },
  { v:'pending',   l:'Chờ xử lý'  },
  { v:'confirmed', l:'Đã xác nhận'},
  { v:'completed', l:'Hoàn thành' },
  { v:'cancelled', l:'Đã hủy'     },
];

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [actionId,     setActionId]     = useState(null);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = filterStatus ? { status: filterStatus } : {};
      const res = await api.get('/appointments', { params });
      setAppointments(res.data || []);
    } catch { setAppointments([]); }
    finally  { setIsLoading(false); }
  }, [filterStatus]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const handleUpdateStatus = async (id, status) => {
    setActionId(id);
    try {
      await api.put(`/appointments/${id}`, { status });
      setAppointments(prev =>
        prev.map(a => a._id === id ? { ...a, status } : a)
      );
    } catch (e) { alert(e.message || 'Cập nhật thất bại'); }
    finally { setActionId(null); }
  };

  const columns = [
    { key:'visitorName',     label:'Khách hàng'  },
    { key:'visitorPhone',    label:'SĐT'         },
    {
      key:'car', label:'Xe',
      render: a => a.car?.name || '—',
    },
    {
      key:'appointmentDate', label:'Ngày hẹn',
      render: a => new Date(a.appointmentDate).toLocaleDateString('vi-VN'),
    },
    { key:'timeSlot', label:'Giờ' },
    {
      key:'status', label:'Trạng thái',
      render: a => (
        <Badge variant={STATUS_CFG[a.status]?.v || 'default'}>
          {STATUS_CFG[a.status]?.l || a.status}
        </Badge>
      ),
    },
  ];

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--black)' }}>
      <AdminSidebar />
      <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
        <AdminHeader title="Lịch hẹn xem xe" />
        <main style={{ padding:'28px 32px', flex:1 }}>

          {/* Filter tabs */}
          <div style={{ display:'flex', gap:20, marginBottom:20, flexWrap:'wrap' }}>
            {FILTER_TABS.map(tab => (
              <button key={tab.v}
                onClick={() => setFilterStatus(tab.v)}
                className={`btn btn-sm
                  ${filterStatus === tab.v ? 'btn-primary' : 'btn-outline'}`}>
                {tab.l}
              </button>
            ))}
          </div>

          <DataTable
            columns={columns}
            data={appointments}
            isLoading={isLoading}
            emptyMessage="Chưa có lịch hẹn nào"
            actions={appt => {
              const isProcessing = actionId === appt._id;
              if (appt.status === 'pending') return (
                <>
                  <button
                    onClick={() => handleUpdateStatus(appt._id, 'confirmed')}
                    disabled={isProcessing}
                    className="btn btn-outline-gold btn-sm">
                    Xác nhận
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(appt._id, 'cancelled')}
                    disabled={isProcessing}
                    className="btn btn-danger btn-sm">
                    Hủy
                  </button>
                </>
              );
              if (appt.status === 'confirmed') return (
                <button
                  onClick={() => handleUpdateStatus(appt._id, 'completed')}
                  disabled={isProcessing}
                  className="btn btn-outline btn-sm">
                  Hoàn thành
                </button>
              );
              return (
                <span style={{
                  fontFamily:'Space Grotesk', fontSize:9,
                  color:'var(--muted)', letterSpacing:'0.1em',
                }}>
                  Đã xử lý
                </span>
              );
            }}
          />
        </main>
      </div>
    </div>
  );
}