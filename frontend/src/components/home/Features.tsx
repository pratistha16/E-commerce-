'use client';

import React from 'react';
import { 
  Store, 
  Zap, 
  BarChart3, 
  ShieldCheck, 
  Layers, 
  Globe 
} from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Multi-tenant Infrastructure',
    description: 'Every merchant gets their own secure database schema and custom subdomain automatically.',
    icon: Layers,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    title: 'Powerful Merchant Tools',
    description: 'Comprehensive dashboard to manage products, orders, and customer relationships with ease.',
    icon: Store,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    title: 'Lightning Fast Checkout',
    description: 'Optimized conversion-focused checkout process that works flawlessly on all devices.',
    icon: Zap,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    title: 'Advanced Analytics',
    description: 'Real-time insights into sales, revenue trends, and top-performing products for every store.',
    icon: BarChart3,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    title: 'Enterprise Security',
    description: 'Bank-grade security with SSL, data isolation, and robust permission management built-in.',
    icon: ShieldCheck,
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
  {
    title: 'Global Customization',
    description: 'Full control over store branding, colors, typography, and layout without writing code.',
    icon: Globe,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-3">Platform Features</h2>
          <p className="text-4xl font-black text-gray-900 tracking-tight mb-6">Everything you need to scale your commerce business.</p>
          <p className="text-lg text-gray-500 font-medium leading-relaxed">
            We've built the most robust multi-tenant architecture so you can focus on what matters: your customers and your brand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-8 rounded-3xl border border-gray-100 bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group"
            >
              <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
