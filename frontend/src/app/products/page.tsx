'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductService } from '@/services/productService';
import { Product, Category } from '@/types';
import Link from 'next/link';
import { Star, Search, X, SlidersHorizontal } from 'lucide-react';

function ProductListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [showMobileFilters, setShowShowMobileFilters] = useState(false);

  // Get filters from URL
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentOrdering = searchParams.get('ordering') || '';

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const deriveCategoriesFromProducts = (items: Product[]) => {
    const categoryMap = new Map<number, Category>();
    items.forEach((item) => {
      if (item.category?.id) {
        categoryMap.set(item.category.id, item.category);
      }
    });
    return Array.from(categoryMap.values());
  };

  const fetchInitialData = async () => {
    try {
      const cats = await ProductService.getCategories();
      setCategories(cats);
    } catch {
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setProductsError(null);
    try {
      const params = Object.fromEntries(searchParams.entries());
      const data = await ProductService.getProducts(params);
      setProducts(data);
      setCategories((prev) => (prev.length > 0 ? prev : deriveCategoriesFromProducts(data)));
    } catch {
      setProducts([]);
      setProductsError('Unable to load products right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`/products?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateFilters({ search: formData.get('search') as string });
  };

  const clearFilters = () => {
    router.push('/products');
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Search & Header Section */}
      <header className="border-b border-slate-100 bg-white sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Marketplace</h1>
              <p className="text-slate-500 mt-1 text-sm font-medium">Discover premium products from independent brands</p>
            </div>
            
            <form onSubmit={handleSearch} className="relative w-full md:max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="text"
                name="search"
                defaultValue={currentSearch}
                placeholder="Search products, brands, categories..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all outline-none font-medium"
              />
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-44 space-y-8">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <SlidersHorizontal size={16} className="text-accent" />
                    Refine
                  </h3>
                  {(currentCategory || currentOrdering || currentSearch) && (
                    <button onClick={clearFilters} className="text-xs font-bold text-accent hover:text-indigo-700 transition-colors">
                      Reset
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <section>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Categories</p>
                    <div className="space-y-1">
                      <button
                        onClick={() => updateFilters({ category: '' })}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                          !currentCategory ? 'bg-accent text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => updateFilters({ category: cat.id.toString() })}
                          className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                            currentCategory === cat.id.toString() ? 'bg-accent text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Sort By</p>
                    <select
                      value={currentOrdering}
                      onChange={(e) => updateFilters({ ordering: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-accent/20 outline-none"
                    >
                      <option value="">Featured</option>
                      <option value="price">Price: Low to High</option>
                      <option value="-price">Price: High to Low</option>
                      <option value="-created_at">Newest Arrivals</option>
                    </select>
                  </section>
                </div>
              </div>

              {/* Promo Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-elevated">
                <h4 className="font-bold text-lg leading-tight mb-2">Sell on MultiMarket</h4>
                <p className="text-indigo-100 text-xs mb-4">Reach millions of customers and grow your brand globally.</p>
                <Link href="/register" className="inline-flex items-center justify-center w-full py-2 bg-white text-indigo-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors">
                  Open a Store
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-slate-500 font-medium">
                Showing <span className="text-slate-900 font-bold">{products.length}</span> products
              </p>
              
              <button 
                onClick={() => setShowShowMobileFilters(true)}
                className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-100 transition-all"
              >
                <SlidersHorizontal size={18} />
                Filters
              </button>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl border border-slate-100 p-4 space-y-4 animate-pulse">
                    <div className="aspect-[4/5] bg-slate-50 rounded-2xl"></div>
                    <div className="h-4 bg-slate-50 rounded-lg w-2/3"></div>
                    <div className="h-6 bg-slate-50 rounded-lg w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : productsError ? (
              <div className="text-center py-32 bg-slate-50 rounded-4xl border-2 border-dashed border-slate-200">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-6">
                  <Search size={32} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Products unavailable</h3>
                <p className="text-slate-500 mt-2 max-w-xs mx-auto font-medium">{productsError}</p>
                <button
                  onClick={fetchProducts}
                  className="mt-8 btn btn-primary"
                >
                  Retry Search
                </button>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((p) => (
                  <Link 
                    key={p.id} 
                    href={`/products/${p.slug}`}
                    className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-elevated transition-all duration-500"
                  >
                    <div className="aspect-[4/5] relative bg-slate-50 overflow-hidden">
                      <img 
                        src={p.images?.[0]?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop'} 
                        alt={p.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {p.discount_price && (
                        <span className="absolute top-4 left-4 bg-accent text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg tracking-wider">
                          SAVE {Math.round((1 - p.final_price / p.price) * 100)}%
                        </span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                          {p.category?.name || 'New Arrival'}
                        </span>
                        <div className="flex items-center gap-1 text-amber-400">
                          <Star size={12} fill="currentColor" />
                          <span className="text-[10px] font-bold text-slate-900">4.8</span>
                        </div>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-accent transition-colors truncate">
                        {p.name}
                      </h3>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-lg font-black text-slate-900">${p.final_price}</span>
                        {p.discount_price && (
                          <span className="text-sm font-medium text-slate-400 line-through">${p.price}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-slate-50 rounded-4xl border-2 border-dashed border-slate-200">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-6">
                  <Search size={32} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No products found</h3>
                <p className="text-slate-500 mt-2 max-w-xs mx-auto font-medium">Try adjusting your filters or search terms to find what you're looking for.</p>
                <button
                  onClick={clearFilters}
                  className="mt-8 btn btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </main>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowShowMobileFilters(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-8 space-y-10 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900">Filters</h2>
              <button onClick={() => setShowShowMobileFilters(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            {/* Mobile filters content */}
            <div className="space-y-8">
              <section>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Categories</p>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => { updateFilters({ category: '' }); setShowShowMobileFilters(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      !currentCategory ? 'bg-accent text-white' : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { updateFilters({ category: cat.id.toString() }); setShowShowMobileFilters(false); }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        currentCategory === cat.id.toString() ? 'bg-accent text-white' : 'bg-slate-50 text-slate-600'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductListPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    }>
      <ProductListContent />
    </Suspense>
  );
}
