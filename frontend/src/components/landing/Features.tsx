'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, 
  Package, 
  CreditCard, 
  BarChart3, 
  ShieldCheck,
  Zap,
  Globe,
  ArrowUpRight
} from 'lucide-react';
import { Card } from '@/components/ui';

export default function Features() {
  return (
    <section id="features" className="py-32 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 mb-6"
            >
              <Zap className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Platform Features</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[0.95]"
            >
              Built for the <br />
              <span className="text-blue-600">modern merchant.</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg text-slate-500 font-medium max-w-sm leading-relaxed"
          >
            A comprehensive suite of tools designed to help you launch, manage, and scale your business globally.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Bento Grid Item 1: Large */}
          <motion.div 
            className="md:col-span-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="group relative h-full rounded-[3rem] bg-slate-50 border border-slate-100 p-12 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5">
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 mb-20 group-hover:scale-110 transition-transform duration-500">
                  <Layers className="w-7 h-7" />
                </div>
                <div className="mt-auto">
                  <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">Multi-tenant Architecture</h3>
                  <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-md">
                    Manage unlimited storefronts from a single powerful dashboard. Designed for complex merchant ecosystems.
                  </p>
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute top-12 right-12 opacity-10 group-hover:opacity-20 transition-opacity">
                <Globe className="w-32 h-32" />
              </div>
            </div>
          </motion.div>

          {/* Bento Grid Item 2: Small Dark */}
          <motion.div 
            className="md:col-span-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="group relative h-full rounded-[3rem] bg-slate-900 p-12 overflow-hidden">
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-20">
                  <Package className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">Global Logistics</h3>
                <p className="text-slate-400 font-medium leading-relaxed">
                  Advanced inventory management with real-time tracking across multiple regions.
                </p>
              </div>
              <div className="absolute -bottom-4 -right-4 opacity-10">
                <ShieldCheck className="w-40 h-40 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Bento Grid Item 3: Small Accent */}
          <motion.div 
            className="md:col-span-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="group relative h-full rounded-[3rem] bg-blue-600 p-12 overflow-hidden shadow-2xl shadow-blue-500/20">
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-20 group-hover:rotate-12 transition-transform">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">Lightning Fast</h3>
                <p className="text-blue-100 font-medium leading-relaxed">
                  Optimized for speed. Deliver a seamless shopping experience with sub-second page loads.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Bento Grid Item 4: Large White */}
          <motion.div 
            className="md:col-span-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="group relative h-full rounded-[3rem] bg-white border border-slate-100 p-12 overflow-hidden transition-all duration-500 hover:border-blue-100">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-600 mb-12 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-7 h-7" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">Precision Insights</h3>
                  <p className="text-lg text-slate-500 font-medium leading-relaxed">
                    Make data-driven decisions with enterprise-grade analytics and real-time sales reporting.
                  </p>
                </div>
                <div className="relative h-64 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                  {/* Mock Analytics UI */}
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-24 bg-slate-200 rounded-full" />
                      <div className="h-4 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-[10px] font-black">+12%</div>
                    </div>
                    <div className="flex items-end gap-2 h-24">
                      {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h}%` }}
                          transition={{ delay: 0.5 + (i * 0.1), duration: 0.8 }}
                          className="flex-1 bg-blue-600 rounded-t-lg"
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-10 bg-white rounded-xl border border-slate-100" />
                      <div className="h-10 bg-white rounded-xl border border-slate-100" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
