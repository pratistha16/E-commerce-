'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import StorefrontNavbar from '@/components/landing/StorefrontNavbar';
import CartDrawer from '@/components/landing/CartDrawer';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import { Heart, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  return (
    <ProtectedRoute>
      <StorefrontNavbar />
      <CartDrawer />
      
      <div className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <ProfileSidebar />
            
            <div className="flex-1">
              <div className="bg-white rounded-4xl p-10 border border-slate-100 shadow-soft text-center">
                <div className="h-20 w-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart size={40} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Your Wishlist is Empty</h1>
                <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8">Save items you love to your wishlist and they'll show up here for later purchase.</p>
                <Link href="/products" className="btn btn-primary !h-14 !px-10">
                  Browse Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
