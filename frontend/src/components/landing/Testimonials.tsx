'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Maya Chen',
    role: 'Founder, Lumi Wear',
    avatar: 'M',
    quote:
      'The storefront quality is exceptional. We launched 3 tenant stores in two weeks and conversions improved instantly by over 40%.',
  },
  {
    name: 'Daniel Ortiz',
    role: 'Head of Commerce, Modern Haus',
    avatar: 'D',
    quote:
      'Clean admin tools, fast checkout, and clear analytics. This is the first platform our team actually enjoys using daily.',
  },
  {
    name: 'Sara Malik',
    role: 'Marketplace Manager, BlendCart',
    avatar: 'S',
    quote:
      'From vendor onboarding to product publishing, everything feels polished and production-ready out of the box.',
  },
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-white py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 mb-6"
            >
              <Star className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Success Stories</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[0.95]"
            >
              Trusted by the <br />
              <span className="text-blue-600">world's best teams.</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg text-slate-500 font-medium max-w-sm leading-relaxed"
          >
            Join thousands of merchants who have already scaled their businesses with our infrastructure.
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              key={item.name}
              className="group relative rounded-[3rem] bg-slate-50 border border-slate-100 p-12 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-2"
            >
              <Quote className="absolute top-10 right-10 w-12 h-12 text-slate-200 group-hover:text-blue-100 transition-colors" />
              
              <div className="mb-8 flex items-center gap-1 text-blue-600">
                {[...Array(5)].map((_, i) => (
                  <Star key={`${item.name}-${i}`} className="h-4 w-4 fill-current" />
                ))}
              </div>
              
              <p className="text-xl leading-relaxed text-slate-600 font-medium mb-10">
                "{item.quote}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-black text-blue-600 text-xl shadow-sm group-hover:scale-110 transition-transform">
                  {item.avatar}
                </div>
                <div>
                  <p className="text-base font-black text-slate-900">{item.name}</p>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{item.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
