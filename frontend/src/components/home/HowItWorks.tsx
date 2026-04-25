'use client';

import React from 'react';
import { UserPlus, Layout, Package, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    title: 'Register Account',
    description: 'Sign up in seconds and verify your identity to get started on our platform.',
    icon: UserPlus,
    color: 'blue',
  },
  {
    title: 'Create Your Store',
    description: 'Provision your own secure store instance with a custom domain and branding.',
    icon: Layout,
    color: 'purple',
  },
  {
    title: 'Add Products',
    description: 'Upload your inventory, set prices, and configure variants like size and color.',
    icon: Package,
    color: 'orange',
  },
  {
    title: 'Start Selling',
    description: 'Go live and start accepting payments from customers all over the world.',
    icon: Rocket,
    color: 'green',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-gray-50 overflow-hidden" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-3">The Process</h2>
          <p className="text-4xl font-black text-gray-900 tracking-tight mb-6">Launch your business in 4 easy steps.</p>
        </div>

        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className={`w-20 h-20 bg-white border-4 border-${step.color}-50 rounded-full flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform duration-300 relative`}>
                  <div className={`absolute -top-2 -right-2 w-8 h-8 bg-${step.color}-600 text-white rounded-full flex items-center justify-center font-black text-sm`}>
                    {idx + 1}
                  </div>
                  <step.icon className={`w-8 h-8 text-${step.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed px-4">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
