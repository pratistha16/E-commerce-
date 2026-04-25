'use client';

import React, { useEffect, useState } from 'react';
import { adminService, SystemStats } from '@/services/adminService';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Store, 
  ShoppingBag, 
  DollarSign, 
  BarChart3, 
  PieChart as PieChartIcon, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#819581', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getSystemAnalytics();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExport = async (resource: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/tenants/analytics/export/?resource=${resource}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resource}_report.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Failed to export CSV', error);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-100px)]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  const pieData = stats?.top_tenants.map((t: any) => ({
    name: t.vendor__store_name,
    value: t.revenue
  })) || [];

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto pb-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Platform Analytics</h1>
          <p className="text-slate-500 font-medium text-lg">Deep dive into cross-merchant growth and performance.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button 
            onClick={() => handleExport('revenue')}
            variant="outline"
            className="flex-1 md:flex-none border-slate-200 bg-white"
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export Revenue
          </Button>
          <Button 
            onClick={() => handleExport('tenants')}
            className="flex-1 md:flex-none"
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export Merchants
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Revenue Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-[2.5rem] shadow-soft border border-slate-100 hover:shadow-card transition-shadow"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 rounded-2xl">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Monthly Revenue Growth</h2>
                  <p className="text-sm font-medium text-slate-400 mt-0.5">Platform-wide earnings trend</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-black text-slate-500 uppercase">Last 6 Months</span>
              </div>
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.revenue_over_time}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                    tickFormatter={(val) => val.split('-')[1] + '/' + val.split('-')[0].slice(2)}
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                    tickFormatter={(val) => `$${val >= 1000 ? (val/1000) + 'k' : val}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      border: 'none', 
                      borderRadius: '16px',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      padding: '12px 16px'
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#4f46e5" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-10 rounded-[2.5rem] shadow-soft border border-slate-100 hover:shadow-card transition-shadow"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-purple-50 rounded-2xl">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">User Acquisition</h3>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">New signups monthly</p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-5xl font-black text-slate-900 tracking-tighter">{stats?.total_users}</p>
                  <p className="text-sm font-bold text-emerald-500 mt-3 flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" />
                    +12% vs last month
                  </p>
                </div>
                <div className="h-20 w-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats?.revenue_over_time?.slice(-5)}>
                      <Line type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={3} dot={false} animationDuration={2000} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-10 rounded-[2.5rem] shadow-soft border border-slate-100 hover:shadow-card transition-shadow"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-amber-50 rounded-2xl">
                  <ShoppingBag className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Order Volume</h3>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">Global transaction count</p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-5xl font-black text-slate-900 tracking-tighter">{stats?.total_orders}</p>
                  <p className="text-sm font-bold text-emerald-500 mt-3 flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" />
                    +8.5% vs last month
                  </p>
                </div>
                <div className="h-20 w-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats?.revenue_over_time?.slice(-5)}>
                      <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} animationDuration={2000} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Revenue Share Pie Chart */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 rounded-[2.5rem] shadow-soft border border-slate-100 hover:shadow-card transition-shadow"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-rose-50 rounded-2xl">
                <PieChartIcon className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">Market Share</h2>
                <p className="text-sm font-medium text-slate-400 mt-0.5">Revenue by top merchants</p>
              </div>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                    animationDuration={2000}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      border: 'none', 
                      borderRadius: '16px',
                      color: '#fff',
                      fontSize: '11px',
                      padding: '8px 12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 space-y-4">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors truncate max-w-[140px]">{entry.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900 tracking-tight">${entry.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Platform Revenue Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-indigo-600 to-violet-700 p-10 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <DollarSign className="w-32 h-32" />
            </div>
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
              <DollarSign className="w-6 h-6" />
              Platform Earnings
            </h2>
            <div className="space-y-8 relative z-10">
              <div>
                <p className="text-xs font-black opacity-60 uppercase tracking-[0.2em] mb-2">Gross Revenue</p>
                <p className="text-4xl font-black tracking-tighter">${stats?.total_revenue?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-black opacity-60 uppercase tracking-[0.2em] mb-2">Net Commission (10%)</p>
                <p className="text-4xl font-black tracking-tighter text-emerald-400">${((stats?.total_revenue || 0) * 0.1).toLocaleString()}</p>
              </div>
              <Button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-black rounded-[1.5rem] mt-4 shadow-none">
                View Payout Reports
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
