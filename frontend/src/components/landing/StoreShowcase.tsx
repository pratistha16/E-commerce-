'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Layout, Sparkles, Zap } from 'lucide-react';

const showcaseCards = [
  {
    title: 'High-Fashion Minimalist',
    theme: 'bg-slate-50',
    tag: 'Trending Layout',
    icon: Layout,
    delay: 0.1
  },
  {
    title: 'Electronic Gizmos',
    theme: 'bg-blue-50',
    tag: 'Highest Conversion',
    icon: Zap,
    delay: 0.2
  },
  {
    title: 'Luxury Home Decor',
    theme: 'bg-indigo-50',
    tag: 'Premium Aesthetic',
    icon: Sparkles,
    delay: 0.3
  },
];

export default function StoreShowcase() {
  return (
    <section className="relative overflow-hidden py-32 bg-white">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 mb-6"
            >
              <Layout className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Experience Design</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[0.95]"
            >
              Elite Storefront <br />
              <span className="text-blue-600">Experiences.</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg text-slate-500 font-medium max-w-sm leading-relaxed"
          >
            Stunning, design-rich storefronts equipped with dynamic micro-animations and conversion-focused paths.
          </motion.p>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {showcaseCards.map((card, index) => (
            <motion.article
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: card.delay, duration: 0.8 }}
              key={card.title}
              className={`group relative rounded-[3rem] border border-slate-100 bg-white p-8 transition-all duration-700 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-4 ${index === 1 ? 'md:-translate-y-8' : ''}`}
            >
              <div className={`relative h-96 rounded-[2.5rem] overflow-hidden ${card.theme} p-8 mb-8`}>
                {/* Mock UI in card */}
                <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm group-hover:scale-105 transition-transform duration-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-2 w-16 bg-slate-100 rounded-full" />
                    <card.icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 w-full bg-slate-50 rounded-xl" />
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-8 bg-slate-50 rounded-lg" />
                      <div className="h-8 bg-slate-50 rounded-lg" />
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1.5 rounded-full bg-white text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm border border-slate-100">
                    {card.tag}
                  </span>
                </div>
              </div>

              <div className="px-4">
                <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{card.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-6">
                  Conversion-focused blocks with elite aesthetics.
                </p>
                <div className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform -translate-x-4 group-hover:translate-x-0">
                  <span>View Layout</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
