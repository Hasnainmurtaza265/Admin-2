import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  Download,
  CheckCircle2,
  ChevronDown,
  User,
  ShieldAlert,
  LogOut,
} from 'lucide-react';
import NotificationDropdown from './NotificationDropdown.jsx';

export default function Header({
  id = 'app-header',
  isCollapsed,
  setIsMobileOpen,
  searchTerm,
  setSearchTerm,
  notifications,
  setNotifications,
  onOpenNewProduct,
  onExportReport,
  darkMode,
  setDarkMode,
  currentUser,
  onLogout,
}) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleMarkRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, unread: false } : n))
    );
  };

  const handleClear = (notifId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notifId));
  };

  return (
    <header
      id={id}
      className={`fixed top-0 right-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-all duration-200 ${
        isCollapsed ? 'lg:left-20' : 'lg:left-64'
      } left-0`}
    >
      <div className="flex items-center justify-between h-full px-4 sm:px-6 gap-4">
        {/* Left: Mobile menu toggle + Global Search */}
        <div className="flex items-center gap-3 flex-1 max-w-lg">
          <button
            id="mobile-menu-btn"
            onClick={() => setIsMobileOpen(true)}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 lg:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="global-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search across analytics, users, orders, logs..."
              className="w-full pl-9 pr-8 py-1.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                id="search-clear-btn"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Action: New Product */}
          <button
            id="quick-add-product-btn"
            onClick={onOpenNewProduct}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>

          {/* Quick Action: Export */}
          <button
            id="quick-export-btn"
            onClick={onExportReport}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
            title="Export CSV Report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          {/* Theme Switcher */}
          <button
            id="theme-toggle-btn"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              id="notifications-bell-btn"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
              )}
            </button>

            <NotificationDropdown
              notifications={notifications}
              isOpen={isNotifOpen}
              onClose={() => setIsNotifOpen(false)}
              onMarkAllRead={handleMarkAllRead}
              onMarkRead={handleMarkRead}
              onClear={handleClear}
            />
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-0.5 hidden sm:block" />

          {/* User Profile Pill */}
          <div className="relative" ref={profileRef}>
            <button
              id="user-profile-menu-btn"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'}
                alt={currentUser?.name || 'Admin'}
                className="w-7 h-7 rounded-full object-cover border border-slate-300 dark:border-slate-700"
              />
              <div className="hidden lg:block text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate max-w-[120px]">
                  {currentUser?.name || 'Elena Rostova'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                  {currentUser?.role || 'Super Admin'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
            </button>

            {isProfileOpen && (
              <div
                id="user-profile-dropdown"
                className="absolute right-0 top-12 z-50 w-56 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 text-xs text-slate-700 dark:text-slate-300 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="font-semibold text-slate-900 dark:text-white truncate">
                    {currentUser?.name || 'Elena Rostova'}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {currentUser?.email || 'elena.rostova@nexus.io'}
                  </p>
                </div>

                <div className="py-1">
                  <div className="px-3 py-1.5 flex items-center justify-between text-slate-500">
                    <span>Role</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {currentUser?.role || 'Super Admin'}
                    </span>
                  </div>
                  <div className="px-3 py-1.5 flex items-center justify-between text-slate-500">
                    <span>System Status</span>
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Online
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                  <button
                    onClick={() => {
                      onLogout?.();
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
