'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Store, Package, Rocket, ChevronRight } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: "1. Register",
    description: "Create your account in seconds and join our community of elite merchants."
  },
  {
    icon: Store,
    title: "2. Create Store",
    description: "Set up your unique storefront with dynamic branding and elite elements."
  },
  {
    icon: Package,
    title: "3. Add Products",
    description: "Upload your inventory with rich descriptions and high-quality images."
  },
  {
    icon: Rocket,
    title: "4. Scale Globally",
    description: "Deploy your optimized store and reach customers anywhere, effortlessly."
  }
];

export default function HowItWorks() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 mb-6"
            >
              <Rocket className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Platform Onboarding</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[0.95]"
            >
              Launch your store <br />
              <span className="text-blue-600">in minutes.</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg text-slate-500 font-medium max-w-sm leading-relaxed"
          >
            Get your next-generation e-commerce empire online effortlessly. No coding required.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="relative group"
            >
              <div className="w-20 h-20 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:-translate-y-2 transition-all duration-500">
                <step.icon className="w-8 h-8 text-slate-900 group-hover:text-white group-hover:scale-110 transition-all" />
              </div>
              
              <h3 className="text-2xl font-black mb-4 tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors uppercase">{step.title}</h3>
              <p className="text-base font-medium text-slate-500 leading-relaxed">
                {step.description}
              </p>

              {/* Decorative Arrow for desktop */}
              {idx !== 3 && (
                <div className="hidden lg:block absolute top-10 left-[70%] text-slate-100 group-hover:text-blue-100 transition-colors">
                  <ChevronRight className="w-10 h-10" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
