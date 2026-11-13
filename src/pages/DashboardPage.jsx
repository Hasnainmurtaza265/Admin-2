
import React from 'react';
import {
  DollarSign,
  Users,
  ShoppingBag,
  Package,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Truck,
  XCircle,
} from 'lucide-react';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import StatCard from '../components/common/StatCard.jsx';
import Badge from '../components/common/Badge.jsx';

export default function DashboardPage({
  stats,
  revenueTimeline,
  categorySales,
  orders = [],
  users = [],
  onNavigate,
  onSelectOrder,
}) {
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'success';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'purple';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  const recentOrders = orders.slice(0, 5);

  const currency = (value) =>
    `$${Number(value || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const number = (value) =>
    Number(value || 0).toLocaleString('en-US');

  const orderStatuses = [
    {
      title: 'Placed',
      count: stats.placed,
      icon: Clock,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-950/50',
    },
    {
      title: 'Processing',
      count: stats.processing,
      icon: Package,
      color: 'text-amber-600 bg-amber-100 dark:bg-amber-950/50',
    },
    {
      title: 'Shipped',
      count: stats.shipped,
      icon: Truck,
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-950/50',
    },
    {
      title: 'Delivered',
      count: stats.delivered,
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/50',
    },
    {
      title: 'Cancelled',
      count: stats.cancelled,
      icon: XCircle,
      color: 'text-rose-600 bg-rose-100 dark:bg-rose-950/50',
    },
  ];

  return (
    <div id="dashboard-page" className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Executive Performance Overview
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Live business performance and inventory statistics from Shop.Co database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            <span>Live database</span>
          </span>

          <button
            id="view-analytics-shortcut-btn"
            onClick={() => onNavigate('analytics')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
          >
            Detailed Metrics
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* LIVE KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          id="kpi-revenue"
          title="Total Revenue"
          value={currency(stats.totalRevenue)}
          period="All-time non-cancelled orders"
          icon={DollarSign}
          iconColor="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400"
        />

        <StatCard
          id="kpi-users"
          title="Registered Customers"
          value={number(stats.activeUsers)}
          period="Customer accounts in database"
          icon={Users}
          iconColor="text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400"
        />

        <StatCard
          id="kpi-orders"
          title="Total Orders"
          value={number(stats.totalOrders)}
          period="All recorded orders"
          icon={ShoppingBag}
          iconColor="text-purple-600 bg-purple-50 dark:bg-purple-950/50 dark:text-purple-400"
        />

        <StatCard
          id="kpi-products"
          title="Total Products"
          value={number(stats.totalProducts)}
          period="Products in inventory"
          icon={Package}
          iconColor="text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400"
        />

      </div>

      {/* INVENTORY SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total Stock Units
            </span>
            <Package className="w-5 h-5 text-blue-500" />
          </div>

          <h3 className="text-2xl font-bold mt-3 text-slate-900 dark:text-white">
            {number(stats.totalStock)}
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Units currently in inventory
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Low Stock Products
            </span>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>

          <h3 className="text-2xl font-bold mt-3 text-slate-900 dark:text-white">
            {number(stats.lowStockProducts)}
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Products with 1–15 units remaining
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Average Order Value
            </span>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>

          <h3 className="text-2xl font-bold mt-3 text-slate-900 dark:text-white">
            {currency(stats.avgOrderValue)}
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Revenue divided by total orders
          </p>
        </div>

      </div>

      {/* ORDER STATUS AND REVENUE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* REVENUE CHART */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">

          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Revenue Overview
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Daily revenue chart will be available when historical revenue aggregation is connected.
            </p>
          </div>

          {Object.values(revenueTimeline || {}).some(
            (data) => data?.length > 0
          ) ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueTimeline['7D'] || []}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                    opacity={0.5}
                  />

                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex flex-col items-center justify-center text-center border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
              <TrendingUp className="w-9 h-9 text-slate-300 mb-3" />

              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Revenue history not available yet
              </p>

              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Current total revenue is available above. Historical chart requires a date-wise backend report.
              </p>
            </div>
          )}

        </div>

        {/* ORDER STATUS */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">

          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Order Status Overview
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
            Actual order distribution
          </p>

          <div className="space-y-3">
            {orderStatuses.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {item.title}
                    </span>
                  </div>

                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {number(item.count)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('orders')}
              className="w-full py-2 px-3 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 rounded-lg transition-colors"
            >
              Manage Orders
            </button>
          </div>

        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">

          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Recent Orders
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Latest customer orders from MongoDB.
              </p>
            </div>

            <button
              id="view-all-orders-btn"
              onClick={() => onNavigate('orders')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all ({orders.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">

              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">

                {recentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-10 text-center text-slate-400"
                    >
                      No orders found in database.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr
                      key={order._id || order.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">
                        {order.id}
                      </td>

                      <td className="py-3">
                        <div>
                          <span className="font-medium text-slate-800 dark:text-slate-200 block">
                            {order.customer}
                          </span>

                          <span className="text-[11px] text-slate-400 block truncate max-w-[150px]">
                            {order.email}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 text-slate-500 whitespace-nowrap">
                        {order.date}
                      </td>

                      <td className="py-3 font-semibold text-slate-900 dark:text-white">
                        {currency(order.total)}
                      </td>

                      <td className="py-3">
                        <Badge variant={getStatusVariant(order.status)}>
                          {order.status}
                        </Badge>
                      </td>

                      <td className="py-3 text-right">
                        <button
                          id={`view-order-${order.id}-btn`}
                          onClick={() => onSelectOrder(order)}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))
                )}

              </tbody>
            </table>
          </div>
        </div>

        {/* OPERATIONAL HIGHLIGHTS */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">

          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Operational Highlights
          </h2>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>

            <div className="text-xs">
              <p className="font-semibold text-slate-900 dark:text-white">
                Low Stock Products
              </p>

              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                {number(stats.lowStockProducts)} products have 15 or fewer units remaining.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 shrink-0">
              <Clock className="w-4 h-4" />
            </div>

            <div className="text-xs">
              <p className="font-semibold text-slate-900 dark:text-white">
                Pending Fulfillment
              </p>

              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                {number(Number(stats.placed || 0) + Number(stats.processing || 0))} orders are placed or processing.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>

            <div className="text-xs">
              <p className="font-semibold text-slate-900 dark:text-white">
                Featured Products
              </p>

              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                {number(stats.featuredProducts)} products are currently featured.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('products')}
              className="w-full py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Review Inventory
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
