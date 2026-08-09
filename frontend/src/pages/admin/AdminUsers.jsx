import { useState, useEffect, useCallback, useMemo } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { ROLES_CONFIG, PERMISSION_ITEMS } from '@/config/rolesConfig';
import {
  Search,
  ShieldCheck,
  UserCheck,
  Trash2,
  Crown,
  Briefcase,
  ShoppingBag,
  Headphones,
  User,
  CheckCircle2,
  XCircle,
  Award,
  Users,
  Settings,
  Filter,
} from 'lucide-react';

const ROLE_ICONS = {
  admin: Crown,
  giam_doc: Briefcase,
  quan_ly: UserCheck,
  sales: ShoppingBag,
  cskh: Headphones,
  user: User,
};

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'matrix'
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [actionId, setActionId] = useState(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = search ? { search } : {};
      const res = await api.get('/users', { params });
      setUsers(res.data || res || []);
      setMeta(res.meta);
    } catch (err) {
      console.error('Lỗi tải danh sách người dùng:', err);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchRole = !filterRole || u.role === filterRole;
      const matchSearch =
        !search ||
        u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone?.includes(search);
      return matchRole && matchSearch;
    });
  }, [users, filterRole, search]);

  const handleChangeRole = async (u, newRole) => {
    const roleObj = ROLES_CONFIG[newRole] || ROLES_CONFIG.user;
    if (!window.confirm(`Đổi vai trò tài khoản "${u.fullName}" sang "${roleObj.label}"?`)) return;
    setActionId(u._id);
    try {
      await api.put(`/users/${u._id}/role`, { role: newRole });
      setUsers((prev) => prev.map((x) => (x._id === u._id ? { ...x, role: newRole } : x)));
    } catch (e) {
      alert(e.message || 'Cập nhật vai trò thất bại');
    } finally {
      setActionId(null);
    }
  };

  const handleToggleStatus = async (u) => {
    const newStatus = !u.isActive;
    if (!window.confirm(`${newStatus ? 'Mở khóa' : 'Khóa'} tài khoản "${u.fullName}"?`)) return;
    setActionId(u._id);
    try {
      await api.put(`/users/${u._id}/status`, { isActive: newStatus });
      setUsers((prev) => prev.map((x) => (x._id === u._id ? { ...x, isActive: newStatus } : x)));
    } catch (e) {
      alert(e.message || 'Cập nhật trạng thái thất bại');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (u) => {
    if (!window.confirm(`Xóa tài khoản "${u.fullName}"? Hành động không thể hoàn tác.`)) return;
    setActionId(u._id);
    try {
      await api.delete(`/users/${u._id}`);
      setUsers((prev) => prev.filter((x) => x._id !== u._id));
    } catch (e) {
      alert(e.message || 'Xóa tài khoản thất bại');
    } finally {
      setActionId(null);
    }
  };

  const columns = [
    {
      key: 'fullName',
      label: 'Họ và Tên Tài Khoản',
      render: (u) => {
        const roleInfo = ROLES_CONFIG[u.role] || ROLES_CONFIG.user;
        const IconComp = ROLE_ICONS[u.role] || User;
        return (
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border ${roleInfo.color}`}>
              <IconComp className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-xs">{u.fullName}</p>
              <p className="text-[10px] text-slate-400 font-mono-lux">{u.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'phone',
      label: 'Số Điện Thoại',
      render: (u) => (
        <span className="font-mono-lux text-[#D4AF37] text-xs">
          {u.phone || '—'}
        </span>
      ),
    },
    {
      key: 'role',
      label: 'Vai Trò Phân Quyền (RBAC)',
      render: (u) => {
        const isSelf = u._id === currentUser?._id;
        const currentRoleKey = u.role || 'user';
        return (
          <div className="space-y-1">
            {isSelf ? (
              <span className="px-2.5 py-1 rounded text-[10px] font-mono-lux font-bold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 inline-block">
                👑 Admin Tối Cao (Bạn)
              </span>
            ) : (
              <select
                value={currentRoleKey}
                onChange={(e) => handleChangeRole(u, e.target.value)}
                disabled={actionId === u._id}
                className="bg-[#14141E] border border-white/15 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-[#D4AF37] cursor-pointer"
              >
                <option value="admin">👑 Admin (Quản trị tối cao)</option>
                <option value="giam_doc">💼 Giám Đốc (Executive Director)</option>
                <option value="quan_ly">👔 Quản Lý (Showroom Manager)</option>
                <option value="sales">🛍️ Sales (Nhân viên bán hàng)</option>
                <option value="cskh">🎧 CSKH (Chăm sóc khách hàng)</option>
                <option value="user">👤 Khách Hàng VIP (Client)</option>
              </select>
            )}
          </div>
        );
      },
    },
    {
      key: 'permissionsPreview',
      label: 'Quyền Hạn Chính',
      render: (u) => {
        const roleConfig = ROLES_CONFIG[u.role] || ROLES_CONFIG.user;
        return (
          <div className="max-w-xs space-y-1">
            <p className="text-[11px] text-slate-300 font-medium line-clamp-1">{roleConfig.description}</p>
            {roleConfig.limitations && (
              <span className="inline-block text-[9px] font-mono-lux text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                ⚠️ {roleConfig.limitations[0]}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'isActive',
      label: 'Trạng Thái',
      render: (u) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-mono-lux ${
            u.isActive
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}
        >
          {u.isActive ? 'Hoạt Động' : 'Đã Khóa'}
        </span>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#070709', color: '#E2E8F0' }}>
      <AdminSidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminHeader title="Quản Lý Phân Quyền & Tài Khoản" />

        <main style={{ padding: '32px 36px', flex: 1 }} className="space-y-6">
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="eyebrow text-[#D4AF37] text-[10px] tracking-[0.2em] font-mono-lux uppercase">
                RBAC ACCESS CONTROL MATRIX
              </span>
              <h1 className="font-serif-lux text-3xl font-bold text-white mt-1">
                Phân Quyền Vai Trò <span className="text-[#D4AF37] italic">& Quản Lý Tài Khoản</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Gán vai trò cho nhân sự: Admin, Giám đốc, Quản lý, Sales, CSKH & Khách Hàng VIP.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 bg-[#0E0E12] border border-white/10 p-1.5 rounded-lg">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 text-xs font-mono-lux rounded transition-all flex items-center gap-2 ${
                  activeTab === 'users'
                    ? 'bg-[#D4AF37] text-black font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Danh Sách Tài Khoản ({users.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('matrix')}
                className={`px-4 py-2 text-xs font-mono-lux rounded transition-all flex items-center gap-2 ${
                  activeTab === 'matrix'
                    ? 'bg-[#D4AF37] text-black font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Ma Trận Phân Quyền (Role Matrix)</span>
              </button>
            </div>
          </div>

          {activeTab === 'users' ? (
            <div className="space-y-6">
              {/* Toolbar Search & Filter */}
              <div className="bg-[#0E0E12] border border-white/10 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full max-w-md">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm theo tên, email, SĐT..."
                    className="w-full bg-[#14141A] border border-white/10 rounded pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-[#D4AF37] outline-none"
                  />
                </div>

                {/* Filter Role Buttons */}
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                  <button
                    onClick={() => setFilterRole('')}
                    className={`px-3 py-1.5 text-xs font-mono-lux rounded transition-all whitespace-nowrap ${
                      !filterRole ? 'bg-[#D4AF37] text-black font-bold' : 'bg-[#14141A] text-slate-400 hover:text-white'
                    }`}
                  >
                    Tất Cả ({users.length})
                  </button>
                  {Object.values(ROLES_CONFIG).map((r) => (
                    <button
                      key={r.key}
                      onClick={() => setFilterRole(r.key)}
                      className={`px-3 py-1.5 text-xs font-mono-lux rounded transition-all whitespace-nowrap ${
                        filterRole === r.key
                          ? 'bg-[#D4AF37] text-black font-bold'
                          : 'bg-[#14141A] text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {r.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* DataTable */}
              <DataTable
                columns={columns}
                data={filteredUsers}
                isLoading={isLoading}
                emptyMessage="Không tìm thấy tài khoản người dùng nào"
                actions={(u) => {
                  const isSelf = u._id === currentUser?._id;
                  const isProcessing = actionId === u._id;

                  if (isSelf) {
                    return (
                      <span className="text-[10px] font-mono-lux text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-0.5 rounded bg-[#D4AF37]/5">
                        Tài Khoản Đang Đăng Nhập
                      </span>
                    );
                  }

                  return (
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        disabled={isProcessing}
                        className={`px-2.5 py-1 text-[11px] font-mono-lux rounded transition-colors ${
                          u.isActive
                            ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                            : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                      >
                        {u.isActive ? 'Khóa' : 'Mở Khóa'}
                      </button>

                      <button
                        onClick={() => handleDelete(u)}
                        disabled={isProcessing}
                        className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-[11px] font-mono-lux rounded transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                }}
              />
            </div>
          ) : (
            /* TAB 2: DETAILED ROLE MATRIX TABLE */
            <div className="space-y-6">
              {/* Role Cards Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(ROLES_CONFIG).map((r) => {
                  const IconComp = ROLE_ICONS[r.key] || User;
                  return (
                    <div
                      key={r.key}
                      className="bg-[#0E0E12] border border-white/10 rounded-lg p-5 space-y-3 relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded text-xs font-mono-lux font-bold border ${r.color}`}>
                          {r.label}
                        </span>
                        <IconComp className="w-5 h-5 text-[#D4AF37]" />
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-light">{r.description}</p>

                      <div className="space-y-1 pt-2 border-t border-white/5">
                        <span className="text-[10px] font-mono-lux text-slate-400 uppercase tracking-wider block font-semibold">
                          Quyền hạn chính:
                        </span>
                        <ul className="space-y-1">
                          {r.permissions.map((p, idx) => (
                            <li key={idx} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                        {r.limitations && (
                          <div className="pt-2">
                            {r.limitations.map((l, idx) => (
                              <p key={idx} className="text-[10px] text-amber-400 font-mono-lux flex items-center gap-1">
                                <XCircle className="w-3 h-3 shrink-0" />
                                <span>{l}</span>
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Comprehensive Permission Matrix Table */}
              <div className="bg-[#0E0E12] border border-white/10 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-serif-lux text-xl font-bold text-white">
                    Bảng So Sánh Quyền Hạn Chi Tiết (Feature Permissions Matrix)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Đối chiếu quyền truy cập và thao tác giữa 6 cấp vai trò trong hệ thống Luxe Motors
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#14141C] text-slate-300 font-mono-lux uppercase text-[10px] tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-3 border-r border-white/10">Tính Năng / Quyền Thao Tác</th>
                        <th className="p-3 text-center border-r border-white/10 text-[#D4AF37]">Admin</th>
                        <th className="p-3 text-center border-r border-white/10 text-[#E6C200]">Giám Đốc</th>
                        <th className="p-3 text-center border-r border-white/10 text-blue-400">Quản Lý</th>
                        <th className="p-3 text-center border-r border-white/10 text-purple-400">Sales</th>
                        <th className="p-3 text-center border-r border-white/10 text-emerald-400">CSKH</th>
                        <th className="p-3 text-center text-slate-400">Khách VIP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {[
                        {
                          name: '1. Quản lý tài khoản & Phân quyền user',
                          admin: true, giam_doc: false, quan_ly: false, sales: false, cskh: false, user: false,
                        },
                        {
                          name: '2. Cấu hình hệ thống website',
                          admin: true, giam_doc: false, quan_ly: false, sales: false, cskh: false, user: false,
                        },
                        {
                          name: '3. Thêm / Sửa / Xóa kho xe siêu cấp',
                          admin: true, giam_doc: false, quan_ly: true, sales: false, cskh: false, user: false,
                        },
                        {
                          name: '4. Xem toàn bộ doanh thu & lợi nhuận',
                          admin: true, giam_doc: true, quan_ly: 'Theo bộ phận', sales: false, cskh: false, user: false,
                        },
                        {
                          name: '5. Phê duyệt đơn hàng & Giảm giá lớn',
                          admin: true, giam_doc: true, quan_ly: 'Theo hạn mức', sales: false, cskh: false, user: false,
                        },
                        {
                          name: '6. Quản lý nhân viên bán hàng',
                          admin: true, giam_doc: true, quan_ly: true, sales: false, cskh: false, user: false,
                        },
                        {
                          name: '7. Quản lý đơn hàng & yêu cầu cọc xe',
                          admin: true, giam_doc: true, quan_ly: true, sales: 'Tạo đơn cá nhân', cskh: false, user: 'Cọc xe cá nhân',
                        },
                        {
                          name: '8. Quản lý lịch hẹn Concierge & Chăm sóc KH',
                          admin: true, giam_doc: true, quan_ly: true, sales: 'Lịch hẹn cá nhân', cskh: true, user: 'Đặt lịch cá nhân',
                        },
                        {
                          name: '9. Ghi nhận phản hồi & Xử lý khiếu nại',
                          admin: true, giam_doc: true, quan_ly: true, sales: false, cskh: true, user: false,
                        },
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-3 font-semibold text-white border-r border-white/10">{row.name}</td>
                          <td className="p-3 text-center border-r border-white/10 font-mono-lux font-bold text-[#D4AF37]">
                            {row.admin === true ? '✅ Full Access' : row.admin}
                          </td>
                          <td className="p-3 text-center border-r border-white/10 font-mono-lux text-[#E6C200]">
                            {row.giam_doc === true ? '✅ Cho phép' : row.giam_doc === false ? '🚫 Khóa' : row.giam_doc}
                          </td>
                          <td className="p-3 text-center border-r border-white/10 font-mono-lux text-blue-400">
                            {row.quan_ly === true ? '✅ Cho phép' : row.quan_ly === false ? '🚫 Khóa' : row.quan_ly}
                          </td>
                          <td className="p-3 text-center border-r border-white/10 font-mono-lux text-purple-400">
                            {row.sales === true ? '✅ Cho phép' : row.sales === false ? '🚫 Khóa' : row.sales}
                          </td>
                          <td className="p-3 text-center border-r border-white/10 font-mono-lux text-emerald-400">
                            {row.cskh === true ? '✅ Cho phép' : row.cskh === false ? '🚫 Khóa' : row.cskh}
                          </td>
                          <td className="p-3 text-center font-mono-lux text-slate-400">
                            {row.user === true ? '✅ Cho phép' : row.user === false ? '🚫 Khóa' : row.user}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}