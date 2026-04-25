'use client';

import React, { useEffect, useState } from 'react';
import { adminService, GlobalSettings } from '@/services/adminService';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  Settings, 
  Percent, 
  ShieldCheck, 
  Truck, 
  Save, 
  RefreshCw, 
  History, 
  Database, 
  Globe, 
  AlertTriangle,
  Server,
  Key,
  Mail,
  Bell
} from 'lucide-react';
import api from '@/lib/api';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSave] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetchSettings();
    fetchLogs();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await adminService.getGlobalSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await api.get('/tenants/audit-logs/');
      const data = response.data;
      setLogs(data.results || data);
    } catch (error) {
      console.error('Failed to fetch audit logs', error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSave(true);
    try {
      await adminService.updateGlobalSettings(settings);
      fetchLogs();
    } catch (error) {
      console.error('Failed to update settings', error);
    } finally {
      setSave(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-100px)]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <ProtectedRoute role="ADMIN">
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">System Settings</h1>
            <p className="text-gray-500 font-medium">Platform-wide governance and global configurations.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <ShieldCheck className="w-5 h-5 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Global Parameters</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white px-3 py-1.5 rounded-full border border-gray-200">
                    Auto-sync: Enabled
                  </span>
                </div>
              </div>
              
              <form onSubmit={handleSave} className="p-8 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Percent className="w-4 h-4 text-indigo-500" />
                      Platform Commission
                    </label>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">Percentage fee automatically deducted from every merchant transaction.</p>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        className="w-full pl-6 pr-12 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-white focus:outline-none transition-all font-black text-gray-900"
                        value={settings?.commission_percentage}
                        onChange={(e) => setSettings({ ...settings!, commission_percentage: parseFloat(e.target.value) })}
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-gray-400">%</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-indigo-500" />
                      Standard Tax Rate
                    </label>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">Default tax percentage applied if no regional tax rules are defined.</p>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        className="w-full pl-6 pr-12 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-white focus:outline-none transition-all font-black text-gray-900"
                        value={settings?.global_tax_percentage}
                        onChange={(e) => setSettings({ ...settings!, global_tax_percentage: parseFloat(e.target.value) })}
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-gray-400">%</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-indigo-500" />
                      Base Shipping Fee
                    </label>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">Starting shipping cost for all orders across the marketplace.</p>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-400">$</span>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full pl-10 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-white focus:outline-none transition-all font-black text-gray-900"
                        value={settings?.default_shipping_fee}
                        onChange={(e) => setSettings({ ...settings!, default_shipping_fee: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-3 px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Deploy System Changes
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <History className="w-5 h-5 text-gray-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Governance Audit Trail</h2>
                </div>
                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Export All Logs</button>
              </div>
              <div className="divide-y divide-gray-100">
                {logs.slice(0, 5).map((log, i) => (
                  <div key={i} className="p-6 flex items-start justify-between group hover:bg-gray-50/50 transition-colors">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shrink-0">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 leading-snug">{log.action.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-gray-400 font-medium mt-1">
                          <span className="font-bold text-gray-600">{log.admin_username}</span> modified <span className="font-bold text-gray-600">{log.target_model}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-gray-300 uppercase shrink-0 mt-1">{new Date(log.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-rose-50 p-8 rounded-3xl border-2 border-rose-100 space-y-5">
              <div className="flex items-center gap-3 text-rose-700">
                <AlertTriangle className="w-6 h-6" />
                <h2 className="text-lg font-black tracking-tight uppercase">System Integrity</h2>
              </div>
              <p className="text-xs text-rose-600 font-bold leading-relaxed">
                Platform-wide changes are irreversible and affect all active merchants. Ensure you have conducted a system backup before proceeding with maintenance.
              </p>
              <button className="w-full py-4 bg-rose-600 text-white font-black rounded-2xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 active:scale-95">
                Enable Maintenance Mode
              </button>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-500" />
                Infrastructure
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Main Database</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-600 uppercase">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Storage API</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-600 uppercase">Operational</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-500" />
                Security
              </h2>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-600">SMTP Settings</span>
                  </div>
                  <RefreshCw className="w-3.5 h-3.5 text-gray-300" />
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-600">Webhooks</span>
                  </div>
                  <RefreshCw className="w-3.5 h-3.5 text-gray-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
