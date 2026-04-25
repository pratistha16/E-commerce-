'use client';

import React, { useEffect, useState } from 'react';
import { adminService, UserStats } from '@/services/adminService';
import { User } from '@/types';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Store, 
  UserCircle, 
  Trash2, 
  Mail, 
  Phone, 
  BadgeCheck, 
  Search, 
  Filter,
  MoreHorizontal,
  Lock,
  Unlock,
  ArrowUpRight
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
  }, [page, search]);

  const fetchData = async () => {
    try {
      const [usersResponse, statsData] = await Promise.all([
        adminService.getUsers(page, { search }),
        adminService.getUserStats()
      ]);
      setUsers(usersResponse.results);
      setTotalPages(Math.ceil(usersResponse.count / 20));
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch user data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await adminService.toggleUserActive(id);
      fetchData();
    } catch (error) {
      console.error('Failed to toggle user status', error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return <Shield className="w-4 h-4 text-rose-600" />;
      case 'VENDOR': return <Store className="w-4 h-4 text-primary-600" />;
      case 'CUSTOMER': return <UserCircle className="w-4 h-4 text-emerald-600" />;
      default: return null;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'VENDOR': return 'bg-primary-50 text-primary-700 border-primary-100';
      case 'CUSTOMER': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  if (loading && page === 1 && !search) return (
    <div className="flex items-center justify-center h-[calc(100vh-100px)]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Users Management</h1>
          <p className="text-gray-500 font-medium">Control platform access and administrative roles.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 shadow-md transition-all duration-200">
          <UserPlus className="w-5 h-5" />
          Add Internal User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: stats?.total_users || 0, icon: Users, color: 'text-primary-600', bg: 'bg-primary-50' },
          { label: 'Verified Merchants', value: stats?.total_vendors || 0, icon: Store, color: 'text-primary-600', bg: 'bg-primary-50' },
          { label: 'Customers', value: stats?.total_customers || 0, icon: UserCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Active Sessions', value: stats?.active_users || 0, icon: Shield, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row gap-6 justify-between items-center bg-gray-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-12 pr-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:outline-none shadow-sm transition-all duration-200 font-medium text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5" />
              Advanced Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto relative">
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Identity</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Platform Role</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Contact</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-100">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-900 flex items-center gap-1.5">
                          {user.username}
                          {user.role === 'ADMIN' && <BadgeCheck className="w-4 h-4 text-indigo-500" />}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">UID: #{user.id.toString().padStart(4, '0')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border ${getRoleBadgeColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500 group-hover:text-gray-900 transition-colors">
                        <Mail className="w-3.5 h-3.5" />
                        {user.email}
                      </div>
                      {user.phone_number && (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                          <Phone className="w-3.5 h-3.5" />
                          {user.phone_number}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {user.role === 'VENDOR' && !user.is_active && (
                        <button 
                          onClick={() => handleToggleActive(user.id)}
                          className="px-4 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100 flex items-center gap-2"
                        >
                          <Unlock className="w-3 h-3" /> Approve Merchant
                        </button>
                      )}
                      <button 
                        onClick={() => handleToggleActive(user.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.is_active 
                            ? 'text-amber-600 hover:bg-amber-50' 
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={user.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {user.is_active ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                      </button>
                      <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm font-bold text-gray-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
