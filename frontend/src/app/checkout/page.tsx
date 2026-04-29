'use client';

import React, { useEffect, useState } from 'react';
import { OrderService } from '@/services/orderService';
import { PaymentService } from '@/services/paymentService';
import { CartItem, useCart } from '@/context/CartContext';
import { Order } from '@/types';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { CreditCard, Truck, CheckCircle, ShieldCheck, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import StorefrontNavbar from '@/components/landing/StorefrontNavbar';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, totalItems } = useCart();
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('STRIPE');
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
  const [processing, setProcessing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && items.length === 0) {
      router.push('/cart');
    }
  }, [items, isMounted, router]);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress) return;
    setStep(2);
  };

  const handleCheckoutAndPay = async () => {
    setProcessing(true);
    try {
      // 1. Create orders from cart
      const orders = await OrderService.checkout(shippingAddress);
      const orderIds = orders.map((o: Order) => o.id);
      
      // 2. Process payment for these orders
      await PaymentService.processPayment(orderIds, paymentMethod);
      
      // 3. Clear local cart
      clearCart();
      
      // 4. Success redirect
      router.push('/orders?success=true');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (!isMounted) return null;
  if (items.length === 0) return null;

  return (
    <ProtectedRoute>
      <StorefrontNavbar />
      <div className="bg-slate-50 min-h-screen pb-24">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <Link href="/cart" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm mb-4 transition-colors">
                <ArrowLeft size={16} />
                Back to Cart
              </Link>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Checkout</h1>
              <p className="text-slate-500 font-medium mt-1">Review your items and select a payment method.</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-2xl flex items-center justify-center font-black transition-all ${step >= 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-200 text-slate-500'}`}>1</div>
                <span className={`text-sm font-black uppercase tracking-widest ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>Shipping</span>
              </div>
              <div className="h-px w-8 bg-slate-200"></div>
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-2xl flex items-center justify-center font-black transition-all ${step >= 2 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-200 text-slate-500'}`}>2</div>
                <span className={`text-sm font-black uppercase tracking-widest ${step >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>Payment</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {step === 1 ? (
                <form onSubmit={handleNextStep} className="bg-white rounded-4xl p-10 border border-slate-100 shadow-soft space-y-8">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                      <Truck size={24} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Shipping Details</h2>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Shipping Address</label>
                    <textarea
                      required
                      rows={4}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none resize-none"
                      placeholder="Street address, City, State, Country, ZIP"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full btn btn-primary !h-16 text-lg font-black shadow-xl shadow-blue-600/20"
                  >
                    Continue to Payment
                  </button>
                </form>
              ) : (
                <div className="bg-white rounded-4xl p-10 border border-slate-100 shadow-soft space-y-8">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                      <CreditCard size={24} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Payment Method</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className={`cursor-pointer group relative bg-slate-50 rounded-3xl p-8 border-2 transition-all hover:bg-white ${paymentMethod === 'STRIPE' ? 'border-blue-600 bg-white ring-4 ring-blue-600/10' : 'border-transparent hover:border-slate-200'}`}>
                      <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'STRIPE'} onChange={() => setPaymentMethod('STRIPE')} />
                      <div className="flex flex-col items-center gap-4 text-center">
                        <div className={`p-4 rounded-2xl transition-colors ${paymentMethod === 'STRIPE' ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 group-hover:text-blue-600'}`}>
                          <CreditCard size={32} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 uppercase tracking-tight">Credit / Debit Card</p>
                          <p className="text-xs text-slate-500 font-bold mt-1">Securely processed by Stripe</p>
                        </div>
                      </div>
                    </label>
                    
                    <label className={`cursor-pointer group relative bg-slate-50 rounded-3xl p-8 border-2 transition-all hover:bg-white ${paymentMethod === 'PAYPAL' ? 'border-blue-600 bg-white ring-4 ring-blue-600/10' : 'border-transparent hover:border-slate-200'}`}>
                      <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'PAYPAL'} onChange={() => setPaymentMethod('PAYPAL')} />
                      <div className="flex flex-col items-center gap-4 text-center">
                        <div className={`p-4 rounded-2xl transition-colors ${paymentMethod === 'PAYPAL' ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 group-hover:text-blue-600'}`}>
                          <ShieldCheck size={32} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 uppercase tracking-tight">PayPal Secure</p>
                          <p className="text-xs text-slate-500 font-bold mt-1">Fast checkout with PayPal</p>
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <CheckCircle className="text-emerald-500" size={18} />
                      <span>Encrypted SSL Connection</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <CheckCircle className="text-emerald-500" size={18} />
                      <span>Buyer Protection Policy</span>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 btn bg-slate-100 text-slate-900 hover:bg-slate-200 !h-16 font-black"
                    >
                      Go Back
                    </button>
                    <button
                      onClick={handleCheckoutAndPay}
                      disabled={processing}
                      className="flex-[2] btn btn-primary !h-16 text-lg font-black shadow-xl shadow-blue-600/20"
                    >
                      {processing ? 'Processing Payment...' : 'Complete Order'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-soft sticky top-32 space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Order Summary</h2>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-black">{totalItems} Items</span>
                </div>
                
                <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="h-16 w-16 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100">
                        <img 
                          src={item.product.images?.[0]?.image || 'https://via.placeholder.com/150'} 
                          alt={item.product.name} 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-900 truncate">{item.product.name}</p>
                        <p className="text-xs text-slate-500 font-bold mt-1">
                          {item.quantity} × ${item.product.price}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900">${(item.quantity * item.product.price).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-8 border-t border-slate-100 space-y-4">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                    <span>Subtotal</span>
                    <span className="text-slate-900">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                    <span>Shipping</span>
                    <span className="text-emerald-500 uppercase tracking-widest text-[10px]">Free</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                    <span>Estimated Tax</span>
                    <span className="text-slate-900">$0.00</span>
                  </div>
                  <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-lg font-black text-slate-900 uppercase tracking-tight">Total</span>
                    <span className="text-3xl font-black text-blue-600">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 pt-4">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    Secure Checkout
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
