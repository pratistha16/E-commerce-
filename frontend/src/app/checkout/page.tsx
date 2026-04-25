'use client';

import React, { useEffect, useState } from 'react';
import { OrderService } from '@/services/orderService';
import { PaymentService } from '@/services/paymentService';
import { Cart, Order } from '@/types';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { CreditCard, Truck, CheckCircle, ShieldCheck } from 'lucide-react';

export default function CheckoutPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('STRIPE');
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
  const [processing, setProcessing] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await OrderService.getCart();
      if (!data || data.items.length === 0) {
        router.push('/cart');
        return;
      }
      setCart(data);
    } catch (err) {
      console.error('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

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
      
      // 3. Success redirect
      router.push('/orders?success=true');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return null;

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto px-4 py-12 animate-fade-in relative">
        <div className="absolute top-10 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10" />
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Focus <span className="text-gradient-primary">Checkout</span></h1>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center font-bold ${step >= 1 ? 'border-primary bg-primary-50' : 'border-gray-300'}`}>1</div>
              <span className="font-medium">Shipping</span>
            </div>
            <div className="h-px w-12 bg-gray-300"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center font-bold ${step >= 2 ? 'border-primary bg-primary-50' : 'border-gray-300'}`}>2</div>
              <span className="font-medium">Payment</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {step === 1 ? (
              <form onSubmit={handleNextStep} className="glass-panel p-8 space-y-6">
                <div className="flex items-center gap-2 text-xl font-black text-slate-900 dark:text-white mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Truck className="text-primary w-5 h-5" />
                  </div>
                  <h2>Delivery Information</h2>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Shipping Address</label>
                  <textarea
                    required
                    className="w-full bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 h-32 focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white outline-none transition-all"
                    placeholder="123 Street Name, City, Country, ZIP"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full btn-primary py-4 text-lg"
                >
                  Continue to Payment
                </button>
              </form>
            ) : (
              <div className="glass-panel p-8 space-y-8">
                <div className="flex items-center gap-2 text-xl font-black text-slate-900 dark:text-white">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CreditCard className="text-primary w-5 h-5" />
                  </div>
                  <h2>Select Payment Method</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`cursor-pointer border-2 rounded-2xl p-6 flex flex-col items-center gap-3 transition-all ${paymentMethod === 'STRIPE' ? 'border-primary bg-primary/5 shadow-neon' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                    <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'STRIPE'} onChange={() => setPaymentMethod('STRIPE')} />
                    <CreditCard size={32} className={paymentMethod === 'STRIPE' ? 'text-primary' : 'text-slate-400'} />
                    <span className={`font-bold ${paymentMethod === 'STRIPE' ? 'text-primary' : 'text-slate-600 dark:text-slate-300'}`}>Credit / Debit Card</span>
                    <span className="text-xs text-slate-500 text-center">Powered by Stripe</span>
                  </label>
                  
                  <label className={`cursor-pointer border-2 rounded-2xl p-6 flex flex-col items-center gap-3 transition-all ${paymentMethod === 'PAYPAL' ? 'border-primary bg-primary/5 shadow-neon' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                    <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'PAYPAL'} onChange={() => setPaymentMethod('PAYPAL')} />
                    <ShieldCheck size={32} className={paymentMethod === 'PAYPAL' ? 'text-primary' : 'text-slate-400'} />
                    <span className={`font-bold ${paymentMethod === 'PAYPAL' ? 'text-primary' : 'text-slate-600 dark:text-slate-300'}`}>PayPal Secure</span>
                    <span className="text-xs text-slate-500 text-center">Fast and secure checkout</span>
                  </label>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle className="text-green-500" size={18} />
                    <span>Secure encrypted transaction</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle className="text-green-500" size={18} />
                    <span>Purchase protection included</span>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-grow btn-secondary py-4"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCheckoutAndPay}
                    disabled={processing}
                    className="flex-[2] btn-primary py-4 text-lg"
                  >
                    {processing ? 'Processing...' : 'Complete Purchase'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="glass-panel p-6 sticky top-24">
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cart?.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-16 w-16 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                      <img src={item.product.images?.[0]?.image} alt={item.product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${cart?.total_price}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between text-xl font-bold text-gray-900">
                  <span>Grand Total</span>
                  <span>${cart?.total_price}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
