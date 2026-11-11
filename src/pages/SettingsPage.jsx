import React, { useState } from 'react';
import {
  User,
  Shield,
  Key,
  Bell,
  Sliders,
  Check,
  Copy,
  Plus,
  Trash2,
  Lock,
  Save,
} from 'lucide-react';
import Badge from '../components/common/Badge.jsx';

export default function SettingsPage({ currentUser, setCurrentUser }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Profile Form
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'Elena Rostova',
    email: currentUser?.email || 'forexample@gmail.com',
    phone: '+92 3XXXXXXXXX',
    department: 'Co-Founder',
    bio: 'Lead administrative architect overseeing platform reliability and logistics pipeline.',
  });

  // System General Preferences
  const [generalPrefs, setGeneralPrefs] = useState({
    appName: 'NexusAdmin Enterprise',
    supportEmail: 'ops@nexus.io',
    currency: 'USD',
    timezone: 'UTC',
    dateFormat: 'YYYY-MM-DD',
  });

  // Security
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  // Notification Preferences
  const [notifSettings, setNotifSettings] = useState({
    emailOrders: true,
    emailLowStock: true,
    emailSecurity: true,
    weeklyReport: false,
    pushAlerts: true,
  });

  // API Keys
  const [apiKeys, setApiKeys] = useState([
    {
      id: 'key_1',
      name: 'Production Server Ingestion',
      prefix: 'sk_live_98a7...',
      full: 'test_key_here',
      created: '2025-01-10',
      lastUsed: '2 mins ago',
    },
    {
      id: 'key_2',
      name: 'Analytics ETL Pipeline',
      prefix: 'sk_live_33f2...',
      full: 'test_key_here2',
      created: '2025-03-22',
      lastUsed: 'Yesterday',
    },
  ]);
  const [copiedKeyId, setCopiedKeyId] = useState(null);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (setCurrentUser) {
      setCurrentUser((prev) => ({
        ...prev,
        name: profileData.name,
        email: profileData.email,
      }));
    }
    triggerSaveBanner();
  };

  const triggerSaveBanner = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopyKey = (keyItem) => {
    navigator.clipboard?.writeText(keyItem.full);
    setCopiedKeyId(keyItem.id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleGenerateKey = () => {
    const newKey = {
      id: `key_${Date.now()}`,
      name: `API Token #${apiKeys.length + 1}`,
      prefix: 'sk_live_new...',
      full: `sk_live_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
    };
    setApiKeys([...apiKeys, newKey]);
    triggerSaveBanner();
  };

  const handleRevokeKey = (id) => {
    if (window.confirm('Are you sure you want to revoke this API token immediately?')) {
      setApiKeys(apiKeys.filter((k) => k.id !== id));
    }
  };

  return (
    <div id="settings-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            System & Workspace Settings
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Configure identity credentials, operational parameters, security tokens, and notifications.
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-semibold animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Settings saved successfully</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-px">
        {[
          { id: 'profile', label: 'Admin Profile', icon: User },
          { id: 'general', label: 'Platform Config', icon: Sliders },
          { id: 'security', label: 'Security & 2FA', icon: Shield },
          { id: 'notifications', label: 'Notification Rules', icon: Bell },
          { id: 'apikeys', label: 'Developer API Keys', icon: Key },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`settings-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${isActive
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs max-w-3xl">
          <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-sm"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Profile Avatar
                </h3>
                <p className="text-slate-500 mt-0.5">
                  Synchronized with internal federated identity directory.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Display Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Primary Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Telephone Contact
                </label>
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={profileData.department}
                  onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Executive Bio
              </label>
              <textarea
                rows={3}
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: General Platform */}
      {activeTab === 'general' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs max-w-3xl space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Organization / App Name
              </label>
              <input
                type="text"
                value={generalPrefs.appName}
                onChange={(e) => setGeneralPrefs({ ...generalPrefs, appName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                System Support Inquiries
              </label>
              <input
                type="email"
                value={generalPrefs.supportEmail}
                onChange={(e) => setGeneralPrefs({ ...generalPrefs, supportEmail: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Default Currency
              </label>
              <select
                value={generalPrefs.currency}
                onChange={(e) => setGeneralPrefs({ ...generalPrefs, currency: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="USD">USD ($ - US Dollar)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="GBP">GBP (£ - British Pound)</option>
                <option value="JPY">JPY (¥ - Japanese Yen)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Server Time Zone
              </label>
              <select
                value={generalPrefs.timezone}
                onChange={(e) => setGeneralPrefs({ ...generalPrefs, timezone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="EST">EST (US Eastern)</option>
                <option value="PST">PST (US Pacific)</option>
                <option value="CET">CET (Central European)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Date Display Format
              </label>
              <select
                value={generalPrefs.dateFormat}
                onChange={(e) => setGeneralPrefs({ ...generalPrefs, dateFormat: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (EU)</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={triggerSaveBanner}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Update Platform Configurations</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Security & 2FA */}
      {activeTab === 'security' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs max-w-3xl space-y-5 text-xs">
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Two-Factor Authentication (2FA)
                </h4>
                <p className="text-slate-500 mt-0.5">
                  Enforces hardware security keys (FIDO2) or TOTP authenticator app tokens.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setTwoFactorEnabled(!twoFactorEnabled);
                triggerSaveBanner();
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${twoFactorEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
              />
            </button>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Idle Session Inactivity Expiry (Minutes)
            </label>
            <select
              value={sessionTimeout}
              onChange={(e) => {
                setSessionTimeout(e.target.value);
                triggerSaveBanner();
              }}
              className="w-full sm:w-64 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="15">15 Minutes</option>
              <option value="30">30 Minutes (Recommended)</option>
              <option value="60">60 Minutes</option>
              <option value="240">4 Hours</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Password Rotation
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="password"
                placeholder="Current Administrative Password"
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="password"
                placeholder="New Cryptographically Strong Password"
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={triggerSaveBanner}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold transition-colors shadow-xs"
            >
              Update Password
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs max-w-3xl space-y-4 text-xs">
          {[
            { key: 'emailOrders', title: 'High-Value Order Alerts', desc: 'Trigger instantaneous dispatch notices for orders above $500.00.' },
            { key: 'emailLowStock', title: 'Warehouse Restock Alerts', desc: 'Receive urgent notices when SKUs breach safety inventory thresholds.' },
            { key: 'emailSecurity', title: 'Security Incident Warnings', desc: 'Notify immediately upon failed credential bursts or IP anomaly flags.' },
            { key: 'weeklyReport', title: 'Weekly Executive Briefing', desc: 'Aggregate weekly sales KPIs and customer cohort retention analysis.' },
            { key: 'pushAlerts', title: 'Browser Real-time Web Push', desc: 'Allow browser notifications for incoming urgent tickets and transactions.' },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800"
            >
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">{item.title}</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={() => {
                  setNotifSettings({
                    ...notifSettings,
                    [item.key]: !notifSettings[item.key],
                  });
                  triggerSaveBanner();
                }}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${notifSettings[item.key] ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifSettings[item.key] ? 'translate-x-4' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: API Keys */}
      {activeTab === 'apikeys' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs max-w-3xl space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Authorized Secret Keys
              </h3>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Machine-to-machine authentication tokens for REST API integration.
              </p>
            </div>
            <button
              id="generate-api-key-btn"
              onClick={handleGenerateKey}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Token</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            {apiKeys.map((k) => (
              <div
                key={k.id}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/30"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {k.name}
                    </span>
                    <Badge variant="success" size="sm">Active</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-[11px] mt-1 font-mono">
                    <span>{k.prefix}</span>
                    <span>Created: {k.created}</span>
                    <span>Last used: {k.lastUsed}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleCopyKey(k)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-[11px] font-medium"
                  >
                    {copiedKeyId === k.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleRevokeKey(k.id)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Revoke Token"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
