'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import StorefrontNavbar from '@/components/landing/StorefrontNavbar';
import CartDrawer from '@/components/landing/CartDrawer';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import { MapPin, Plus, Home, Briefcase, Edit2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SavedAddressesPage() {
  const [addresses, setAddresses] = useState([
    { id: 1, type: 'HOME', icon: Home, label: 'Home Address', details: '123 Luxury Lane, Penthouse A, Beverly Hills, CA 90210, USA', isDefault: true },
    { id: 2, type: 'WORK', icon: Briefcase, label: 'Work Office', details: '456 Business Plaza, Suite 200, San Francisco, CA 94105, USA', isDefault: false },
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState({ label: '', details: '' });

  const startEditing = (addr: any) => {
    setEditingId(addr.id);
    setEditForm({ label: addr.label, details: addr.details });
    setIsAdding(false);
  };

  const startAdding = () => {
    setIsAdding(true);
    setEditingId(null);
    setEditForm({ label: '', details: '' });
  };

  const saveEdit = () => {
    if (isAdding) {
      const newAddr = {
        id: Math.max(...addresses.map(a => a.id)) + 1,
        type: 'OTHER',
        icon: MapPin,
        label: editForm.label || 'New Address',
        details: editForm.details,
        isDefault: false
      };
      setAddresses([...addresses, newAddr]);
      setIsAdding(false);
    } else {
      setAddresses(addresses.map(a => a.id === editingId ? { ...a, label: editForm.label, details: editForm.details } : a));
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
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Saved Addresses</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Manage your delivery locations for faster checkout.</p>
                  </div>
                  <button 
                    onClick={startAdding}
                    className="btn btn-primary !h-12 !px-6 flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Add Address
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatePresence mode="popLayout">
                    {isAdding && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="rounded-3xl p-6 border-2 border-blue-600 bg-white ring-4 ring-blue-600/5 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest">New Address</h3>
                          <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-rose-500 transition-colors">
                            <X size={16} />
                          </button>
                        </div>
                        <input 
                          type="text" 
                          placeholder="Label (e.g. Office)"
                          className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600/20 outline-none"
                          value={editForm.label}
                          onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                        />
                        <textarea 
                          rows={3}
                          placeholder="Full Address Details"
                          className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600/20 outline-none resize-none"
                          value={editForm.details}
                          onChange={(e) => setEditForm({ ...editForm, details: e.target.value })}
                        />
                        <button 
                          onClick={saveEdit}
                          className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Check size={14} />
                          Add Address
                        </button>
                      </motion.div>
                    )}

                    {addresses.map((addr) => (
                      <motion.div 
                        layout
                        key={addr.id} 
                        className={`rounded-3xl p-6 border transition-all relative group ${
                          editingId === addr.id ? 'bg-white border-blue-600 ring-4 ring-blue-600/5' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-soft'
                        }`}
                      >
                      <AnimatePresence mode="wait">
                        {editingId === addr.id ? (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-4"
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest">Editing Address</h3>
                              <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-rose-500 transition-colors">
                                <X size={16} />
                              </button>
                            </div>
                            <input 
                              type="text" 
                              className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600/20 outline-none"
                              value={editForm.label}
                              onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                            />
                            <textarea 
                              rows={3}
                              className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600/20 outline-none resize-none"
                              value={editForm.details}
                              onChange={(e) => setEditForm({ ...editForm, details: e.target.value })}
                            />
                            <button 
                              onClick={saveEdit}
                              className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                              <Check size={14} />
                              Save Changes
                            </button>
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <button 
                              onClick={() => startEditing(addr)}
                              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Edit2 size={16} />
                            </button>
                            <div className="flex items-start gap-4">
                              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${addr.isDefault ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                                <addr.icon size={20} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-black text-slate-900 uppercase text-xs tracking-tight">{addr.label}</h3>
                                  {addr.isDefault && (
                                    <span className="bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Default</span>
                                  )}
                                </div>
                                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                  {addr.details}
                                </p>
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
                    className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-blue-600 hover:text-blue-600 transition-all cursor-pointer group h-full min-h-[160px]"
                  >
                    <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-50 transition-colors">
                      <Plus size={20} />
                    </div>
                    <p className="font-bold text-xs">Add New Address</p>
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
