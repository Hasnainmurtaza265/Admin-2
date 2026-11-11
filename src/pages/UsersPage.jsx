import React, { useState, useMemo } from 'react';
import {
  Search,
  UserPlus,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  Building,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import Badge from '../components/common/Badge.jsx';
import Modal from '../components/common/Modal.jsx';
import Pagination from '../components/common/Pagination.jsx';

export default function UsersPage({
  users = [],
  setUsers,
  searchTerm = '',
  readOnly = false,
}) {
  const [localSearch, setLocalSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Customer',
    status: 'Active',
    department: 'Engineering',
    phone: '',
  });

  const query = (searchTerm || localSearch).toLowerCase().trim();

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchQuery =
        !query ||
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.id.toLowerCase().includes(query) ||
        u.department?.toLowerCase().includes(query);

      const matchRole = roleFilter === 'All' || u.role === roleFilter;
      const matchStatus = statusFilter === 'All' || u.status === statusFilter;

      return matchQuery && matchRole && matchStatus;
    });
  }, [users, query, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      role: 'Customer',
      status: 'Active',
      department: 'Engineering',
      phone: '',
    });
    setIsAddModalOpen(true);
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const newUser = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status,
      department: formData.department,
      phone: formData.phone || '+1 (555) 000-1122',
      joinedDate: new Date().toISOString().split('T')[0],
      totalSpend: 0.0,
      lastLogin: 'Just now',
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
    };

    setUsers([newUser, ...users]);
    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      department: user.department || 'Operations',
      phone: user.phone || '',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id ? { ...u, ...formData } : u
      )
    );
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to remove this user from the directory?')) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
  };

  const handleOpenView = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'suspended':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'purple';
      case 'manager':
        return 'info';
      case 'editor':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div id="users-page" className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            User Accounts & Directory
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Customer directory from Shop.Co order records. Customer account editing is not available in the current Shop.Co API.
          </p>
        </div>

        {!readOnly && <button id="add-new-user-btn" onClick={handleOpenAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"><UserPlus className="w-4 h-4" /><span>Add New User</span></button>}
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="users-search-input"
            type="text"
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, email, department..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Role Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 hidden sm:inline">Role:</span>
            <select
              id="users-role-filter"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Editor">Editor</option>
              <option value="Customer">Customer</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 hidden sm:inline">Status:</span>
            <select
              id="users-status-filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {(localSearch || roleFilter !== 'All' || statusFilter !== 'All') && (
            <button
              onClick={() => {
                setLocalSearch('');
                setRoleFilter('All');
                setStatusFilter('All');
                setCurrentPage(1);
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline px-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Total Spend</th>
                <th className="py-3.5 px-4">Last Active</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No users found matching current filters.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    id={`user-row-${user.id}`}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white block">
                            {user.name}
                          </span>
                          <span className="text-[11px] text-slate-400 block truncate max-w-[170px]">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusBadgeVariant(user.status)}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {user.department || 'General'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      ${user.totalSpend?.toFixed(2) || '0.00'}
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {user.lastLogin}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          id={`view-user-${user.id}-btn`}
                          onClick={() => handleOpenView(user)}
                          className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View Profile Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {!readOnly && <button
                          id={`edit-user-${user.id}-btn`}
                          onClick={() => handleOpenEdit(user)}
                          className="p-1 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit User"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>}
                        {!readOnly && <button
                          id={`delete-user-${user.id}-btn`}
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>}
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
          id="users-pagination"
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add User Modal */}
      <Modal
        id="add-user-modal"
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New User Account"
        description="Provision credentials and assign system access permissions."
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
              form="add-user-form"
              className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs"
            >
              Create Account
            </button>
          </>
        }
      >
        <form id="add-user-form" onSubmit={handleCreateUser} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Alex Morgan"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Work Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="alex.m@company.com"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Access Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Customer">Customer</option>
                <option value="Editor">Editor</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="Engineering"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        id="edit-user-modal"
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit User: ${selectedUser?.name}`}
        description="Update contact credentials or adjust administrative authorization."
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
              form="edit-user-form"
              className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs"
            >
              Save Changes
            </button>
          </>
        }
      >
        <form id="edit-user-form" onSubmit={handleSaveEdit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Full Name
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
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Work Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Access Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Customer">Customer</option>
                <option value="Editor">Editor</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* User Details Drawer / Modal */}
      {selectedUser && (
        <Modal
          id="view-user-modal"
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedUser(null);
          }}
          title="User Profile Dossier"
          description={`ID: ${selectedUser.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-xs"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedUser.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={getRoleBadgeVariant(selectedUser.role)}>
                    {selectedUser.role}
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(selectedUser.status)}>
                    {selectedUser.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">Email Address</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  {selectedUser.email}
                </span>
              </div>

              <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">Telephone</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-500" />
                  {selectedUser.phone || 'N/A'}
                </span>
              </div>

              <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">Department Unit</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-blue-500" />
                  {selectedUser.department}
                </span>
              </div>

              <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">Date Registered</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  {selectedUser.joinedDate}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-blue-700 dark:text-blue-300 block">
                  Cumulative Lifetime Spend
                </span>
                <span className="text-lg font-bold text-blue-900 dark:text-blue-200">
                  ${selectedUser.totalSpend?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Last Active Session</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {selectedUser.lastLogin}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
