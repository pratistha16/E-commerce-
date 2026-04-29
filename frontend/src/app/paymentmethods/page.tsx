'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import StorefrontNavbar from '@/components/landing/StorefrontNavbar';
import CartDrawer from '@/components/landing/CartDrawer';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import { CreditCard, Plus, Edit2, X, Check, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PaymentMethodsPage() {
  const [cards, setCards] = useState([
    { id: 1, type: 'VISA', last4: '4242', holder: 'Test Customer', expiry: '12/26', isDefault: true, fullNumber: '4242424242424242', cvv: '123' },
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState({ holder: '', expiry: '', cardNumber: '', cvv: '' });

  const startEditing = (card: any) => {
    setEditingId(card.id);
    setEditForm({ 
      holder: card.holder, 
      expiry: card.expiry, 
      cardNumber: card.fullNumber || `•••• •••• •••• ${card.last4}`,
      cvv: card.cvv || '•••'
    });
    setIsAdding(false);
  };

  const startAdding = () => {
    setIsAdding(true);
    setEditingId(null);
    setEditForm({ holder: '', expiry: '', cardNumber: '', cvv: '' });
  };

  const saveEdit = () => {
    if (isAdding) {
      const newCard = {
        id: Math.max(...cards.map(c => c.id)) + 1,
        type: editForm.cardNumber.startsWith('4') ? 'VISA' : 'MASTERCARD',
        last4: editForm.cardNumber.slice(-4),
        holder: editForm.holder || 'New Card',
        expiry: editForm.expiry || '01/29',
        fullNumber: editForm.cardNumber,
        cvv: editForm.cvv,
        isDefault: false
      };
      setCards([...cards, newCard]);
      setIsAdding(false);
    } else {
      setCards(cards.map(c => c.id === editingId ? { 
        ...c, 
        holder: editForm.holder, 
        expiry: editForm.expiry, 
        fullNumber: editForm.cardNumber,
        last4: editForm.cardNumber.slice(-4),
        cvv: editForm.cvv 
      } : c));
      setEditingId(null);
    }
  };

  return (
    <ProtectedRoute>
      <StorefrontNavbar />
      <CartDrawer />
      
      <div className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <ProfileSidebar />
            
            <div className="flex-1 space-y-8">
              <div className="bg-white rounded-4xl p-10 border border-slate-100 shadow-soft">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Payment Methods</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Manage your saved credit cards and payment accounts.</p>
                  </div>
                  <button 
                    onClick={startAdding}
                    className="btn btn-primary !h-12 !px-6 flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Add New Card
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatePresence mode="popLayout">
                    {isAdding && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative group rounded-3xl p-8 overflow-hidden transition-all min-h-[280px] bg-white border-2 border-blue-600 shadow-xl shadow-blue-600/5 space-y-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest">New Card Details</h3>
                          <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-rose-500">
                            <X size={16} />
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Number</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600/20 outline-none"
                              placeholder="4242 4242 4242 4242"
                              value={editForm.cardNumber}
                              onChange={(e) => setEditForm({ ...editForm, cardNumber: e.target.value })}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry Date</label>
                              <input 
                                type="text" 
                                className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600/20 outline-none"
                                placeholder="MM/YY"
                                value={editForm.expiry}
                                onChange={(e) => setEditForm({ ...editForm, expiry: e.target.value })}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">CVV</label>
                              <input 
                                type="text" 
                                className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600/20 outline-none"
                                placeholder="123"
                                value={editForm.cvv}
                                onChange={(e) => setEditForm({ ...editForm, cvv: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Holder</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600/20 outline-none"
                              placeholder="Full Name"
                              value={editForm.holder}
                              onChange={(e) => setEditForm({ ...editForm, holder: e.target.value })}
                            />
                          </div>
                        </div>

                        <button 
                          onClick={saveEdit}
                          className="w-full py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-600/20"
                        >
                          <Check size={12} />
                          Add Payment Method
                        </button>
                      </motion.div>
                    )}

                    {cards.map((card) => (
                      <motion.div 
                        layout
                        key={card.id}
                        className={`relative group rounded-3xl p-8 overflow-hidden transition-all min-h-[280px] ${
                          editingId === card.id 
                          ? 'bg-white border-2 border-blue-600 shadow-xl shadow-blue-600/5' 
                          : 'bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-elevated border border-slate-700'
                        }`}
                      >
                      <AnimatePresence mode="wait">
                        {editingId === card.id ? (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest">Update Card Details</h3>
                              <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-rose-500">
                                <X size={16} />
                              </button>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Number</label>
                                <input 
                                  type="text" 
                                  className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600/20 outline-none"
                                  placeholder="4242 4242 4242 4242"
                                  value={editForm.cardNumber}
                                  onChange={(e) => setEditForm({ ...editForm, cardNumber: e.target.value })}
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry Date</label>
                                  <input 
                                    type="text" 
                                    className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600/20 outline-none"
                                    placeholder="MM/YY"
                                    value={editForm.expiry}
                                    onChange={(e) => setEditForm({ ...editForm, expiry: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">CVV</label>
                                  <input 
                                    type="text" 
                                    className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600/20 outline-none"
                                    placeholder="123"
                                    value={editForm.cvv}
                                    onChange={(e) => setEditForm({ ...editForm, cvv: e.target.value })}
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Holder</label>
                                <input 
                                  type="text" 
                                  className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600/20 outline-none"
                                  placeholder="Full Name"
                                  value={editForm.holder}
                                  onChange={(e) => setEditForm({ ...editForm, holder: e.target.value })}
                                />
                              </div>
                            </div>

                            <button 
                              onClick={saveEdit}
                              className="w-full py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-600/20"
                            >
                              <Check size={12} />
                              Confirm Changes
                            </button>
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <button 
                              onClick={() => startEditing(card)}
                              className="absolute top-4 left-6 p-2 text-white/40 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Edit2 size={16} />
                            </button>
                            <div className="absolute top-4 right-6 text-slate-500 font-bold italic text-xl">{card.type}</div>
                            <div className="mt-12">
                              <p className="text-lg font-black tracking-widest italic">•••• •••• •••• {card.last4}</p>
                            </div>
                            <div className="mt-8 flex justify-between items-end">
                              <div>
                                <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest mb-1">Card Holder</p>
                                <p className="text-xs font-bold uppercase">{card.holder}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest mb-1">Expires</p>
                                <p className="text-xs font-bold">{card.expiry}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                  </AnimatePresence>

                  <div 
                    onClick={startAdding}
                    className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-slate-400 hover:border-blue-600 hover:text-blue-600 transition-all cursor-pointer group h-full min-h-[200px]"
                  >
                    <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                      <Plus size={24} />
                    </div>
                    <p className="font-bold text-sm">Add New Payment Method</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
