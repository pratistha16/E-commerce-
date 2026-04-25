'use client';

import React from 'react';
import Link from 'next/link';
import { Twitter, Instagram, Linkedin, Github, Mail, Phone, MapPin, Globe } from 'lucide-react';

const footerLinks = [
  {
    title: "Platform",
    links: [
      { label: "Features", href: "#features" },
      { label: "Marketplace", href: "/products" },
      { label: "Merchants", href: "/merchants" },
      { label: "Pricing", href: "/pricing" },
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Press", href: "/press" },
    ]
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ]
  }
];

export default function LandingFooter() {
  return (
    <footer className="bg-white pt-32 pb-12 relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
          {/* Logo & Info */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                M
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight uppercase">
                Global<span className="text-blue-600">Merchant</span>
              </span>
            </Link>
            <p className="text-slate-500 font-medium leading-relaxed max-w-sm text-lg">
              The definitive commerce infrastructure for modern merchants. Built for global scale, designed for maximum conversion.
            </p>
            <div className="flex items-center gap-4">
              {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                <button key={i} className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-8">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-base font-bold text-slate-400 hover:text-blue-600 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            © 2026 Global Merchant. Built for scale.
          </p>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-blue-600 transition-colors cursor-pointer uppercase tracking-widest">
              <Globe className="w-4 h-4" />
              Global Edition
            </div>
            <div className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-blue-600 transition-colors cursor-pointer uppercase tracking-widest">
              <MapPin className="w-4 h-4" />
              San Francisco
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
