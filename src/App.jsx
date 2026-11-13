
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

const emptyStats = {
  totalRevenue: 0,
  activeUsers: 0,
  totalOrders: 0,
  totalProducts: 0,
  totalStock: 0,
  featuredProducts: 0,
  avgOrderValue: 0,
  lowStockProducts: 0,
  placed: 0,
  processing: 0,
  shipped: 0,
  delivered: 0,
  cancelled: 0,
};

const money = (value) => Number(value || 0);

const formatAddress = (address = {}) =>
  [
    address.address,
    address.city,
    address.postalCode,
    address.country,
  ]
    .filter(Boolean)
    .join(', ');

// PRODUCT NORMALIZER
function normalizeProduct(product) {
  const stock = Number(product.stock || 0);

  return {
    ...product,
    id: String(product._id),
    sku: product.legacyId
      ? `SHOP-${product.legacyId}`
      : `SHOP-${String(product._id).slice(-6).toUpperCase()}`,
    price: money(product.price),
    stock,
    status:
      stock === 0
        ? 'Out of Stock'
        : stock <= 15
          ? 'Low Stock'
          : 'In Stock',
    salesCount: 0,
  };
}

// ORDER NORMALIZER
function normalizeOrder(order) {
  const user =
    order.user && typeof order.user === 'object'
      ? order.user
      : {};

  const id = String(order._id);

  return {
    ...order,

    id: `#${id.slice(-8).toUpperCase()}`,
    _id: id,

    customer:
      user.name ||
      order.shippingAddress?.fullName ||
      'Guest Customer',

    email: user.email || '—',

    date: order.createdAt
      ? new Date(order.createdAt).toLocaleString()
      : '—',

    status:
      String(order.status || 'placed').charAt(0).toUpperCase() +
      String(order.status || 'placed').slice(1),

    paymentMethod:
      order.paymentMethod === 'cash_on_delivery'
        ? 'Cash on Delivery'
        : order.paymentMethod || '—',

    itemsCount: (order.items || []).reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    ),

    total: money(order.total),

    shippingAddress: formatAddress(order.shippingAddress),

    items: (order.items || []).map((item) => ({
      ...item,
      qty: Number(item.quantity || 0),
    })),
  };
}

