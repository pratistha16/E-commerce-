'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { OrderService } from '@/services/orderService';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string | number) => Promise<void>;
  updateQuantity: (productId: string | number, quantity: number) => Promise<void>;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role === 'CUSTOMER') {
      fetchBackendCart();
    } else {
      const saved = localStorage.getItem('guest_cart');
      if (saved) {
        try {
          setItems(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse cart');
        }
      }
    }
  }, [user]);

  const fetchBackendCart = async () => {
    try {
      const cart = await OrderService.getCart();
      if (cart && cart.items) {
        setItems(cart.items);
      }
    } catch (err) {
      console.error('Failed to fetch backend cart', err);
    }
  };

  useEffect(() => {
    if (!user) {
      localStorage.setItem('guest_cart', JSON.stringify(items));
    }
  }, [items, user]);

  const requireCustomer = () => {
    if (!user) {
      toast.error('Please login to continue', { description: 'You must be logged in as a customer to add items to the cart.' });
      router.push('/login');
      return false;
    }
    if (user.role !== 'CUSTOMER') {
      toast.error('Invalid Account Type', { description: 'Only customers can use the shopping cart.' });
      return false;
    }
    return true;
  };

  const addToCart = async (product: Product, quantity = 1) => {
    if (!requireCustomer()) return;

    try {
      await OrderService.addToCart(product.id, quantity);
      
      setItems(prev => {
        const existing = prev.find(item => item.product.id === product.id);
        if (existing) {
          toast.success(`Updated ${product.name} quantity in cart`);
          return prev.map(item => 
            item.product.id === product.id 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        toast.success(`Added ${product.name} to cart`);
        return [...prev, { product, quantity }];
      });
      setIsCartOpen(true);
    } catch (err) {
      console.error(err);
      toast.error('Failed to add to cart on server.');
    }
  };

  const removeFromCart = async (productId: string | number) => {
    try {
      await OrderService.removeFromCart(Number(productId));
      setItems(prev => prev.filter(item => item.product.id !== productId));
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove from cart.');
    }
  };

  const updateQuantity = async (productId: string | number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    try {
      await OrderService.updateCartQuantity(Number(productId), quantity);
      setItems(prev => prev.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      ));
    } catch (err) {
      console.error(err);
      toast.error('Failed to update quantity.');
    }
  };

  const clearCart = () => setItems([]);

  const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems, isCartOpen, setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCart must be used within a CartProvider');
  return context;
}
