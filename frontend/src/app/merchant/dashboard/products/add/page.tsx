'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MerchantService } from '@/services/merchantService';
import { ProductService } from '@/services/productService';
import { Category } from '@/types';

export default function MerchantAddProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    is_available: true,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCats = async () => {
      const data = await ProductService.getCategories();
      setCategories(data);
    };
    fetchCats();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await MerchantService.createProduct({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      });
      router.push('/merchant/dashboard/products');
    } catch (err) {
      alert('Failed to add product. Ensure slug is unique.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
      
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              name="name"
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL identifier)</label>
            <input
              name="slug"
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              placeholder="macbook-pro-2026"
              value={formData.slug}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            required
            rows={5}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Level</label>
            <input
              name="stock"
              type="number"
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              value={formData.stock}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_available"
            id="is_available"
            checked={formData.is_available}
            onChange={handleChange}
          />
          <label htmlFor="is_available" className="text-sm font-medium text-gray-700">Make product available for sale immediately</label>
        </div>

        <div className="pt-6 border-t border-gray-100 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-grow bg-primary text-white py-3 rounded-md font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Adding Product...' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 border border-gray-300 rounded-md font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
