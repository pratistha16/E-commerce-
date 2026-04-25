'use client';

import React, { useState, useEffect } from 'react';
import { MerchantService } from '@/services/merchantService';
import { motion } from 'framer-motion';
import { 
  Store, 
  Palette, 
  Layout, 
  Image as ImageIcon, 
  Globe, 
  Save, 
  CheckCircle2, 
  Loader2,
  Type,
  LayoutGrid,
  Monitor
} from 'lucide-react';
import { Card, CardTitle, Button } from '@/components/ui';
import { toast } from 'sonner';

export default function MerchantSettingsPage() {
  const [formData, setFormData] = useState({
    store_name: '',
    description: '',
    tagline: '',
    primary_color: '#2563eb',
    secondary_color: '#0f172a',
    background_color: '#f8fafc',
    button_style: 'rounded',
    homepage_layout: 'grid',
    font_family: 'Inter, sans-serif',
    font_size_scale: 1.0,
    contact_email: '',
    contact_phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await MerchantService.getProfile(); // Need to implement this in service
      if (response) {
        setFormData(prev => ({ ...prev, ...response }));
      }
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await MerchantService.updateProfile(formData); // Need to implement this in service
      toast.success('Settings updated successfully');
      
      // Update local preview variables
      const root = document.documentElement;
      root.style.setProperty('--primary-color', formData.primary_color);
      root.style.setProperty('--secondary-color', formData.secondary_color);
      root.style.setProperty('--bg-color', formData.background_color);
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Store Customization</h1>
          <p className="text-slate-500 font-medium mt-1">Design your unique storefront and manage business details.</p>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={saving}
          className="btn-primary !h-14 !px-8 flex items-center gap-2 shadow-xl shadow-blue-500/20"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={20} />}
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Store Identity */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8 border-none shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
              <Store className="text-blue-600 w-5 h-5" />
              <CardTitle className="text-lg tracking-widest uppercase">Brand Identity</CardTitle>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Store Name</label>
                <input
                  name="store_name"
                  className="w-full mt-2 pl-4 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none font-medium text-slate-900"
                  value={formData.store_name}
                  onChange={handleChange}
                  placeholder="e.g. Seera Premium Electronics"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tagline</label>
                <input
                  name="tagline"
                  className="w-full mt-2 pl-4 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none font-medium text-slate-900"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="e.g. Elevate your digital life"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <textarea
                  name="description"
                  rows={4}
                  className="w-full mt-2 pl-4 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none font-medium text-slate-900"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell your story..."
                />
              </div>
            </div>
          </Card>

          <Card className="p-8 border-none shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
              <Globe className="text-blue-600 w-5 h-5" />
              <CardTitle className="text-lg tracking-widest uppercase">Contact & Social</CardTitle>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Public Email</label>
                <input
                  name="contact_email"
                  type="email"
                  className="w-full mt-2 pl-4 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none font-medium text-slate-900"
                  value={formData.contact_email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <input
                  name="contact_phone"
                  className="w-full mt-2 pl-4 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none font-medium text-slate-900"
                  value={formData.contact_phone}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Physical Address</label>
                <textarea
                  name="address"
                  rows={2}
                  className="w-full mt-2 pl-4 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none font-medium text-slate-900"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Visual Styling */}
        <div className="space-y-8">
          <Card className="p-8 border-none shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
              <Palette className="text-blue-600 w-5 h-5" />
              <CardTitle className="text-lg tracking-widest uppercase">Visual Theme</CardTitle>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Color</label>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="color"
                    name="primary_color"
                    className="h-14 w-14 rounded-2xl border-none p-0 cursor-pointer overflow-hidden"
                    value={formData.primary_color}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="primary_color"
                    className="flex-1 pl-4 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm uppercase font-mono"
                    value={formData.primary_color}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Background Theme</label>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="color"
                    name="background_color"
                    className="h-14 w-14 rounded-2xl border-none p-0 cursor-pointer overflow-hidden"
                    value={formData.background_color}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="background_color"
                    className="flex-1 pl-4 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm uppercase font-mono"
                    value={formData.background_color}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Typography</label>
                <div className="relative mt-2">
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select
                    name="font_family"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none appearance-none"
                    value={formData.font_family}
                    onChange={handleChange}
                  >
                    <option value="Inter, sans-serif">Inter (Modern)</option>
                    <option value="'Space Grotesk', sans-serif">Space Grotesk (Tech)</option>
                    <option value="'Playfair Display', serif">Playfair (Elegant)</option>
                    <option value="'Syne', sans-serif">Syne (Brutalist)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Button Style</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {['rounded', 'square', 'pill'].map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, button_style: style as any }))}
                      className={`py-3 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all ${
                        formData.button_style === style 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20' 
                        : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 border-none shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
              <Layout className="text-blue-600 w-5 h-5" />
              <CardTitle className="text-lg tracking-widest uppercase">Shop Layout</CardTitle>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Homepage Style</label>
              <div className="grid grid-cols-1 gap-4 mt-2">
                {[
                  { id: 'grid', label: 'Classic Grid', icon: LayoutGrid },
                  { id: 'banner', label: 'Banner Showcase', icon: Monitor },
                ].map((layout) => (
                  <button
                    key={layout.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, homepage_layout: layout.id as any }))}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                      formData.homepage_layout === layout.id 
                      ? 'bg-blue-50 border-blue-200 text-blue-600' 
                      : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <layout.icon size={20} />
                    <span className="text-sm font-black uppercase tracking-widest">{layout.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
