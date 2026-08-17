import { Edit2, Trash2, ArrowUpDown, Tag, Star, MapPin, AlertCircle, RefreshCw, Truck, Calculator, ShieldCheck } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function DataTable({
  products,
  loading,
  error,
  onRetry,
  onEdit,
  onDelete,
  onTrack,
  onCalculateRate,
  sortBy,
  order,
  onSort,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}) {
  const getSortIcon = (field) => {
    if (sortBy !== field) return <ArrowUpDown size={12} className="text-slate-400" />;
    return <ArrowUpDown size={12} className={order === 'asc' ? 'text-orange-500' : 'text-blue-600 rotate-180'} />;
  };

  const isAllSelected = products.length > 0 && products.every((p) => selectedIds.includes(p.id));

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
              <th className="py-3 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => onToggleSelectAll(e.target.checked)}
                  className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                />
              </th>
              <th className="py-3 px-4 font-bold">Product & Brand</th>
              <th className="py-3 px-4 font-bold cursor-pointer select-none" onClick={() => onSort('category')}>
                <div className="flex items-center gap-1 hover:text-slate-900">
                  Category {getSortIcon('category')}
                </div>
              </th>
              <th className="py-3 px-4 font-bold cursor-pointer select-none" onClick={() => onSort('price')}>
                <div className="flex items-center gap-1 hover:text-slate-900">
                  Price (₹) {getSortIcon('price')}
                </div>
              </th>
              <th className="py-3 px-4 font-bold">Assigned Logistics Partner</th>
              <th className="py-3 px-4 font-bold">Pickup Hub</th>
              <th className="py-3 px-4 font-bold cursor-pointer select-none" onClick={() => onSort('rating')}>
                <div className="flex items-center gap-1 hover:text-slate-900">
                  Rating {getSortIcon('rating')}
                </div>
              </th>
              <th className="py-3 px-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={8} className="py-4 px-4">
                    <div className="h-5 bg-slate-100 rounded w-full"></div>
                  </td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={8} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle size={28} className="text-rose-500" />
                    <p className="text-xs font-bold text-slate-800">{error}</p>
                    <button
                      onClick={onRetry}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition cursor-pointer"
                    >
                      <RefreshCw size={13} /> Retry Query
                    </button>
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle size={28} className="text-orange-400" />
                    <span className="font-semibold text-xs">No products match your criteria.</span>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const isSelected = selectedIds.includes(product.id);
                return (
                  <tr
                    key={product.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelected ? 'bg-orange-50/30' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(product.id)}
                        className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                      />
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg border border-slate-200 bg-white p-1 shrink-0 overflow-hidden flex items-center justify-center">
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&q=80';
                            }}
                          />
                        </div>
                        <div className="max-w-xs">
                          <div className="font-bold text-slate-900 text-xs line-clamp-1 hover:text-blue-600 transition">
                            {product.title}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <span className="font-semibold text-slate-700">{product.brand || 'D2C Direct'}</span>
                            <span>•</span>
                            <span className="text-slate-400">{product.sku}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                        <Tag size={10} />
                        {product.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-xs">
                          ₹{product.priceINR.toLocaleString('en-IN')}
                        </span>
                        {product.discountPercentage > 0 && (
                          <span className="text-[10px] text-emerald-600 font-bold">
                            {Math.round(product.discountPercentage)}% Off
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700">
                          <Truck size={12} /> {product.preferredCourier}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-600">
                          {product.dispatchMode}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 font-medium">
                        <MapPin size={11} className="text-orange-500 shrink-0" />
                        {product.warehouse}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1 bg-emerald-600 text-white font-bold text-[11px] px-1.5 py-0.5 rounded">
                        <span>{product.rating ? Number(product.rating).toFixed(1) : '4.2'}</span>
                        <Star size={10} className="fill-white stroke-none" />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => onCalculateRate(product)}
                        className="p-1.5 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg transition cursor-pointer"
                        title="Calculate Shipping Rate"
                      >
                        <Calculator size={14} />
                      </button>
                      <button
                        onClick={() => onTrack(product)}
                        className="p-1.5 hover:bg-orange-50 text-slate-400 hover:text-orange-600 rounded-lg transition cursor-pointer"
                        title="Track Delivery Status"
                      >
                        <Truck size={14} />
                      </button>
                      <button
                        onClick={() => onEdit(product)}
                        className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}