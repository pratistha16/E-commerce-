'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Label } from '@/components/ui';
import { Palette, Globe, Image as ImageIcon, Layout, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function MerchantSettings() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    storeName: 'My Electronics Store',
    tagline: 'Best tech at best prices',
    primaryColor: '#2563eb',
    secondaryColor: '#0f172a',
    layout: 'MODERN',
    enableDarkMode: true,
  });

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Store settings updated successfully!');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Store Settings</h1>
        <p className="text-sm font-bold text-slate-400 mt-1">Customize your storefront branding and appearance</p>
      </div>

      <div className="grid gap-8">
        <Card className="p-8 border-none shadow-sm space-y-8">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
            <Globe className="text-blue-600" />
            <h3 className="text-lg font-black uppercase tracking-widest">General Info</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Store Display Name</Label>
              <Input 
                value={settings.storeName}
                onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                className="h-12 bg-slate-50 border-none rounded-xl font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Store Tagline</Label>
              <Input 
                value={settings.tagline}
                onChange={(e) => setSettings({...settings, tagline: e.target.value})}
                className="h-12 bg-slate-50 border-none rounded-xl font-bold"
              />
            </div>
          </div>
        </Card>

        <Card className="p-8 border-none shadow-sm space-y-8">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
            <Palette className="text-purple-600" />
            <h3 className="text-lg font-black uppercase tracking-widest">Branding & Style</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Primary Color</Label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                  className="w-12 h-12 rounded-lg border-none cursor-pointer"
                />
                <span className="text-sm font-mono font-bold text-slate-600">{settings.primaryColor}</span>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Secondary Color</Label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={settings.secondaryColor}
                  onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                  className="w-12 h-12 rounded-lg border-none cursor-pointer"
                />
                <span className="text-sm font-mono font-bold text-slate-600">{settings.secondaryColor}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Layout Style</Label>
              <select 
                value={settings.layout}
                onChange={(e) => setSettings({...settings, layout: e.target.value})}
                className="w-full h-12 px-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600/20 outline-none text-sm font-bold"
              >
                <option value="MODERN">Modern & Clean</option>
                <option value="BRUTALIST">Bold & Brutalist</option>
                <option value="MINIMAL">Minimalist</option>
              </select>
            </div>
          </div>
        </Card>

        <Card className="p-8 border-none shadow-sm space-y-8">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
            <ImageIcon className="text-emerald-600" />
            <h3 className="text-lg font-black uppercase tracking-widest">Assets</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-400">
                <ImageIcon size={32} />
              </div>
              <div className="text-center">
                <p className="text-xs font-black uppercase tracking-widest mb-1">Store Logo</p>
                <p className="text-[10px] text-slate-400 font-bold">SVG, PNG or JPG (Max 2MB)</p>
              </div>
            </div>

            <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-400">
                <Layout size={32} />
              </div>
              <div className="text-center">
                <p className="text-xs font-black uppercase tracking-widest mb-1">Favicon</p>
                <p className="text-[10px] text-slate-400 font-bold">ICO or PNG (32x32px)</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-end pt-6">
          <Button 
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-10 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-blue-600/20"
          >
            {loading ? <RefreshCw className="animate-spin" /> : <Save />}
            Save Store Identity
          </Button>
        </div>
      </div>
    </div>
  );
}
