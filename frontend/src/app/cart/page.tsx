'use client';

import React, { useEffect, useState } from 'react';
import { OrderService as CartService } from '@/services/orderService';
import { Cart } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck, RotateCcw, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import RecommendedProducts from '@/components/RecommendedProducts';

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await CartService.getCart();
      setCart(data);
    } catch (err) {
      console.error('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId: number, quantity: number) => {
    if (quantity < 1) return;
    try {
      await CartService.updateCartQuantity(productId, quantity);
      fetchCart();
    } catch (err) {
      alert('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId: number) => {
    try {
      await CartService.removeFromCart(productId);
      fetchCart();
    } catch (err) {
      alert('Failed to remove item');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <ProtectedRoute>
      <div className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-12">Your Shopping Bag</h1>

          {isEmpty ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32 bg-white rounded-4xl border-2 border-dashed border-slate-200"
            >
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 mb-6">
                <ShoppingBag size={40} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Your bag is empty</h3>
              <p className="text-slate-500 mt-2 max-w-xs mx-auto font-medium">Looks like you haven't added any items to your bag yet.</p>
              <Link href="/products" className="mt-8 btn btn-primary !h-12 !px-8">
                Start Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Cart Items */}
              <div className="flex-1 space-y-6">
                <AnimatePresence>
                  {cart.items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-white p-6 rounded-4xl border border-slate-100 shadow-soft flex flex-col sm:flex-row items-center gap-8 group"
                    >
                      <div className="h-32 w-32 rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                        <img 
                          src={item.product.images?.[0]?.image || 'https://via.placeholder.com/150'} 
                          alt={item.product.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                          <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-accent transition-colors">
                            {item.product.name}
                          </h3>
                          <p className="text-xl font-black text-slate-900">${item.total_price}</p>
                        </div>
                        <p className="text-sm text-slate-500 font-medium mb-6">Sold by {item.product.vendor.store_name}</p>
                        
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6">
                          <div className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-100">
                            <button 
                              onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="p-2 hover:bg-white hover:text-accent rounded-xl transition-all disabled:opacity-30"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-10 text-center font-black text-slate-900">{item.quantity}</span>
                            <button 
                              onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="p-2 hover:bg-white hover:text-accent rounded-xl transition-all"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <button 
                            onClick={() => handleRemoveItem(item.product.id)}
                            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 size={16} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Shipping info cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Truck size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">Free Shipping</p>
                      <p className="text-[10px] text-slate-500 font-bold">On orders over $100</p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <RotateCcw size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">30-Day Returns</p>
                      <p className="text-[10px] text-slate-500 font-bold">Hassle-free exchanges</p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">Secure Payment</p>
                      <p className="text-[10px] text-slate-500 font-bold">Encrypted transactions</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <aside className="lg:w-96">
                <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-soft sticky top-32">
                  <h2 className="text-xl font-black text-slate-900 mb-8">Order Summary</h2>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="text-slate-900 font-bold">${cart.total_price}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-slate-500">Shipping</span>
                      <span className="text-emerald-500 font-bold">Calculated at next step</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-slate-500">Tax</span>
                      <span className="text-slate-900 font-bold">$0.00</span>
                    </div>
                    <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-base font-black text-slate-900">Estimated Total</span>
                      <span className="text-3xl font-black text-accent">${cart.total_price}</span>
                    </div>
                  </div>

                  <Link 
                    href="/checkout" 
                    className="w-full btn btn-primary !h-14 text-base flex items-center justify-center gap-2 group"
                  >
                    Proceed to Checkout
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <div className="mt-8 flex flex-col items-center gap-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">We Accept</p>
                    <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                      <CreditCard size={24} />
                      <ShoppingBag size={24} />
                      <ShieldCheck size={24} />
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* Recommendations */}
          <RecommendedProducts className="mt-24" />
        </div>
      </div>
    </ProtectedRoute>
  );
}
