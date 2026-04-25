'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@/types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  Button,
  Input,
  Label,
  Separator
} from '@/components/ui';
import { Shield, Mail, User as UserIcon, Phone, MapPin, Store, UserCircle, Key, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { adminService } from '@/services/adminService';

interface UserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  mode: 'view' | 'edit' | 'create';
}

export default function UserModal({ user, isOpen, onClose, onUpdate, mode }: UserModalProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    role: 'CUSTOMER',
    is_active: true
  });
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (user && mode !== 'create') {
      setFormData(user);
    } else if (mode === 'create') {
      setFormData({ role: 'ADMIN', is_active: true });
      setNewPassword('');
    }
  }, [user, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      if (mode === 'create') {
        if (!newPassword) {
          toast.error('Password is required for new users');
          setLoading(false);
          return;
        }
        await adminService.createUser({ ...formData, password: newPassword });
        toast.success('User created successfully');
      } else if (user) {
        await adminService.updateUser(user.id, formData);
        toast.success('User updated successfully');
      }
      onUpdate();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || `Failed to ${mode === 'create' ? 'create' : 'update'} user`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user || !newPassword) {
      toast.error('Please enter a new password');
      return;
    }
    
    setResetting(true);
    try {
      await adminService.resetUserPassword(user.id, newPassword);
      toast.success('Password reset successfully');
      setNewPassword('');
    } catch (error: any) {
      toast.error('Failed to reset password');
    } finally {
      setResetting(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl font-black">
              {mode === 'create' ? <UserCircle size={32} /> : (user?.username?.[0]?.toUpperCase() || 'U')}
            </div>
            <div>
              <DialogTitle className="text-2xl font-black tracking-tight">
                {mode === 'create' ? 'Provision Internal User' : mode === 'view' ? 'User Profile' : 'Edit User'}
              </DialogTitle>
              <p className="text-slate-400 text-sm font-medium">
                {mode === 'create' ? 'Grant platform access' : `UID: #${user?.id?.toString().substring(0, 8)}...`}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Account Info</Label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <Input
                    value={formData.username || ''}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    disabled={mode === 'view' || loading}
                    className="pl-12 h-12 bg-slate-50 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-blue-600/20"
                    placeholder="Username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <Input
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={mode === 'view' || loading}
                    className="pl-12 h-12 bg-slate-50 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-blue-600/20"
                    placeholder="Email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone</Label>
                  <Input
                    value={formData.phone_number || ''}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    disabled={mode === 'view' || loading}
                    className="h-12 bg-slate-50 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-blue-600/20"
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Role</Label>
                  <select
                    value={formData.role || 'CUSTOMER'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    disabled={mode === 'view' || loading}
                    className="w-full h-12 px-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600/20 outline-none text-sm font-medium"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="VENDOR">Merchant</option>
                    <option value="CUSTOMER">Customer</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Business Address</Label>
                <textarea
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={mode === 'view' || loading}
                  className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600/20 outline-none text-sm font-medium min-h-[100px] resize-none"
                  placeholder="Street address, City, Country"
                />
              </div>

              {(mode === 'edit' || mode === 'create') && (
                <div className="pt-4 space-y-4">
                  <Separator className="bg-slate-100" />
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-rose-500 ml-1">
                      {mode === 'create' ? 'Access Password' : 'Security: Reset Password'}
                    </Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1 group">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                        <Input
                          type="text"
                          required={mode === 'create'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="pl-12 h-12 bg-slate-50 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-blue-600/20 font-bold"
                          placeholder={mode === 'create' ? "Set password" : "Enter new password"}
                        />
                      </div>
                      {mode === 'edit' && (
                        <Button 
                          type="button"
                          onClick={handleResetPassword}
                          disabled={resetting || !newPassword}
                          className="h-12 px-6 bg-slate-900 text-white rounded-xl font-bold flex gap-2"
                        >
                          {resetting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                          Reset
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {(mode === 'edit' || mode === 'create') && (
              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={onClose}
                  className="font-bold rounded-xl"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl px-10 shadow-lg shadow-blue-600/20"
                >
                  {loading ? 'Processing...' : mode === 'create' ? 'Provision User' : 'Save Changes'}
                </Button>
              </DialogFooter>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
