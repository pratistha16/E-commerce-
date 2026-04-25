'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { TenantProvider, useTenant } from '@/context/TenantContext';
import { MerchantService } from '@/services/merchantService';
import { Product } from '@/types';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Search, Menu, ArrowRight, Instagram, Facebook, Twitter } from 'lucide-react';

function StorefrontContent() {
  const { profile, loading, error } = useTenant();
  const [products, setProducts] = useState<Product[]>([]);
  const params = useParams();
  const subdomain = params.subdomain as string;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await MerchantService.getProducts(); // This will be filtered by tenant in backend
        setProducts(response);
      } catch (err) {
        console.error('Failed to fetch store products', err);
      }
    };
    fetchProducts();
  }, [subdomain]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-slate-100 border-t-primary animate-spin rounded-full"></div>
    </div>
  );

  if (!profile && !loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-4 uppercase">Store Not Found</h1>
        <p className="text-slate-500 font-medium mb-8">The store you are looking for does not exist or has been suspended.</p>
        <Link href="http://localhost:3000" className="btn btn-primary !rounded-full px-8">Return to GlobalMerchant</Link>
      </div>
    </div>
  );

  const primaryColor = profile?.primary_color || '#2563eb';
  const fontFamily = profile?.font_family || 'Inter, sans-serif';

  return (
    <div style={{ fontFamily }} className="min-h-screen transition-colors duration-500" style={{ backgroundColor: profile?.background_color }}>
      {/* Dynamic Merchant Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            {profile?.logo ? (
              <img src={profile.logo} alt={profile.store_name} className="h-10 w-auto" />
            ) : (
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20 transition-transform group-hover:scale-110"
                style={{ backgroundColor: primaryColor }}
              >
                {profile?.store_name[0]}
              </div>
            )}
            <span className="text-xl font-black text-slate-900 tracking-tight uppercase">{profile?.store_name}</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/products" className="hover:text-primary transition-colors">Catalog</Link>
            <Link href="/about" className="hover:text-primary transition-colors">Our Story</Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[8px] font-black flex items-center justify-center rounded-full">0</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-[10px] font-black uppercase tracking-widest"
              style={{ backgroundColor: `${primaryColor}10`, color: primaryColor }}
            >
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
              New Collection 2024
            </div>
            <h1 className="text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-8">
              {profile?.tagline || 'Experience premium quality in every detail.'}
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12 max-w-lg">
              {profile?.description || 'Discover a curated selection of high-end products designed for those who value excellence and sophisticated design.'}
            </p>
            <div className="flex items-center gap-4">
              <button 
                className="!h-16 !px-10 text-[11px] font-black uppercase tracking-widest text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: primaryColor, borderRadius: profile?.button_style === 'pill' ? '9999px' : profile?.button_style === 'rounded' ? '1rem' : '0' }}
              >
                Shop Collection
              </button>
              <button className="h-16 px-8 text-[11px] font-black uppercase tracking-widest text-slate-900 hover:bg-slate-100 transition-all flex items-center gap-2">
                Explore Story <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div 
              className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-3xl rotate-2 hover:rotate-0 transition-transform duration-700"
              style={{ backgroundColor: `${primaryColor}05` }}
            >
              <img 
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80" 
                alt="Featured Product" 
                className="w-full h-full object-cover mix-blend-multiply opacity-90"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-[240px] -rotate-3 hover:rotate-0 transition-transform">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Featured Now</p>
              <p className="text-lg font-black text-slate-900 leading-tight mb-4">The Zenith Watch Collection</p>
              <p className="text-xl font-black" style={{ color: primaryColor }}>$299.00</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Catalog */}
      <section className="py-32 px-6 bg-white rounded-t-[5rem]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">The Catalog</p>
              <h2 className="text-5xl font-black text-slate-900 tracking-tight uppercase">Featured Arrivals</h2>
            </div>
            <div className="flex gap-4">
              <button className="h-12 px-6 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">All Products</button>
              <button className="h-12 px-6 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">Best Sellers</button>
            </div>
          </div>

          <div className={`grid gap-10 ${profile?.homepage_layout === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {products.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/5] bg-slate-50 rounded-[2.5rem] overflow-hidden mb-8 relative">
                  <img 
                    src={product.images?.[0]?.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80'} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-6 right-6">
                    <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-slate-900 hover:text-white transition-all transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.category.name}</p>
                    <p className="text-lg font-black text-slate-900">${product.price}</p>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Merchant Footer */}
      <footer className="bg-slate-900 py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-8">{profile?.store_name}</h2>
            <p className="text-slate-400 font-medium leading-relaxed max-w-sm mb-12">
              {profile?.description || 'Providing the finest selection of products with a focus on quality and design.'}
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-slate-500 hover:text-white transition-colors"><Instagram size={24} /></Link>
              <Link href="#" className="text-slate-500 hover:text-white transition-colors"><Facebook size={24} /></Link>
              <Link href="#" className="text-slate-500 hover:text-white transition-colors"><Twitter size={24} /></Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-10">Quick Links</h4>
            <ul className="space-y-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <li><Link href="/" className="hover:text-white transition-colors">Catalog</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Shipping Info</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-10">Contact</h4>
            <ul className="space-y-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <li>{profile?.contact_email}</li>
              <li>{profile?.contact_phone}</li>
              <li>{profile?.address}</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            © 2024 {profile?.store_name}. All rights reserved.
          </p>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
            Powered by <span className="text-slate-400">GlobalMerchant</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function StorefrontPage() {
  return (
    <TenantProvider>
      <StorefrontContent />
    </TenantProvider>
  );
}
