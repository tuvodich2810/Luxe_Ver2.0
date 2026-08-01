import { useState, useEffect, useCallback } from 'react';

import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import Badge from '@/components/common/Badge';

import { formatPriceShort } from '@/utils/formatPrice';
import api from '@/services/api';

// ===================================
// Luồng trạng thái đơn hàng
// Phải khớp với backend Order.js
// ===================================
const STATUS_FLOW = [
  'pending',
  'confirmed',
  'processing',
  'completed',
];

// ===================================
// Cấu hình trạng thái
// ===================================
const STATUS_CFG = {
  pending: {
    l: 'Chờ xử lý',
    v: 'used',
  },

  confirmed: {
    l: 'Đã xác nhận',
    v: 'certified',
  },

  processing: {
    l: 'Đang xử lý',
    v: 'default',
  },

  completed: {
    l: 'Hoàn tất',
    v: 'new',
  },

  cancelled: {
    l: 'Đã hủy',
    v: 'danger',
  },
};

// ===================================
// Admin Orders
// ===================================
export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState('');

  const [updatingId, setUpdatingId] = useState(null);

  // ===================================
  // Lấy danh sách đơn hàng
  // GET /api/orders
  // ===================================
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);

    try {
      const params = filterStatus
        ? { orderStatus: filterStatus }
        : {};

      const res = await api.get('/orders', {
        params,
      });

      // api.js của bạn trả về res.data
      setOrders(Array.isArray(res.data) ? res.data : []);

      setMeta(res.meta || null);
    } catch (error) {
      console.error(
        'Lỗi lấy danh sách đơn hàng:',
        error
      );

      setOrders([]);
      setMeta(null);
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus]);

  // ===================================
  // Load đơn hàng khi mở trang
  // hoặc thay đổi bộ lọc
  // ===================================
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ===================================
  // Chuyển trạng thái đơn hàng
  // PATCH /api/orders/:id/status
  // ===================================
  const handleAdvance = async (order) => {
    const currentIndex = STATUS_FLOW.indexOf(
      order.orderStatus
    );

    const nextStatus =
      STATUS_FLOW[currentIndex + 1];

    if (!nextStatus) {
      return;
    }

    setUpdatingId(order._id);

    try {
      await api.patch(
        `/orders/${order._id}/status`,
        {
          orderStatus: nextStatus,
        }
      );

      // Cập nhật giao diện ngay
      setOrders((prev) =>
        prev.map((item) =>
          item._id === order._id
            ? {
                ...item,
                orderStatus: nextStatus,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        'Lỗi cập nhật trạng thái:',
        error
      );

      alert(
        error.message ||
          'Cập nhật trạng thái thất bại'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ===================================
  // Hủy đơn hàng
  // PATCH /api/orders/:id/cancel
  // ===================================
  const handleCancel = async (id) => {
    const confirmed = window.confirm(
      'Bạn có chắc chắn muốn hủy đơn hàng này?'
    );

    if (!confirmed) {
      return;
    }

    setUpdatingId(id);

    try {
      await api.patch(
        `/orders/${id}/cancel`
      );

      // Cập nhật giao diện
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id
            ? {
                ...order,
                orderStatus: 'cancelled',
              }
            : order
        )
      );
    } catch (error) {
      console.error(
        'Lỗi hủy đơn hàng:',
        error
      );

      alert(
        error.message ||
          'Hủy đơn hàng thất bại'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ===================================
  // Bộ lọc trạng thái
  // ===================================
  const FILTER_TABS = [
    {
      v: '',
      l: 'Tất cả',
    },

    ...STATUS_FLOW.map((status) => ({
      v: status,
      l: STATUS_CFG[status].l,
    })),

    {
      v: 'cancelled',
      l: 'Đã hủy',
    },
  ];

  // ===================================
  // Các cột DataTable
  // ===================================
  const columns = [
    {
      key: 'orderNumber',
      label: 'Mã đơn',
      render: (order) =>
        order.orderNumber || '—',
    },

    {
      key: 'user',
      label: 'Khách hàng',
      render: (order) =>
        order.user?.fullName || '—',
    },

    {
      key: 'car',
      label: 'Xe',
      render: (order) =>
        order.carSnapshot?.name ||
        order.car?.name ||
        '—',
    },

    {
      key: 'deposit',
      label: 'Tiền cọc',
      render: (order) =>
        formatPriceShort(
          order.depositAmount || 0
        ),
    },

    {
      key: 'total',
      label: 'Tổng tiền',
      render: (order) =>
        formatPriceShort(
          order.totalAmount || 0
        ),
    },

    {
      key: 'payment',
      label: 'Thanh toán',
      render: (order) => {
        const paymentStatus =
          order.paymentStatus;

        const paymentLabels = {
          pending: 'Chờ thanh toán',
          deposit_paid: 'Đã đặt cọc',
          fully_paid: 'Đã thanh toán',
          refunded: 'Đã hoàn tiền',
        };

        return (
          <span
            style={{
              fontFamily: 'Space Grotesk',
              fontSize: 10,
              color: 'var(--muted)',
            }}
          >
            {paymentLabels[paymentStatus] ||
              paymentStatus ||
              '—'}
          </span>
        );
      },
    },

    {
      key: 'status',
      label: 'Trạng thái',
      render: (order) => (
        <Badge
          variant={
            STATUS_CFG[order.orderStatus]
              ?.v || 'default'
          }
        >
          {STATUS_CFG[order.orderStatus]
            ?.l || order.orderStatus}
        </Badge>
      ),
    },

    {
      key: 'date',
      label: 'Ngày tạo',
      render: (order) =>
        order.createdAt
          ? new Date(
              order.createdAt
            ).toLocaleDateString('vi-VN')
          : '—',
    },
  ];

  // ===================================
  // Render
  // ===================================
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--black)',
      }}
    >
      {/* Sidebar */}
      <AdminSidebar />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <AdminHeader
          title="Quản lý đơn hàng"
        />

        <main
          style={{
            padding: '28px 32px',
            flex: 1,
          }}
        >
          {/* ===================================
              Filter + Count
          =================================== */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            {/* Filter */}
            <div
              style={{
                display: 'flex',
                gap: 10,
                flexWrap: 'wrap',
              }}
            >
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.v}
                  onClick={() =>
                    setFilterStatus(tab.v)
                  }
                  className={`btn btn-sm ${
                    filterStatus === tab.v
                      ? 'btn-primary'
                      : 'btn-outline'
                  }`}
                >
                  {tab.l}
                </button>
              ))}
            </div>

            {/* Count */}
            {meta && (
              <p
                style={{
                  fontFamily:
                    'Space Grotesk',
                  fontSize: 11,
                  color: 'var(--muted)',
                  letterSpacing: '0.1em',
                }}
              >
                {meta.total || 0} đơn
              </p>
            )}
          </div>

          {/* ===================================
              Table
          =================================== */}
          <DataTable
            columns={columns}
            data={orders}
            isLoading={isLoading}
            emptyMessage="Chưa có đơn hàng nào"
            actions={(order) => {
              const isProcessing =
                updatingId === order._id;

              const isFinal =
                order.orderStatus ===
                  'completed' ||
                order.orderStatus ===
                  'cancelled';

              const currentIndex =
                STATUS_FLOW.indexOf(
                  order.orderStatus
                );

              const nextStatus =
                STATUS_FLOW[
                  currentIndex + 1
                ];

              // Đơn đã hoàn tất hoặc đã hủy
              if (isFinal) {
                return (
                  <span
                    style={{
                      fontFamily:
                        'Space Grotesk',
                      fontSize: 9,
                      color:
                        'var(--muted)',
                      letterSpacing:
                        '0.1em',
                    }}
                  >
                    Hoàn tất
                  </span>
                );
              }

              return (
                <>
                  {/* Chuyển trạng thái */}
                  {nextStatus && (
                    <button
                      onClick={() =>
                        handleAdvance(order)
                      }
                      disabled={isProcessing}
                      className="btn btn-outline-gold btn-sm"
                    >
                      {isProcessing
                        ? 'Đang xử lý...'
                        : `→ ${STATUS_CFG[nextStatus].l}`}
                    </button>
                  )}

                  {/* Hủy */}
                  <button
                    onClick={() =>
                      handleCancel(order._id)
                    }
                    disabled={isProcessing}
                    className="btn btn-danger btn-sm"
                  >
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