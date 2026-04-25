'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MerchantService } from '@/services/merchantService';
import { ProductService } from '@/services/productService';
import { Category } from '@/types';
import { 
  ArrowLeft, 
  Save, 
  Image as ImageIcon, 
  DollarSign, 
  Type,
  CheckCircle2,
  Loader2,
  Plus
} from 'lucide-react';
import { Card, CardTitle, Button } from '@/components/ui';
import { toast } from 'sonner';

export default function MerchantEditProductPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, products] = await Promise.all([
          ProductService.getCategories(),
          MerchantService.getProducts()
        ]);
        setCategories(cats);
        
        const product = products.find((p: any) => p.id === id);
        if (product) {
          setFormData({
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price.toString(),
            stock: product.stock.toString(),
            category: product.category.id.toString(),
            is_available: product.is_available,
          });
        } else {
          toast.error('Product not found');
          router.push('/merchant/dashboard/products');
        }
      } catch (err) {
        toast.error('Failed to load product data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await MerchantService.updateProduct(id, {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      });
      toast.success('Product updated successfully!');
      router.push('/merchant/dashboard/products');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Edit Product</h1>
            <p className="text-sm font-bold text-slate-400 mt-1">Modify your product details and availability</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="!rounded-2xl !px-8 !h-14 text-xs font-black uppercase tracking-widest border-slate-100"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={saving}
            className="btn-primary !rounded-2xl !px-8 !h-14 text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/20"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8 border-none shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
              <Type className="text-blue-600 w-5 h-5" />
              <CardTitle className="text-lg tracking-widest uppercase">Basic Information</CardTitle>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                <input
                  name="name"
                  required
                  className="w-full mt-2 pl-4 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none font-medium text-slate-900"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Slug (URL)</label>
                  <input
                    name="slug"
                    required
                    className="w-full mt-2 pl-4 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none font-medium text-slate-900"
                    value={formData.slug}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <select
                    name="category"
                    required
                    className="w-full mt-2 pl-4 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none font-medium text-slate-900 appearance-none"
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

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <textarea
                  name="description"
                  required
                  rows={6}
                  className="w-full mt-2 pl-4 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none font-medium text-slate-900"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </Card>

          <Card className="p-8 border-none shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
              <ImageIcon className="text-blue-600 w-5 h-5" />
              <CardTitle className="text-lg tracking-widest uppercase">Product Media</CardTitle>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="aspect-square bg-slate-50 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center gap-2 group hover:border-blue-200 transition-all cursor-pointer">
                <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                  <Plus className="text-slate-400" size={24} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Add Media</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="p-8 border-none shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
              <DollarSign className="text-blue-600 w-5 h-5" />
              <CardTitle className="text-lg tracking-widest uppercase">Pricing & Stock</CardTitle>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Base Price ($)</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  className="w-full mt-2 pl-4 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none font-medium text-slate-900"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Inventory Count</label>
                <input
                  name="stock"
                  type="number"
                  required
                  className="w-full mt-2 pl-4 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none font-medium text-slate-900"
                  value={formData.stock}
                  onChange={handleChange}
                />
              </div>

              <div className="pt-4 flex items-center gap-3">
                <div 
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${formData.is_available ? 'bg-blue-600' : 'bg-slate-200'}`}
                  onClick={() => setFormData(prev => ({ ...prev, is_available: !prev.is_available }))}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.is_available ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Live Status</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
