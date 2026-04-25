'use client';

import React, { useEffect, useState } from 'react';
import { ProductService } from '@/services/productService';
import { Product } from '@/types';
import Link from 'next/link';
import { Star, ShoppingCart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface RecommendedProductsProps {
  title?: string;
  limit?: number;
  className?: string;
}

export default function RecommendedProducts({ 
  title = "Recommended for you", 
  limit = 4,
  className = "" 
}: RecommendedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, [limit]);

  const fetchRecommendations = async () => {
    try {
      const data = await ProductService.getProducts({ limit });
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="bg-white rounded-3xl border border-slate-100 p-4 space-y-4 animate-pulse">
            <div className="aspect-[4/5] bg-slate-50 rounded-2xl"></div>
            <div className="h-4 bg-slate-50 rounded-lg w-2/3"></div>
            <div className="h-6 bg-slate-50 rounded-lg w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
        <Link href="/products" className="group flex items-center gap-2 text-sm font-bold text-accent hover:text-indigo-700 transition-colors">
          View all <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link 
              href={`/products/${product.slug}`}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-elevated transition-all duration-500 block"
            >
              <div className="aspect-[4/5] relative bg-slate-50 overflow-hidden">
                <img 
                  src={product.images?.[0]?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop'} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                    {product.category?.name || 'New Arrival'}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star size={12} fill="currentColor" />
                    <span className="text-[10px] font-bold text-slate-900">4.8</span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-accent transition-colors truncate">
                  {product.name}
                </h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-lg font-black text-slate-900">${product.final_price}</span>
                  {product.discount_price && (
                    <span className="text-sm font-medium text-slate-400 line-through">${product.price}</span>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
