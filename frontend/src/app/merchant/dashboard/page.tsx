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
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardTitle, Button } from '@/components/ui';
import { MerchantService } from '@/services/merchantService';

export default function MerchantDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [analyticsData, ordersData, productsData] = await Promise.all([
          MerchantService.getAnalytics(),
          api.get('/merchant/orders/').then(res => res.data.results || res.data),
          MerchantService.getProducts()
        ]);
        
        setAnalytics(analyticsData);
        setOrders(ordersData.slice(0, 5));
        setLowStockProducts(productsData.filter((p: any) => p.stock < 10));
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
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
      <Card variant="white" className="p-8 group relative overflow-hidden h-full">
        <div className="flex justify-between items-start mb-8">
          <div className={`p-3 rounded-2xl ${color} bg-opacity-10 transition-transform group-hover:scale-110 duration-300`}>
            <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
          </div>
          {trend && (
            <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${isUp ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'}`}>
              {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {trend}
            </span>
          )}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
        </div>
        <div className="mt-6 flex items-end gap-1 h-8 opacity-40">
          {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
            <div key={i} className={`flex-1 ${color} rounded-sm`} style={{ height: `${h}%` }} />
          ))}
        </div>
      </Card>
    </motion.div>
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-100 border-t-blue-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Activity className="w-6 h-6 text-blue-600 animate-pulse" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Store Dashboard</h1>
          <p className="text-sm font-bold text-slate-400 mt-1">Welcome back, Architect Commerce</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white border border-slate-100 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2 shadow-sm">
            <Clock size={16} className="text-slate-400" />
            Oct 1, 2024 - Oct 31, 2024
          </div>
          <button className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-slate-900 rounded-xl transition-all shadow-sm">
            <Bell size={20} />
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Sales" 
          value={`$${analytics?.total_revenue?.toLocaleString() || '45,231.89'}`} 
          trend="+12.5%" 
          isUp={true} 
          icon={DollarSign} 
          color="bg-emerald-600" 
          delay={0.1}
        />
        <StatCard 
          label="Active Orders" 
          value={analytics?.total_orders || '142'} 
          trend="8 Pending" 
          isUp={true} 
          icon={ShoppingBag} 
          color="bg-blue-600" 
          delay={0.2}
        />
        <StatCard 
          label="Top Product" 
          value="Bauhaus Side Table" 
          trend="Customer Growth" 
          isUp={true} 
          icon={Package} 
          color="bg-slate-900" 
          delay={0.3}
        />
        <StatCard 
          label="Conversion Rate" 
          value="4.8%" 
          trend="+2.1%" 
          isUp={true} 
          icon={TrendingUp} 
          color="bg-purple-600" 
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2">
          <Card className="p-8 h-full border-none shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <CardTitle className="uppercase text-lg tracking-widest">Recent Orders</CardTitle>
              <Link href="/merchant/dashboard/orders" className="text-xs font-black text-blue-600 hover:underline">VIEW ALL</Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    <th className="pb-4">Order ID</th>
                    <th className="pb-4">Customer</th>
                    <th className="pb-4">Product</th>
                    <th className="pb-4">Amount</th>
                    <th className="pb-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[1, 2, 3, 4].map((i) => (
                    <tr key={i} className="group hover:bg-slate-50 transition-colors">
                      <td className="py-5 text-xs font-bold text-slate-400">#ORD-829{i}</td>
                      <td className="py-5 text-sm font-black text-slate-900">
                        {['Elena Rodriguez', 'Marcus Chen', 'Sophie Vane', 'Julian Blake'][i-1]}
                      </td>
                      <td className="py-5 text-sm font-bold text-slate-500">
                        {['Brutalist Lamp', 'Glass Vessel V2', 'Oak Frame Set', 'Bauhaus Side Table'][i-1]}
                      </td>
                      <td className="py-5 text-sm font-black text-slate-900">$245.00</td>
                      <td className="py-5">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          i === 1 ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {i === 1 ? 'Delivered' : 'Processing'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Store Insights */}
        <div className="space-y-6">
          <Card className="p-8 border-none shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="text-rose-500 w-5 h-5" />
              <h3 className="text-sm font-black uppercase tracking-widest">Inventory Alert</h3>
            </div>
            <p className="text-xs font-medium text-slate-500 mb-6 leading-relaxed">
              3 items are below safety stock levels: Brutalist Lamp, Glass Vessel V2.
            </p>
            <Button variant="outline" size="sm" className="w-full text-[10px] font-black uppercase tracking-widest border-slate-100">
              RESTOCK NOW
            </Button>
          </Card>

          <Card className="p-8 border-none shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="text-blue-600 w-5 h-5" />
              <h3 className="text-sm font-black uppercase tracking-widest">Growth Opportunity</h3>
            </div>
            <p className="text-xs font-medium text-slate-500 mb-6 leading-relaxed">
              Customers searching for "Outdoor Minimalist" increased by 22% this week.
            </p>
            <Link href="/merchant/dashboard/analytics" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">
              VIEW TRENDS <ChevronRight size={12} />
            </Link>
          </Card>

          <Card className="p-8 bg-slate-900 text-white border-none shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Globe size={80} />
            </div>
            <h3 className="text-lg font-black tracking-tight mb-2 uppercase">Scale Your Reach</h3>
            <p className="text-xs font-medium text-slate-400 mb-8 leading-relaxed">
              Unlock international shipping for your European customers today.
            </p>
            <Button className="w-full py-4 text-[10px] font-black uppercase tracking-widest rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
              GET STARTED
            </Button>
          </Card>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-10 right-10 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <Plus size={24} />
      </button>
    </div>
  );
}
