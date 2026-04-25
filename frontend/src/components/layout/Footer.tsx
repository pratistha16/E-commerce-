'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Github, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  platform: [
    { name: 'How it Works', href: '/#how-it-works' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Merchant Tools', href: '/merchant/tools' },
    { name: 'Analytics', href: '/analytics' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Blog', href: '/blog' },
  ],
  support: [
    { name: 'Help Center', href: '/support' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Contact', href: '/contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xl italic">M</span>
              </div>
              <span className="text-xl font-black tracking-tighter text-gray-900">
                MARKETMASTER
              </span>
            </Link>
            <p className="text-gray-500 font-medium leading-relaxed max-w-sm">
              The leading multi-tenant e-commerce solution for businesses of all sizes. Build, scale, and manage your online store with ease.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Github].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Platform</h4>
            <ul className="space-y-4">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-500 hover:text-primary-600 font-medium transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-500 hover:text-primary-600 font-medium transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-500">
                <MapPin className="w-5 h-5 text-primary-600 shrink-0" />
                <span className="text-sm font-medium">123 Commerce St, Suite 100, San Francisco, CA 94103</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <Mail className="w-5 h-5 text-primary-600 shrink-0" />
                <span className="text-sm font-medium">hello@marketmaster.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <Phone className="w-5 h-5 text-primary-600 shrink-0" />
                <span className="text-sm font-medium">+1 (555) 000-0000</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm font-medium">
            © {new Date().getFullYear()} MultiCart Inc. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="/terms" className="text-gray-400 hover:text-gray-600 text-xs font-bold uppercase tracking-widest">Terms</Link>
            <Link href="/privacy" className="text-gray-400 hover:text-gray-600 text-xs font-bold uppercase tracking-widest">Privacy</Link>
            <Link href="/cookies" className="text-gray-400 hover:text-gray-600 text-xs font-bold uppercase tracking-widest">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
