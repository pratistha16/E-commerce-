'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MerchantSidebar from '@/components/merchant/MerchantSidebar';
import { motion } from 'framer-motion';

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['VENDOR']}>
      <div className="flex bg-slate-50/50 dark:bg-slate-950 min-h-screen overflow-hidden font-sans antialiased">
        <MerchantSidebar />
        <main className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
          <div className="p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
