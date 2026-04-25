'use client';

import React, { useEffect, useState } from 'react';
import { MerchantService } from '@/services/merchantService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar,
  Filter,
  Download,
  Loader2
} from 'lucide-react';
import { Card, CardTitle, Button } from '@/components/ui';
import { motion } from 'framer-motion';

export default function MerchantAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await MerchantService.getAnalytics();
      setData(response);
    } catch (err) {
      console.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ label, value, trend, isUp, icon: Icon, delay }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="p-8 border-none shadow-sm relative overflow-hidden group">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
            <Icon className="w-6 h-6 text-slate-900 group-hover:text-blue-600 transition-colors" />
          </div>
          <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend}
          </div>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
      </Card>
    </motion.div>
  );

  if (loading && !data) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Revenue Analytics</h1>
          <p className="text-sm font-bold text-slate-400 mt-1">Deep dive into your store's performance and growth</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white border border-slate-100 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-600/10 shadow-sm"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <Button variant="outline" className="!h-11 !px-5 !rounded-xl text-xs font-black uppercase tracking-widest border-slate-100 shadow-sm flex items-center gap-2">
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Gross Revenue" 
          value={`$${data?.stats?.total_revenue?.toLocaleString() || '0'}`} 
          trend="+12.4%" 
          isUp={true} 
          icon={DollarSign} 
          delay={0.1}
        />
        <StatCard 
          label="Total Orders" 
          value={data?.stats?.total_orders || '0'} 
          trend="+8.2%" 
          isUp={true} 
          icon={ShoppingBag} 
          delay={0.2}
        />
        <StatCard 
          label="Avg. Order Value" 
          value={`$${(data?.stats?.total_revenue / (data?.stats?.total_orders || 1)).toFixed(2)}`} 
          trend="-2.1%" 
          isUp={false} 
          icon={TrendingUp} 
          delay={0.3}
        />
        <StatCard 
          label="Store Visitors" 
          value="12.4k" 
          trend="+18.5%" 
          isUp={true} 
          icon={Users} 
          delay={0.4}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8 border-none shadow-sm h-[500px] flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <div>
              <CardTitle className="uppercase text-sm tracking-[0.2em] mb-1">Revenue Stream</CardTitle>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Daily performance over time</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Revenue</span>
            </div>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.charts?.daily_revenue || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    padding: '12px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#2563eb" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8 border-none shadow-sm h-[500px] flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <div>
              <CardTitle className="uppercase text-sm tracking-[0.2em] mb-1">Sales by Product</CardTitle>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Your top performing items</p>
            </div>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.top_selling || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="product__name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  width={150}
                  tick={{ fontSize: 10, fontWeight: 800, fill: '#1e293b' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} 
                />
                <Bar 
                  dataKey="revenue" 
                  fill="#1e293b" 
                  radius={[0, 10, 10, 0]} 
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Product performance table */}
      <Card className="p-8 border-none shadow-sm overflow-hidden">
        <CardTitle className="uppercase text-sm tracking-[0.2em] mb-10">Detailed Product Performance</CardTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                <th className="pb-4">Product Name</th>
                <th className="pb-4 text-center">Units Sold</th>
                <th className="pb-4 text-center">Gross Revenue</th>
                <th className="pb-4 text-center">Avg. Margin</th>
                <th className="pb-4 text-right">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {(data?.top_selling || []).map((item: any, index: number) => (
                <tr key={index} className="group hover:bg-slate-50 transition-colors">
                  <td className="py-6 text-sm font-black text-slate-900 uppercase tracking-tight">{item.product__name}</td>
                  <td className="py-6 text-sm font-bold text-slate-500 text-center">{item.total_sold} Units</td>
                  <td className="py-6 text-sm font-black text-slate-900 text-center">${item.revenue?.toLocaleString()}</td>
                  <td className="py-6 text-sm font-bold text-emerald-600 text-center">64%</td>
                  <td className="py-6 text-right">
                    <div className="flex items-center justify-end gap-2 text-emerald-500">
                      <ArrowUpRight size={14} />
                      <span className="text-[10px] font-black uppercase">+14.2%</span>
                    </div>
                  </td>
                </tr>
              ))}
              {(data?.top_selling || []).length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    Insufficient data for detailed analysis
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
