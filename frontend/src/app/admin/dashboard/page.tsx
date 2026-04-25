'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService, SystemStats } from '@/services/adminService';
import { motion } from 'framer-motion';
import { 
  Users, 
  Store, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  LayoutDashboard,
  Bell,
  ChevronRight,
  BarChart3,
  Search,
  CheckCircle2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '@/components/ui';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue, delay, status }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ delay }}
  >
    <Card variant="white" className="p-8 group h-full border-none shadow-sm relative overflow-hidden">
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 transition-transform group-hover:scale-110 duration-300`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        {status && (
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
            {status}
          </span>
        )}
        {trend && (
          <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${trend === 'up' ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trendValue}
          </span>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</p>
      </div>
    </Card>
  </motion.div>
);

const chartData = [
  { name: 'Jan', revenue: 400, growth: 240 },
  { name: 'Feb', revenue: 300, growth: 139 },
  { name: 'Mar', revenue: 600, growth: 980 },
  { name: 'Apr', revenue: 800, growth: 390 },
  { name: 'May', revenue: 500, growth: 480 },
  { name: 'Jun', revenue: 900, growth: 380 },
  { name: 'Jul', revenue: 700, growth: 430 },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [pendingRequests, setPendingRequests] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, pendingData] = await Promise.all([
          adminService.getSystemAnalytics(),
          adminService.getPendingTenants()
        ]);
        setStats(statsData);
        setPendingRequests(pendingData);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-100px)]">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-100 border-t-blue-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Activity className="w-6 h-6 text-blue-600 animate-pulse" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto pb-12">
      {/* System Status */}
      <div className="flex items-center justify-end gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System: Optimal</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Platform Revenue" 
          value={`$${stats?.total_revenue?.toLocaleString() || '2.4M'}`} 
          icon={DollarSign} 
          color="bg-emerald-600"
          trend="up"
          trendValue="+14.2%"
          delay={0.1}
        />
        <StatCard 
          title="Active Merchants" 
          value={stats?.total_tenants || '12,840'} 
          icon={Store} 
          color="bg-blue-600"
          trend="up"
          trendValue="+8%"
          delay={0.2}
        />
        <StatCard 
          title="User Growth" 
          value={stats?.total_users || '45.2k'} 
          icon={Users} 
          color="bg-purple-600"
          status="Stable"
          delay={0.3}
        />
        <StatCard 
          title="Pending Approvals" 
          value={stats?.pending_tenants || '142'} 
          icon={Bell} 
          color="bg-rose-600"
          status="Action Required"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Growth Bar Chart */}
        <div className="lg:col-span-2">
          <Card className="p-8 h-full border-none shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-10">
              <div>
                <CardTitle className="uppercase text-lg tracking-widest">Monthly Revenue Growth</CardTitle>
                <CardDescription>Performance comparison across Q3 - Q4</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-[10px] font-black uppercase tracking-widest px-4 border-slate-100">EXPORT CSV</Button>
                <Button className="btn-primary py-2 px-4 text-[10px] font-black uppercase tracking-widest rounded-lg">Full Report</Button>
              </div>
            </div>
            
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.revenue_over_time && stats.revenue_over_time.length > 0 ? stats.revenue_over_time : chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc', radius: 12 }}
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      border: 'none', 
                      borderRadius: '16px',
                      color: '#fff',
                      padding: '12px 16px'
                    }}
                    itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: '800' }}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="#3b82f6" 
                    radius={[8, 8, 8, 8]} 
                    barSize={40}
                  />
                  <Bar 
                    dataKey="growth" 
                    fill="#0f172a" 
                    radius={[8, 8, 8, 8]} 
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Performance Index Gauge */}
        <Card className="p-8 bg-slate-900 text-white border-none shadow-xl relative overflow-hidden flex flex-col items-center justify-center text-center">
          <div className="mb-8">
            <h3 className="text-xl font-black tracking-tight mb-2 uppercase">Platform Performance Index</h3>
            <p className="text-xs font-medium text-slate-400 leading-relaxed max-w-[200px]">
              Real-time health score based on transaction speed and server latency.
            </p>
          </div>
          
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* SVG Gauge Mockup */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="110"
                stroke="currentColor"
                strokeWidth="20"
                fill="transparent"
                className="text-slate-800"
              />
              <circle
                cx="128"
                cy="128"
                r="110"
                stroke="currentColor"
                strokeWidth="20"
                fill="transparent"
                strokeDasharray="691"
                strokeDashoffset="69.1"
                className="text-blue-500"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-7xl font-black tracking-tighter">98</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">/100</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Merchant Requests Table */}
      <Card className="p-8 border-none shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-10">
          <div>
            <CardTitle className="uppercase text-lg tracking-widest">Pending Merchant Requests</CardTitle>
            <CardDescription>Review and approve new account applications</CardDescription>
          </div>
          <Link href="/admin/merchants" className="text-xs font-black text-blue-600 hover:underline">VIEW ALL REQUESTS</Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                <th className="pb-4">Merchant / Entity</th>
                <th className="pb-4">Category</th>
                <th className="pb-4">Applied Date</th>
                <th className="pb-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pendingRequests.length > 0 ? (
                pendingRequests.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 font-black text-xs">
                          {item.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 leading-none mb-1">{item.name}</p>
                          <p className="text-xs font-bold text-slate-400">{item.schema_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6">
                      <span className="text-[10px] font-black text-slate-500 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                        PENDING APPROVAL
                      </span>
                    </td>
                    <td className="py-6 text-sm font-bold text-slate-400">
                      {new Date(item.created_on).toLocaleDateString()}
                    </td>
                    <td className="py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href="/admin/tenants" className="p-2 text-slate-400 hover:text-slate-900 transition-all">
                          <ChevronRight size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-10 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                      <p className="text-sm font-bold text-slate-500">All caught up! No pending requests.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
