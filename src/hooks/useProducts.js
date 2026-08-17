import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  getProducts, 
  getCategories, 
  addProduct as apiAddProduct, 
  updateProduct as apiUpdateProduct, 
  deleteProduct as apiDeleteProduct 
} from '../services/productService';

const WAREHOUSES = ['Bhiwandi Hub (MH)', 'Gurugram Facility (HR)', 'Bengaluru Depot (KA)', 'Kolkata Fulfillment (WB)'];
const COURIERS = ['Bluedart Air', 'Delhivery Surface', 'Shadowfax Express', 'DTDC Express'];

export function useProducts(limit = 8) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('asc');

  const [toast, setToast] = useState(null);
  const debounceTimerRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  const clearToast = () => setToast(null);

  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(debounceTimerRef.current);
  }, [search]);

  useEffect(() => {
    async function loadTaxonomy() {
      try {
        const catData = await getCategories();
        setCategories(catData);
      } catch (err) {
        console.error(err);
      }
    }
    loadTaxonomy();
  }, []);

  const enrichProduct = (p) => {
    const warehouse = WAREHOUSES[p.id % WAREHOUSES.length];
    const preferredCourier = COURIERS[p.id % COURIERS.length];
    const status = p.id % 7 === 0 ? 'Draft' : p.id % 11 === 0 ? 'Inactive' : 'Published';
    
    const hasNDR = p.id % 6 === 0;
    const ndrReason = hasNDR ? (p.id % 2 === 0 ? 'Customer Unavailable' : 'Incomplete Address') : null;

    return {
      ...p,
      priceINR: Math.round((p.price || 10) * 83),
      discountPercentage: p.discountPercentage || 12,
      warehouse,
      preferredCourier,
      dispatchMode: p.id % 2 === 0 ? 'Express Air' : 'Surface Standard',
      status,
      ndrStatus: hasNDR,
      ndrReason,
      sku: p.sku || `SKU-${10000 + p.id}`
    };
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const skip = (page - 1) * limit;
      const data = await getProducts({
        limit,
        skip,
        search: debouncedSearch,
        category,
        sortBy,
        order,
      });
      const enriched = (data.products || []).map(enrichProduct);
      setProducts(enriched);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message || 'Error communicating with catalog server');
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, category, sortBy, order]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  const saveProduct = async (formData, editingId) => {
    try {
      if (editingId) {
        await apiUpdateProduct(editingId, formData);
        setProducts((prev) =>
          prev.map((item) => (item.id === editingId ? { ...item, ...formData, priceINR: formData.priceINR } : item))
        );
        showToast(`Product "${formData.title}" updated successfully`);
      } else {
        const res = await apiAddProduct(formData);
        const newEnriched = enrichProduct({ ...res, id: Date.now(), ...formData });
        setProducts((prev) => [newEnriched, ...prev]);
        setTotal((prev) => prev + 1);
        showToast(`Product "${formData.title}" published successfully`);
      }
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to save product', 'error');
      return false;
    }
  };

  const removeProduct = async (id) => {
    const previousProducts = [...products];
    const previousTotal = total;

    setProducts((prev) => prev.filter((p) => p.id !== id));
    setTotal((prev) => Math.max(0, prev - 1));

    try {
      await apiDeleteProduct(id);
      showToast(`Product removed successfully`);
    } catch (err) {
      setProducts(previousProducts);
      setTotal(previousTotal);
      showToast(`Failed to delete product. Changes rolled back.`, 'error');
    }
  };

  const bulkRemove = (selectedIds) => {
    setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    setTotal((prev) => Math.max(0, prev - selectedIds.length));
    showToast(`Removed ${selectedIds.length} products`);
  };

  const bulkWarehouseReassign = (selectedIds, newWarehouse) => {
    setProducts((prev) =>
      prev.map((p) => (selectedIds.includes(p.id) ? { ...p, warehouse: newWarehouse } : p))
    );
    showToast(`Updated pickup hub to ${newWarehouse}`);
  };

  const resolveNDR = (id, action) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ndrStatus: false, ndrReason: null } : p))
    );
    showToast(`NDR Action: "${action}" submitted to courier network`);
  };

  return {
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
    retry: loadData,
    toast,
    clearToast,
    showToast,
    warehouses: WAREHOUSES
  };
}