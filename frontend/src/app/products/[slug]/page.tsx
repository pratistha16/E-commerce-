'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShoppingCart, 
  ArrowLeft, 
  Star, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Package, 
  ChevronRight,
  Heart,
  Share2,
  Minus,
  Plus
} from 'lucide-react';
import { ProductService } from '@/services/productService';
import { Product } from '@/types';
import { Button, Card, Badge, Skeleton } from '@/components/ui';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import StorefrontNavbar from '@/components/landing/StorefrontNavbar';

// Helper for absolute URLs
const getFullImageUrl = (url: string) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
  return `${baseUrl}${url}`;
};

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const [productData, similarData] = await Promise.all([
          ProductService.getProductBySlug(slug as string),
          ProductService.getSimilarProducts(slug as string)
        ]);
        setProduct(productData);
        setSimilarProducts(similarData);
      } catch (err) {
        toast.error('Failed to load product details');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <StorefrontNavbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-3xl" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-16 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-white">
      <StorefrontNavbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="hover:text-blue-600 transition-colors cursor-pointer">{product.category?.name || 'Category'}</span>
          <ChevronRight size={12} />
          <span className="text-slate-900 truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Image Gallery */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-square bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100"
            >
              <AnimatePresence mode="wait">
                {product.images?.[activeImage]?.image ? (
                  <motion.img 
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    src={getFullImageUrl(product.images[activeImage].image)} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Package size={64} />
                  </div>
                )}
              </AnimatePresence>
              
              {product.discount_price && (
                <div className="absolute top-6 left-6 bg-rose-600 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-xl shadow-rose-600/20">
                  Sale
                </div>
              )}
            </motion.div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 transition-all ${
                      activeImage === idx 
                        ? 'ring-2 ring-blue-600 ring-offset-2' 
                        : 'opacity-60 hover:opacity-100 border border-slate-100'
                    }`}
                  >
                    <img src={getFullImageUrl(img.image)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <div className="space-y-6 border-b border-slate-100 pb-8">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                  {product.brand?.name || product.vendor?.store_name || 'Verified Merchant'}
                </span>
                <div className="flex items-center gap-1 ml-auto text-amber-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-black text-slate-900">{product.average_rating || '5.0'}</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              <div className="flex items-end gap-4">
                {product.discount_price ? (
                  <>
                    <span className="text-4xl font-black text-slate-900">
                      ${Number(product.discount_price).toLocaleString()}
                    </span>
                    <span className="text-xl font-bold text-slate-400 line-through mb-1">
                      ${Number(product.price).toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-black text-slate-900">
                    ${Number(product.price).toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-slate-600 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            <div className="py-8 space-y-8">
              {/* Quantity Selector & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center bg-slate-50 rounded-2xl p-1 shrink-0">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-12 text-center font-black text-slate-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                
                <Button 
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className="flex-1 bg-slate-900 text-white hover:bg-blue-600 !h-16 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10"
                >
                  <ShoppingCart size={18} className="mr-2" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Shopping Bag'}
                </Button>
                
                <button className="p-5 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all rounded-2xl shrink-0">
                  <Heart size={20} />
                </button>
              </div>

              {/* Service Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/30">
                  <Truck className="text-blue-600 shrink-0" size={20} />
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Global Shipping</h4>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Free on orders over $150</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/30">
                  <ShieldCheck className="text-emerald-600 shrink-0" size={20} />
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Safe Payment</h4>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">100% Secure Transaction</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto border-t border-slate-100 pt-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-black italic">
                  {product.vendor?.store_name?.charAt(0) || 'M'}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sold by</p>
                  <h5 className="font-bold text-slate-900">{product.vendor?.store_name || 'Global Retail'}</h5>
                </div>
              </div>
              <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 hover:text-slate-900 transition-colors">
                Visit Store <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <section className="mt-24">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Recommended for you</h2>
                <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Similar items from this category</p>
              </div>
              <Link href="/" className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 hover:text-slate-900 transition-colors">
                View All Catalog
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {similarProducts.map((item) => (
                <Link 
                  key={item.id} 
                  href={`/products/${item.slug}`}
                  className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300"
                >
                  <div className="relative aspect-square bg-slate-50 overflow-hidden">
                    {item.images?.[0]?.image ? (
                      <img 
                        src={getFullImageUrl(item.images[0].image)} 
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Package size={32} />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      {item.category?.name || 'Retail'}
                    </p>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-lg font-black text-slate-900">
                      ${Number(item.price).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
