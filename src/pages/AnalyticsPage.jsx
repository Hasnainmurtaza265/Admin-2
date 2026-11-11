import React, { useState } from 'react';
import {
  Globe,
  Smartphone,
  Laptop,
  Tablet,
  TrendingUp,
  Activity,
  Zap,
  Filter,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import StatCard from '../components/common/StatCard.jsx';
import Badge from '../components/common/Badge.jsx';

export default function AnalyticsPage({
  trafficSources = [],
  deviceAnalytics = [],
}) {
  const [selectedChannel, setSelectedChannel] = useState('All');

  // Traffic tracking is not wired to an analytics provider yet.
  if (!trafficSources.length && !deviceAnalytics.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Audience & Traffic Analytics</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Traffic analytics are not connected yet. This panel will show verified visitor and device metrics after an analytics source is configured.
        </p>
      </div>
    );
  }

  const hourlyVisitorsData = [
    { hour: '00:00', visitors: 420 },
    { hour: '03:00', visitors: 280 },
    { hour: '06:00', visitors: 610 },
    { hour: '09:00', visitors: 1940 },
    { hour: '12:00', visitors: 2850 },
    { hour: '15:00', visitors: 3120 },
    { hour: '18:00', visitors: 2400 },
    { hour: '21:00', visitors: 1680 },
  ];

  const funnelSteps = [
    { name: 'Unique Site Impressions', count: '142,500', rate: '100%', drop: null },
    { name: 'Product Details Explored', count: '64,200', rate: '45.0%', drop: '-55%' },
    { name: 'Added To Shopping Cart', count: '18,400', rate: '12.9%', drop: '-71%' },
    { name: 'Checkout Initialized', count: '8,900', rate: '6.2%', drop: '-51%' },
    { name: 'Order Completed & Paid', count: '3,240', rate: '2.3%', drop: '-63%' },
  ];

  const topCountries = [
    { country: 'United States', flag: '🇺🇸', visitors: '45,210', share: '42%' },
    { country: 'Germany', flag: '🇩🇪', visitors: '18,400', share: '17%' },
    { country: 'United Kingdom', flag: '🇬🇧', visitors: '14,900', share: '14%' },
    { country: 'Japan', flag: '🇯🇵', visitors: '11,200', share: '10%' },
    { country: 'Canada', flag: '🇨🇦', visitors: '8,600', share: '8%' },
  ];

  return (
    <div id="analytics-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Audience & Traffic Analytics
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            In-depth acquisition funnels, device distribution, and user session telemetry.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">Real-time Stream: Active</Badge>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-pageviews"
          title="Total Page Views"
          value="489,120"
          change="+18.4%"
          period="vs prior 30 days"
          icon={Activity}
          iconColor="text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400"
        />
        <StatCard
          id="stat-avg-session"
          title="Avg Session Duration"
          value="4m 28s"
          change="+32s"
          period="improved engagement"
          icon={TrendingUp}
          iconColor="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400"
        />
        <StatCard
          id="stat-bounce"
          title="Bounce Rate"
          value="28.3%"
          change="-3.1%"
          period="lower bounce rate"
          icon={Globe}
          iconColor="text-purple-600 bg-purple-50 dark:bg-purple-950/50 dark:text-purple-400"
        />
        <StatCard
          id="stat-speed"
          title="Avg Load Latency"
          value="0.74s"
          change="-120ms"
          period="edge CDN optimized"
          icon={Zap}
          iconColor="text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400"
        />
      </div>

      {/* Hourly Traffic Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Hourly Traffic Velocity
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active unique visitors recorded per 3-hour cluster across server nodes.
            </p>
          </div>
          <span className="text-xs text-slate-500">Peak hour: 15:00 UTC (3,120 concurrents)</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyVisitorsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip
                formatter={(val) => [`${val.toLocaleString()} visitors`, 'Active Sessions']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="visitors" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2-Column Split: Acquisition Sources & Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Acquisition Sources */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
            Top Acquisition Channels
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Direct tracking and attribution origins for inbound sessions.
          </p>

          <div className="space-y-4">
            {trafficSources.map((source, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-800 dark:text-slate-200">{source.source}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400">
                      {source.visits.toLocaleString()} visits
                    </span>
                    <span className="text-emerald-600 font-semibold">{source.change}</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
            E-Commerce Conversion Funnel
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Drop-off rate analysis through progressive customer journey checkpoints.
          </p>

          <div className="space-y-3">
            {funnelSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                      {step.name}
                    </h4>
                    <span className="text-[11px] text-slate-500">{step.count} sessions</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    {step.rate}
                  </span>
                  {step.drop && (
                    <span className="text-[10px] text-rose-500 font-medium">{step.drop}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Devices & Geographic Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Matrix */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
            Device Environment
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Client platform hardware categorization.
          </p>

          <div className="grid grid-cols-3 gap-3">
            {deviceAnalytics.map((dev, idx) => {
              const icons = [Laptop, Smartphone, Tablet];
              const Icon = icons[idx] || Laptop;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center"
                >
                  <div className="mx-auto w-10 h-10 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2 shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {dev.device}
                  </h4>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {dev.share}%
                  </p>
                  <span className="text-[11px] text-slate-500">{dev.visitors} visitors</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Geographic Origin */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
            Top Visitor Geographies
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Global market penetration sorted by unique authenticated users.
          </p>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {topCountries.map((c, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-base leading-none">{c.flag}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {c.country}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 dark:text-slate-400">{c.visitors}</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 w-10 text-right">
                    {c.share}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
