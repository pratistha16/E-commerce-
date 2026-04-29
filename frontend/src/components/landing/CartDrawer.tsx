'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui';

import Link from 'next/link';

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-blue-600" />
                <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Your Cart</h2>
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                  {totalItems}
                </span>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                    <ShoppingBag size={40} />
                  </div>
                  <p className="text-slate-500 font-medium">Your cart is empty.</p>
                  <Button 
                    onClick={() => setIsCartOpen(false)}
                    variant="outline" 
                    className="!rounded-xl border-slate-200"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                      {item.product.images?.[0]?.image ? (
                        <img 
                          src={item.product.images[0].image} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Package size={24} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-slate-900 text-sm line-clamp-2">{item.product.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
                          {item.product.vendor.store_name}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-1 border border-slate-100">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-black text-slate-900 w-4 text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="font-black text-slate-900">
                          ${(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Subtotal</span>
                  <span className="text-2xl font-black text-slate-900">${totalPrice.toLocaleString()}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-6">Shipping and taxes calculated at checkout.</p>
                
                <Link 
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full h-14 rounded-2xl text-sm font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group transition-all"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
