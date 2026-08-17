import { AlertCircle, RotateCcw, CheckCircle2, PhoneCall } from 'lucide-react';

export default function ActionNeededPanel({ products, onResolveNDR }) {
  const ndrItems = products.filter((p) => p.ndrStatus);
  const totalIssues = ndrItems.length;

  if (totalIssues === 0) return null;

  return (
    <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-500 text-white rounded-lg shrink-0">
          <AlertCircle size={18} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
            Shiprocket NDR Action Center: {totalIssues} Non-Delivery Exceptions Pending
          </h4>
          <p className="text-xs text-amber-800 mt-0.5">
            Customer was unavailable or address was incomplete. Take action to prevent automatic Return-to-Origin (RTO) charges.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
        {ndrItems.slice(0, 2).map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 bg-white border border-amber-300 p-1.5 px-3 rounded-lg text-xs font-bold shadow-2xs shrink-0"
          >
            <span className="text-slate-800 truncate max-w-[120px]">{item.title}</span>
            <span className="text-orange-600 text-[11px] font-semibold">({item.ndrReason})</span>
            <button
              onClick={() => onResolveNDR(item.id, 'Re-attempt')}
              className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold cursor-pointer transition flex items-center gap-1"
            >
              <RotateCcw size={10} /> Re-attempt
            </button>
            <button
              onClick={() => onResolveNDR(item.id, 'RTO Approved')}
              className="px-2 py-0.5 bg-slate-700 hover:bg-slate-800 text-white rounded text-[11px] font-bold cursor-pointer transition"
            >
              RTO
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}