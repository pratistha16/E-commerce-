'use client';

import React, { useState } from 'react';
import { 
  Upload, 
  LayoutGrid, 
  StretchHorizontal, 
  Palette, 
  Image as ImageIcon, 
  Type, 
  Phone, 
  Mail, 
  Save, 
  Eye, 
  Undo2,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function StoreDesignPage() {
  const [storeData, setStoreData] = useState({
    name: 'Aura Studio',
    tagline: 'Modern minimalist essentials for your home',
    primaryColor: '#6366f1',
    layout: 'grid',
    email: 'hello@aurastudio.com',
    phone: '+1 (555) 902-1234',
  });

  const [activeTab, setActiveTab] = useState('brand'); // brand, theme, contact
  const [isSaving, setIsSaving] = useState(false);

  const colors = [
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Slate', value: '#0f172a' },
    { name: 'Violet', value: '#8b5cf6' },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Store theme updated successfully!');
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Store Design</h1>
          <p className="text-slate-500 font-medium mt-1">Customize your storefront's look and feel.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-outline flex items-center gap-2">
            <Undo2 size={16} />
            Discard
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="btn btn-primary flex items-center gap-2 shadow-elevated"
          >
            {isSaving ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isSaving ? 'Publishing...' : 'Publish Changes'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-10 overflow-hidden">
        {/* Left: Customization Panel */}
        <aside className="w-96 bg-white rounded-4xl border border-slate-100 shadow-soft flex flex-col overflow-hidden">
          <div className="flex border-b border-slate-100">
            <button 
              onClick={() => setActiveTab('brand')}
              className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-colors ${
                activeTab === 'brand' ? 'text-accent border-b-2 border-accent' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Brand
            </button>
            <button 
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-colors ${
                activeTab === 'theme' ? 'text-accent border-b-2 border-accent' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Theme
            </button>
            <button 
              onClick={() => setActiveTab('contact')}
              className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-colors ${
                activeTab === 'contact' ? 'text-accent border-b-2 border-accent' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Contact
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-10">
            {activeTab === 'brand' && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Store Logo</label>
                  <div className="border-2 border-dashed border-slate-100 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 hover:border-accent/30 hover:bg-slate-50 transition-all cursor-pointer group">
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-accent transition-colors">
                      <Upload size={24} />
                    </div>
                    <p className="text-xs font-bold text-slate-500">Click or drag to upload</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Type size={14} /> Store Name
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-accent/20 outline-none"
                      value={storeData.name}
                      onChange={(e) => setStoreData({...storeData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tagline</label>
                    <textarea 
                      className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-accent/20 outline-none resize-none"
                      rows={3}
                      value={storeData.tagline}
                      onChange={(e) => setStoreData({...storeData, tagline: e.target.value})}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'theme' && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Palette size={14} /> Accent Color
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setStoreData({...storeData, primaryColor: color.value})}
                        className={`h-12 rounded-2xl flex items-center justify-center transition-all ${
                          storeData.primaryColor === color.value ? 'ring-4 ring-slate-100 scale-95 shadow-sm' : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.value }}
                      >
                        {storeData.primaryColor === color.value && <Check className="text-white" size={20} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <LayoutGrid size={14} /> Product Layout
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setStoreData({...storeData, layout: 'grid'})}
                      className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        storeData.layout === 'grid' ? 'border-accent bg-accent/5 text-accent' : 'border-slate-50 text-slate-400'
                      }`}
                    >
                      <LayoutGrid size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">Grid</span>
                    </button>
                    <button
                      onClick={() => setStoreData({...storeData, layout: 'list'})}
                      className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        storeData.layout === 'list' ? 'border-accent bg-accent/5 text-accent' : 'border-slate-50 text-slate-400'
                      }`}
                    >
                      <StretchHorizontal size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">List</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'contact' && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Mail size={14} /> Store Email
                  </label>
                  <input 
                    type="email" 
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-accent/20 outline-none"
                    value={storeData.email}
                    onChange={(e) => setStoreData({...storeData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Phone size={14} /> Phone Number
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-accent/20 outline-none"
                    value={storeData.phone}
                    onChange={(e) => setStoreData({...storeData, phone: e.target.value})}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </aside>

        {/* Right: Live Preview */}
        <div className="flex-1 bg-slate-100 rounded-4xl border border-slate-200 overflow-hidden relative group">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <Eye size={12} />
            Live Preview
          </div>

          <div className="h-full overflow-y-auto bg-white m-8 rounded-2xl shadow-2xl border border-slate-200">
            {/* Mock Header */}
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-black shadow-lg" style={{ backgroundColor: storeData.primaryColor }}>
                  {storeData.name?.[0]}
                </div>
                <span className="font-black text-slate-900">{storeData.name}</span>
              </div>
              <div className="flex gap-6 text-xs font-bold text-slate-400">
                <span style={{ color: storeData.primaryColor }}>Home</span>
                <span>Products</span>
                <span>About</span>
              </div>
            </div>

            {/* Mock Hero */}
            <div className="p-16 text-center space-y-6">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {storeData.tagline}
              </h2>
              <button className="btn !h-12 !px-10 text-white font-bold" style={{ backgroundColor: storeData.primaryColor }}>
                Shop Collection
              </button>
            </div>

            {/* Mock Products Grid */}
            <div className="p-8 grid grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className={`bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 ${storeData.layout === 'list' ? 'flex items-center gap-4 p-4' : ''}`}>
                  <div className={`${storeData.layout === 'list' ? 'h-24 w-24' : 'aspect-square'} bg-slate-200`} />
                  <div className="p-6 space-y-2">
                    <div className="h-4 w-2/3 bg-slate-200 rounded" />
                    <div className="h-6 w-1/3 bg-slate-300 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
