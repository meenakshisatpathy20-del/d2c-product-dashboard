import { X, Star, ShieldCheck, Truck, RotateCcw, Tag, IndianRupee, Store } from 'lucide-react';

export default function ProductDetailDrawer({ isOpen, onClose, product, onEdit }) {
  if (!isOpen || !product) return null;

  const originalMrp = Math.round(product.priceINR / (1 - (product.discountPercentage || 15) / 100));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
        
        <div>
          <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-md z-10">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Quick View</span>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer">
              <X size={18} />
            </button>
          </div>

          <div className="p-5 space-y-5">
            <div className="w-full h-56 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center p-3 overflow-hidden">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80';
                }}
              />
            </div>

            <div>
              <span className="text-[11px] font-extrabold text-orange-600 uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded">
                {product.brand || 'D2C Exclusive'}
              </span>
              <h2 className="text-base font-extrabold text-slate-900 mt-1">{product.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">SKU: {product.sku} • Category: {product.category}</p>

              <div className="flex items-center gap-2 mt-2">
                <div className="inline-flex items-center gap-1 bg-emerald-600 text-white font-bold text-xs px-2 py-0.5 rounded">
                  <span>{product.rating ? Number(product.rating).toFixed(1) : '4.4'}</span>
                  <Star size={10} className="fill-white stroke-none" />
                </div>
                <span className="text-xs text-slate-400 font-medium">(2,410 verified buyer reviews)</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">₹{product.priceINR.toLocaleString('en-IN')}</span>
                <span className="text-sm text-slate-400 line-through">₹{originalMrp.toLocaleString('en-IN')}</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {Math.round(product.discountPercentage || 15)}% OFF
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Inclusive of all taxes & GST</p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center gap-2.5">
                <Truck size={15} className="text-blue-600 shrink-0" />
                <span>Express courier dispatch from <strong>{product.warehouse}</strong> via <strong>{product.preferredCourier}</strong></span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
                <span>100% Genuine Direct from Manufacturer warranty</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw size={15} className="text-orange-500 shrink-0" />
                <span>7 Days Hassle-Free Return & Replacement Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
          <button
            onClick={() => {
              onClose();
              onEdit(product);
            }}
            className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Edit Product Data
          </button>
        </div>
      </div>
    </div>
  );
}