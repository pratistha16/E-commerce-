'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { User, Mail, Phone, MapPin, Calendar, ShoppingBag, ShieldCheck, Camera, Heart, Settings, ArrowRight, Package, CreditCard, LogOut, Truck, ShoppingCart } from 'lucide-react';
import { OrderService } from '@/services/orderService';
import { motion, AnimatePresence } from 'framer-motion';
import RecommendedProducts from '@/components/RecommendedProducts';
import StorefrontNavbar from '@/components/landing/StorefrontNavbar';
import CartDrawer from '@/components/landing/CartDrawer';
import Link from 'next/link';

import ProfileSidebar from '@/components/profile/ProfileSidebar';

export default function UserProfilePage() {
  const { user, logout } = useAuth();
  const { totalItems, setIsCartOpen, items, totalPrice } = useCart();
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    address: user?.address || '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        phone_number: user.phone_number || '',
        address: user.address || '',
      });
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const orders = await OrderService.getOrders();
      setOrderCount(orders.length);
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    try {
      await api.patch('/auth/me/', formData);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <StorefrontNavbar />
      <CartDrawer />
      
      <div className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            <ProfileSidebar />

            {/* Right: Main Content */}
            <main className="flex-1 space-y-8">
              <section className="bg-white rounded-4xl p-10 border border-slate-100 shadow-soft">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Profile Information</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Manage your personal details and account settings.</p>
                  </div>
                  <ShieldCheck size={32} className="text-emerald-500" />
                </div>

                {success && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-sm font-bold"
                  >
                    {success}
                  </motion.div>
                )}

                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                      <input
                        type="text"
                        disabled
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-400 cursor-not-allowed"
                        value={user?.username || ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input
                        type="email"
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                      <input
                        type="text"
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none"
                        value={formData.phone_number}
                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Member Since</label>
                      <div className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-900 flex items-center gap-3">
                        <Calendar size={18} className="text-slate-400" />
                        <span>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Primary Address</label>
                    <textarea
                      rows={3}
                      placeholder="Street address, City, State, ZIP"
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none resize-none"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary !h-14 !px-10 text-base"
                    >
                      {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                    </button>
                  </div>
                </form>
              </section>

              {/* Cart Quick View Section */}
              <section className="bg-white rounded-4xl p-10 border border-slate-100 shadow-soft">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Shopping Bag</h2>
                    <p className="text-slate-500 text-sm font-medium mt-1">You have {totalItems} items in your cart.</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <ShoppingCart size={24} />
                  </div>
                </div>

                {items.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      {items.slice(0, 3).map((item) => (
                        <div key={item.product.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="h-16 w-16 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-slate-100">
                            <img 
                              src={item.product.images?.[0]?.image || 'https://via.placeholder.com/150'} 
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 truncate">{item.product.name}</h4>
                            <p className="text-xs text-slate-500 font-medium">Qty: {item.quantity} • ${item.product.price}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-slate-900">${(item.product.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {items.length > 3 && (
                      <p className="text-center text-xs font-bold text-slate-400 py-2">
                        + {items.length - 3} more items
                      </p>
                    )}
                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Value</p>
                        <p className="text-2xl font-black text-slate-900">${totalPrice.toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => setIsCartOpen(true)}
                        className="btn btn-primary !h-12 !px-8 text-sm"
                      >
                        View Full Cart
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-500 font-medium mb-4">Your bag is currently empty.</p>
                    <Link href="/products" className="text-blue-600 font-black text-sm uppercase tracking-widest hover:underline">
                      Start Shopping
                    </Link>
                  </div>
                )}
              </section>

              {/* Order Tracking Quick View */}
              <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-4xl p-10 text-white shadow-elevated overflow-hidden relative">
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
                <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Latest Order Status
                    </div>
                    <h2 className="text-3xl font-black tracking-tight">Your package is on its way!</h2>
                    <p className="text-slate-400 font-medium max-w-sm">Order #88219 is currently out for delivery and should arrive by 6:00 PM today.</p>
                    <Link href="/orders" className="btn bg-white text-slate-900 !h-12 !px-8 hover:bg-slate-100 transition-all">
                      Track Package
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="h-40 w-40 border-8 border-slate-700 rounded-full flex items-center justify-center">
                      <Package size={64} className="text-blue-600" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-3 rounded-full border-4 border-slate-800">
                      <Truck size={20} className="text-white" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Recommendations */}
              <RecommendedProducts className="pt-8" />
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
