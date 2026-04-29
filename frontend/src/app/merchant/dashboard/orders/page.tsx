'use client';

import React, { useEffect, useState } from 'react';
import { MerchantService } from '@/services/merchantService';
import { Order } from '@/types';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle, 
  Search, 
  Filter, 
  Download,
  ShoppingBag,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  User,
  ArrowUpDown,
  DollarSign
} from 'lucide-react';
import { Card, CardTitle, Button } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';

const statusConfig: any = {
  PENDING: { color: 'text-amber-600', icon: Clock, bg: 'bg-amber-50', border: 'border-amber-100' },
  PROCESSING: { color: 'text-blue-600', icon: Package, bg: 'bg-blue-50', border: 'border-blue-100' },
  SHIPPED: { color: 'text-indigo-600', icon: Truck, bg: 'bg-indigo-50', border: 'border-indigo-100' },
  DELIVERED: { color: 'text-emerald-600', icon: CheckCircle, bg: 'bg-emerald-50', border: 'border-emerald-100' },
  CANCELLED: { color: 'text-rose-600', icon: XCircle, bg: 'bg-rose-50', border: 'border-rose-100' },
};

export default function MerchantOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await MerchantService.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await MerchantService.updateOrderStatus(orderId, newStatus);
      fetchOrders(); // Refresh list
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = (order.id.toString().includes(searchTerm)) || 
                         ((order as any).user_email?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = activeFilter === 'ALL' || order.status === activeFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Order Management</h1>
          <p className="text-sm font-bold text-slate-400 mt-1">Track, process, and fulfill your customer orders</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="!h-11 !px-5 !rounded-xl text-xs font-black uppercase tracking-widest border-slate-100 shadow-sm flex items-center gap-2">
            <Download size={16} />
            Export Orders
          </Button>
          <Button className="!h-11 !px-6 !rounded-xl text-xs font-black uppercase tracking-widest bg-slate-900 text-white shadow-xl">
            Batch Fulfill
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-none shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</p>
            <p className="text-xl font-black text-slate-900">{orders.filter(o => o.status === 'PENDING').length}</p>
          </div>
        </Card>
        <Card className="p-6 border-none shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Package size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processing</p>
            <p className="text-xl font-black text-slate-900">{orders.filter(o => o.status === 'PROCESSING').length}</p>
          </div>
        </Card>
        <Card className="p-6 border-none shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed</p>
            <p className="text-xl font-black text-slate-900">{orders.filter(o => o.status === 'DELIVERED').length}</p>
          </div>
        </Card>
        <Card className="p-6 border-none shadow-sm flex items-center gap-4">
          <div className="p-3 bg-slate-900 text-white rounded-xl">
            <DollarSign size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Sales</p>
            <p className="text-xl font-black text-slate-900">${orders.reduce((acc, o) => acc + (o.status === 'DELIVERED' ? Number(o.total_amount) : 0), 0).toLocaleString()}</p>
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-soft space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer Email..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-600/10 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl shrink-0">
            {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeFilter === filter 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-4xl border border-slate-100 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Order</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Product Info</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredOrders.map((order, index) => {
                  const config = statusConfig[order.status] || statusConfig.PENDING;
                  const StatusIcon = config.icon;
                  return (
                    <motion.tr 
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <p className="font-black text-slate-900 text-sm">#{order.id}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900">{(order as any).user_name || 'Guest User'}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Mail size={10} className="text-slate-300" />
                              <p className="text-[10px] font-medium text-slate-400 lowercase italic">{(order as any).user_email || 'no-email@store.com'}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <span className="h-6 w-6 bg-slate-100 rounded text-[10px] font-black flex items-center justify-center text-slate-500">
                            {order.items?.length || 0}
                          </span>
                          <span className="text-xs font-bold text-slate-600">Items Ordered</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-slate-900">${Number(order.total_amount).toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter mt-0.5">Paid via Stripe</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.bg} ${config.color} ${config.border}`}>
                          <StatusIcon size={12} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{order.status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            className="bg-slate-50 border-none text-[10px] font-black uppercase tracking-widest rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600/10 cursor-pointer"
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          >
                            {Object.keys(statusConfig).map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                          <Button variant="outline" className="!p-2.5 !rounded-xl border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all">
                            <Eye size={18} />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-32 text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="mx-auto h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                        <ShoppingBag size={48} />
                      </div>
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">No orders found</h3>
                      <p className="text-sm font-medium text-slate-400 max-w-xs mx-auto">
                        {searchTerm ? `We couldn't find any orders matching "${searchTerm}"` : "You haven't received any orders yet. Time to promote your store!"}
                      </p>
                      {searchTerm && (
                        <button 
                          onClick={() => setSearchTerm('')}
                          className="mt-6 text-xs font-black text-blue-600 hover:underline uppercase tracking-widest"
                        >
                          Clear Search
                        </button>
                      )}
                    </motion.div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Showing <span className="text-slate-900">1</span> to <span className="text-slate-900">{filteredOrders.length}</span> of <span className="text-slate-900">{orders.length}</span> entries
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all shadow-sm" disabled>
              <ChevronLeft size={18} />
            </button>
            <button className="p-2 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
