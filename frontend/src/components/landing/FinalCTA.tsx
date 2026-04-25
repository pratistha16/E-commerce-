'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';

export default function FinalCTA() {
  return (
    <section className="py-32 relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[4rem] bg-slate-900 p-12 lg:p-24 overflow-hidden shadow-2xl"
        >
          {/* Decorative Background */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px]" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 mix-blend-overlay" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 rounded-[2.5rem] bg-blue-600 flex items-center justify-center mb-10 shadow-xl shadow-blue-500/20"
            >
              <Zap className="w-10 h-10 text-white fill-white" />
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-8xl font-black text-white tracking-tight leading-[0.9] mb-8"
            >
              Ready to build <br />
              <span className="text-blue-500">your empire?</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-slate-400 text-xl md:text-2xl max-w-2xl mb-16 font-medium leading-relaxed"
            >
              Join 12,000+ merchants already scaling their businesses on the world's most advanced commerce platform.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
            >
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto btn-primary h-20 px-16 rounded-3xl text-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/20 group">
                  Start for Free
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto h-20 px-16 rounded-3xl text-xl font-black uppercase tracking-widest border-2 border-slate-700 text-white hover:bg-white hover:text-slate-900 transition-all">
                  Contact Sales
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
