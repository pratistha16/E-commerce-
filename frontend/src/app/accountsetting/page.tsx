'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import StorefrontNavbar from '@/components/landing/StorefrontNavbar';
import CartDrawer from '@/components/landing/CartDrawer';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import { Settings, Shield, Bell, Lock } from 'lucide-react';

export default function AccountSettingPage() {
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
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Account Settings</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Privacy, notifications, and security preferences.</p>
                  </div>
                  <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center">
                    <Settings size={24} />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-soft transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors shadow-sm">
                        <Lock size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">Change Password</h3>
                        <p className="text-xs text-slate-500 font-medium">Update your account password regularly for better security.</p>
                      </div>
                    </div>
                    <div className="text-blue-600 font-black text-xs uppercase tracking-widest">Update</div>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-soft transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors shadow-sm">
                        <Shield size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">Two-Factor Authentication</h3>
                        <p className="text-xs text-slate-500 font-medium">Add an extra layer of security to your account.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Off</span>
                      <div className="w-10 h-5 bg-slate-200 rounded-full relative">
                        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-soft transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors shadow-sm">
                        <Bell size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">Email Notifications</h3>
                        <p className="text-xs text-slate-500 font-medium">Configure which emails you want to receive.</p>
                      </div>
                    </div>
                    <div className="text-blue-600 font-black text-xs uppercase tracking-widest">Configure</div>
                  </div>
                </div>

                <div className="mt-12 pt-12 border-t border-slate-100">
                  <p className="text-slate-400 text-xs font-bold italic">Contact support if you wish to close your account.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
