'use client';

import React, { useEffect, useState } from 'react';
import { MerchantService } from '@/services/merchantService';
import { Product } from '@/types';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Package, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';

// Helper to get absolute image URL
const getFullImageUrl = (url: string) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
  return `${baseUrl}${url}`;
};

export default function MerchantProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await MerchantService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    try {
      await MerchantService.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Product Catalog</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your products, inventory, and storefront availability.</p>
        </div>
        <Link
          href="/merchant/dashboard/products/add"
          className="btn btn-primary shadow-elevated flex items-center gap-2 !h-12 !px-8"
        >
          <Plus size={20} />
          Add New Product
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-soft flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search products by name or category..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <button className="btn btn-outline flex items-center gap-2 !px-6">
            <Filter size={18} />
            Filters
          </button>
          <button className="btn btn-outline !px-6">
            Export CSV
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-4xl border border-slate-100 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Product Info</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Inventory</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pricing</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((product, index) => (
                <motion.tr 
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="h-16 w-16 bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0">
                        <img 
                          src={getFullImageUrl(product.images?.[0]?.image) || 'https://via.placeholder.com/100'} 
                          alt={product.name} 
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate group-hover:text-accent transition-colors">{product.name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{product.category.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'
                      }`} />
                      <span className="text-sm font-bold text-slate-700">{product.stock} in stock</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">SKU: {(product as any).sku || 'PRD-'+product.id}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-base font-black text-slate-900">${product.price}</p>
                    {product.discount_price && (
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Sale active</p>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      product.is_available 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {product.is_available ? 'Live on Store' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="p-2.5 text-slate-400 hover:text-accent hover:bg-accent/5 rounded-xl transition-all"
                        title="View on store"
                      >
                        <ExternalLink size={18} />
                      </Link>
                      <Link 
                        href={`/merchant/dashboard/products/${product.id}/edit`}
                        className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        title="Edit product"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-500">
            Showing <span className="text-slate-900">1</span> to <span className="text-slate-900">{filteredProducts.length}</span> of <span className="text-slate-900">{products.length}</span> products
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 disabled:opacity-30" disabled>
              <ChevronLeft size={20} />
            </button>
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
