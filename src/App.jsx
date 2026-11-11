import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/layout/Sidebar.jsx';
import Header from './components/layout/Header.jsx';
import LoginPage from './components/auth/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import LogsPage from './pages/LogsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import { getToken, setToken, shopApi } from './services/api.js';

const emptyStats = { totalRevenue: 0, revenueChange: 0, activeUsers: 0, usersChange: 0, totalOrders: 0, ordersChange: 0, conversionRate: 0, conversionChange: 0, avgOrderValue: 0, bounceRate: 0 };
const money = (value) => Number(value || 0);
const formatAddress = (address = {}) => [address.address, address.city, address.postalCode, address.country].filter(Boolean).join(', ');

function normalizeProduct(product) {
  const stock = Number(product.stock || 0);
  return { ...product, id: String(product._id), sku: product.legacyId ? `SHOP-${product.legacyId}` : `SHOP-${String(product._id).slice(-6).toUpperCase()}`, price: money(product.price), stock, status: stock === 0 ? 'Out of Stock' : stock <= 15 ? 'Low Stock' : 'In Stock', salesCount: 0 };
}
function normalizeOrder(order) {
  const user = order.user && typeof order.user === 'object' ? order.user : {};
  const id = String(order._id);
  return { ...order, id: `#${id.slice(-8).toUpperCase()}`, _id: id, customer: user.name || order.shippingAddress?.fullName || 'Guest Customer', email: user.email || '—', date: new Date(order.createdAt || Date.now()).toLocaleString(), status: String(order.status || 'placed').charAt(0).toUpperCase() + String(order.status || 'placed').slice(1), paymentMethod: order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : (order.paymentMethod || '—'), itemsCount: (order.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0), total: money(order.total), shippingAddress: formatAddress(order.shippingAddress), items: (order.items || []).map(item => ({ ...item, qty: Number(item.quantity || 0) })) };
}
function deriveCustomers(orders) {
  const map = new Map();
  orders.forEach(order => {
    const user = order.user && typeof order.user === 'object' ? order.user : null;
    if (!user?._id) return;
    const id = String(user._id);
    const current = map.get(id) || { id, name: user.name || 'Customer', email: user.email || '', role: 'Customer', status: 'Active', department: 'Customer', phone: '', joinedDate: order.createdAt ? new Date(order.createdAt).toISOString().slice(0, 10) : '—', totalSpend: 0, lastLogin: '—', avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'Customer')}&background=eff6ff&color=2563eb` };
    current.totalSpend += money(order.total);
    map.set(id, current);
  });
  return [...map.values()];
}

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [stats, setStats] = useState(emptyStats);
  const [revenueTimeline] = useState({ '7D': [], '30D': [], '12M': [] });
  const [categorySales] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [logs, setLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const productsRef = useRef([]);
  const ordersRef = useRef([]);
  productsRef.current = products;
  ordersRef.current = orders;

  useEffect(() => { document.documentElement.classList.toggle('dark', darkMode); }, [darkMode]);

  const refreshData = useCallback(async () => {
    setPageLoading(true); setPageError('');
    try {
      const [productResult, orderResult] = await Promise.all([shopApi.products(), shopApi.orders()]);
      const rawProducts = productResult.products || [];
      const rawOrders = orderResult.orders || [];
      const nextProducts = rawProducts.map(normalizeProduct);
      const nextOrders = rawOrders.map(normalizeOrder);
      setProducts(nextProducts); setOrders(nextOrders); setUsers(deriveCustomers(rawOrders));
      const revenue = rawOrders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + money(o.total), 0);
      setStats({ ...emptyStats, totalRevenue: revenue, activeUsers: deriveCustomers(rawOrders).length, totalOrders: rawOrders.length, avgOrderValue: rawOrders.length ? revenue / rawOrders.length : 0 });
    } catch (err) {
      setPageError(err.message);
      if (!getToken()) setCurrentUser(null);
      throw err;
    } finally { setPageLoading(false); }
  }, []);

  useEffect(() => {
    let active = true;
    const checkSession = async () => {
      if (!getToken()) { if (active) setAuthChecked(true); return; }
      try {
        const result = await shopApi.me();
        if (result.user?.role !== 'admin') throw new Error('Is account ko admin access nahi hai. Admin account se login karein.');
        if (active) { setCurrentUser(result.user); await refreshData(); }
      } catch (error) {
        setToken(null); if (active) { setCurrentUser(null); if (error.message) setPageError(error.message); }
      } finally { if (active) setAuthChecked(true); }
    };
    checkSession();
    return () => { active = false; };
  }, [refreshData]);

  const handleLogin = async (email, password) => {
    const result = await shopApi.login(email, password);
    if (result.user?.role !== 'admin') throw new Error('Yeh customer account hai. Shop.Co admin account se sign in karein.');
    setToken(result.token); setCurrentUser(result.user);
    try { await refreshData(); } catch (error) { setToken(null); setCurrentUser(null); throw error; }
  };
  const handleLogout = () => { setToken(null); setCurrentUser(null); setProducts([]); setUsers([]); setOrders([]); setActivePage('dashboard'); };

  const updateProducts = (updater) => {
    const previous = productsRef.current;
    const next = typeof updater === 'function' ? updater(previous) : updater;
    setProducts(next);
    (async () => {
      try {
        const oldById = new Map(previous.map(p => [String(p.id), p]));
        const newById = new Map(next.map(p => [String(p.id), p]));
        for (const item of next) {
          const old = oldById.get(String(item.id));
          const payload = { name: item.name, price: money(item.price), image: item.image || '/images/Party.png', category: item.category || 'Uncategorized', stock: Number(item.stock || 0), rating: money(item.rating), description: item.description || '', sizes: item.sizes || [], colors: item.colors || [], isFeatured: Boolean(item.isFeatured) };
          if (!old) await shopApi.createProduct(payload);
          else if (JSON.stringify({ ...old, status: undefined, sku: undefined, salesCount: undefined }) !== JSON.stringify({ ...item, status: undefined, sku: undefined, salesCount: undefined })) await shopApi.updateProduct(item._id || item.id, payload);
        }
        for (const old of previous) if (!newById.has(String(old.id))) await shopApi.deleteProduct(old._id || old.id);
        await refreshData();
      } catch (err) { setPageError(`Product save failed: ${err.message}`); await refreshData().catch(() => {}); }
    })();
  };

  const updateOrders = (updater) => {
    const previous = ordersRef.current;
    const next = typeof updater === 'function' ? updater(previous) : updater;
    setOrders(next);
    (async () => {
      try {
        for (const item of next) {
          const old = previous.find(p => String(p._id) === String(item._id));
          if (old && old.status !== item.status) await shopApi.updateOrderStatus(item._id, String(item.status).toLowerCase());
        }
        await refreshData();
      } catch (err) { setPageError(`Order update failed: ${err.message}`); await refreshData().catch(() => {}); }
    })();
  };

  const handleExportReport = () => {
    const csvContent = [['Order ID', 'Customer', 'Email', 'Date', 'Total', 'Status'].join(','), ...orders.map(o => [o.id, `"${o.customer}"`, o.email, o.date, Number(o.total || 0).toFixed(2), o.status].join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `shopco_orders_${new Date().toISOString().slice(0, 10)}.csv`; link.click(); URL.revokeObjectURL(url);
  };
  const handleSelectOrderAndNavigate = (order) => { setSelectedOrder(order); setActivePage('orders'); };

  if (!authChecked) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Checking Shop.Co admin session...</div>;
  if (!currentUser) return <LoginPage onLogin={handleLogin} />;
  const lowStockCount = products.filter(p => p.status === 'Low Stock').length;
  const pendingOrdersCount = orders.filter(o => ['Placed', 'Processing'].includes(o.status)).length;

  return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
    <Sidebar activePage={activePage} setActivePage={setActivePage} isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} isMobileOpen={isMobileSidebarOpen} setIsMobileOpen={setIsMobileSidebarOpen} counts={{ usersCount: users.length, lowStockCount, pendingOrdersCount }} />
    <Header isCollapsed={isSidebarCollapsed} setIsMobileOpen={setIsMobileSidebarOpen} searchTerm={searchTerm} setSearchTerm={setSearchTerm} notifications={notifications} setNotifications={setNotifications} onOpenNewProduct={() => { setActivePage('products'); setIsAddProductModalOpen(true); }} onExportReport={handleExportReport} darkMode={darkMode} setDarkMode={setDarkMode} currentUser={currentUser} onLogout={handleLogout} />
    <main id="main-content-viewport" className={`flex-1 transition-all duration-200 ease-in-out pt-16 ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {pageError && <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm flex items-center justify-between"><span>{pageError}</span><button onClick={() => setPageError('')} className="font-bold">×</button></div>}
        {pageLoading && <div className="mb-4 text-sm text-slate-500">Shop.Co database se live records load ho rahe hain...</div>}
        {activePage === 'dashboard' && <DashboardPage stats={stats} revenueTimeline={revenueTimeline} categorySales={categorySales} orders={orders} users={users} onNavigate={setActivePage} onSelectOrder={handleSelectOrderAndNavigate} />}
        {activePage === 'analytics' && <AnalyticsPage trafficSources={[]} deviceAnalytics={[]} />}
        {activePage === 'users' && <UsersPage users={users} setUsers={() => {}} searchTerm={searchTerm} readOnly />}
        {activePage === 'products' && <ProductsPage products={products} setProducts={updateProducts} searchTerm={searchTerm} isAddModalOpen={isAddProductModalOpen} setIsAddModalOpen={setIsAddProductModalOpen} />}
        {activePage === 'orders' && <OrdersPage orders={orders} setOrders={updateOrders} searchTerm={searchTerm} selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} onExportReport={handleExportReport} />}
        {activePage === 'logs' && <LogsPage logs={logs} setLogs={setLogs} searchTerm={searchTerm} />}
        {activePage === 'settings' && <SettingsPage currentUser={currentUser} setCurrentUser={setCurrentUser} />}
      </div>
    </main>
  </div>;
}
