import api from '@/lib/api';
import { Cart, Order } from '@/types';

export const OrderService = {
  async getCart() {
    const response = await api.get<any>('/cart/');
    // Handle paginated response
    const data = response.data.results || response.data;
    return data[0];
  },

  async addToCart(productId: number, quantity: number = 1) {
    const response = await api.post<Cart>('/cart/add_item/', { product_id: productId, quantity });
    return response.data;
  },

  async updateCartQuantity(productId: number, quantity: number) {
    const response = await api.post<Cart>('/cart/update_quantity/', { product_id: productId, quantity });
    return response.data;
  },

  async removeFromCart(productId: number) {
    const response = await api.post<Cart>('/cart/remove_item/', { product_id: productId });
    return response.data;
  },

  async checkout(shippingAddress: string) {
    const response = await api.post<Order[]>('/orders/checkout/', { shipping_address: shippingAddress });
    return response.data;
  },

  async getOrders() {
    const response = await api.get<any>('/orders/');
    return response.data.results || response.data;
  },

  async getOrderDetails(id: string | number) {
    const response = await api.get<Order>(`/orders/${id}/`);
    return response.data;
  },
};
