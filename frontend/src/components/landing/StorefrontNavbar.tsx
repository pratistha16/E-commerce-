'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, User as UserIcon, LogOut, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

interface StorefrontNavbarProps {
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
}

export default function StorefrontNavbar({ onSearchChange, searchQuery = '' }: StorefrontNavbarProps) {
  const { user, logout } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              M
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight uppercase hidden sm:block">
              Global<span className="text-slate-400">Market</span>
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search products, categories, brands..."
                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 mr-2">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-black text-xs uppercase">
                    {user.username.substring(0, 2)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Welcome back</span>
                    <span className="text-xs font-bold text-slate-900">{user.username}</span>
                  </div>
                </div>
                
                <Link href="/profile" className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                  <UserIcon size={20} />
                </Link>

                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors group"
                >
                  <ShoppingCart size={20} />
                  {totalItems > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </button>

                <button 
                  onClick={logout}
                  className="p-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
                  Sign in
                </Link>
                <Link href="/register" className="px-5 py-2.5 text-sm font-black text-white bg-slate-900 hover:bg-blue-600 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all">
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="block w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
