'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const mockProducts = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 299.00,
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
    category: 'Electronics'
  },
  {
    id: 2,
    name: 'Minimalist Leather Watch',
    price: 185.00,
    rating: 4.9,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80',
    category: 'Accessories'
  },
  {
    id: 3,
    name: 'Ergonomic Desk Chair',
    price: 450.00,
    rating: 4.7,
    reviews: 256,
    image: 'https://images.unsplash.com/photo-1505843490701-5be5d0b19d58?auto=format&fit=crop&w=500&q=80',
    category: 'Furniture'
  },
  {
    id: 4,
    name: 'Portable Smart Speaker',
    price: 129.00,
    rating: 4.6,
    reviews: 167,
    image: 'https://images.unsplash.com/photo-1589003077984-894e133d1a9a?auto=format&fit=crop&w=500&q=80',
    category: 'Electronics'
  },
];

export default function FeaturedProducts() {
  return (
    <section className="py-24 bg-white" id="products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-3">Trending Now</h2>
            <p className="text-4xl font-black text-gray-900 tracking-tight">Featured Products from our Top Merchants.</p>
          </div>
          <Link href="/products" className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
            View All Products <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 mb-6">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm">
                    {product.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button className="p-4 bg-white rounded-2xl text-gray-900 hover:bg-blue-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300">
                    <ShoppingCart className="w-6 h-6" />
                  </button>
                  <button className="p-4 bg-white rounded-2xl text-gray-900 hover:bg-blue-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75">
                    <Eye className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1 text-orange-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-bold text-gray-900">{product.rating}</span>
                  <span className="text-xs font-medium text-gray-400">({product.reviews} reviews)</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-xl font-black text-gray-900">${product.price.toFixed(2)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Eye(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
