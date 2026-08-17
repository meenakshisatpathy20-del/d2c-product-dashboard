import { AlertTriangle, ChevronRight, Scale, ImageOff, Tag } from 'lucide-react';

export default function ActionNeededPanel({ products, onSelectProduct }) {
  const discrepancyItems = products.filter((p) => p.hasDiscrepancy);
  const totalIssues = discrepancyItems.length;

  if (totalIssues === 0) return null;

  return (
    <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-500 text-white rounded-lg shrink-0">
          <AlertTriangle size={18} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
            Action Needed: {totalIssues} Courier Weight Disputes Detected
          </h4>
          <p className="text-xs text-amber-800 mt-0.5">
            Declared weight differs from courier auto-measured volumetric weight. Dispute to prevent excess shipping fee deductions.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
        {discrepancyItems.slice(0, 2).map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectProduct(item)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-300 hover:border-amber-400 text-slate-800 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer shadow-2xs"
          >
            <span>{item.sku}</span>
            <span className="text-rose-600 font-extrabold">+{((item.actualWeight - item.weight)).toFixed(2)}kg</span>
            <ChevronRight size={13} className="text-slate-400" />
          </button>
        ))}
      </div>
    </div>
  );
}