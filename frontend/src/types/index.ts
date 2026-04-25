export type Role = 'ADMIN' | 'VENDOR' | 'CUSTOMER';

export interface User {
  id: string | number;
  username: string;
  email: string;
  role: Role;
  phone_number?: string;
  address?: string;
}

export interface Category {
  id: string | number;
  name: string;
  slug: string;
  parent?: number;
}

export interface Product {
  id: string | number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  is_available: boolean;
  vendor: {
    id: string | number;
    store_name: string;
    logo?: string;
  };
  category: Category;
  images: {
    id: string | number;
    image: string;
    is_primary: boolean;
  }[];
  description?: string;
}

export interface CartItem {
  id: string | number;
  product: Product;
  quantity: number;
  total_price: number;
}

export interface Cart {
  id: string | number;
  user: number;
  items: CartItem[];
  total_price: number;
}

export interface Order {
  id: string | number;
  vendor: number;
  total_amount: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shipping_address: string;
  items: {
    id: string | number;
    product: Product;
    quantity: number;
    price: number;
  }[];
  created_at: string;
}

export interface Notification {
  id: string | number;
  title: string;
  message: string;
  notification_type: 'ORDER_UPDATE' | 'PROMOTION' | 'SYSTEM';
  is_read: boolean;
  created_at: string;
}
