'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import StorefrontNavbar from '@/components/landing/StorefrontNavbar';
import LandingFooter from '@/components/landing/LandingFooter';
import CartDrawer from '@/components/landing/CartDrawer';
import ProductService from '@/services/productService';
import { Product, Category } from '@/types';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Package, Filter, ChevronRight, Activity, X, Check, Search, TrendingUp, Sparkles, Tag, ArrowDownUp } from 'lucide-react';
import { Button } from '@/components/ui';

// Helper to get absolute image URL
const getFullImageUrl = (url: string) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
  return `${baseUrl}${url}`;
};

// Quick Filters
const QUICK_FILTERS = [
  { id: 'all', label: 'All Products', icon: Package },
  { id: 'new', label: 'New Arrivals', icon: Sparkles },
  { id: 'under50', label: 'Under $50', icon: Tag },
  { id: 'sale', label: 'Sale Items', icon: TrendingUp },
];

export default function StorefrontPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Advanced Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [quickFilter, setQuickFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          ProductService.getProducts(),
          ProductService.getCategories()
        ]);
        setProducts(productsData || []);
        setCategories(categoriesData || []);
        
        // Auto-set max price based on data
        if (productsData?.length > 0) {
          const maxPrice = Math.max(...productsData.map((p: Product) => Number(p.price)));
          setPriceRange([0, Math.ceil(maxPrice)]);
        }
      } catch (error) {
        console.error('Error fetching storefront data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Extract unique brands/vendors from products
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach(p => {
      if (p.brand?.name) brands.add(p.brand.name);
      else if (p.vendor?.store_name) brands.add(p.vendor.store_name);
    });
    return Array.from(brands);
  }, [products]);

  // Massive Client-Side Filter Engine
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.vendor?.store_name?.toLowerCase().includes(q) ||
        p.brand?.name?.toLowerCase().includes(q)
      );
    }

    // 2. Category
    if (selectedCategory) {
      result = result.filter(p => p.category?.slug === selectedCategory);
    }

    // 3. Brands
    if (selectedBrands.length > 0) {
      result = result.filter(p => 
        selectedBrands.includes(p.brand?.name || p.vendor?.store_name || '')
      );
    }

    // 4. Price Range
    result = result.filter(p => Number(p.price) >= priceRange[0] && Number(p.price) <= priceRange[1]);

    // 5. In Stock Only
    if (inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // 6. Quick Filters
    if (quickFilter === 'under50') {
      result = result.filter(p => Number(p.price) < 50);
    } else if (quickFilter === 'sale') {
      result = result.filter(p => p.discount_price && Number(p.discount_price) < Number(p.price));
    }
    // Note: 'new' filter would require created_at field, we'll simulate by sorting below if needed.

    // 7. Sorting
    result.sort((a, b) => {
      if (sortBy === 'price_asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price_desc') return Number(b.price) - Number(a.price);
      // 'newest' is default, assuming ID represents chronological order if created_at is missing
      return Number(b.id) - Number(a.id); 
    });

    return result;
  }, [products, searchQuery, selectedCategory, selectedBrands, priceRange, inStockOnly, quickFilter, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedBrands([]);
    setInStockOnly(false);
    setSearchQuery('');
    setQuickFilter('all');
    if (products.length > 0) {
      const maxPrice = Math.max(...products.map(p => Number(p.price)));
      setPriceRange([0, Math.ceil(maxPrice)]);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      <StorefrontNavbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <CartDrawer />

      {/* Quick Filters Bar */}
      <div className="bg-white border-b border-slate-100 overflow-x-auto custom-scrollbar sticky top-20 z-40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          {QUICK_FILTERS.map((qf) => (
            <button
              key={qf.id}
              onClick={() => setQuickFilter(qf.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                quickFilter === qf.id 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <qf.icon size={14} />
              {qf.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar Filters */}
        <aside className="w-full md:w-72 shrink-0 space-y-6 hidden md:block">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft sticky top-36">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Filter size={18} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Filters</h3>
              </div>
              <button onClick={clearFilters} className="text-[10px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors">
                Clear All
              </button>
            </div>
            
            <div className="space-y-8">
              {/* Category Filter */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3">Categories</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedCategory === null ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span>All Categories</span>
                  </button>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.slug)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedCategory === category.slug ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3">Price Range</h4>
                <div className="px-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="1000" 
                    value={priceRange[1]} 
                    onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between items-center mt-3 text-xs font-bold text-slate-500">
                    <span>$0</span>
                    <span className="px-3 py-1 bg-slate-50 rounded-lg text-slate-900">Up to ${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Brands Filter */}
              {availableBrands.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3">Brands & Merchants</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                    {availableBrands.map(brand => (
                      <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          selectedBrands.includes(brand) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 bg-slate-50 group-hover:border-blue-400'
                        }`}>
                          {selectedBrands.includes(brand) && <Check size={12} strokeWidth={4} />}
                        </div>
                        <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability Filter */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3">Availability</h4>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-10 h-5 rounded-full p-1 transition-colors ${inStockOnly ? 'bg-blue-600' : 'bg-slate-200'}`}>
                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${inStockOnly ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">In Stock Only</span>
                </label>
              </div>

            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <section className="flex-1">
          {/* Top Results Bar */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                {selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name : 'Explore Market'}
              </h1>
              <p className="text-sm font-bold text-slate-400 mt-1">
                Showing {filteredProducts.length} items
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ArrowDownUp size={14} /> Sort By
              </span>
              <select 
                className="bg-white border border-slate-100 text-sm font-bold text-slate-900 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600/20 shadow-sm cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6 bg-white rounded-4xl border border-slate-100 shadow-soft">
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-[3px] border-slate-100 border-t-blue-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity className="w-8 h-8 text-blue-600 animate-pulse" />
                </div>
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Loading Catalog...</p>
            </div>
          ) : (
            <>
              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, idx) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      key={product.id}
                      className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-soft hover:shadow-xl hover:border-blue-100 transition-all duration-300 group flex flex-col h-full relative"
                    >
                      {/* Link Wrapper for the whole card content except the Add to Cart button */}
                      <Link href={`/products/${product.slug}`} className="flex flex-col h-full">
                        {/* Image */}
                        <div className="relative aspect-square bg-slate-50 overflow-hidden shrink-0">
                          {product.images?.[0]?.image ? (
                            <img 
                              src={getFullImageUrl(product.images[0].image)} 
                              alt={product.name} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Package size={48} />
                            </div>
                          )}
                          
                          {/* Badges */}
                          <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {product.discount_price && Number(product.discount_price) < Number(product.price) && (
                              <span className="bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                                Sale
                              </span>
                            )}
                            {product.stock === 0 && (
                              <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                                Out of Stock
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-1">
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 group-hover:text-blue-600 transition-colors">
                                {product.brand?.name || product.vendor?.store_name || 'Global Merchant'}
                              </p>
                              <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                                {product.name}
                              </h3>
                            </div>
                          </div>
                          
                          <div className="mt-auto pt-4 flex items-end justify-between">
                            <div>
                              {product.discount_price && Number(product.discount_price) < Number(product.price) ? (
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-slate-400 line-through">${Number(product.price).toLocaleString()}</span>
                                  <span className="text-xl font-black text-rose-600">${Number(product.discount_price).toLocaleString()}</span>
                                </div>
                              ) : (
                                <span className="text-xl font-black text-slate-900">${Number(product.price).toLocaleString()}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* Floating Add to Cart Button (separate from Link) */}
                      <div className="absolute inset-x-0 bottom-24 bg-gradient-to-t from-white/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center py-4">
                        <Button 
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                          className="bg-blue-600 text-white hover:bg-slate-900 border-none shadow-2xl transition-all font-black uppercase tracking-widest text-xs px-6 py-4 rounded-2xl disabled:opacity-50"
                        >
                          {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                        </Button>
                      </div>

                      {/* Mobile Add to Cart */}
                      <button 
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className="md:hidden absolute bottom-5 right-5 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg disabled:opacity-50"
                      >
                        <ShoppingCart size={18} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Empty State */}
              {filteredProducts.length === 0 && (
                <div className="text-center py-32 bg-white rounded-4xl border border-slate-100 shadow-soft">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-6">
                    <Search size={40} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">No matches found</h3>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto">
                    We couldn't find any products matching your current filters. Try adjusting them or clear all filters.
                  </p>
                  <Button 
                    onClick={clearFilters}
                    className="mt-8 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest px-8"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
