'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductService } from '@/services/productService';
import { Product } from '@/types';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import api from '@/lib/api';
import { Star, ShoppingCart, ShieldCheck, Truck, RefreshCw, ChevronRight, MessageSquare, Heart } from 'lucide-react';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [addingToCart, setAddingToCart] = useState(false);
  const { user } = useAuth();
  const { OrderService } = require('@/services/orderService');

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const data = await ProductService.getProductBySlug(slug as string);
      setProduct(data);
      // Fetch similar products
      const similar = await api.get(`/products/${slug}/similar_products/`);
      setSimilarProducts(similar.data);
    } catch (err) {
      console.error('Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    if (!product) return;

    setAddingToCart(true);
    try {
      await OrderService.addToCart(product.id, quantity);
      alert('Product added to cart!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ProductService.createReview(slug as string, reviewData);
      setReviewData({ rating: 5, comment: '' });
      fetchProduct(); // Refresh reviews
    } catch (err) {
      alert('Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h1 className="text-3xl font-black text-gray-900">Product Not Found</h1>
        <Link href="/products" className="mt-6 inline-block text-primary font-bold hover:underline">Back to Store</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-10">
        <Link href="/" className="hover:text-gray-900">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-gray-900">Products</Link>
        <ChevronRight size={14} />
        <Link href={`/products?category=${product.category.id}`} className="hover:text-gray-900">{product.category.name}</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        {/* Gallery */}
        <div className="space-y-6">
          <div className="aspect-square bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative group">
            {product.images?.[activeImage] ? (
              <img
                src={product.images[activeImage].image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
            )}
            {product.discount_price && (
              <div className="absolute top-6 left-6 bg-red-500 text-white text-xs font-black px-4 py-2 rounded-full shadow-xl">
                -{Math.round((1 - product.final_price / product.price) * 100)}% OFF
              </div>
            )}
            <button className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg text-gray-400 hover:text-red-500 transition-colors">
              <Heart size={20} />
            </button>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {product.images?.map((img, idx) => (
              <button 
                key={img.id} 
                onClick={() => setActiveImage(idx)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary shadow-md' : 'border-transparent hover:border-gray-200'}`}
              >
                <img src={img.image} alt={product.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="flex-grow space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">{product.brand?.name || 'GENERIC'}</p>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill={i < Math.round(product.average_rating) ? 'currentColor' : 'none'} />
                  ))}
                  <span className="ml-2 text-sm font-black text-gray-900">{product.average_rating.toFixed(1)}</span>
                </div>
                <span className="text-gray-300">|</span>
                <button className="text-sm font-bold text-gray-500 hover:text-primary transition-colors flex items-center gap-1">
                  <MessageSquare size={16} />
                  {product.reviews?.length || 0} Reviews
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-4xl font-black text-gray-900">${product.final_price}</span>
              {product.discount_price && (
                <span className="text-xl text-gray-400 line-through font-medium">${product.price}</span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>

            <div className="p-6 bg-gray-50 rounded-2xl space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="text-blue-600" size={20} />
                <span className="text-gray-700 font-medium">Free express shipping on orders over $100</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RefreshCw className="text-purple-600" size={20} />
                <span className="text-gray-700 font-medium">30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <ShieldCheck className="text-green-600" size={20} />
                <span className="text-gray-700 font-medium">Authentic product from verified merchant</span>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-10 border-t border-gray-100 space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center bg-gray-100 rounded-xl p-1 w-full sm:w-auto">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-12 w-12 flex items-center justify-center text-xl font-bold hover:bg-white rounded-lg transition-all"
                >-</button>
                <span className="w-12 text-center font-black">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-12 w-12 flex items-center justify-center text-xl font-bold hover:bg-white rounded-lg transition-all"
                >+</button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className="flex-grow flex items-center justify-center gap-3 bg-primary text-white h-14 px-10 rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:shadow-none"
              >
                <ShoppingCart size={24} />
                {addingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
            <p className="text-xs text-center text-gray-400 font-bold uppercase tracking-widest">
              Secure Checkout • Global Shipping • Sold by {product.vendor.store_name}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs / Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-t border-gray-100 pt-20">
        <div className="lg:col-span-4 space-y-10">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Specifications</h2>
            <div className="space-y-4">
              {product.specifications?.map((spec: any) => (
                <div key={spec.id} className="flex justify-between py-4 border-b border-gray-50 group">
                  <dt className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">{spec.key}</dt>
                  <dd className="text-gray-900 font-medium">{spec.value}</dd>
                </div>
              ))}
              {(!product.specifications || product.specifications.length === 0) && (
                <p className="text-gray-400 italic">No detailed specs available.</p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-12">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Customer Feedback</h2>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-black text-gray-900">{product.average_rating.toFixed(1)}</div>
              <div className="text-yellow-400 flex"><Star size={16} fill="currentColor" /></div>
            </div>
          </div>
          
          {user && (
            <form onSubmit={handleAddReview} className="bg-gray-50 p-8 rounded-3xl border border-gray-100 space-y-6">
              <h3 className="text-lg font-black text-gray-900">Share your thoughts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[5, 4, 3, 2, 1].map((n) => (
                      <button 
                        key={n} 
                        type="button"
                        onClick={() => setReviewData({ ...reviewData, rating: n })}
                        className={`px-4 py-2 rounded-lg font-bold border transition-all ${reviewData.rating === n ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white border-gray-200 text-gray-600'}`}
                      >
                        {n}★
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Comment</label>
                <textarea
                  required
                  placeholder="Tell others about your experience with this product..."
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-4 focus:ring-primary focus:border-primary outline-none transition-all"
                  rows={4}
                ></textarea>
              </div>
              <button type="submit" className="bg-gray-900 text-white px-10 py-4 rounded-xl font-black hover:bg-black transition-all shadow-xl shadow-gray-900/10">
                Post Review
              </button>
            </form>
          )}

          <div className="space-y-10">
            {product.reviews?.map((review: any) => (
              <div key={review.id} className="group animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black uppercase tracking-tighter">
                      {review.user[0]}
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-sm">{review.user}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} />)}
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed pl-13 ml-13">{review.comment}</p>
              </div>
            ))}
            {(!product.reviews || product.reviews.length === 0) && (
              <div className="text-center py-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">No reviews yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="mt-32 pt-20 border-t border-gray-100">
          <h2 className="text-3xl font-black text-gray-900 mb-12 text-center tracking-tight">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {similarProducts.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`} className="group bg-white rounded-3xl overflow-hidden border border-gray-50 hover:shadow-2xl transition-all duration-500">
                <div className="aspect-square relative bg-gray-50 overflow-hidden">
                  <img src={p.images?.[0]?.image || 'https://via.placeholder.com/400'} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="font-black text-gray-900 group-hover:text-primary transition-colors truncate">{p.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-black text-gray-900">${p.price}</p>
                    <div className="flex items-center text-yellow-400 bg-yellow-50 px-2 py-1 rounded-lg">
                      <Star size={12} fill="currentColor" />
                      <span className="text-[10px] font-black ml-1 text-gray-900">{(p as any).average_rating?.toFixed(1) || '5.0'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
