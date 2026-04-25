'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { OrderService } from '@/services/orderService';
import { Order } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Package, Truck, CheckCircle, Clock, MapPin, ChevronLeft, CreditCard, ArrowLeft, Receipt, Calendar, User, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const steps = [
  { status: 'PENDING', label: 'Order Placed', icon: Clock, description: 'Your order has been received and is waiting for processing.' },
  { status: 'PROCESSING', label: 'Processing', icon: Package, description: 'We are preparing your items and getting them ready for shipment.' },
  { status: 'SHIPPED', label: 'Shipped', icon: Truck, description: 'Your package is on its way to your delivery address.' },
  { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle, description: 'The order has been delivered successfully. Enjoy!' },
];

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (id) fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const data = await OrderService.getOrderDetails(id as string);
      setOrder(data);
    } catch (err) {
      console.error('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
    </div>
  );

  if (!order) return (
    <div className="max-w-7xl mx-auto px-4 py-32 text-center">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 mb-6">
        <Package size={40} className="text-slate-300" />
      </div>
      <h1 className="text-2xl font-black text-slate-900">Order Not Found</h1>
      <p className="text-slate-500 mt-2 font-medium">We couldn't find the order you're looking for.</p>
      <Link href="/orders" className="mt-8 btn btn-primary !h-12 !px-8">
        Back to My Orders
      </Link>
    </div>
  );

  const currentStepIndex = steps.findIndex(step => step.status === order.status);

  return (
    <ProtectedRoute>
      <div className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-8 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Order History
          </button>

          <div className="space-y-8">
            {/* Header Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-100 rounded-4xl shadow-soft overflow-hidden"
            >
              <div className="bg-slate-900 px-10 py-12 text-white relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                      Order Tracking
                    </div>
                    <h1 className="text-4xl font-black tracking-tight">#{(order as any).order_number?.split('-')[0] || order.id}</h1>
                    <p className="text-slate-400 mt-2 font-medium">Placed on {new Date(order.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div className="flex gap-12">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Amount</p>
                      <p className="text-3xl font-black text-white">${order.total_amount}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="px-10 py-20 border-b border-slate-100">
                <div className="relative">
                  {/* Background Line */}
                  <div className="absolute top-6 left-0 w-full h-1 bg-slate-100 rounded-full hidden md:block"></div>
                  {/* Progress Line */}
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute top-6 left-0 h-1 bg-accent rounded-full hidden md:block"
                  ></motion.div>

                  <div className="relative flex flex-col md:flex-row justify-between gap-12 md:gap-4">
                    {steps.map((step, idx) => {
                      const Icon = step.icon;
                      const isCompleted = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      
                      return (
                        <div key={step.status} className="flex md:flex-col items-start md:items-center md:text-center gap-6 md:gap-4 md:flex-1 group">
                          <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500 ${
                            isCompleted ? 'bg-accent text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-100 text-slate-400'
                          } ${isCurrent ? 'ring-4 ring-accent/20 scale-110' : ''}`}>
                            <Icon size={24} />
                          </div>
                          <div className="space-y-1">
                            <h3 className={`text-sm font-black uppercase tracking-widest ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                              {step.label}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium max-w-[180px]">{step.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-10">
                <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                  <ShoppingBag className="text-accent" size={24} />
                  Items in this order
                </h2>
                <div className="space-y-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-8 p-4 rounded-3xl border border-slate-50 hover:border-slate-100 hover:bg-slate-50 transition-all">
                      <div className="h-24 w-24 rounded-2xl overflow-hidden bg-white border border-slate-100 flex-shrink-0">
                        <img 
                          src={item.product.images?.[0]?.image || 'https://via.placeholder.com/150'} 
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold text-slate-900 truncate">{item.product.name}</h4>
                        <p className="text-sm text-slate-500 font-medium mt-1">Sold by {item.product.vendor.store_name}</p>
                        <div className="flex items-center gap-6 mt-2">
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                          <p className="text-lg font-black text-slate-900">${item.price}</p>
                        </div>
                      </div>
                      <div className="hidden sm:block">
                        <Link href={`/products/${item.product.slug}`} className="btn btn-outline !px-6">View Product</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Shipping Address */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white border border-slate-100 rounded-4xl p-8 shadow-soft"
              >
                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                  <MapPin className="text-accent" size={20} />
                  Shipping Address
                </h3>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-900">{user?.username || 'Customer'}</p>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    {order.shipping_address || 'No address provided'}
                  </p>
                  <p className="text-sm text-slate-500 font-medium">{user?.email}</p>
                </div>
              </motion.div>

              {/* Payment Summary */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white border border-slate-100 rounded-4xl p-8 shadow-soft"
              >
                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                  <Receipt className="text-accent" size={20} />
                  Payment Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="text-slate-900 font-bold">${order.total_amount}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-slate-500">Shipping</span>
                    <span className="text-emerald-500 font-bold">Free</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-slate-500">Tax</span>
                    <span className="text-slate-900 font-bold">$0.00</span>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-base font-black text-slate-900">Total</span>
                    <span className="text-2xl font-black text-accent">${order.total_amount}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
