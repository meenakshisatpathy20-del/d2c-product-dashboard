import { useState, useEffect } from 'react';
import { X, Tag, Info, Image as ImageIcon, Truck, ShieldCheck } from 'lucide-react';
import FormField from './FormField';

export default function ProductModal({ isOpen, onClose, onSubmit, initialData, categories, warehouses }) {
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    category: '',
    priceINR: '',
    discountPercentage: '',
    warehouse: '',
    thumbnail: '',
    preferredCourier: 'Bluedart Surface',
    dispatchMode: 'Express Air',
    status: 'Published'
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        brand: initialData.brand || '',
        category: initialData.category || categories[0] || 'beauty',
        priceINR: initialData.priceINR || Math.round(initialData.price * 83),
        discountPercentage: initialData.discountPercentage || '10',
        warehouse: initialData.warehouse || warehouses[0],
        thumbnail: initialData.thumbnail || '',
        preferredCourier: initialData.preferredCourier || 'Bluedart Surface',
        dispatchMode: initialData.dispatchMode || 'Express Air',
        status: initialData.status || 'Published'
      });
    } else {
      setFormData({
        title: '',
        brand: '',
        category: categories[0] || 'beauty',
        priceINR: '',
        discountPercentage: '10',
        warehouse: warehouses[0] || 'Bhiwandi Hub (MH)',
        thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
        preferredCourier: 'Bluedart Surface',
        dispatchMode: 'Express Air',
        status: 'Published'
      });
    }
    setErrors({});
    setTouched({});
  }, [initialData, categories, warehouses, isOpen]);

  const validateField = (name, value) => {
    let err = '';
    if (name === 'title' && (!value || value.trim().length < 3)) {
      err = 'Product title must be at least 3 characters.';
    } else if (name === 'brand' && (!value || value.trim().length < 2)) {
      err = 'Brand name is required.';
    } else if (name === 'priceINR' && (!value || parseFloat(value) <= 0)) {
      err = 'Price must be greater than ₹0.';
    } else if (name === 'discountPercentage' && (parseFloat(value) < 0 || parseFloat(value) > 90)) {
      err = 'Discount must be between 0% and 90%.';
    } else if (name === 'thumbnail' && value && !value.match(/^https?:\/\/.+/i)) {
      err = 'Enter a valid image URL starting with http:// or https://';
    }
    return err;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const err = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const isFormValid =
    formData.title.trim().length >= 3 &&
    formData.brand.trim().length >= 2 &&
    parseFloat(formData.priceINR) > 0 &&
    !Object.values(errors).some(Boolean);

  const priceNum = parseFloat(formData.priceINR) || 0;
  const discountNum = parseFloat(formData.discountPercentage) || 0;
  const finalCustomerPrice = Math.round(priceNum * (1 - discountNum / 100));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    onSubmit({
      title: formData.title,
      brand: formData.brand,
      category: formData.category,
      priceINR: priceNum,
      price: priceNum / 83,
      discountPercentage: discountNum,
      warehouse: formData.warehouse,
      preferredCourier: formData.preferredCourier,
      dispatchMode: formData.dispatchMode,
      thumbnail: formData.thumbnail,
      status: formData.status
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {initialData ? 'Edit Product Details' : 'Add New Product to Store'}
            </h2>
            <p className="text-xs text-slate-500">Configure catalog information & Shiprocket automated dispatch rules</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
              <Tag size={13} /> 1. Product Catalog Information
            </h3>
            
            <FormField label="Product Name / Title" required error={touched.title && errors.title}>
              <input
                type="text"
                placeholder="e.g. Pure Cotton Casual Shirt"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                onBlur={() => handleBlur('title')}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Brand" required error={touched.brand && errors.brand}>
                <input
                  type="text"
                  placeholder="e.g. Minimalist, Boat"
                  value={formData.brand}
                  onChange={(e) => handleChange('brand', e.target.value)}
                  onBlur={() => handleBlur('brand')}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                />
              </FormField>

              <FormField label="Category Taxonomy" required>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm capitalize bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </FormField>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-extrabold text-orange-600 uppercase tracking-wider flex items-center gap-1.5">
              <Info size={13} /> 2. Pricing & Customer Commercials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Base Price (₹ INR)" required error={touched.priceINR && errors.priceINR}>
                <input
                  type="number"
                  placeholder="1499"
                  value={formData.priceINR}
                  onChange={(e) => handleChange('priceINR', e.target.value)}
                  onBlur={() => handleBlur('priceINR')}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-semibold focus:border-orange-500 outline-none"
                />
              </FormField>

              <FormField label="Customer Discount (%)" error={touched.discountPercentage && errors.discountPercentage}>
                <input
                  type="number"
                  placeholder="15"
                  value={formData.discountPercentage}
                  onChange={(e) => handleChange('discountPercentage', e.target.value)}
                  onBlur={() => handleBlur('discountPercentage')}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:border-emerald-600 outline-none"
                />
              </FormField>
            </div>

            <div className="p-3 bg-orange-50/70 border border-orange-200/80 rounded-xl flex items-center justify-between">
              <span className="text-xs text-orange-950 font-medium">Customer Checkout Price Preview:</span>
              <span className="text-sm font-black text-orange-700">
                Customer pays ₹{finalCustomerPrice.toLocaleString('en-IN')}{' '}
                <span className="text-xs font-normal text-slate-500 line-through">₹{priceNum.toLocaleString('en-IN')}</span>
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
              <Truck size={13} /> 3. Shiprocket Dispatch & Fulfillment Hub
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FormField label="Pickup Hub">
                <select
                  value={formData.warehouse}
                  onChange={(e) => handleChange('warehouse', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:border-blue-600 outline-none font-medium text-slate-800"
                >
                  {warehouses.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Default Courier Partner">
                <select
                  value={formData.preferredCourier}
                  onChange={(e) => handleChange('preferredCourier', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:border-blue-600 outline-none font-medium text-slate-800"
                >
                  <option value="Bluedart Air">Bluedart Air (Priority)</option>
                  <option value="Delhivery Surface">Delhivery Surface (Economy)</option>
                  <option value="Shadowfax Express">Shadowfax (Hyperlocal)</option>
                  <option value="DTDC Express">DTDC Express (Pan-India)</option>
                </select>
              </FormField>

              <FormField label="Dispatch Priority Mode">
                <select
                  value={formData.dispatchMode}
                  onChange={(e) => handleChange('dispatchMode', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:border-blue-600 outline-none font-medium text-slate-800"
                >
                  <option value="Express Air">Express Air (Same-day handover)</option>
                  <option value="Surface Standard">Surface Standard (24hr SLA)</option>
                </select>
              </FormField>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon size={13} /> 4. Product Media & Thumbnail
            </h3>

            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <FormField label="Image URL" error={touched.thumbnail && errors.thumbnail} hint="Direct CDN link">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.thumbnail}
                    onChange={(e) => handleChange('thumbnail', e.target.value)}
                    onBlur={() => handleBlur('thumbnail')}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:border-blue-600 outline-none"
                  />
                </FormField>
              </div>

              <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                {formData.thumbnail ? (
                  <img
                    src={formData.thumbnail}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&q=80';
                    }}
                  />
                ) : (
                  <ImageIcon size={20} className="text-slate-300" />
                )}
              </div>
            </div>
          </div>
        </form>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-orange-500 text-white font-bold text-xs transition shadow-md shadow-orange-500/20 cursor-pointer disabled:cursor-not-allowed"
          >
            {initialData ? 'Update Product' : 'Publish Product'}
          </button>
        </div>
      </div>
    </div>
  );
}