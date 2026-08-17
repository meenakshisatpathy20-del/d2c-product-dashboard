import { useState, useEffect } from 'react';
import { 
  X, 
  Tag, 
  IndianRupee, 
  Truck, 
  Image as ImageIcon, 
  CheckCircle2, 
  Percent, 
  ShieldCheck, 
  Building2, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import FormField from './FormField';

export default function ProductModal({ isOpen, onClose, onSubmit, initialData, categories, warehouses }) {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    category: '',
    sku: '',
    priceINR: '',
    mrpINR: '',
    discountPercentage: '',
    gstRate: '18',
    hsnCode: '61091000',
    warehouse: '',
    preferredCourier: 'Bluedart Air Express',
    dispatchSLA: 'Same Day Dispatch',
    thumbnail: '',
    status: 'Published'
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      const pInr = initialData.priceINR || Math.round(initialData.price * 83);
      const disc = initialData.discountPercentage || 15;
      const mrp = Math.round(pInr / (1 - disc / 100));
      setFormData({
        title: initialData.title || '',
        brand: initialData.brand || '',
        category: initialData.category || categories[0] || 'beauty',
        sku: initialData.sku || `D2C-${Math.floor(100000 + Math.random() * 900000)}`,
        priceINR: pInr,
        mrpINR: mrp,
        discountPercentage: disc,
        gstRate: initialData.gstRate || '18',
        hsnCode: initialData.hsnCode || '61091000',
        warehouse: initialData.warehouse || warehouses[0],
        preferredCourier: initialData.preferredCourier || 'Bluedart Air Express',
        dispatchSLA: initialData.dispatchSLA || 'Same Day Dispatch',
        thumbnail: initialData.thumbnail || '',
        status: initialData.status || 'Published'
      });
    } else {
      setFormData({
        title: '',
        brand: '',
        category: categories[0] || 'beauty',
        sku: `D2C-${Math.floor(100000 + Math.random() * 900000)}`,
        priceINR: '',
        mrpINR: '',
        discountPercentage: '15',
        gstRate: '18',
        hsnCode: '61091000',
        warehouse: warehouses[0] || 'Bhiwandi Hub (MH)',
        preferredCourier: 'Bluedart Air Express',
        dispatchSLA: 'Same Day Dispatch',
        thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
        status: 'Published'
      });
    }
    setErrors({});
    setTouched({});
    setActiveTab('basic');
  }, [initialData, categories, warehouses, isOpen]);

  const validateField = (name, value) => {
    let err = '';
    if (name === 'title' && (!value || value.trim().length < 3)) {
      err = 'Product title must be at least 3 characters.';
    } else if (name === 'brand' && (!value || value.trim().length < 2)) {
      err = 'Brand name is required.';
    } else if (name === 'priceINR' && (!value || parseFloat(value) <= 0)) {
      err = 'Selling price must be greater than ₹0.';
    } else if (name === 'thumbnail' && value && !value.match(/^https?:\/\/.+/i)) {
      err = 'Enter a valid image CDN URL starting with http:// or https://';
    }
    return err;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'priceINR' && next.discountPercentage) {
        const p = parseFloat(value) || 0;
        const d = parseFloat(next.discountPercentage) || 0;
        if (p > 0 && d > 0) next.mrpINR = Math.round(p / (1 - d / 100));
      }
      return next;
    });

    if (touched[field]) {
      const err = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const priceNum = parseFloat(formData.priceINR) || 0;
  const gstNum = parseFloat(formData.gstRate) || 18;
  const netEarnings = Math.round(priceNum / (1 + gstNum / 100));
  const gstAmount = priceNum - netEarnings;

  const isFormValid =
    formData.title.trim().length >= 3 &&
    formData.brand.trim().length >= 2 &&
    parseFloat(formData.priceINR) > 0 &&
    !Object.values(errors).some(Boolean);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    onSubmit({
      ...formData,
      priceINR: priceNum,
      price: priceNum / 83,
      discountPercentage: parseFloat(formData.discountPercentage || 0),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in duration-150">
        
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 text-white rounded-xl shadow-xs">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {initialData ? 'Update Product Catalog & Logistics' : 'Add New Direct-to-Consumer Product'}
              </h2>
              <p className="text-xs text-slate-500">Live multi-channel commercial distribution & Shiprocket courier mapping</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="flex border-b border-slate-200 bg-white px-6 gap-6 text-xs font-bold text-slate-500 shrink-0">
          {[
            { id: 'basic', label: '1. Catalog Core', icon: Tag },
            { id: 'pricing', label: '2. Pricing & GST Tax', icon: IndianRupee },
            { id: 'logistics', label: '3. Logistics & SLAs', icon: Truck },
            { id: 'media', label: '4. Media & Live Card', icon: ImageIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 flex items-center gap-2 border-b-2 font-extrabold transition cursor-pointer ${
                  isActive
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 bg-slate-50/40">
          {activeTab === 'basic' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <FormField label="Product Title / Display Name" required error={touched.title && errors.title}>
                <input
                  type="text"
                  placeholder="e.g. Oversized 240 GSM Heavyweight French Terry T-Shirt"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  onBlur={() => handleBlur('title')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 outline-none bg-white font-medium"
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Brand Name" required error={touched.brand && errors.brand}>
                  <input
                    type="text"
                    placeholder="e.g. Roadster, Minimalist, Snitch"
                    value={formData.brand}
                    onChange={(e) => handleChange('brand', e.target.value)}
                    onBlur={() => handleBlur('brand')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-orange-500 outline-none bg-white font-medium"
                  />
                </FormField>

                <FormField label="Product Category" required>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm capitalize bg-white focus:border-blue-600 outline-none font-semibold text-slate-800"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Master SKU Code" hint="Auto-generated">
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => handleChange('sku', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold bg-white text-slate-700 outline-none"
                  />
                </FormField>

                <FormField label="Catalog Listing Status">
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white font-bold text-slate-800 outline-none"
                  >
                    <option value="Published">Published (Active on Store)</option>
                    <option value="Draft">Draft (Internal Review)</option>
                    <option value="Inactive">Inactive (Delisted)</option>
                  </select>
                </FormField>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField label="Customer Selling Price (₹)" required error={touched.priceINR && errors.priceINR}>
                  <input
                    type="number"
                    placeholder="1299"
                    value={formData.priceINR}
                    onChange={(e) => handleChange('priceINR', e.target.value)}
                    onBlur={() => handleBlur('priceINR')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-black text-slate-900 bg-white focus:border-orange-500 outline-none"
                  />
                </FormField>

                <FormField label="Discount (%)">
                  <input
                    type="number"
                    placeholder="15"
                    value={formData.discountPercentage}
                    onChange={(e) => handleChange('discountPercentage', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white focus:border-emerald-600 outline-none"
                  />
                </FormField>

                <FormField label="Original MRP (₹)" hint="Printed Price">
                  <input
                    type="number"
                    placeholder="1999"
                    value={formData.mrpINR}
                    onChange={(e) => handleChange('mrpINR', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white text-slate-600 outline-none"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Applicable GST Bracket (%)">
                  <select
                    value={formData.gstRate}
                    onChange={(e) => handleChange('gstRate', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white font-bold text-slate-800 outline-none"
                  >
                    <option value="0">0% (Exempt)</option>
                    <option value="5">5% (Essential Goods / Footwear &lt; ₹1k)</option>
                    <option value="12">12% (Standard Apparel &gt; ₹1k)</option>
                    <option value="18">18% (Electronics, Personal Care & Beauty)</option>
                    <option value="28">28% (Luxury & Premium)</option>
                  </select>
                </FormField>

                <FormField label="Harmonized HSN / SAC Code">
                  <input
                    type="text"
                    value={formData.hsnCode}
                    onChange={(e) => handleChange('hsnCode', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono bg-white text-slate-700 outline-none"
                  />
                </FormField>
              </div>

              <div className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                <div>
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Net Merchant Realization (Excl. GST)</p>
                  <p className="text-xl font-black text-emerald-700 mt-0.5">₹{netEarnings.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <span>GST Liability: <strong className="text-slate-800">₹{gstAmount.toLocaleString('en-IN')}</strong> ({formData.gstRate}%)</span>
                  <p className="text-[11px] text-blue-600 font-semibold mt-0.5">Auto-filed in GSTR-1 Ledger</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logistics' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Assigned Pickup Warehouse">
                  <select
                    value={formData.warehouse}
                    onChange={(e) => handleChange('warehouse', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white font-bold text-slate-800 outline-none"
                  >
                    {warehouses.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Primary Courier Engine">
                  <select
                    value={formData.preferredCourier}
                    onChange={(e) => handleChange('preferredCourier', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white font-bold text-blue-700 outline-none"
                  >
                    <option value="Bluedart Air Express">Bluedart Air Express (Priority Metro)</option>
                    <option value="Delhivery Surface Direct">Delhivery Surface Direct (Economical)</option>
                    <option value="Shadowfax Hyperlocal">Shadowfax Hyperlocal (Same-Day City)</option>
                    <option value="DTDC Premium Plus">DTDC Premium Plus (Tier 2/3 Reach)</option>
                  </select>
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Warehouse Dispatch SLA">
                  <select
                    value={formData.dispatchSLA}
                    onChange={(e) => handleChange('dispatchSLA', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white font-semibold text-slate-800 outline-none"
                  >
                    <option value="Same Day Dispatch">Same Day Dispatch (Cutoff: 3 PM)</option>
                    <option value="Next Day Handover">Next Day Handover (24hr SLA)</option>
                    <option value="Made to Order (48hr)">Made to Order (48hr Handover)</option>
                  </select>
                </FormField>

                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
                  <ShieldCheck size={22} className="text-blue-600 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-blue-950">Shiprocket Smart Route Enabled</p>
                    <p className="text-blue-700 text-[11px] mt-0.5">Automated courier re-allocation if primary partner breaches SLA.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <FormField label="Product Image CDN Link" error={touched.thumbnail && errors.thumbnail} hint="Direct CDN URL">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.thumbnail}
                  onChange={(e) => handleChange('thumbnail', e.target.value)}
                  onBlur={() => handleBlur('thumbnail')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono bg-white outline-none focus:border-blue-600"
                />
              </FormField>

              <div className="p-4 bg-white border border-slate-200 rounded-2xl">
                <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-3">Live Marketplace Storefront Preview</p>
                <div className="max-w-xs border border-slate-200 rounded-xl p-3 bg-slate-50/60 flex items-center gap-3 shadow-xs">
                  <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={formData.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&q=80'}
                      alt="Preview"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&q=80';
                      }}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase">{formData.brand || 'D2C Brand'}</span>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{formData.title || 'Product Title Placeholder'}</h4>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-sm font-black text-slate-900">₹{priceNum ? priceNum.toLocaleString('en-IN') : '0'}</span>
                      {formData.mrpINR && (
                        <span className="text-[10px] text-slate-400 line-through">₹{formData.mrpINR}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            {activeTab !== 'basic' && (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'media') setActiveTab('logistics');
                  else if (activeTab === 'logistics') setActiveTab('pricing');
                  else if (activeTab === 'pricing') setActiveTab('basic');
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Back
              </button>
            )}
            {activeTab !== 'media' && (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'basic') setActiveTab('pricing');
                  else if (activeTab === 'pricing') setActiveTab('logistics');
                  else if (activeTab === 'logistics') setActiveTab('media');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1"
              >
                Next <ArrowRight size={12} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-extrabold text-xs transition shadow-md shadow-orange-500/20 cursor-pointer disabled:cursor-not-allowed"
            >
              {initialData ? 'Save Changes' : 'Publish to D2C Store'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}