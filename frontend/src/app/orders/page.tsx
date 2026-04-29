'use client';

import React, { useEffect, useState } from 'react';
import { OrderService } from '@/services/orderService';
import { Order } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Package, Clock, CheckCircle, Truck, XCircle, ChevronRight, Search, Filter, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const statusConfig: any = {
  PENDING: { color: 'text-amber-600', icon: Clock, bg: 'bg-amber-50', label: 'Pending' },
  PROCESSING: { color: 'text-indigo-600', icon: Package, bg: 'bg-indigo-50', label: 'Processing' },
  SHIPPED: { color: 'text-blue-600', icon: Truck, bg: 'bg-blue-50', label: 'Shipped' },
  DELIVERED: { color: 'text-emerald-600', icon: CheckCircle, bg: 'bg-emerald-50', label: 'Delivered' },
  CANCELLED: { color: 'text-rose-600', icon: XCircle, bg: 'bg-rose-50', label: 'Cancelled' },
};

import StorefrontNavbar from '@/components/landing/StorefrontNavbar';
import CartDrawer from '@/components/landing/CartDrawer';
import ProfileSidebar from '@/components/profile/ProfileSidebar';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await OrderService.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => 
    order.id.toString().includes(searchTerm) || 
    order.items.some(item => item.product.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return null;

  return (
    <ProtectedRoute>
      <StorefrontNavbar />
      <CartDrawer />
      
      <div className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <ProfileSidebar />
            
            <div className="flex-1 space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">Order History</h1>
                  <p className="text-slate-500 mt-2 font-medium">View and track all your past and current orders.</p>
                </div>
                <div className="relative w-full md:w-96 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search by order ID or product..."
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600/20 outline-none transition-all shadow-soft font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              {filteredOrders.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-32 bg-white rounded-4xl border-2 border-dashed border-slate-200"
                >
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 mb-6">
                    <Package size={40} className="text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">No orders found</h3>
                  <p className="text-slate-500 mt-2 max-w-xs mx-auto font-medium">
                    {searchTerm ? "We couldn't find any orders matching your search." : "You haven't placed any orders yet."}
                  </p>
                  <Link href="/products" className="mt-8 btn btn-primary !h-12 !px-8">
                    Start Shopping
                  </Link>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {filteredOrders.map((order, index) => {
                    const config = statusConfig[order.status] || statusConfig.PENDING;
                    const StatusIcon = config.icon;
                    return (
                      <motion.div 
                        key={order.id} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group bg-white border border-slate-100 rounded-4xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500"
                      >
                        <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex flex-wrap justify-between items-center gap-6">
                          <div className="flex gap-12">
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Date</p>
                              <p className="text-sm font-bold text-slate-900">{new Date(order.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Total</p>
                              <p className="text-sm font-black text-blue-600">${order.total_amount}</p>
                            </div>
                            <div className="hidden sm:block">
                              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Order ID</p>
                              <p className="text-sm font-bold text-slate-900 truncate">#{(order as any).order_number?.split('-')[0] || order.id}</p>
                            </div>
                          </div>
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-wider ${config.bg} ${config.color} border border-current/10`}>
                            <StatusIcon size={12} strokeWidth={3} />
                            {config.label}
                          </div>
                        </div>

                        <div className="p-8">
                          <div className="space-y-6">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-6">
                                <div className="h-20 w-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                                  <img 
                                    src={item.product.images?.[0]?.image || 'https://via.placeholder.com/100'} 
                                    alt={item.product.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                                    {item.product.name}
                                  </h4>
                                  <p className="text-xs text-slate-500 font-medium mt-1">Quantity: {item.quantity}</p>
                                  <p className="text-sm font-black text-slate-900 mt-1">${item.price}</p>
                                </div>
                                <div className="hidden md:block">
                                  <Link 
                                    href={`/products/${item.product.slug}`}
                                    className="btn btn-outline !h-10 !px-4 text-xs"
                                  >
                                    Buy Again
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                              <span className="flex items-center gap-1.5"><Calendar size={14} /> Est. Delivery: April 20, 2026</span>
                            </div>
                            <Link 
                              href={`/orders/${order.id}`}
                              className="w-full sm:w-auto btn btn-primary !h-12 !px-8 flex items-center justify-center gap-2 group"
                            >
                              View Order Details
                              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
