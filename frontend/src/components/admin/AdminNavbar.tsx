'use client';

import React from 'react';
import { 
  Search, 
  Bell, 
  User, 
  Menu, 
  HelpCircle, 
  Maximize, 
  ChevronDown,
  Calendar,
  Settings
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import NotificationBell from '@/components/NotificationBell';

interface AdminNavbarProps {
  onMenuClick: () => void;
}

export default function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white border-b border-slate-50 flex items-center justify-between px-8 sticky top-0 z-40 transition-all shrink-0">
      <div className="flex items-center gap-6 flex-1">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onMenuClick}
          className="p-2 text-slate-400 hover:text-slate-900 lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex flex-col">
          <h1 className="text-xl font-black text-slate-900 leading-tight">Platform Administration</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global ecosystem overview for architect commerce</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-600">Oct 1, 2024 - Oct 31, 2024</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          </button>
          
          <div className="h-8 w-[1px] bg-slate-100" />

          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group-hover:border-slate-400 transition-all">
              <img src={`https://i.pravatar.cc/100?u=${user?.email}`} alt="User" />
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-all" />
          </div>
        </div>
      </div>
    </header>
  );
}
