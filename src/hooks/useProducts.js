import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  getProducts, 
  getCategories, 
  addProduct as apiAddProduct, 
  updateProduct as apiUpdateProduct, 
  deleteProduct as apiDeleteProduct 
} from '../services/productService';

const WAREHOUSES = ['Bhiwandi Hub (MH)', 'Gurugram Facility (HR)', 'Bengaluru Depot (KA)', 'Kolkata Fulfillment (WB)'];

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

  const enrichProduct = (p, index) => {
    const declaredWeight = (0.2 + ((p.id * 17) % 25) / 10).toFixed(2);
    const hasDiscrepancy = p.id % 4 === 0;
    const actualWeight = hasDiscrepancy ? (parseFloat(declaredWeight) + 0.65).toFixed(2) : declaredWeight;
    const warehouse = WAREHOUSES[p.id % WAREHOUSES.length];
    const status = p.id % 7 === 0 ? 'Draft' : p.id % 11 === 0 ? 'Inactive' : 'Published';
    
    return {
      ...p,
      priceINR: Math.round((p.price || 10) * 83),
      discountPercentage: p.discountPercentage || 12,
      weight: declaredWeight,
      actualWeight,
      hasDiscrepancy,
      dimensions: {
        length: 15 + (p.id % 10),
        width: 10 + (p.id % 5),
        height: 5 + (p.id % 8)
      },
      warehouse,
      status,
      missingImage: !p.thumbnail || p.thumbnail.includes('placeholder'),
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
        showToast(`Listing for "${formData.title}" successfully updated`);
      } else {
        const res = await apiAddProduct(formData);
        const newEnriched = enrichProduct({ ...res, id: Date.now(), ...formData });
        setProducts((prev) => [newEnriched, ...prev]);
        setTotal((prev) => prev + 1);
        showToast(`New SKU "${formData.title}" published to marketplace`);
      }
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to save product listing', 'error');
      return false;
    }
  };

  const removeProduct = async (id) => {
    const previousProducts = [...products];
    const previousTotal = total;
    const targetProduct = products.find((p) => p.id === id);

    setProducts((prev) => prev.filter((p) => p.id !== id));
    setTotal((prev) => Math.max(0, prev - 1));

    try {
      await apiDeleteProduct(id);
      showToast(`SKU delisted successfully`);
    } catch (err) {
      setProducts(previousProducts);
      setTotal(previousTotal);
      showToast(`Failed to delist ${targetProduct?.title || 'product'}. Changes rolled back.`, 'error');
    }
  };

  const bulkRemove = (selectedIds) => {
    const previousProducts = [...products];
    const previousTotal = total;

    setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    setTotal((prev) => Math.max(0, prev - selectedIds.length));
    showToast(`Successfully delisted ${selectedIds.length} selected SKUs`);
  };

  const bulkWarehouseReassign = (selectedIds, newWarehouse) => {
    setProducts((prev) =>
      prev.map((p) => (selectedIds.includes(p.id) ? { ...p, warehouse: newWarehouse } : p))
    );
    showToast(`Updated pickup hub to ${newWarehouse} for ${selectedIds.length} items`);
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
    retry: loadData,
    toast,
    clearToast,
    showToast,
    warehouses: WAREHOUSES
  };
}