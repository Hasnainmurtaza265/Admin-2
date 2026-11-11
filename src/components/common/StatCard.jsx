import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({
  id,
  title,
  value,
  change,
  period = 'vs last period',
  icon: Icon,
  iconColor = 'text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400',
}) {
  const isPositive = typeof change === 'number' ? change >= 0 : change?.startsWith('+');

  return (
    <div
      id={id}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </h3>
      </div>

      <div className="mt-2.5 flex items-center gap-1.5 text-xs">
        {change !== undefined && (
          <span
            className={`inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded ${
              isPositive
                ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400'
                : 'text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {typeof change === 'number'
              ? `${change > 0 ? '+' : ''}${change}%`
              : change}
          </span>
        )}
        <span className="text-slate-500 dark:text-slate-400">{period}</span>
      </div>
    </div>
  );
}
