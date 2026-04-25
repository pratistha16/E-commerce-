'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { User, Mail, Phone, MapPin, Calendar, ShoppingBag, ShieldCheck, Camera, Heart, Settings, ArrowRight, Package, CreditCard, LogOut, Truck } from 'lucide-react';
import { OrderService } from '@/services/orderService';
import { motion } from 'framer-motion';
import RecommendedProducts from '@/components/RecommendedProducts';
import Link from 'next/link';

export default function UserProfilePage() {
  const { user, logout } = useAuth();
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

  const sidebarLinks = [
    { icon: User, label: 'Profile Information', href: '/profile', active: true },
    { icon: ShoppingBag, label: 'Order History', href: '/orders', active: false },
    { icon: Heart, label: 'My Wishlist', href: '#', active: false },
    { icon: CreditCard, label: 'Payment Methods', href: '#', active: false },
    { icon: MapPin, label: 'Saved Addresses', href: '#', active: false },
    { icon: Settings, label: 'Account Settings', href: '#', active: false },
  ];

  return (
    <ProtectedRoute>
      <div className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left: Sidebar Navigation */}
            <aside className="lg:w-80 space-y-6">
              <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-soft text-center">
                <div className="relative inline-block mb-6">
                  <div className="h-28 w-28 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-elevated">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2.5 bg-slate-900 text-white rounded-full border-4 border-white hover:scale-110 transition-transform shadow-lg">
                    <Camera size={14} />
                  </button>
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">{user?.username}</h2>
                <p className="text-primary-600 font-bold uppercase text-[10px] tracking-widest mt-1">Premium Member</p>
                
                <div className="grid grid-cols-2 gap-3 mt-8">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-xl font-black text-slate-900">{orderCount}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Orders</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-xl font-black text-slate-900">0</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Wishlist</p>
                  </div>
                </div>
              </div>

              <nav className="bg-white rounded-4xl p-6 border border-slate-100 shadow-soft">
                <div className="space-y-1">
                  {sidebarLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                        link.active 
                        ? 'bg-accent text-white shadow-lg shadow-indigo-600/10' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <link.icon size={18} className={link.active ? 'text-white' : 'text-slate-400'} />
                      {link.label}
                    </Link>
                  ))}
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all mt-4"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              </nav>
            </aside>

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
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all outline-none"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                      <input
                        type="text"
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all outline-none"
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
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all outline-none resize-none"
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

              {/* Order Tracking Quick View */}
              <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-4xl p-10 text-white shadow-elevated overflow-hidden relative">
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
                <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
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
                      <Package size={64} className="text-accent" />
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
