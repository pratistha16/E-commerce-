import api from '@/lib/api';
import { Product, Order } from '@/types';

export const MerchantService = {
  async getAnalytics() {
    const response = await api.get('/merchant/products/analytics/');
    return response.data;
  },

  async getProducts() {
    const response = await api.get<any>('/merchant/products/');
    return response.data.results || response.data;
  },

  async createProduct(productData: any) {
    const response = await api.post<Product>('/merchant/products/', productData);
    return response.data;
  },

  async updateProduct(id: number, productData: any) {
    const response = await api.patch<Product>(`/merchant/products/${id}/`, productData);
    return response.data;
  },

  async deleteProduct(id: number) {
    const response = await api.delete(`/merchant/products/${id}/`);
    return response.data;
  },

  async getOrders() {
    const response = await api.get<any>('/merchant/orders/');
    return response.data.results || response.data;
  },

  async updateOrderStatus(orderId: number, status: string) {
    const response = await api.patch(`/merchant/orders/${orderId}/update_status/`, { status });
    return response.data;
  },
};

export default MerchantService;
