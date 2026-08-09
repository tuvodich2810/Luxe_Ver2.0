const expressAsyncHandler = require('express-async-handler');
const Car = require('../models/Car');
const Order = require('../models/Order');
const Appointment = require('../models/Appointment');
const Contact = require('../models/Contact');
const User = require('../models/User');
const { ok } = require('../utils/apiResponse');

// ===================================
// GET /api/admin/dashboard
// Tổng hợp chỉ số kinh doanh & Thống kê toàn hệ thống
// ===================================
const getDashboardStats = expressAsyncHandler(async (req, res) => {
  const [
    totalCars,
    totalOrders,
    totalAppointments,
    pendingAppointments,
    totalUsers,
    revenueResult,
    recentOrders,
  ] = await Promise.all([
    Car.countDocuments(),
    Order.countDocuments(),
    Appointment.countDocuments(),
    Appointment.countDocuments({ status: 'pending' }),
    User.countDocuments(),
    Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalDeposit: { $sum: '$depositAmount' },
          completedRevenue: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'completed'] }, '$totalAmount', 0] },
          },
          completedCount: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'completed'] }, 1, 0] },
          },
        },
      },
    ]),
    Order.find()
      .populate('user', 'fullName email')
      .populate('car', 'name mainImage')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  const totalRevenue = revenueResult[0]?.totalRevenue || 0;
  const totalDeposit = revenueResult[0]?.totalDeposit || 0;
  const completedRevenue = revenueResult[0]?.completedRevenue || 0;
  const completedCount = revenueResult[0]?.completedCount || 0;

  // Lợi nhuận gộp thực thu: 15% biên lợi nhuận siêu xe bàn giao + 10% từ tiền cọc
  const totalProfit = Math.round(completedRevenue * 0.15 + totalDeposit * 0.1);

  return ok(res, 'Lấy dữ liệu Dashboard thành công', {
    stats: {
      totalCars,
      totalOrders,
      totalAppointments,
      pendingAppointments,
      totalUsers,
      totalRevenue,
      totalDeposit,
      completedRevenue,
      completedCount,
      totalProfit,
    },
    recentOrders,
  });
});

// ===================================
// GET /api/admin/crm
// Thống kê chi tiết CRM Quản lý Doanh thu & Phễu khách hàng (Sales Pipeline)
// ===================================
const getCRMStats = expressAsyncHandler(async (req, res) => {
  const [
    revenueByStatus,
    monthlyRevenue,
    totalLeads,
    totalAppointments,
    totalOrders,
    completedOrders,
    recentLeads,
  ] = await Promise.all([
    // Doanh thu phân loại theo trạng thái thanh toán
    Order.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          totalAmount: { $sum: '$totalAmount' },
          totalDeposit: { $sum: '$depositAmount' },
          count: { $sum: 1 },
        },
      },
    ]),

    // Doanh thu 6 tháng gần nhất
    Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$totalAmount' },
          deposits: { $sum: '$depositAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 },
    ]),

    Contact.countDocuments(),
    Appointment.countDocuments(),
    Order.countDocuments({ orderStatus: { $ne: 'cancelled' } }),
    Order.countDocuments({ orderStatus: 'completed' }),

    // Phễu khách hàng tiềm năng gần đây (Leads)
    Contact.find().sort({ createdAt: -1 }).limit(10).lean(),
  ]);

  // Tính toán chỉ số KPIs
  let totalGrossRevenue = 0;
  let totalCollectedDeposit = 0;

  revenueByStatus.forEach((item) => {
    if (item._id !== 'refunded') {
      totalGrossRevenue += item.totalAmount;
      totalCollectedDeposit += item.totalDeposit;
    }
  });

  const conversionRate = totalLeads > 0 ? ((totalOrders / totalLeads) * 100).toFixed(1) : 0;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalGrossRevenue / totalOrders) : 0;

  return ok(res, 'Lấy báo cáo doanh thu CRM thành công', {
    overview: {
      totalGrossRevenue,
      totalCollectedDeposit,
      totalOrders,
      completedOrders,
      totalLeads,
      totalAppointments,
      conversionRate,
      avgOrderValue,
    },
    monthlyRevenue,
    revenueByStatus,
    recentLeads,
  });
});

module.exports = {
  getDashboardStats,
  getCRMStats,
};
