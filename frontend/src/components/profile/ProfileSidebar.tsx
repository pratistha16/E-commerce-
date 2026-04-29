'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { User, ShoppingBag, Heart, CreditCard, MapPin, Settings, ShoppingCart, Camera, Package, Truck, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { OrderService } from '@/services/orderService';

export default function ProfileSidebar() {
  const { user, logout } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const pathname = usePathname();
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const orders = await OrderService.getOrders();
      setOrderCount(orders.length);
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  const sidebarLinks = [
    { icon: User, label: 'Profile Information', href: '/profile' },
    { icon: ShoppingBag, label: 'Order History', href: '/orders' },
    { icon: Heart, label: 'My Wishlist', href: '/mywishlist' },
    { icon: CreditCard, label: 'Payment Methods', href: '/paymentmethods' },
    { icon: MapPin, label: 'Saved Addresses', href: '/saveaddress' },
    { icon: Settings, label: 'Account Settings', href: '/accountsetting' },
  ];

  return (
    <aside className="lg:w-80 space-y-6">
      <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-soft text-center">
        <div className="relative inline-block mb-6">
          <div className="h-28 w-28 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-elevated">
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <button className="absolute bottom-0 right-0 p-2.5 bg-slate-900 text-white rounded-full border-4 border-white hover:scale-110 transition-transform shadow-lg">
            <Camera size={14} />
          </button>
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">{user?.username}</h2>
        <p className="text-blue-600 font-bold uppercase text-[10px] tracking-widest mt-1">Premium Member</p>
        
        <div className="grid grid-cols-2 gap-3 mt-8">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-xl font-black text-slate-900">{orderCount}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Orders</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-xl font-black text-slate-900">0</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Wishlist</p>
          </div>
        </div>
      </div>

      <nav className="bg-white rounded-4xl p-6 border border-slate-100 shadow-soft">
        <div className="space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                pathname === link.href 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <link.icon size={18} className={pathname === link.href ? 'text-white' : 'text-slate-400'} />
              {link.label}
            </Link>
          ))}
          
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            <ShoppingCart size={18} className="text-slate-400" />
            <div className="flex items-center justify-between flex-1">
              My Shopping Cart
              {totalItems > 0 && (
                <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">{totalItems}</span>
              )}
            </div>
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all mt-4"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </nav>
    </aside>
  );
}
