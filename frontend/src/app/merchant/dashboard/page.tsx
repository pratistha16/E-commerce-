'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Package,
  Activity,
  ChevronRight,
  AlertCircle,
  Lightbulb,
  Plus,
  Bell,
  Globe,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardTitle, Button } from '@/components/ui';
import { MerchantService } from '@/services/merchantService';

export default function MerchantDashboard() {
  const [data, setData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [analyticsData, ordersData] = await Promise.all([
          MerchantService.getAnalytics(),
          MerchantService.getOrders()
        ]);
        
        setData(analyticsData);
        setOrders(Array.isArray(ordersData) ? ordersData.slice(0, 5) : []);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const StatCard = ({ label, value, trend, isUp, icon: Icon, color, delay }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="p-8 group relative overflow-hidden h-full border-none shadow-sm hover:shadow-md transition-all duration-500">
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div className={`p-4 rounded-2xl ${color} bg-opacity-10 transition-all group-hover:scale-110 group-hover:rotate-3 duration-500`}>
            <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
          </div>
          {trend && (
            <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${isUp ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'}`}>
              {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {trend}
            </span>
          )}
        </div>
        <div className="relative z-10">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
          <p className="text-4xl font-black text-slate-900 tracking-tight">{value}</p>
        </div>
        
        {/* Background Decor */}
        <div className={`absolute -right-4 -bottom-4 w-32 h-32 rounded-full ${color} opacity-[0.03] blur-2xl group-hover:opacity-[0.08] transition-opacity duration-500`} />
      </Card>
    </motion.div>
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="relative">
        <div className="animate-spin rounded-full h-20 w-20 border-[3px] border-slate-100 border-t-blue-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Activity className="w-8 h-8 text-blue-600 animate-pulse" />
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10 bg-white rounded-4xl border border-slate-100 shadow-soft">
      <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6">
        <AlertCircle size={40} />
      </div>
      <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Sync Error</h2>
      <p className="text-slate-500 font-medium max-w-sm mb-8">We couldn't establish a connection with your store's database. Please check your network or try again.</p>
      <Button onClick={() => window.location.reload()} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest">
        RETRY CONNECTION
      </Button>
    </div>
  );

  return (
    <div className="space-y-12 pb-24 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Live Status</div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Command Center</h1>
          <p className="text-slate-400 font-bold mt-2 uppercase text-[11px] tracking-widest">Overview of your merchant ecosystem</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white border border-slate-100 px-5 py-3 rounded-2xl text-[10px] font-black text-slate-500 flex items-center gap-3 shadow-sm uppercase tracking-widest">
            <Calendar size={14} className="text-slate-400" />
            Oct 25, 2024
          </div>
          <button className="relative p-3 bg-white border border-slate-100 text-slate-400 hover:text-slate-900 rounded-2xl transition-all shadow-sm group">
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Revenue" 
          value={`$${data?.stats?.total_revenue?.toLocaleString() || '0'}`} 
          trend="+14.2%" 
          isUp={true} 
          icon={DollarSign} 
          color="bg-emerald-600" 
          delay={0.1}
        />
        <StatCard 
          label="Order Volume" 
          value={data?.stats?.total_orders || '0'} 
          trend="Real-time" 
          isUp={true} 
          icon={ShoppingBag} 
          color="bg-blue-600" 
          delay={0.2}
        />
        <StatCard 
          label="Top Performer" 
          value={data?.top_selling?.[0]?.product__name || 'None'} 
          trend={data?.top_selling?.[0]?.total_sold ? `${data.top_selling[0].total_sold} Units` : 'N/A'} 
          isUp={true} 
          icon={Package} 
          color="bg-slate-900" 
          delay={0.3}
        />
        <StatCard 
          label="Growth Rate" 
          value="8.4%" 
          trend="+1.2%" 
          isUp={true} 
          icon={TrendingUp} 
          color="bg-purple-600" 
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2">
          <Card className="p-10 h-full border-none shadow-soft rounded-4xl bg-white overflow-hidden relative">
            <div className="flex items-center justify-between mb-12">
              <div>
                <CardTitle className="uppercase text-lg tracking-[0.2em] font-black">Recent Orders</CardTitle>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Latest 5 transactions</p>
              </div>
              <Link 
                href="/merchant/dashboard/orders" 
                className="group flex items-center gap-2 text-[10px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest"
              >
                Full Ledger <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50">
                    <th className="pb-6">Order ID</th>
                    <th className="pb-6">Customer</th>
                    <th className="pb-6 text-center">Amount</th>
                    <th className="pb-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id} className="group hover:bg-slate-50/50 transition-all">
                        <td className="py-6 text-[11px] font-black text-slate-400 uppercase">#{order.id}</td>
                        <td className="py-6">
                          <p className="text-sm font-black text-slate-900 tracking-tight">
                            {order.user_email || 'Anonymous Guest'}
                          </p>
                        </td>
                        <td className="py-6 text-sm font-black text-slate-900 text-center tracking-tight">
                          ${Number(order.total_amount).toLocaleString()}
                        </td>
                        <td className="py-6 text-right">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 ${
                            order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600' : 
                            order.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                            'bg-blue-50 text-blue-600'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              order.status === 'DELIVERED' ? 'bg-emerald-500' : 
                              order.status === 'PENDING' ? 'bg-amber-500' : 'bg-blue-500'
                            }`} />
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-24 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
                            <ShoppingBag size={32} />
                          </div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">No Recent Orders</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Store Insights */}
        <div className="space-y-8">
          <Card className="p-10 border-none shadow-soft rounded-4xl bg-white group relative overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Lightbulb size={24} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em]">Intelligence</h3>
            </div>
            <p className="text-xs font-bold text-slate-500 mb-8 leading-relaxed uppercase tracking-tight">
              Customers searching for <span className="text-slate-900">"Minimalist"</span> increased by 22% this week. Consider adding more inventory in this category.
            </p>
            <Link href="/merchant/dashboard/analytics" className="inline-flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
              EXPLORE TRENDS <ChevronRight size={14} />
            </Link>
            
            {/* Background Decor */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-50 rounded-full opacity-50 blur-3xl" />
          </Card>

          <Card className="p-10 bg-slate-950 text-white border-none shadow-2xl rounded-4xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
              <Globe size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                <TrendingUp size={24} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-black tracking-tighter mb-4 uppercase leading-none">Scale Your Reach</h3>
              <p className="text-xs font-medium text-slate-400 mb-10 leading-relaxed">
                Unlock international fulfillment for your European and Asian customers with one click.
              </p>
              <Button className="w-full py-6 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                EXPAND GLOBALLY
              </Button>
            </div>
          </Card>
          
          <div className="bg-slate-50 p-8 rounded-4xl border border-dashed border-slate-200 flex flex-col items-center text-center group cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all">
             <div className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:scale-110 transition-all mb-4">
               <Plus size={24} />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Promotion</p>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.button 
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-12 right-12 w-16 h-16 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-center transition-all z-50 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <Plus size={28} className="relative z-10" />
      </motion.button>
    </div>
  );
}

