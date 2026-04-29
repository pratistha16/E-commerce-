'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MerchantService } from '@/services/merchantService';
import { ProductService } from '@/services/productService';
import { Category } from '@/types';
import { 
  Package, 
  ArrowLeft, 
  Plus, 
  Image as ImageIcon, 
  Tag, 
  DollarSign, 
  Inventory, 
  Type,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2
} from 'lucide-react';
import { Card, CardTitle, Button } from '@/components/ui';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function MerchantAddProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    discount_price: '',
    stock: '',
    category: '',
    is_available: true,
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Stable unique suffix for the duration of this add session to keep slugs unique but stable while typing
  const [sessionSuffix] = useState(() => Math.random().toString(36).substring(2, 8));

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await ProductService.getCategories();
        setCategories(data);
      } catch (err) {
        toast.error('Failed to load categories');
      }
    };
    fetchCats();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (selectedImages.length + files.length > 6) {
      toast.error('You can only upload up to 6 images.');
      return;
    }

    const newImages = [...selectedImages, ...files];
    setSelectedImages(newImages);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);

    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'name') {
      const baseSlug = value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      setFormData(prev => ({
        ...prev,
        name: value,
        slug: value ? `${baseSlug}-${sessionSuffix}` : ''
      }));
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real scenario, you'd use FormData to send files along with other fields
      // For now, we'll follow the existing JSON structure but log the images
      const { category, ...rest } = formData;
      const product = await MerchantService.createProduct({
        ...rest,
        category_id: category,
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        stock: parseInt(formData.stock),
      });

      // Upload images if any are selected
      if (selectedImages.length > 0) {
        toast.info(`Uploading ${selectedImages.length} images...`);
        await Promise.all(
          selectedImages.map(img => MerchantService.uploadProductImage(product.id, img))
        );
      }

      toast.success('Product and images created successfully!');
      router.push('/merchant/dashboard/products');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to add product. Ensure slug is unique.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Add New Product</h1>
            <p className="text-sm font-bold text-slate-400 mt-1">Create a new item in your store catalog</p>
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
            disabled={loading}
            className="btn-primary !rounded-2xl !px-8 !h-14 text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Plus size={18} className="mr-2" />}
            {loading ? 'Creating...' : 'Create Product'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
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
                  placeholder="e.g. Minimalist Ceramic Vessel"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Slug (URL)</label>
                  <input
                    name="slug"
                    readOnly
                    className="w-full mt-2 pl-4 pr-4 py-4 bg-slate-100 border-none rounded-2xl text-sm font-medium text-slate-400 cursor-not-allowed outline-none"
                    value={formData.slug}
                    placeholder="Auto-generated..."
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
                  placeholder="Describe your product's story and features..."
                />
              </div>
            </div>
          </Card>

          {/* Media Upload */}
          <Card className="p-8 border-none shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
              <ImageIcon className="text-blue-600 w-5 h-5" />
              <CardTitle className="text-lg tracking-widest uppercase">Product Media ({selectedImages.length}/6)</CardTitle>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-3xl overflow-hidden group">
                  <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => removeImage(index)}
                      className="p-3 bg-white text-rose-500 rounded-2xl shadow-xl hover:scale-110 transition-transform"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  {index === 0 && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      Primary
                    </div>
                  )}
                </div>
              ))}
              
              {selectedImages.length < 6 && (
                <label className="aspect-square bg-slate-50 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center gap-2 group hover:border-blue-200 transition-all cursor-pointer">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange}
                  />
                  <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                    <Plus className="text-slate-400" size={24} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-4">Add Media</span>
                </label>
              )}
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Recommended: 800x1000px, PNG or JPG (Max 6 photos)</p>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Inventory & Pricing */}
          <Card className="p-8 border-none shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
              <DollarSign className="text-blue-600 w-5 h-5" />
              <CardTitle className="text-lg tracking-widest uppercase">Pricing & Stock</CardTitle>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
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
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest ml-1">Sale Price ($)</label>
                  <input
                    name="discount_price"
                    type="number"
                    step="0.01"
                    className="w-full mt-2 pl-4 pr-4 py-4 bg-rose-50/30 border-none rounded-2xl text-sm focus:ring-2 focus:ring-rose-600/20 focus:bg-white transition-all outline-none font-medium text-slate-900"
                    value={formData.discount_price}
                    onChange={handleChange}
                    placeholder="Optional"
                  />
                </div>
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
                  placeholder="0"
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

          {/* Visibility Info */}
          <div className="bg-blue-600 rounded-3xl p-8 text-white space-y-4 shadow-xl shadow-blue-600/20">
            <h4 className="text-lg font-black tracking-tight uppercase">Ready to sell?</h4>
            <p className="text-xs font-medium text-blue-100 leading-relaxed">
              Once created, your product will be instantly available on your store if 'Live Status' is active.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">
              <CheckCircle2 size={16} /> Verified Storefront
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
