'use client';

import React, { useEffect, useState } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  User, 
  Clock, 
  Activity, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import api from '@/lib/api';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    action: '',
    target_model: ''
  });

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    try {
      let url = '/tenants/audit-logs/';
      const params = new URLSearchParams();
      if (filters.action) params.append('action', filters.action);
      if (filters.target_model) params.append('target_model', filters.target_model);
      
      const response = await api.get(`${url}?${params.toString()}`);
      setLogs(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch audit logs', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.admin_username?.toLowerCase().includes(search.toLowerCase()) ||
    log.action?.toLowerCase().includes(search.toLowerCase()) ||
    log.target_model?.toLowerCase().includes(search.toLowerCase())
  );

  const getActionColor = (action: string) => {
    if (action.includes('DELETE')) return 'text-red-600 bg-red-50 border-red-100';
    if (action.includes('CREATE')) return 'text-green-600 bg-green-50 border-green-100';
    if (action.includes('UPDATE')) return 'text-primary-600 bg-primary-50 border-primary-100';
    return 'text-gray-600 bg-gray-50 border-gray-100';
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-100px)]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">System Audit Trail</h1>
          <p className="text-gray-500 font-medium">Complete record of administrative actions and security events.</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
            <ShieldAlert className="w-4 h-4 text-orange-500" />
            Security Alerts
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              className="w-full pl-12 pr-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-primary-500 focus:outline-none shadow-sm transition-all font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <select 
              className="px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-primary-500 outline-none font-bold text-sm text-gray-600"
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
            >
              <option value="">All Actions</option>
              <option value="CREATE_TENANT">Create Tenant</option>
              <option value="APPROVE_TENANT">Approve Tenant</option>
              <option value="DELETE_USER">Delete User</option>
              <option value="UPDATE_GLOBAL_SETTINGS">Update Settings</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Event</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Administrator</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Resource</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl border ${getActionColor(log.action)}`}>
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 uppercase tracking-tight">
                          {log.action.replace(/_/g, ' ')}
                        </p>
                        <p className="text-[10px] font-black text-gray-400">IP: {log.ip_address || 'Internal System'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                        {log.admin_username?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-sm font-bold text-gray-700">{log.admin_username}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-black rounded uppercase">
                        {log.target_model}
                      </span>
                      <ArrowRight className="w-3 h-3 text-gray-300" />
                      <span className="text-xs font-bold text-gray-900">ID #{log.target_id}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-black text-gray-900">{new Date(log.created_at).toLocaleDateString()}</span>
                      <span className="text-[10px] font-bold text-gray-400">{new Date(log.created_at).toLocaleTimeString()}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLogs.length === 0 && (
            <div className="text-center py-20">
              <Database className="w-16 h-16 text-gray-100 mx-auto mb-4" />
              <p className="text-gray-400 font-bold text-lg">No audit records found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
