export type Role = 'ADMIN' | 'VENDOR' | 'CUSTOMER';

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  phone_number?: string;
  address?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent?: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  is_available: boolean;
  vendor: {
    id: number;
    store_name: string;
    logo?: string;
  };
  category: Category;
  images: {
    id: number;
    image: string;
    is_primary: boolean;
  }[];
  description?: string;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  total_price: number;
}

export interface Cart {
  id: number;
  user: number;
  items: CartItem[];
  total_price: number;
}

export interface Order {
  id: number;
  vendor: number;
  total_amount: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shipping_address: string;
  items: {
    id: number;
    product: Product;
    quantity: number;
    price: number;
  }[];
  created_at: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  notification_type: 'ORDER_UPDATE' | 'PROMOTION' | 'SYSTEM';
  is_read: boolean;
  created_at: string;
}
