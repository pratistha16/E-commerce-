import api from '@/lib/api';
import { Product, Category } from '@/types';

export const ProductService = {
  async getProducts(params?: any) {
    const response = await api.get<any>('/products/', { params });
    // Handle paginated response
    return response.data.results || response.data;
  },

  async getProductBySlug(slug: string) {
    const response = await api.get<Product>(`/products/${slug}/`);
    return response.data;
  },

  async getCategories() {
    try {
      const response = await api.get<any>('/categories/');
      // Handle paginated response
      return response.data.results || response.data;
    } catch {
      // Graceful fallback for environments where category endpoint is unavailable.
      return [];
    }
  },

  async createReview(productSlug: string, reviewData: { rating: number; comment: string }) {
    const response = await api.post(`/products/${productSlug}/reviews/`, reviewData);
    return response.data;
  },
};

export default ProductService;
