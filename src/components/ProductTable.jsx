import { Edit2, Trash2, ArrowUpDown, Tag, Star, Truck, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function ProductTable({
  products,
  loading,
  onEdit,
  onDelete,
  sortBy,
  order,
  onSort,
}) {
  const getSortIcon = (field) => {
    if (sortBy !== field) return <ArrowUpDown size={13} className="text-slate-400" />;
    return <ArrowUpDown size={13} className={order === 'asc' ? 'text-orange-500' : 'text-blue-600 rotate-180'} />;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
              <th className="py-3.5 px-6 font-bold">Product & Brand Info</th>
              <th className="py-3.5 px-6 font-bold cursor-pointer select-none" onClick={() => onSort('category')}>
                <div className="flex items-center gap-1.5 hover:text-slate-900">
                  Category {getSortIcon('category')}
                </div>
              </th>
              <th className="py-3.5 px-6 font-bold cursor-pointer select-none" onClick={() => onSort('price')}>
                <div className="flex items-center gap-1.5 hover:text-slate-900">
                  Price (₹ INR) {getSortIcon('price')}
                </div>
              </th>
              <th className="py-3.5 px-6 font-bold">Delivery & Trust Badge</th>
              <th className="py-3.5 px-6 font-bold cursor-pointer select-none" onClick={() => onSort('rating')}>
                <div className="flex items-center gap-1.5 hover:text-slate-900">
                  Ratings {getSortIcon('rating')}
                </div>
              </th>
              <th className="py-3.5 px-6 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="py-4 px-6">
                    <div className="h-4 bg-slate-100 rounded w-full"></div>
                  </td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertTriangle size={28} className="text-orange-400" />
                    <span className="font-medium text-sm">No items found matching your filter criteria.</span>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const inrPrice = Math.round(product.price * 83);
                const originalMrp = Math.round(inrPrice * (1 + (product.discountPercentage || 15) / 100));

                return (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="w-13 h-13 rounded-lg border border-slate-200 bg-white p-1 shrink-0 overflow-hidden flex items-center justify-center">
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
                          <div className="font-semibold text-slate-900 text-sm line-clamp-1 hover:text-blue-600 transition">
                            {product.title}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <span className="font-semibold text-slate-800">{product.brand || 'D2C Exclusive'}</span>
                            <span>•</span>
                            <span className="text-[11px] text-slate-400">SKU-{product.id + 10480}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                        <Tag size={11} />
                        {product.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-6">
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-extrabold text-slate-900 text-base">
                            ₹{inrPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-slate-400 line-through">
                            ₹{originalMrp.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <span className="text-[11px] text-emerald-600 font-bold">
                          {Math.round(product.discountPercentage || 15)}% OFF
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 w-fit">
                          <ShieldCheck size={13} className="text-emerald-600" /> D2C Assured
                        </div>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Truck size={12} className="text-slate-400" /> Express: Next-Day Delivery
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-1.5">
                        <div className="inline-flex items-center gap-1 bg-emerald-600 text-white font-bold text-xs px-2 py-0.5 rounded">
                          <span>{product.rating ? Number(product.rating).toFixed(1) : '4.2'}</span>
                          <Star size={11} className="fill-white stroke-none" />
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">({Math.floor(product.rating * 142 || 500)})</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-6 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-lg transition cursor-pointer"
                        title="Edit Listing"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="p-2 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition cursor-pointer"
                        title="Delete Listing"
                      >
                        <Trash2 size={15} />
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