'use client';

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  Button,
  Input,
  Label
} from '@/components/ui';
import { Store, User, Mail, Lock, Globe, Zap, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { adminService } from '@/services/adminService';

interface ProvisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProvisionMerchantModal({ isOpen, onClose, onSuccess }: ProvisionModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    subdomain: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminService.provisionMerchant(formData);
      toast.success('Merchant provisioned successfully');
      onSuccess();
      onClose();
      setFormData({ name: '', email: '', username: '', password: '', subdomain: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to provision merchant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
        <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-60 h-60 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg">
              <Store size={32} />
            </div>
            <DialogTitle className="text-3xl font-black tracking-tight uppercase">Provision New Merchant</DialogTitle>
            <p className="text-slate-400 font-medium mt-2">Create a merchant account, store, and subdomain in one step.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 col-span-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Store Name</Label>
              <div className="relative group">
                <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-12 h-14 bg-slate-50 border-none rounded-2xl font-bold focus-visible:ring-2 focus-visible:ring-blue-600/20"
                  placeholder="e.g. Electronics Hub"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Merchant Username</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <Input
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="pl-12 h-14 bg-slate-50 border-none rounded-2xl font-bold focus-visible:ring-2 focus-visible:ring-blue-600/20"
                  placeholder="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Temporary Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <Input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-12 h-14 bg-slate-50 border-none rounded-2xl font-bold focus-visible:ring-2 focus-visible:ring-blue-600/20"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Merchant Email</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-12 h-14 bg-slate-50 border-none rounded-2xl font-bold focus-visible:ring-2 focus-visible:ring-blue-600/20"
                  placeholder="merchant@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-blue-600 ml-1">Store Subdomain</Label>
              <div className="relative group">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <Input
                  required
                  value={formData.subdomain}
                  onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  className="pl-12 h-14 bg-blue-50/50 border-2 border-blue-100 rounded-2xl font-black text-blue-700 focus-visible:ring-4 focus-visible:ring-blue-600/10"
                  placeholder="electronics"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-400 uppercase">.localhost</span>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-6">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="h-14 px-8 font-bold rounded-2xl"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="h-14 px-10 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Zap className="w-5 h-5" />}
              PROVISION STORE
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
