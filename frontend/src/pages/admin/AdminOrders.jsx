import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import api from '@/services/api';
import {
  ShoppingBag,
  ArrowRight,
  XCircle,
  CheckCircle2,
  DollarSign,
  Clock,
  ShieldCheck,
  Search,
  Eye,
  FileText,
  Download,
  Filter,
  Car,
  User,
  MapPin,
  Calendar,
  CreditCard,
  RotateCcw,
} from 'lucide-react';

const STATUS_FLOW = ['pending', 'confirmed', 'processing', 'completed'];

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Chờ Xử Lý' },
  { value: 'confirmed', label: 'Đã Xác Nhận Cọc' },
  { value: 'processing', label: 'Đang Làm Hồ Sơ' },
  { value: 'completed', label: 'Đã Bàn Giao Xe' },
  { value: 'cancelled', label: 'Đã Hủy' },
];

const STATUS_CFG = {
  pending: { label: 'Chờ Xử Lý', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  confirmed: { label: 'Đã Xác Nhận', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  processing: { label: 'Đang Xử Lý Hồ Sơ', color: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30' },
  completed: { label: 'Đã Bàn Giao Xe', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  cancelled: { label: 'Đã Hủy', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

export default function AdminOrders() {
  const [allOrders, setAllOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/orders');
      const orderList = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : res?.orders || [];
      setAllOrders(orderList);
    } catch (err) {
      console.error('Lỗi lấy đơn hàng:', err);
      setAllOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Tính số lượng đơn theo từng trạng thái
  const counts = {
    all: allOrders.length,
    pending: allOrders.filter((o) => o.orderStatus === 'pending').length,
    confirmed: allOrders.filter((o) => o.orderStatus === 'confirmed').length,
    processing: allOrders.filter((o) => o.orderStatus === 'processing').length,
    completed: allOrders.filter((o) => o.orderStatus === 'completed').length,
    cancelled: allOrders.filter((o) => o.orderStatus === 'cancelled').length,
  };

  // Lọc dữ liệu theo tab trạng thái & từ khóa tìm kiếm
  const filteredOrders = allOrders.filter((order) => {
    const matchStatus = !filterStatus || order.orderStatus === filterStatus;
    const matchSearch =
      !searchTerm ||
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.phone?.includes(searchTerm) ||
      order.carSnapshot?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.car?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Thao tác cập nhật trạng thái hợp đồng (Hỗ trợ cả PATCH & PUT để chống lỗi Network Error)
  const handleUpdateStatus = async (order, targetStatus) => {
    if (targetStatus === 'cancelled') {
      if (!window.confirm(`Xác nhận hủy hợp đồng cọc xe mã ${order.orderNumber || order._id}?`)) return;
    }

    setUpdatingId(order._id);

    // Cập nhật UI tạm thời (Optimistic UI Update)
    setAllOrders((prev) =>
      prev.map((o) => (o._id === order._id ? { ...o, orderStatus: targetStatus } : o))
    );
    if (selectedContract?._id === order._id) {
      setSelectedContract((prev) => ({ ...prev, orderStatus: targetStatus }));
    }

    try {
      if (targetStatus === 'cancelled') {
        try {
          await api.patch(`/orders/${order._id}/cancel`);
        } catch {
          await api.put(`/orders/${order._id}/status`, { orderStatus: 'cancelled' });
        }
      } else {
        try {
          await api.patch(`/orders/${order._id}/status`, { orderStatus: targetStatus });
        } catch {
          await api.put(`/orders/${order._id}/status`, { orderStatus: targetStatus });
        }
      }

      const label = STATUS_CFG[targetStatus]?.label || targetStatus;
      showToast(`✅ Đã duyệt hợp đồng #${order.orderNumber || order._id.slice(-6)} sang "${label}"!`);
      await fetchOrders();
    } catch (err) {
      console.error('Lỗi cập nhật đơn:', err);
      await fetchOrders();
      showToast(`⚠️ Không thể cập nhật: ${err.message || 'Lỗi kết nối máy chủ'}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExportCSV = () => {
    if (filteredOrders.length === 0) return alert('Không có đơn hàng nào để xuất báo cáo');
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Mã Hợp Đồng,Khách Hàng,Số Điện Thoại,Siêu Xe,Tổng Tiền (VNĐ),Tiền Cọc (VNĐ),Trạng Thái']
        .concat(
          filteredOrders.map(
            (o) =>
              `"${o.orderNumber}","${o.user?.fullName || 'Khách VIP'}","${o.user?.phone || ''}","${
                o.carSnapshot?.name || o.car?.name || ''
              }",${o.totalAmount || 0},${o.depositAmount || 0},"${o.orderStatus}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LuxeMotors_BaoCaoDonHang_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatVND = (num) => {
    if (!num || isNaN(num)) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const columns = [
    {
      key: 'orderNumber',
      label: 'Mã Hợp Đồng',
      render: (order) => (
        <div className="space-y-0.5">
          <p className="font-mono-lux font-bold text-[#D4AF37] text-xs">{order.orderNumber || 'LM-2026-XXXX'}</p>
          <p className="text-[10px] text-slate-500 font-mono-lux">
            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : 'Hôm nay'}
          </p>
        </div>
      ),
    },
    {
      key: 'user',
      label: 'Khách Hàng',
      render: (order) => (
        <div>
          <p className="font-semibold text-white text-xs">{order.user?.fullName || 'Khách VIP'}</p>
          <p className="text-[10px] text-slate-400 font-mono-lux">{order.user?.phone || order.user?.email || 'N/A'}</p>
        </div>
      ),
    },
    {
      key: 'car',
      label: 'Siêu Xe Đặt Cọc',
      render: (order) => (
        <div className="flex items-center gap-2.5">
          <img
            src={order.carSnapshot?.image || order.car?.mainImage || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=200'}
            alt=""
            className="w-10 h-7 object-cover rounded border border-white/10"
          />
          <div>
            <p className="text-xs text-white font-medium">{order.carSnapshot?.name || order.car?.name || 'Siêu xe Luxe'}</p>
            <p className="text-[10px] text-slate-400 font-mono-lux">{order.carSnapshot?.brand || 'Luxury'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'depositAmount',
      label: 'Tiền Cọc Thu Được',
      render: (order) => (
        <span className="font-mono-lux font-bold text-emerald-400 text-xs">
          {formatVND(order.depositAmount)}
        </span>
      ),
    },
    {
      key: 'totalAmount',
      label: 'Tổng Giá Trị Đơn',
      render: (order) => (
        <span className="font-mono-lux text-slate-200 text-xs">
          {formatVND(order.totalAmount)}
        </span>
      ),
    },
    {
      key: 'orderStatus',
      label: 'Trạng Thái Đơn',
      render: (order) => {
        const sCfg = STATUS_CFG[order.orderStatus] || STATUS_CFG.pending;
        return (
          <span className={`px-2.5 py-1 rounded text-[10px] font-mono-lux border ${sCfg.color}`}>
            {sCfg.label}
          </span>
        );
      },
    },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#070709', color: '#E2E8F0' }}>
      <AdminSidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminHeader title="Quản Lý Đơn Hàng & Đặt Cọc Xe" />

        <main className="p-4 sm:p-6 lg:p-8 flex-1 space-y-6 overflow-x-hidden">
          {/* Toast Notification */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-3.5 bg-[#14141C] border border-[#D4AF37]/50 text-[#D4AF37] font-mono-lux text-xs rounded-lg shadow-xl flex items-center justify-between"
              >
                <span>{toastMessage}</span>
                <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white font-bold ml-4">✕</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top Bar Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="eyebrow text-[#D4AF37] text-[10px] tracking-[0.2em] font-mono-lux uppercase">
                SALES CONTRACT & DEPOSIT TRACKER
              </span>
              <h1 className="font-serif-lux text-3xl font-bold text-white mt-1">
                Danh Sách Đơn Hàng <span className="text-[#D4AF37] italic">& Đặt Cọc Xe</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-[#14141C] hover:bg-[#1E1E2A] border border-white/10 text-slate-300 hover:text-white rounded font-mono-lux text-xs flex items-center gap-2 transition-all"
              >
                <Download className="w-4 h-4 text-[#D4AF37]" />
                <span>Xuất CSV</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Status Filter Tabs (Chuẩn màu nguyên bản như cũ) */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto w-full sm:w-auto">
              {[
                { value: '', label: 'Tất Cả Đơn Hàng', count: counts.all },
                { value: 'pending', label: 'Chờ Xử Lý', count: counts.pending },
                { value: 'confirmed', label: 'Đã Xác Nhận Cọc', count: counts.confirmed },
                { value: 'processing', label: 'Đang Làm Hồ Sơ', count: counts.processing },
                { value: 'completed', label: 'Đã Bàn Giao Xe', count: counts.completed },
                { value: 'cancelled', label: 'Đã Hủy', count: counts.cancelled },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilterStatus(tab.value)}
                  className={`px-4 py-2 text-xs font-mono-lux rounded transition-all whitespace-nowrap flex items-center gap-2 ${
                    filterStatus === tab.value
                      ? 'bg-[#D4AF37] text-black font-bold shadow-lg shadow-[#D4AF37]/10'
                      : 'bg-[#0E0E12] text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${filterStatus === tab.value ? 'bg-black/20 text-black font-bold' : 'bg-white/10 text-slate-300'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Live Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm mã HĐ, Tên KH, SĐT..."
                className="w-full bg-[#0E0E12] border border-white/10 rounded pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Table Container */}
          <DataTable
            columns={columns}
            data={filteredOrders}
            isLoading={isLoading}
            emptyMessage="Không có đơn đặt cọc xe nào"
            actions={(order) => {
              const currentIndex = STATUS_FLOW.indexOf(order.orderStatus);
              const canAdvance = currentIndex !== -1 && currentIndex < STATUS_FLOW.length - 1;
              const canCancel = order.orderStatus !== 'cancelled' && order.orderStatus !== 'completed';

              const nextStatus = STATUS_FLOW[currentIndex + 1];

              return (
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setSelectedContract(order)}
                    className="px-2.5 py-1 bg-white/5 border border-white/10 hover:border-[#D4AF37] text-slate-200 hover:text-[#D4AF37] text-[11px] font-mono-lux rounded transition-all flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Xem HĐ</span>
                  </button>

                  {/* Nút Phê Duyệt / Duyệt Bước Tiếp (Đúng màu chuẩn vàng đen như nguyên bản) */}
                  {canAdvance && (
                    <button
                      onClick={() => handleUpdateStatus(order, nextStatus)}
                      disabled={updatingId === order._id}
                      className="px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] text-[11px] font-mono-lux rounded transition-all flex items-center gap-1"
                    >
                      <span>
                        {order.orderStatus === 'pending'
                          ? 'Duyệt Cọc'
                          : order.orderStatus === 'confirmed'
                          ? 'Làm Hồ Sơ'
                          : 'Bàn Giao Xe'}
                      </span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}

                  {/* Nút Hủy (Đúng màu đỏ mờ như nguyên bản) */}
                  {canCancel && (
                    <button
                      onClick={() => handleUpdateStatus(order, 'cancelled')}
                      disabled={updatingId === order._id}
                      className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-[11px] font-mono-lux rounded transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-3 h-3" />
                      Hủy
                    </button>
                  )}

                  {order.orderStatus === 'cancelled' && (
                    <button
                      onClick={() => handleUpdateStatus(order, 'pending')}
                      disabled={updatingId === order._id}
                      className="px-2 py-1 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-[11px] font-mono-lux rounded transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3 text-amber-400" />
                      Khôi Phục
                    </button>
                  )}
                </div>
              );
            }}
          />
        </main>
      </div>

      {/* Contract Detail & Interactive Direct Status Change Modal */}
      <AnimatePresence>
        {selectedContract && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0E0E12] border border-[#D4AF37]/40 rounded-xl max-w-2xl w-full p-6 space-y-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif-lux text-xl font-bold text-white">
                      Hợp Đồng Cọc Xe <span className="text-[#D4AF37]">#{selectedContract.orderNumber || selectedContract._id?.slice(-6)?.toUpperCase()}</span>
                    </h3>
                    <p className="text-xs text-slate-400 font-mono-lux">
                      Khởi tạo: {selectedContract.createdAt ? new Date(selectedContract.createdAt).toLocaleString('vi-VN') : 'Hôm nay'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedContract(null)}
                  className="p-1 rounded text-slate-400 hover:text-white text-sm font-mono-lux"
                >
                  ✕ Đóng
                </button>
              </div>

              <div className="overflow-y-auto space-y-6 pr-1 text-xs">
                {/* Status selector inside Modal */}
                <div className="p-4 bg-[#14141C] border border-[#D4AF37]/30 rounded-lg flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono-lux text-[#D4AF37] uppercase font-bold block">
                      TRẠNG THÁI HỢP ĐỒNG
                    </span>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded text-xs font-mono-lux font-bold border ${STATUS_CFG[selectedContract.orderStatus]?.color}`}>
                      {STATUS_CFG[selectedContract.orderStatus]?.label || selectedContract.orderStatus}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs font-mono-lux">Chuyển trạng thái:</span>
                    <select
                      value={selectedContract.orderStatus}
                      onChange={(e) => handleUpdateStatus(selectedContract, e.target.value)}
                      className="bg-[#0E0E12] border border-[#D4AF37]/40 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-[#D4AF37] font-mono-lux font-bold"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Car & Customer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#14141C] border border-white/10 rounded-lg space-y-2">
                    <span className="text-[10px] font-mono-lux text-[#D4AF37] uppercase font-bold flex items-center gap-1">
                      <Car className="w-3.5 h-3.5" /> THÔNG TIN SIÊU XE ĐẶT CỌC
                    </span>
                    <img
                      src={selectedContract.carSnapshot?.image || selectedContract.car?.mainImage || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=600'}
                      alt=""
                      className="w-full h-32 object-cover rounded border border-white/10"
                    />
                    <p className="font-bold text-white text-sm">{selectedContract.carSnapshot?.name || selectedContract.car?.name}</p>
                    <p className="text-slate-400 font-mono-lux">Hãng sản xuất: {selectedContract.carSnapshot?.brand || 'Luxury'}</p>
                  </div>

                  <div className="p-4 bg-[#14141C] border border-white/10 rounded-lg space-y-3">
                    <span className="text-[10px] font-mono-lux text-emerald-400 uppercase font-bold flex items-center gap-1">
                      <User className="w-3.5 h-3.5" /> THÔNG TIN KHÁCH HÀNG
                    </span>
                    <p className="font-bold text-white text-sm">{selectedContract.user?.fullName || 'Khách VIP Luxe'}</p>
                    <p className="text-slate-300 font-mono-lux">SĐT: {selectedContract.user?.phone || 'N/A'}</p>
                    <p className="text-slate-300 font-mono-lux">Email: {selectedContract.user?.email || 'N/A'}</p>

                    <div className="pt-2 border-t border-white/5 space-y-1">
                      <span className="text-[10px] font-mono-lux text-slate-400 uppercase flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-400" /> ĐỊA CHỈ BÀN GIAO XE
                      </span>
                      <p className="text-slate-200">{selectedContract.deliveryAddress || 'Showroom Luxe Motors'}</p>
                    </div>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="p-4 bg-[#14141C] border border-[#D4AF37]/20 rounded-lg space-y-3 font-mono-lux">
                  <span className="text-[10px] text-[#D4AF37] uppercase font-bold flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5" /> GIÁ TRỊ HỢP ĐỒNG & TIỀN CỌC
                  </span>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block">Tổng Giá Trị Siêu Xe:</span>
                      <strong className="text-white text-sm">{formatVND(selectedContract.totalAmount)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Tiền Cọc Giữ Xe (20%):</span>
                      <strong className="text-emerald-400 text-sm">{formatVND(selectedContract.depositAmount)}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => setSelectedContract(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded font-mono-lux text-xs"
                >
                  Đóng Cửa Sổ
                </button>

                {STATUS_FLOW.indexOf(selectedContract.orderStatus) < STATUS_FLOW.length - 1 && (
                  <button
                    onClick={() => {
                      const next = STATUS_FLOW[STATUS_FLOW.indexOf(selectedContract.orderStatus) + 1];
                      handleUpdateStatus(selectedContract, next);
                    }}
                    disabled={updatingId === selectedContract._id}
                    className="px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] text-[11px] font-mono-lux rounded transition-all flex items-center gap-1 font-bold"
                  >
                    <span>Duyệt Bước Tiếp</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}