// CUSTOMER NORMALIZER
function normalizeCustomer(customer, orders) {
  const customerId = String(customer._id);

  const customerOrders = orders.filter((order) => {
    const orderUser =
      order.user && typeof order.user === 'object'
        ? order.user
        : null;

    return orderUser?._id &&
      String(orderUser._id) === customerId;
  });

  const totalSpend = customerOrders
    .filter((order) => order.status !== 'cancelled')
    .reduce((sum, order) => sum + money(order.total), 0);

  const name = customer.name || 'Customer';

  return {
    id: customerId,
    name,
    email: customer.email || '—',
    role: 'Customer',

    // Backend does not currently provide customer account status.
    status: 'N/A',

    department: '—',
    phone: '',
    joinedDate: customer.createdAt
      ? new Date(customer.createdAt).toLocaleDateString()
      : '—',

    totalSpend,
    lastLogin: 'Not available',

    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=eff6ff&color=2563eb`,
  };
}

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const [stats, setStats] = useState(emptyStats);

  // No fake chart data.
  const [revenueTimeline] = useState({
    '7D': [],
    '30D': [],
    '12M': [],
  });

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
  const [isAddProductModalOpen, setIsAddProductModalOpen] =
    useState(false);

  const productsRef = useRef([]);
  const ordersRef = useRef([]);

  productsRef.current = products;
  ordersRef.current = orders;

  // DARK MODE
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // FETCH ALL ADMIN DATA
  const refreshData = useCallback(async () => {
    setPageLoading(true);
    setPageError('');

    try {
      const [
        productResult,
        orderResult,
        statsResult,
        customerResult,
      ] = await Promise.all([
        shopApi.products(),
        shopApi.orders(),
        shopApi.adminStats(),
        shopApi.customers(),
      ]);

      const rawProducts = productResult.products || [];
      const rawOrders = orderResult.orders || [];
      const rawCustomers = customerResult.customers || [];

      const nextProducts = rawProducts.map(normalizeProduct);
      const nextOrders = rawOrders.map(normalizeOrder);

      const nextUsers = rawCustomers.map((customer) =>
        normalizeCustomer(customer, rawOrders)
      );

      const backendStats = statsResult.stats || {};

      // ACTUAL DATABASE STATISTICS
      const totalRevenue = money(backendStats.totalRevenue);
      const totalOrders = money(backendStats.totalOrders);
      const totalCustomers = money(backendStats.totalCustomers);
      const totalProducts = money(backendStats.totalProducts);
      const totalStock = money(backendStats.totalStock);

      const avgOrderValue = totalOrders
        ? totalRevenue / totalOrders
        : 0;

      const lowStockProducts = nextProducts.filter(
        (product) => product.status === 'Low Stock'
      ).length;

      setProducts(nextProducts);
      setOrders(nextOrders);
      setUsers(nextUsers);

      setStats({
        ...emptyStats,

        totalRevenue,
        totalOrders,
        activeUsers: totalCustomers,

        totalProducts,
        totalStock,

        featuredProducts: money(backendStats.featuredProducts),

        avgOrderValue,

        lowStockProducts,

        placed: money(backendStats.placed),
        processing: money(backendStats.processing),
        shipped: money(backendStats.shipped),
        delivered: money(backendStats.delivered),
        cancelled: money(backendStats.cancelled),
      });

    } catch (error) {
      console.error('Admin data loading failed:', error);

      setPageError(
        error.message || 'Failed to load Shop.Co dashboard data.'
      );

      throw error;

    } finally {
      setPageLoading(false);
    }
  }, []);

  // CHECK ADMIN SESSION
  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      if (!getToken()) {
        if (active) setAuthChecked(true);
        return;
      }

      try {
        const result = await shopApi.me();

        if (result.user?.role !== 'admin') {
          throw new Error(
            'Is account ko admin access nahi hai. Admin account se login karein.'
          );
        }

        if (!active) return;

        setCurrentUser(result.user);

        try {
          await refreshData();
        } catch (error) {
          // Keep the valid admin session.
          // The dashboard can retry loading data.
          console.error('Dashboard refresh failed:', error);
        }

      } catch (error) {
        setToken(null);

        if (active) {
          setCurrentUser(null);
          setPageError(error.message || 'Admin session expired.');
        }

      } finally {
        if (active) setAuthChecked(true);
      }
    };

    checkSession();

    return () => {
      active = false;
    };
  }, [refreshData]);

  // ADMIN LOGIN
  const handleLogin = async (email, password) => {
    const result = await shopApi.login(email, password);

    if (result.user?.role !== 'admin') {
      throw new Error(
        'Yeh customer account hai. Shop.Co admin account se sign in karein.'
      );
    }

    setToken(result.token);
    setCurrentUser(result.user);

    try {
      await refreshData();
    } catch (error) {
      // Do not discard a valid token because of a temporary
      // dashboard data loading issue.
      console.error('Initial dashboard loading failed:', error);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);

    setProducts([]);
    setUsers([]);
    setOrders([]);

    setStats(emptyStats);
    setPageError('');

    setActivePage('dashboard');
  };

  // CREATE / UPDATE / DELETE PRODUCTS
  const updateProducts = (updater) => {
    const previous = productsRef.current;

    const next =
      typeof updater === 'function'
        ? updater(previous)
        : updater;

    setProducts(next);

    (async () => {
      try {
        const oldById = new Map(
          previous.map((product) => [String(product.id), product])
        );

        const newById = new Map(
          next.map((product) => [String(product.id), product])
        );

        // CREATE AND UPDATE
        for (const item of next) {
          const old = oldById.get(String(item.id));

          const payload = {
            name: item.name,
            price: money(item.price),
            image: item.image || '/images/Party.png',
            category: item.category || 'Uncategorized',
            stock: Number(item.stock || 0),
            rating: money(item.rating),
            description: item.description || '',
            sizes: item.sizes || [],
            colors: item.colors || [],
            isFeatured: Boolean(item.isFeatured),
          };

          if (!old) {
            await shopApi.createProduct(payload);
          } else {
            const oldData = {
              ...old,
              status: undefined,
              sku: undefined,
              salesCount: undefined,
            };

            const newData = {
              ...item,
              status: undefined,
              sku: undefined,
              salesCount: undefined,
            };

            if (JSON.stringify(oldData) !== JSON.stringify(newData)) {
              await shopApi.updateProduct(
                item._id || item.id,
                payload
              );
            }
          }
        }

        // DELETE
        for (const old of previous) {
          if (!newById.has(String(old.id))) {
            await shopApi.deleteProduct(old._id || old.id);
          }
        }

        await refreshData();

      } catch (error) {
        setPageError(`Product save failed: ${error.message}`);

        await refreshData().catch(() => {});
      }
    })();
  };

  // UPDATE ORDER STATUS
  const updateOrders = (updater) => {
    const previous = ordersRef.current;

    const next =
      typeof updater === 'function'
        ? updater(previous)
        : updater;

    setOrders(next);

    (async () => {
      try {
        for (const item of next) {
          const old = previous.find(
            (order) => String(order._id) === String(item._id)
          );

          if (old && old.status !== item.status) {
            await shopApi.updateOrderStatus(
              item._id,
              String(item.status).toLowerCase()
            );
          }
        }

        await refreshData();

      } catch (error) {
        setPageError(`Order update failed: ${error.message}`);

        await refreshData().catch(() => {});
      }
    })();
  };

  // EXPORT ORDERS CSV
  const handleExportReport = () => {
    const csvContent = [
      [
        'Order ID',
        'Customer',
        'Email',
        'Date',
        'Total',
        'Status',
      ].join(','),

      ...orders.map((order) =>
        [
          order.id,
          `"${String(order.customer).replace(/"/g, '""')}"`,
          `"${String(order.email).replace(/"/g, '""')}"`,
          `"${order.date}"`,
          Number(order.total || 0).toFixed(2),
          order.status,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `shopco_orders_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    link.click();

    URL.revokeObjectURL(url);
  };

  // OPEN SELECTED ORDER
  const handleSelectOrderAndNavigate = (order) => {
    setSelectedOrder(order);
    setActivePage('orders');
  };

  // AUTH LOADING
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Checking Shop.Co admin session...
      </div>
    );
  }

  // LOGIN PAGE
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // REAL OPERATIONAL COUNTS
  const lowStockCount = products.filter(
    (product) => product.status === 'Low Stock'
  ).length;

  const pendingOrdersCount = orders.filter((order) =>
    ['Placed', 'Processing'].includes(order.status)
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        counts={{
          usersCount: users.length,
          lowStockCount,
          pendingOrdersCount,
        }}
      />

      <Header
        isCollapsed={isSidebarCollapsed}
        setIsMobileOpen={setIsMobileSidebarOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        notifications={notifications}
        setNotifications={setNotifications}
        onOpenNewProduct={() => {
          setActivePage('products');
          setIsAddProductModalOpen(true);
        }}
        onExportReport={handleExportReport}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main
        id="main-content-viewport"
        className={`flex-1 transition-all duration-200 ease-in-out pt-16 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">

          {/* ERROR MESSAGE */}
          {pageError && (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm flex items-center justify-between">
              <span>{pageError}</span>

              <button
                onClick={() => setPageError('')}
                className="font-bold"
              >
                ×
              </button>
            </div>
          )}

          {/* LOADING MESSAGE */}
          {pageLoading && (
            <div className="mb-4 text-sm text-slate-500">
              Shop.Co database se live records load ho rahe hain...
            </div>
          )}

          {/* DASHBOARD */}
          {activePage === 'dashboard' && (
            <DashboardPage
              stats={stats}
              revenueTimeline={revenueTimeline}
              categorySales={categorySales}
              orders={orders}
              users={users}
              onNavigate={setActivePage}
              onSelectOrder={handleSelectOrderAndNavigate}
            />
          )}

          {/* ANALYTICS */}
          {activePage === 'analytics' && (
            <AnalyticsPage
              trafficSources={[]}
              deviceAnalytics={[]}
            />
          )}

          {/* CUSTOMERS */}
          {activePage === 'users' && (
            <UsersPage
              users={users}
              setUsers={() => {}}
              searchTerm={searchTerm}
              readOnly
            />
          )}

          {/* PRODUCTS */}
          {activePage === 'products' && (
            <ProductsPage
              products={products}
              setProducts={updateProducts}
              searchTerm={searchTerm}
              isAddModalOpen={isAddProductModalOpen}
              setIsAddModalOpen={setIsAddProductModalOpen}
            />
          )}

          {/* ORDERS */}
          {activePage === 'orders' && (
            <OrdersPage
              orders={orders}
              setOrders={updateOrders}
              searchTerm={searchTerm}
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrder}
              onExportReport={handleExportReport}
            />
          )}

          {/* LOGS */}
          {activePage === 'logs' && (
            <LogsPage
              logs={logs}
              setLogs={setLogs}
              searchTerm={searchTerm}
            />
          )}

          {/* SETTINGS */}
          {activePage === 'settings' && (
            <SettingsPage
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          )}

        </div>
      </main>
    </div>
  );
}
