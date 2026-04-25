'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Target, Users, Globe, ShieldCheck } from 'lucide-react';

export default function AboutUs() {
  return (
    <section id="about" className="py-32 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Our Core Mission</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-[0.95]">
              Empowering the <br />
              <span className="text-blue-600">next generation.</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12 max-w-xl">
              Global Merchant was built to democratize e-commerce for independent sellers. 
              Our infrastructure allows anyone to launch a professional, high-performance 
              storefront without worrying about the underlying complexity.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { icon: Users, title: "Community First", desc: "Supporting thousands of independent sellers." },
                { icon: Globe, title: "Global Reach", desc: "Sell to customers anywhere in the world." },
                { icon: Target, title: "Precision Tools", desc: "Advanced analytics and management features." },
                { icon: CheckCircle2, title: "Proven Stability", desc: "99.9% uptime for your business growth." },
              ].map((item, i) => (
                <div key={i} className="flex gap-5 group">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-blue-500/20">
                    <item.icon className="w-6 h-6 text-slate-900 group-hover:text-white group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.title}</h4>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, type: "spring" }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white relative group">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop" 
                alt="Our Mission"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            </div>
            
            {/* Floating Card Decor */}
            <div className="absolute -bottom-8 -left-8 bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl hidden sm:block">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[1.25rem] bg-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-500/20">
                  M
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Support</p>
                  <p className="text-4xl font-black text-white tracking-tighter">24/7</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
