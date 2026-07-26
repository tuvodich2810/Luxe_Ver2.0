import { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader  from '@/components/admin/AdminHeader';
import DataTable    from '@/components/admin/DataTable';
import Badge        from '@/components/common/Badge';
import { useAuth }  from '@/context/AuthContext';
import api from '@/services/api';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users,     setUsers]     = useState([]);
  const [meta,      setMeta]      = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search,    setSearch]    = useState('');
  const [actionId,  setActionId]  = useState(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = search ? { search } : {};
      const res = await api.get('/users', { params });
      setUsers(res.data || []);
      setMeta(res.meta);
    } catch { setUsers([]); }
    finally  { setIsLoading(false); }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 400);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleToggleRole = async (u) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`${newRole === 'admin' ? 'Cấp' : 'Thu hồi'} quyền Admin của "${u.fullName}"?`)) return;
    setActionId(u._id);
    try {
      await api.put(`/users/${u._id}/role`, { role: newRole });
      setUsers(prev => prev.map(x => x._id === u._id ? { ...x, role: newRole } : x));
    } catch (e) { alert(e.message || 'Cập nhật thất bại'); }
    finally { setActionId(null); }
  };

  const handleToggleStatus = async (u) => {
    const newStatus = !u.isActive;
    if (!window.confirm(`${newStatus ? 'Mở khóa' : 'Khóa'} tài khoản "${u.fullName}"?`)) return;
    setActionId(u._id);
    try {
      await api.put(`/users/${u._id}/status`, { isActive: newStatus });
      setUsers(prev => prev.map(x => x._id === u._id ? { ...x, isActive: newStatus } : x));
    } catch (e) { alert(e.message || 'Cập nhật thất bại'); }
    finally { setActionId(null); }
  };

  const handleDelete = async (u) => {
    if (!window.confirm(`Xóa tài khoản "${u.fullName}"? Không thể hoàn tác.`)) return;
    setActionId(u._id);
    try {
      await api.delete(`/users/${u._id}`);
      setUsers(prev => prev.filter(x => x._id !== u._id));
    } catch (e) { alert(e.message || 'Xóa thất bại'); }
    finally { setActionId(null); }
  };

  const columns = [
    { key:'fullName', label:'Họ tên',
      render:u => <span style={{color:'var(--white)',fontSize:13}}>{u.fullName}</span> },
    { key:'email',    label:'Email'     },
    { key:'phone',    label:'SĐT',       render:u => u.phone || '—' },
    { key:'role',     label:'Vai trò',
      render:u => (
        <Badge variant={u.role === 'admin' ? 'gold' : 'default'}>{u.role}</Badge>
      ),
    },
    { key:'isActive', label:'Trạng thái',
      render:u => (
        <span style={{ fontSize:13, color: u.isActive ? '#34D399' : '#F87171' }}>
          {u.isActive ? 'Hoạt động' : 'Đã khóa'}
        </span>
      ),
    },
    { key:'createdAt', label:'Ngày tham gia',
      render:u => new Date(u.createdAt).toLocaleDateString('vi-VN'),
    },
  ];

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--black)' }}>
      <AdminSidebar />
      <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
        <AdminHeader title="Quản lý người dùng" />
        <main style={{ padding:'28px 32px', flex:1 }}>

          {/* Toolbar */}
          <div style={{
            display:'flex', alignItems:'center',
            justifyContent:'space-between',
            marginBottom:20, gap:12,
          }}>
            <input className="lux-input-box"
              style={{ maxWidth:280 }}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm theo tên hoặc email..."
            />
            {meta && (
              <p style={{
                fontFamily:'Space Grotesk', fontSize:11,
                color:'var(--muted)', letterSpacing:'0.1em', whiteSpace:'nowrap',
              }}>
                {meta.total} người dùng
              </p>
            )}
          </div>

          <DataTable
            columns={columns}
            data={users}
            isLoading={isLoading}
            emptyMessage="Không tìm thấy người dùng nào"
            actions={u => {
              const isSelf       = u._id === currentUser?._id;
              const isProcessing = actionId === u._id;

              if (isSelf) return (
                <span style={{
                  fontFamily:'Space Grotesk', fontSize:9,
                  color:'var(--muted)', letterSpacing:'0.1em',
                }}>
                  Tài khoản của bạn
                </span>
              );

              return (
                <>
                  <button
                    onClick={() => handleToggleRole(u)}
                    disabled={isProcessing}
                    className="btn btn-outline-gold btn-sm">
                    {u.role === 'admin' ? 'Hạ quyền' : 'Cấp Admin'}
                  </button>
                  <button
                    onClick={() => handleToggleStatus(u)}
                    disabled={isProcessing}
                    className="btn btn-outline btn-sm">
                    {u.isActive ? 'Khóa' : 'Mở khóa'}
                  </button>
                  <button
                    onClick={() => handleDelete(u)}
                    disabled={isProcessing}
                    className="btn btn-danger btn-sm">
                    Xóa
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