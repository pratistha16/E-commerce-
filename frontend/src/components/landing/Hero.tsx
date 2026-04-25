'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Play, TrendingUp, ShieldCheck, Zap, Globe } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui';

export default function Hero() {
  return (
    <section className="relative pt-[140px] lg:pt-[200px] pb-32 overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-50 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-50 rounded-full blur-[120px] opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Content Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8"
            >
              <Zap className="w-4 h-4 text-blue-600 fill-blue-600" />
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Next-Gen Commerce Platform</span>
            </motion.div>

            <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[0.95] tracking-tight mb-8">
              Scale Your <br />
              <span className="text-blue-600">Digital Empire.</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-500 font-medium leading-relaxed max-w-xl mb-12">
              The definitive commerce infrastructure for modern merchants. Architected for global scale, designed for maximum conversion.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
              <Button asChild className="btn-primary h-16 px-10 rounded-2xl group w-full sm:w-auto text-base font-black uppercase tracking-widest shadow-2xl shadow-blue-500/25">
                <Link href="/register?role=VENDOR">
                  Start Selling <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-16 px-10 rounded-2xl w-full sm:w-auto text-base font-black uppercase tracking-widest border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600 transition-all">
                <Link href="/products">
                  Browse Demo
                </Link>
              </Button>
            </div>

            {/* Trust Signals */}
            <div className="pt-8 border-t border-slate-100">
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Trusted by industry leaders</p>
              <div className="flex flex-wrap items-center gap-8 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700">
                <div className="flex items-center gap-2 font-black text-xl text-slate-900">
                  <ShieldCheck className="w-6 h-6" /> SECURE
                </div>
                <div className="flex items-center gap-2 font-black text-xl text-slate-900">
                  <Globe className="w-6 h-6" /> GLOBAL
                </div>
                <div className="flex items-center gap-2 font-black text-xl text-slate-900">
                  <TrendingUp className="w-6 h-6" /> SCALE
                </div>
              </div>
            </div>
          </motion.div>

          {/* Visual Right */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white group"
            >
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop" 
                alt="Commerce Analytics"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-12 left-12 right-12">
                <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-glass">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-black text-white uppercase tracking-widest">Revenue Growth</p>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black">+24%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "85%" }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Element 1 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -top-12 -right-12 p-6 rounded-[2rem] bg-slate-900 text-white shadow-2xl hidden lg:block"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Merchants</p>
                  <p className="text-xl font-black">12,402</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
