'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  BarChart3, 
  Settings,
  LogOut,
  X,
  HelpCircle,
  ChevronRight,
  ArrowLeftRight,
  Palette
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/merchant/dashboard' },
  { icon: Package, label: 'Inventory', href: '/merchant/dashboard/products' },
  { icon: ShoppingBag, label: 'Orders', href: '/merchant/dashboard/orders' },
  { icon: BarChart3, label: 'Analytics', href: '/merchant/dashboard/analytics' },
  { icon: Palette, label: 'Store Design', href: '/merchant/dashboard/settings' },
];

export default function MerchantSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <div className="flex h-full w-full flex-col bg-white text-slate-600 border-r border-slate-100 shadow-sm relative overflow-hidden">
      <div className="flex h-20 items-center justify-between px-8 border-b border-slate-50 shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
            M
          </div>
          <span className="text-sm font-black tracking-tight text-slate-900 uppercase">
            Global<span className="text-slate-400">Merchant</span>
          </span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-900 lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-4 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (            <Link
              key={item.href}
              href={item.href}
              onClick={() => onClose?.()}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-slate-50 text-slate-900" 
                  : "text-slate-400 hover:text-slate-900 hover:bg-slate-50/50"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-colors shrink-0", isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-900")} />
              <span className="truncate">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="active-pill-merchant"
                  className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-4 border-t border-slate-50">
        <button className="flex items-center justify-between w-full px-4 py-3 text-xs font-bold text-slate-400 hover:text-slate-900 bg-slate-50 rounded-xl group transition-all">
          <div className="flex items-center gap-3">
            <ArrowLeftRight className="w-4 h-4" />
            <span>SWITCH CONTEXT</span>
          </div>
          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <div className="space-y-1">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">
            <HelpCircle className="w-5 h-5" />
            <span>Help Center</span>
          </button>
          <button 
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-slate-400 hover:text-rose-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
