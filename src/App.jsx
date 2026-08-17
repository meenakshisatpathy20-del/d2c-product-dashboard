import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Package, 
  TrendingUp, 
  Store, 
  MapPin, 
  Clock, 
  IndianRupee, 
  Truck, 
  Download, 
  Upload, 
  AlertCircle, 
  Layers, 
  Tag, 
  Copy, 
  Check, 
  Sparkles, 
  Flame, 
  FileText,
  BarChart3,
  ShoppingBag,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';

import { useProducts } from './hooks/useProducts';
import DataTable from './components/DataTable';
import Pagination from './components/Pagination';
import ProductModal from './components/ProductModal';
import OrdersPipeline from './components/OrdersPipeline';
import StatCard from './components/StatCard';
import ActionNeededPanel from './components/ActionNeededPanel';
import Toast from './components/Toast';
import ConfirmDialog from './components/ConfirmDialog';
import TrackingModal from './components/TrackingModal';
import RateCalculatorModal from './components/RateCalculatorModal';
import ManifestModal from './components/ManifestModal';

export default function App() {
  const {
    products,
    categories,
    total,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch,
    category,
    setCategory,
    sortBy,
    order,
    handleSort,
    saveProduct,
    removeProduct,
    bulkRemove,
    bulkWarehouseReassign,
    resolveNDR,
    retry,
    toast,
    clearToast,
    showToast,
    warehouses
  } = useProducts(8);

  const [activeView, setActiveView] = useState('products');
  const [selectedIds, setSelectedIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [trackingProduct, setTrackingProduct] = useState(null);
  const [calculatingProduct, setCalculatingProduct] = useState(null);
  const [isManifestOpen, setIsManifestOpen] = useState(false);

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);

  const [revenuePeriod, setRevenuePeriod] = useState('Monthly');
  const [currentTime, setCurrentTime] = useState(new Date());

  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [copiedCoupon, setCopiedCoupon] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const revenueValues = {
    Total: { val: '₹42.8 Lakh', trend: 18.2 },
    Monthly: { val: '₹6.45 Lakh', trend: 14.5 },
    Weekly: { val: '₹1.52 Lakh', trend: 8.3 },
    Yearly: { val: '₹51.2 Lakh', trend: 22.1 },
  };

  const coupons = [
    { code: 'D2CFESTIVE', off: 'FLAT ₹200 OFF', min: 'Orders ₹999+', tag: 'Trending' },
    { code: 'FREESHIP', off: 'FREE PAN-INDIA DELIVERY', min: 'No min. order', tag: 'Fast Delivery' },
    { code: 'MYNTRA50', off: 'EXTRA 15% OFF', min: 'Fashion & Beauty', tag: 'Limited' },
  ];

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    showToast(`Coupon "${code}" copied!`);
    setTimeout(() => setCopiedCoupon(''), 3000);
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.length === 6 && !isNaN(pincode)) {
      setPincodeStatus({
        valid: true,
        message: `Pincode ${pincode} Serviceable: Next-Day Express Delivery Active via Bluedart & Delhivery`
      });
      showToast(`Pincode ${pincode} verified for 24hr courier handover`);
    } else {
      setPincodeStatus({
        valid: false,
        message: 'Please enter a valid 6-digit Indian Postal Pincode'
      });
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedIds(products.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleCSVExport = () => {
    const exportData = products.map((p) => ({
      ID: p.id,
      SKU: p.sku,
      Title: p.title,
      Brand: p.brand,
      Category: p.category,
      PriceINR: p.priceINR,
      Courier: p.preferredCourier,
      Warehouse: p.warehouse
    }));

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [Object.keys(exportData[0]).join(','), ...exportData.map((e) => Object.values(e).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `D2CMall_Catalog_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Product catalog exported to CSV');
  };

  const handleCSVImportSimulate = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    showToast(`Uploaded "${file.name}" — 12 products synced successfully`);
  };

  const selectedProductList = products.filter((p) => selectedIds.includes(p.id));

  const formattedDate = currentTime.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      
      {/* 1. Live Top Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-2 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <MapPin size={12} /> Hubs: 4 Multi-City Fulfillment Depots
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <AlertCircle size={12} /> NDR Action Sync Active
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-400 flex items-center gap-1">
              <Truck size={12} className="text-blue-400" /> Bluedart, Delhivery & Shadowfax API Connected
            </span>
          </div>

          <div className="flex items-center gap-3 font-medium text-[11px]">
            <span>{formattedDate}</span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-orange-400 font-mono font-bold">
              <Clock size={12} /> {formattedTime}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Executive Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-xl text-white shadow-md shadow-orange-500/20">
              <Store size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-slate-900">
                  D2C<span className="text-orange-500">Mall</span>
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md uppercase">
                  Shiprocket Unified
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Omnichannel Catalog & Order Management Suite</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer">
              <Upload size={14} /> <span className="hidden sm:inline">Bulk CSV</span>
              <input type="file" accept=".csv" onChange={handleCSVImportSimulate} className="hidden" />
            </label>

            <button
              onClick={handleCSVExport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              <Download size={14} /> <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={() => {
                setEditingProduct(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-extrabold text-xs sm:text-sm transition shadow-md shadow-orange-500/20 active:scale-98 cursor-pointer"
            >
              <Plus size={16} strokeWidth={3} /> Add Product
            </button>
          </div>
        </div>
      </header>

      {/* 3. Welcome Banner & Pincode Checker */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600 text-white py-4 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center lg:text-left">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl shrink-0 hidden sm:flex">
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">Welcome to D2C Mall — Direct Indian Commerce Suite</h2>
              <p className="text-xs text-orange-100 font-medium">
                Live multi-channel synchronization across Shopify, Amazon, Flipkart, Myntra & Shiprocket Couriers
              </p>
            </div>
          </div>

          <form onSubmit={handleCheckPincode} className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/30 w-full sm:w-auto">
            <MapPin size={16} className="text-white ml-2 shrink-0" />
            <input
              type="text"
              maxLength={6}
              placeholder="Check Serviceable Pincode..."
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="bg-transparent text-white placeholder-orange-100 text-xs px-2 py-1 outline-none w-40 sm:w-48 font-semibold"
            />
            <button
              type="submit"
              className="bg-white text-slate-900 hover:bg-orange-50 font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer shrink-0 shadow-xs"
            >
              Verify TAT
            </button>
          </form>
        </div>

        {pincodeStatus && (
          <div className={`max-w-7xl mx-auto mt-2 text-xs font-bold px-3 py-1.5 rounded-lg ${pincodeStatus.valid ? 'bg-emerald-950/40 text-emerald-200' : 'bg-rose-950/40 text-rose-200'}`}>
            {pincodeStatus.message}
          </div>
        )}
      </div>

      {/* 4. Active Offers & Discounts Strip */}
      <div className="bg-white border-b border-slate-200 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider shrink-0">
            <Flame size={16} className="text-orange-500" /> Merchant Campaign Offers:
          </div>

          <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {coupons.map((c) => (
              <div
                key={c.code}
                onClick={() => handleCopyCoupon(c.code)}
                className="flex items-center gap-2 bg-orange-50/70 hover:bg-orange-100/80 border border-orange-200 border-dashed rounded-lg px-3 py-1.5 transition cursor-pointer shrink-0"
              >
                <Tag size={13} className="text-orange-600" />
                <span className="text-xs font-black text-orange-950 font-mono">{c.code}</span>
                <span className="text-[11px] font-bold text-orange-700">• {c.off}</span>
                <span className="text-[10px] text-slate-400">({c.min})</span>
                {copiedCoupon === c.code ? (
                  <Check size={13} className="text-emerald-600 ml-1" />
                ) : (
                  <Copy size={13} className="text-slate-400 ml-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Main Dashboard Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Active Catalog SKUs"
            value={total}
            icon={Package}
            color="blue"
            trend={12.4}
            trendLabel="vs last month"
          />

          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-2xs flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Sales</p>
                  <select
                    value={revenuePeriod}
                    onChange={(e) => setRevenuePeriod(e.target.value)}
                    className="text-[11px] font-bold text-slate-600 bg-slate-100 rounded px-1.5 py-0.5 outline-none cursor-pointer"
                  >
                    <option value="Total">Total</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
                <p className="text-2xl font-black text-emerald-600 mt-1">{revenueValues[revenuePeriod].val}</p>
              </div>
              <div className="p-2.5 rounded-xl border bg-emerald-50 text-emerald-600 border-emerald-100">
                <IndianRupee size={20} />
              </div>
            </div>
            <div className="mt-3 text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp size={14} className="mr-0.5" /> +{revenueValues[revenuePeriod].trend}% sales margin
            </div>
          </div>

          <StatCard
            title="Top Converting Category"
            value="Beauty & Apparel"
            icon={Layers}
            color="orange"
            subtitle="Rank #1 across 24 categories"
          />

          <StatCard
            title="Fulfillment Handover SLA"
            value="98.8%"
            icon={Truck}
            color="emerald"
            subtitle="Same-day manifest compliance"
          />
        </div>

        {/* Shiprocket Orders & Fulfillment Pipeline */}
        <OrdersPipeline totalProducts={total} />

        {/* NDR Exceptions Panel */}
        <ActionNeededPanel
          products={products}
          onResolveNDR={resolveNDR}
        />

        {/* View Switcher Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-1">
          <div className="flex items-center gap-6 text-xs font-extrabold text-slate-500">
            <button
              onClick={() => setActiveView('products')}
              className={`pb-2 flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
                activeView === 'products'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <Package size={15} /> All Products Catalog ({total})
            </button>
            <button
              onClick={() => setActiveView('analytics')}
              className={`pb-2 flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
                activeView === 'analytics'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <BarChart3 size={15} /> Courier Performance Matrix
            </button>
          </div>
        </div>

        {activeView === 'products' && (
          <div className="space-y-4">
            {/* Search & Filter Toolbar */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col md:flex-row gap-3 items-center justify-between shadow-2xs">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search products by title, SKU or brand..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 transition font-medium"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                  className="w-full md:w-56 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-700 capitalize focus:outline-none focus:bg-white focus:border-orange-500 transition font-bold cursor-pointer"
                >
                  <option value="">All Store Categories ({categories.length})</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bulk Action Toolbar */}
            {selectedIds.length > 0 && (
              <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2 duration-150 shadow-md">
                <span className="font-bold text-orange-400">
                  {selectedIds.length} {selectedIds.length === 1 ? 'product' : 'products'} selected
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsManifestOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
                  >
                    <FileText size={13} /> Generate Manifest ({selectedIds.length})
                  </button>

                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        bulkWarehouseReassign(selectedIds, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs outline-none cursor-pointer"
                  >
                    <option value="">Reassign Warehouse...</option>
                    {warehouses.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => setIsBulkDeleteConfirmOpen(true)}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1 rounded-lg transition cursor-pointer"
                  >
                    Delete Selected
                  </button>
                </div>
              </div>
            )}

            {/* Reusable Data Table */}
            <DataTable
              products={products}
              loading={loading}
              error={error}
              onRetry={retry}
              onEdit={(product) => {
                setEditingProduct(product);
                setIsModalOpen(true);
              }}
              onDelete={(id) => setConfirmDeleteId(id)}
              onTrack={(product) => setTrackingProduct(product)}
              onCalculateRate={(product) => setCalculatingProduct(product)}
              sortBy={sortBy}
              order={order}
              onSort={handleSort}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onToggleSelectAll={handleToggleSelectAll}
            />

            {/* Server-Side Pagination */}
            <Pagination
              total={total}
              limit={8}
              currentPage={page}
              onPageChange={setPage}
            />
          </div>
        )}

        {activeView === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-150">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Courier SLA Delivery Rates</h4>
              <div className="space-y-3 mt-4 text-xs">
                {[
                  { name: 'Bluedart Air', onTime: '98.2%', share: '45%' },
                  { name: 'Delhivery Surface', onTime: '94.6%', share: '30%' },
                  { name: 'Shadowfax Express', onTime: '92.1%', share: '15%' },
                  { name: 'DTDC Premium', onTime: '89.4%', share: '10%' },
                ].map((c, i) => (
                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0">
                    <span className="font-bold text-slate-800">{c.name}</span>
                    <span className="text-emerald-600 font-extrabold">{c.onTime} on-time</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Channel Sales Share</h4>
              <div className="space-y-3 mt-4 text-xs">
                {[
                  { name: 'Direct D2C Store', sales: '₹9.4 Lakh', share: '51%' },
                  { name: 'Amazon India', sales: '₹4.8 Lakh', share: '26%' },
                  { name: 'Myntra Mall', sales: '₹2.9 Lakh', share: '16%' },
                  { name: 'Flipkart Hub', sales: '₹1.3 Lakh', share: '7%' },
                ].map((ch, i) => (
                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0">
                    <span className="font-bold text-slate-800">{ch.name}</span>
                    <span className="text-blue-700 font-extrabold">{ch.sales} ({ch.share})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Warehouse Handover SLA</h4>
              <div className="space-y-3 mt-4 text-xs">
                {warehouses.map((w, i) => (
                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0">
                    <span className="font-bold text-slate-800">{w}</span>
                    <span className="text-emerald-600 font-bold">100% Ready</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <ManifestModal
        isOpen={isManifestOpen}
        onClose={() => setIsManifestOpen(false)}
        selectedProducts={selectedProductList}
        onDownload={() => showToast(`Pickup Manifest generated for ${selectedIds.length} orders`)}
      />

      <RateCalculatorModal
        isOpen={Boolean(calculatingProduct)}
        onClose={() => setCalculatingProduct(null)}
        product={calculatingProduct}
      />

      <TrackingModal
        isOpen={Boolean(trackingProduct)}
        onClose={() => setTrackingProduct(null)}
        product={trackingProduct}
      />

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={async (formData) => {
          const success = await saveProduct(formData, editingProduct?.id);
          if (success) {
            setIsModalOpen(false);
            setEditingProduct(null);
          }
        }}
        initialData={editingProduct}
        categories={categories}
        warehouses={warehouses}
      />

      <ConfirmDialog
        isOpen={Boolean(confirmDeleteId)}
        title="Delete Product from Catalog?"
        message="This product will immediately be delisted from all D2C store channels and warehouse dispatch lists."
        confirmLabel="Delete Product"
        isDestructive
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={() => {
          removeProduct(confirmDeleteId);
          setConfirmDeleteId(null);
        }}
      />

      <ConfirmDialog
        isOpen={isBulkDeleteConfirmOpen}
        title={`Delete ${selectedIds.length} Selected Products?`}
        message="Are you sure you want to delete all selected items? This updates your live store immediately."
        confirmLabel={`Delete ${selectedIds.length} Products`}
        isDestructive
        onCancel={() => setIsBulkDeleteConfirmOpen(false)}
        onConfirm={() => {
          bulkRemove(selectedIds);
          setSelectedIds([]);
          setIsBulkDeleteConfirmOpen(false);
        }}
      />

      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}