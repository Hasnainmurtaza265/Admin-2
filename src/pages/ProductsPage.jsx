import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  AlertCircle,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import Badge from '../components/common/Badge.jsx';
import Modal from '../components/common/Modal.jsx';
import Pagination from '../components/common/Pagination.jsx';

export default function ProductsPage({
  products = [],
  setProducts,
  searchTerm = '',
  onOpenAddProduct,
  isAddModalOpen,
  setIsAddModalOpen,
}) {
  const [localSearch, setLocalSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Edit Product Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    image: '',
    category: 'T-shirts',
    price: '',
    stock: '',
    status: 'In Stock',
  });

  const query = (searchTerm || localSearch).toLowerCase().trim();

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchQuery =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query);

      const matchCategory = categoryFilter === 'All' || p.category === categoryFilter;
      const matchStock =
        stockFilter === 'All' ||
        (stockFilter === 'In Stock' && p.status === 'In Stock') ||
        (stockFilter === 'Low Stock' && p.status === 'Low Stock') ||
        (stockFilter === 'Out of Stock' && p.status === 'Out of Stock');

      return matchQuery && matchCategory && matchStock;
    });
  }, [products, query, categoryFilter, stockFilter]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const lowStockCount = products.filter((p) => p.status === 'Low Stock').length;
  const outOfStockCount = products.filter((p) => p.status === 'Out of Stock').length;

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const priceNum = parseFloat(formData.price) || 0;
    const stockNum = parseInt(formData.stock, 10) || 0;

    let computedStatus = 'In Stock';
    if (stockNum === 0) computedStatus = 'Out of Stock';
    else if (stockNum <= 15) computedStatus = 'Low Stock';

    const newProduct = {
      id: `PRD-0${products.length + 1}`,
      name: formData.name,
      sku: formData.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      image: formData.image,
      category: formData.category,
      price: priceNum,
      stock: stockNum,
      status: computedStatus,
      rating: 5.0,
      salesCount: 0,
    };

    setProducts([newProduct, ...products]);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      sku: '',
      category: 'T-shirts',
      image: '',
      price: '',
      stock: '',
      status: 'In Stock',
    });
  };

  const handleOpenEdit = (prod) => {
    setSelectedProduct(prod);
    setFormData({
      name: prod.name,
      sku: prod.sku,
      category: prod.category,
      image: prod.image || '',
      price: prod.price.toString(),
      stock: prod.stock.toString(),
      status: prod.status,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const priceNum = parseFloat(formData.price) || selectedProduct.price;
    const stockNum = parseInt(formData.stock, 10) || selectedProduct.stock;

    let computedStatus = formData.status;
    if (stockNum === 0) computedStatus = 'Out of Stock';
    else if (stockNum <= 15) computedStatus = 'Low Stock';
    else computedStatus = 'In Stock';

    setProducts((prev) =>
      prev.map((p) =>
        p.id === selectedProduct.id
          ? {
              ...p,
              name: formData.name,
              sku: formData.sku,
              category: formData.category,
              image: formData.image,
              price: priceNum,
              stock: stockNum,
              status: computedStatus,
            }
          : p
      )
    );
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleAdjustStock = (prodId, delta) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== prodId) return p;
        const newStock = Math.max(0, p.stock + delta);
        let newStatus = 'In Stock';
        if (newStock === 0) newStatus = 'Out of Stock';
        else if (newStock <= 15) newStatus = 'Low Stock';
        return { ...p, stock: newStock, status: newStatus };
      })
    );
  };

  const handleDeleteProduct = (prodId) => {
    if (window.confirm('Are you sure you want to delete this product listing?')) {
      setProducts((prev) => prev.filter((p) => p.id !== prodId));
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'in stock':
        return 'success';
      case 'low stock':
        return 'warning';
      case 'out of stock':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <div id="products-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Product Catalog & Inventory
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Monitor real-time warehouse quantities, pricing, SKUs, and stock replenishment alerts.
          </p>
        </div>

        <button
          id="products-add-btn"
          onClick={() => {
            setFormData({
              name: '',
              sku: '',
              category: 'T-shirts',
              image: '',
              price: '',
              stock: '',
              status: 'In Stock',
            });
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Product</span>
        </button>
      </div>

      {/* Stock Alerts Notice */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <span className="font-bold">Inventory Threshold Warning:</span>{' '}
              <span>
                {lowStockCount} items currently running low (&le;15 units) and{' '}
                {outOfStockCount} items depleted.
              </span>
            </div>
          </div>
          <button
            onClick={() => setStockFilter('Low Stock')}
            className="text-amber-800 dark:text-amber-300 hover:underline font-semibold whitespace-nowrap shrink-0"
          >
            Show Low Stock
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="products-search-input"
            type="text"
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by product name, SKU, category..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 hidden sm:inline">Category:</span>
            <select
              id="products-category-filter"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Level Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 hidden sm:inline">Stock:</span>
            <select
              id="products-stock-filter"
              value={stockFilter}
              onChange={(e) => {
                setStockFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Levels</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          {(localSearch || categoryFilter !== 'All' || stockFilter !== 'All') && (
            <button
              onClick={() => {
                setLocalSearch('');
                setCategoryFilter('All');
                setStockFilter('All');
                setCurrentPage(1);
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline px-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Product Info</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock Level</th>
                <th className="py-3.5 px-4">Quick Adjust</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Sales Vol.</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">
                    No products found matching active filters.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((prod) => (
                  <tr
                    key={prod.id}
                    id={`product-row-${prod.id}`}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block">
                          {prod.name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono block">
                          SKU: {prod.sku}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400">
                        <Layers className="w-3 h-3 text-slate-400" />
                        {prod.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      ${prod.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          prod.stock === 0
                            ? 'text-rose-600'
                            : prod.stock <= 15
                            ? 'text-amber-600'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {prod.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden">
                        <button
                          id={`stock-minus-${prod.id}-btn`}
                          onClick={() => handleAdjustStock(prod.id, -1)}
                          disabled={prod.stock <= 0}
                          className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-xs font-bold"
                          title="Decrease 1"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-[11px] font-mono font-medium">
                          {prod.stock}
                        </span>
                        <button
                          id={`stock-plus-${prod.id}-btn`}
                          onClick={() => handleAdjustStock(prod.id, +5)}
                          className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold"
                          title="Restock +5"
                        >
                          +5
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusBadgeVariant(prod.status)}>
                        {prod.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {prod.salesCount} sold
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          id={`edit-prod-${prod.id}-btn`}
                          onClick={() => handleOpenEdit(prod)}
                          className="p-1 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`delete-prod-${prod.id}-btn`}
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          id="products-pagination"
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredProducts.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add Product Modal */}
      <Modal
        id="add-product-modal"
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Catalog Product"
        description="Configure item details, initial inventory quantities, and pricing."
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-product-form"
              className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs"
            >
              Save Product
            </button>
          </>
        }
      >
        <form id="add-product-form" onSubmit={handleCreateProduct} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Wireless Ergonomic Vertical Mouse"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Product Image URL / Backend path *</label>
            <input type="text" required value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="/images/black-t-shirt.png" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                SKU Barcode
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g. TECH-VM-01"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="T-shirts">T-shirts</option>
                <option value="Jeans">Jeans</option>
                <option value="Shirts">Shirts</option>
                <option value="Shorts">Shorts</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Unit Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="79.99"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Initial Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="50"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        id="edit-product-modal"
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Product: ${selectedProduct?.name}`}
        description="Update pricing, SKU parameters, and inventory balance."
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-product-form"
              className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs"
            >
              Update Product
            </button>
          </>
        }
      >
        <form id="edit-product-form" onSubmit={handleSaveEdit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Product Title
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Product Image URL / Backend path</label>
            <input type="text" required value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="/images/black-t-shirt.png" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                SKU
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="T-shirts">T-shirts</option>
                <option value="Jeans">Jeans</option>
                <option value="Shirts">Shirts</option>
                <option value="Shorts">Shorts</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Unit Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
