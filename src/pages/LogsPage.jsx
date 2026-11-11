import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  Download,
  Terminal,
  Shield,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import Badge from '../components/common/Badge.jsx';
import Pagination from '../components/common/Pagination.jsx';

export default function LogsPage({
  logs = [],
  setLogs,
  searchTerm = '',
}) {
  const [localSearch, setLocalSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const query = (searchTerm || localSearch).toLowerCase().trim();

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchQuery =
        !query ||
        log.id.toLowerCase().includes(query) ||
        log.user.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.detail.toLowerCase().includes(query) ||
        log.ip.toLowerCase().includes(query);

      const matchLevel = levelFilter === 'All' || log.level === levelFilter;

      return matchQuery && matchLevel;
    });
  }, [logs, query, levelFilter]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  const handleSimulateLog = () => {
    const actions = [
      { action: 'API Token Rotated', detail: 'Secret key sk_live_*** refreshed by Admin', level: 'warning' },
      { action: 'Database Index Rebuilt', detail: 'Index `idx_users_email` recomputed in 31ms', level: 'info' },
      { action: 'Security Policy Checked', detail: 'Automated CIS compliance check passed with 100%', level: 'success' },
      { action: 'Webhook Delivery Timeout', detail: 'Stripe webhook retry scheduled for attempt 2', level: 'error' },
    ];
    const picked = actions[Math.floor(Math.random() * actions.length)];
    const newLog = {
      id: `LOG-${Math.floor(400 + Math.random() * 500)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: 'Hasnain Murtaza',
      action: picked.action,
      detail: picked.detail,
      level: picked.level,
      ip: `192.168.1.${Math.floor(10 + Math.random() * 200)}`,
    };

    setLogs([newLog, ...logs]);
  };

  const handleClearLogs = () => {
    if (window.confirm('Do you wish to purge the local log buffer?')) {
      setLogs([]);
    }
  };

  const getLevelBadgeVariant = (level) => {
    switch (level?.toLowerCase()) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'danger';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  const getLevelIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'success':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
      case 'error':
        return <XCircle className="w-3.5 h-3.5 text-rose-500" />;
      default:
        return <Info className="w-3.5 h-3.5 text-blue-500" />;
    }
  };

  return (
    <div id="logs-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            System & Security Audit Logs
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Immutable timeline recording administrative operations, role modifications, and system events.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            id="simulate-log-btn"
            onClick={handleSimulateLog}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate Test Event</span>
          </button>
          <button
            id="clear-logs-btn"
            onClick={handleClearLogs}
            className="p-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-lg transition-colors"
            title="Purge logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="logs-search-input"
            type="text"
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search action, detail, user, IP..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1 text-xs">
          {['All', 'info', 'success', 'warning', 'error'].map((lvl) => (
            <button
              key={lvl}
              id={`filter-log-level-${lvl}-btn`}
              onClick={() => {
                setLevelFilter(lvl);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                levelFilter === lvl
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Level</th>
                <th className="py-3.5 px-4">Event ID</th>
                <th className="py-3.5 px-4">Timestamp (UTC)</th>
                <th className="py-3.5 px-4">Principal Actor</th>
                <th className="py-3.5 px-4">Action Summary</th>
                <th className="py-3.5 px-4">Technical Detail</th>
                <th className="py-3.5 px-4 text-right">Origin IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400 font-sans">
                    No log events recorded matching your query.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-sans">
                      <div className="flex items-center gap-1.5">
                        {getLevelIcon(log.level)}
                        <Badge variant={getLevelBadgeVariant(log.level)} size="sm">
                          {log.level.toUpperCase()}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {log.id}
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4 font-sans font-semibold text-slate-800 dark:text-slate-200">
                      {log.user}
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-slate-900 dark:text-white">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 max-w-xs truncate font-sans">
                      {log.detail}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500">
                      {log.ip}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          id="logs-pagination"
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredLogs.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
