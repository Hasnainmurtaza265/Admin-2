import React, { useState } from 'react';
import {
  DollarSign,
  Users,
  ShoppingBag,
  TrendingUp,
  ArrowUpRight,
  Package,
  Clock,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
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
  const [timeframe, setTimeframe] = useState('7D');
  const currentChartData = revenueTimeline[timeframe] || revenueTimeline['7D'];

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

  return (
    <div id="dashboard-page" className="space-y-6">
      {/* Top Banner / Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Executive Performance Overview
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time analytics, revenue distribution, and fulfillment operational metrics.
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
            Detailed Metrics <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="kpi-revenue"
          title="Total Revenue"
          value={`$${stats.totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          change={stats.revenueChange}
          period="vs previous cycle"
          icon={DollarSign}
          iconColor="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400"
        />
        <StatCard
          id="kpi-users"
          title="Active Users"
          value={stats.activeUsers?.toLocaleString()}
          change={stats.usersChange}
          period="vs previous cycle"
          icon={Users}
          iconColor="text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400"
        />
        <StatCard
          id="kpi-orders"
          title="Total Orders"
          value={stats.totalOrders?.toLocaleString()}
          change={stats.ordersChange}
          period="vs previous cycle"
          icon={ShoppingBag}
          iconColor="text-purple-600 bg-purple-50 dark:bg-purple-950/50 dark:text-purple-400"
        />
        <StatCard
          id="kpi-conversion"
          title="Conversion Rate"
          value={`${stats.conversionRate}%`}
          change={stats.conversionChange}
          period="vs target benchmark"
          icon={TrendingUp}
          iconColor="text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400"
        />
      </div>

      {/* Charts Section: Revenue Area Chart + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Trend (Span 2) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Revenue & Expenditure Flow
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gross sales revenue contrasted against operational fulfillment expenditure.
              </p>
            </div>

            {/* Timeframe selector tabs */}
            <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium self-start sm:self-auto">
              {['7D', '30D', '12M'].map((period) => (
                <button
                  key={period}
                  id={`timeframe-${period}-btn`}
                  onClick={() => setTimeframe(period)}
                  className={`px-3 py-1 rounded-md transition-all ${
                    timeframe === period
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(val) => `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <Tooltip
                  formatter={(value) => [`$${value.toLocaleString()}`, '']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorExpenses)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-slate-600 dark:text-slate-300 font-medium">Gross Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-slate-600 dark:text-slate-300 font-medium">Operational Cost</span>
            </div>
          </div>
        </div>

        {/* Category Breakdown (Span 1) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Sales by Department
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Distribution volume across core inventory classifications.
            </p>
          </div>

          <div className="h-64 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySales}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categorySales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}% volume`, 'Share']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconSize={10}
                  formatter={(value) => (
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs flex justify-between text-slate-500">
            <span>Primary driver</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              No sales data yet
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Orders & Quick Operational Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (Span 2) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Recent Orders
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Latest customer checkouts requiring fulfillment verification.
              </p>
            </div>
            <button
              id="view-all-orders-btn"
              onClick={() => onNavigate('orders')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all orders ({orders.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
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
                    <td className="py-3 text-slate-500 whitespace-nowrap">{order.date}</td>
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">
                      ${order.total.toFixed(2)}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Key Quick Statuses */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Operational Highlights
          </h2>

          <div className="space-y-3">
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-900 dark:text-white">
                  Payment Gateway Healthy
                </p>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  99.98% authorization success rate over the last 48 hours.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 shrink-0">
                <Package className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-900 dark:text-white">
                  Inventory Restock Alert
                </p>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  3 SKUs are under the 10-unit minimum buffer limit.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-900 dark:text-white">
                  Fulfillment SLA: 1.4 Hours
                </p>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  Average dispatch latency remains well under the 4-hour SLA target.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('products')}
              className="w-full py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-center"
            >
              Review Inventory Levels
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
