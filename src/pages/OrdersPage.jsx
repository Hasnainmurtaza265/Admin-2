import React, { useState, useMemo } from 'react';
import {
  ShoppingCart,
  Search,
  Download,
  Eye,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
  MapPin,
  CreditCard,
  User,
  ArrowRight,
} from 'lucide-react';
import Badge from '../components/common/Badge.jsx';
import Modal from '../components/common/Modal.jsx';
import Pagination from '../components/common/Pagination.jsx';

export default function OrdersPage({
  orders = [],
  setOrders,
  searchTerm = '',
  selectedOrder,
  setSelectedOrder,
  onExportReport,
}) {
  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [isDetailOpen, setIsDetailOpen] = useState(Boolean(selectedOrder));

  const query = (searchTerm || localSearch).toLowerCase().trim();

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchQuery =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query);

      const matchStatus = statusFilter === 'All' || order.status === statusFilter;

      return matchQuery && matchStatus;
    });
  }, [orders, query, statusFilter]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const getStatusBadgeVariant = (status) => {
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

  return (
    <div id="orders-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Order Fulfillment & Transactions
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Track customer checkouts, dispatch timelines, logistics statuses, and settlements.
          </p>
        </div>

        <button
          id="orders-export-csv-btn"
          onClick={onExportReport}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export All Orders</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="orders-search-input"
            type="text"
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Order ID, customer, email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1">
            {['All', 'Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
              <button
                key={st}
                id={`filter-status-${st.toLowerCase()}-btn`}
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Placed Date</th>
                <th className="py-3.5 px-4">Items Count</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    id={`order-row-${order.id}`}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {order.id}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block">
                          {order.customer}
                        </span>
                        <span className="text-[11px] text-slate-400 block truncate max-w-[160px]">
                          {order.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {order.date}
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {order.itemsCount} item{order.itemsCount > 1 ? 's' : ''}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      <span className="inline-flex items-center gap-1.5 text-[11px]">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        id={`inspect-order-${order.id}-btn`}
                        onClick={() => handleOpenDetail(order)}
                        className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          id="orders-pagination"
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredOrders.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal
          id="order-detail-modal"
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedOrder(null);
          }}
          title={`Order Dossier: ${selectedOrder.id}`}
          description={`Placed on ${selectedOrder.date}`}
          maxWidth="max-w-xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Update status:</span>
                <select
                  id="order-status-select"
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                  className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Placed" disabled>Placed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsDetailOpen(false);
                  setSelectedOrder(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Customer & Delivery Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-slate-400 font-medium block mb-1">Customer Details</span>
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-500" />
                  {selectedOrder.customer}
                </p>
                <p className="text-slate-500 mt-0.5">{selectedOrder.email}</p>
                <p className="text-slate-500 text-[11px] mt-1">{selectedOrder.paymentMethod}</p>
              </div>

              <div>
                <span className="text-slate-400 font-medium block mb-1">Delivery Destination</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>{selectedOrder.shippingAddress || 'Standard Warehouse Address'}</span>
                </p>
                <div className="mt-2">
                  <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Line items list */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                Purchased Line Items
              </h4>
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200">{item.name}</p>
                      <p className="text-slate-400 text-[11px]">Quantity: {item.qty}</p>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order total */}
            <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Total Transaction Value
              </span>
              <span className="text-lg font-bold text-blue-900 dark:text-blue-200">
                ${selectedOrder.total.toFixed(2)}
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
