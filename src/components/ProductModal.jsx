import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

export default function ProductModal({ isOpen, onClose, onSubmit, initialData, categories }) {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    discountPercentage: '',
    category: '',
    brand: '',
    description: '',
    thumbnail: '',
    deliveryDays: '2',
    isAssured: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        price: initialData.price ? Math.round(initialData.price * 83) : '',
        discountPercentage: initialData.discountPercentage || '15',
        category: initialData.category || '',
        brand: initialData.brand || '',
        description: initialData.description || '',
        thumbnail: initialData.thumbnail || '',
        deliveryDays: initialData.deliveryDays || '2',
        isAssured: initialData.isAssured ?? true,
      });
    } else {
      setFormData({
        title: '',
        price: '',
        discountPercentage: '15',
        category: categories[0] || 'beauty',
        brand: '',
        description: '',
        thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
        deliveryDays: '2',
        isAssured: true,
      });
    }
  }, [initialData, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price) / 83,
      discountPercentage: parseFloat(formData.discountPercentage || 0),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {initialData ? 'Update Listing Details' : 'Add Product to D2C Marketplace'}
            </h2>
            <p className="text-xs text-slate-500">Live on Indian Express Logistics Network</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Product Name / Title</label>
            <input
              required
              type="text"
              placeholder="e.g. Printed Pure Cotton Casual Kurta / Running Shoes"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-sm transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Brand Name</label>
              <input
                required
                type="text"
                placeholder="e.g. Roadster, Boat, Minimalist"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-sm transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-800 capitalize focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-sm transition font-medium"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Price (₹ INR)</label>
              <input
                required
                type="number"
                placeholder="1499"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-sm transition font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Discount %</label>
              <input
                type="number"
                placeholder="20"
                value={formData.discountPercentage}
                onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-sm transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Est. Delivery (Days)</label>
              <input
                type="number"
                placeholder="2"
                value={formData.deliveryDays}
                onChange={(e) => setFormData({ ...formData, deliveryDays: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-sm transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Image Thumbnail URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-sm transition"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition shadow-md shadow-orange-500/20 cursor-pointer"
            >
              {initialData ? 'Save Changes' : 'Publish Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}