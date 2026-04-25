'use client';

import React, { useEffect, useState } from 'react';
import { MerchantService } from '@/services/merchantService';
import { Order } from '@/types';
import { Package, Clock, CheckCircle, Truck, XCircle, Search } from 'lucide-react';

const statusConfig: any = {
  PENDING: { color: 'text-yellow-600', icon: Clock, bg: 'bg-yellow-50' },
  PROCESSING: { color: 'text-primary-600', icon: Package, bg: 'bg-primary-50' },
  SHIPPED: { color: 'text-primary-700', icon: Truck, bg: 'bg-primary-100' },
  DELIVERED: { color: 'text-green-600', icon: CheckCircle, bg: 'bg-green-50' },
  CANCELLED: { color: 'text-red-600', icon: XCircle, bg: 'bg-red-50' },
};

export default function MerchantOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await MerchantService.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await MerchantService.updateOrderStatus(orderId, newStatus);
      fetchOrders(); // Refresh list
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Store Orders</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search order ID..."
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => {
              const config = statusConfig[order.status];
              const StatusIcon = config.icon;
              return (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{(order as any).user_name || 'Customer'}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">${order.total_amount}</td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${config.bg} ${config.color}`}>
                      <StatusIcon size={14} />
                      <span className="text-xs font-bold uppercase tracking-wider">{order.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select
                      className="text-xs font-bold border border-gray-300 rounded-md px-2 py-1 focus:ring-primary focus:border-primary"
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    >
                      {Object.keys(statusConfig).map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-xl text-gray-500">No orders received yet.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
