import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  Package, 
  Layers, 
  TrendingUp, 
  Store,
  MapPin,
  Clock,
  IndianRupee,
  Truck,
  Percent,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

import { 
  fetchProducts, 
  fetchCategories, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from './services/api';

import ProductTable from './components/ProductTable';
import Pagination from './components/Pagination';
import ProductModal from './components/ProductModal';

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('asc');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [currentTime, setCurrentTime] = useState(new Date());

  const LIMIT = 8;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * LIMIT;
      const data = await fetchProducts({
        limit: LIMIT,
        skip,
        search,
        category: selectedCategory,
        sortBy,
        order,
      });
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedCategory, sortBy, order]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  const handleSaveProduct = async (formData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...formData } : p));
      } else {
        const res = await createProduct(formData);
        setProducts([{ ...res, id: Date.now() }, ...products]);
        setTotal(t => t + 1);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to remove this item from the D2C Mall?')) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      setTotal(t => t - 1);
    } catch (err) {
      console.error(err);
    }
  };

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
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <MapPin size={13} /> Hub Location: India (IN) • Express Pincodes Active
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-400">
              <Truck size={13} className="text-orange-400" /> Free Pan-India Delivery on Orders ₹499+
            </span>
          </div>

          <div className="flex items-center gap-3 font-medium">
            <span className="text-slate-300">{formattedDate}</span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-amber-400 font-mono font-bold">
              <Clock size={13} /> {formattedTime}
            </span>
          </div>
        </div>
      </div>

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
                  Marketplace Hub
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Customer & Seller Direct Commercials</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition shadow-md shadow-orange-500/20 active:scale-98 cursor-pointer"
            >
              <Plus size={16} strokeWidth={3} /> Add New Listing
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-2xs">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Catalog Items</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{total}</p>
              </div>
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                <Package size={20} />
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs text-blue-600 font-semibold">
              <Sparkles size={14} className="mr-1" /> 100% Genuine D2C Brands
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-2xs">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg. Indian Basket Size</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">₹1,840</p>
              </div>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                <IndianRupee size={20} />
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs text-emerald-600 font-semibold">
              <TrendingUp size={14} className="mr-0.5" /> +14.2% festive surge
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-2xs">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Store Categories</p>
                <p className="text-2xl font-black text-orange-600 mt-1">{categories.length}</p>
              </div>
              <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl border border-orange-100">
                <Layers size={20} />
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs text-slate-500 font-medium">
              Fashion, Electronics, Home & Beauty
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-2xs">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg. Customer Discount</p>
                <p className="text-2xl font-black text-blue-700 mt-1">18.5%</p>
              </div>
              <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
                <Percent size={20} />
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs text-slate-500 font-medium">
              Direct-from-factory savings
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col md:flex-row gap-3 items-center justify-between shadow-2xs">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search products by brand, title, or keyword..."
              value={search}
              onChange={handleSearchChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full md:w-56 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-700 capitalize focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition font-medium"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <ProductTable
          products={products}
          loading={loading}
          onEdit={(product) => {
            setEditingProduct(product);
            setIsModalOpen(true);
          }}
          onDelete={handleDeleteProduct}
          sortBy={sortBy}
          order={order}
          onSort={handleSort}
        />

        <Pagination
          total={total}
          limit={LIMIT}
          currentPage={page}
          onPageChange={setPage}
        />
      </main>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSaveProduct}
        initialData={editingProduct}
        categories={categories}
      />
    </div>
  );
}