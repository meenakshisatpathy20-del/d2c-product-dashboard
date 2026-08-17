import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle2, 
  RotateCcw, 
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';

export default function OrdersPipeline({ totalProducts }) {
  const stats = [
    { label: 'Total Orders', count: 1248, amount: '₹18,42,190', color: 'blue', icon: Package, pct: 100 },
    { label: 'Unfulfilled / Pending Dispatch', count: 42, amount: '₹62,100', color: 'amber', icon: Clock, pct: 8.2 },
    { label: 'In-Transit (Couriers Handover)', count: 318, amount: '₹4,82,400', color: 'orange', icon: Truck, pct: 25.4 },
    { label: 'Delivered Successfully', count: 864, amount: '₹12,74,100', color: 'emerald', icon: CheckCircle2, pct: 69.2 },
    { label: 'NDR / RTO Exceptions', count: 24, amount: '₹23,590', color: 'rose', icon: RotateCcw, pct: 1.9 },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Package size={17} className="text-orange-500" />
            Live Orders & Fulfillment Pipeline
          </h3>
          <p className="text-xs text-slate-500">Real-time status across Shiprocket, Bluedart, Delhivery & Shadowfax</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
          <span className="flex items-center gap-1 text-emerald-600">
            <ArrowUpRight size={14} /> 94.6% On-Time Delivery SLA
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          const colorStyles = {
            blue: 'border-blue-100 bg-blue-50/40 text-blue-700',
            amber: 'border-amber-100 bg-amber-50/40 text-amber-700',
            orange: 'border-orange-100 bg-orange-50/40 text-orange-700',
            emerald: 'border-emerald-100 bg-emerald-50/40 text-emerald-700',
            rose: 'border-rose-100 bg-rose-50/40 text-rose-700',
          }[item.color];

          return (
            <div key={idx} className={`p-3.5 rounded-xl border ${colorStyles} flex flex-col justify-between space-y-2`}>
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{item.label}</span>
                <Icon size={16} />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900">{item.count}</p>
                <p className="text-[11px] font-semibold text-slate-500">{item.amount}</p>
              </div>
              <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    item.color === 'emerald' ? 'bg-emerald-500' :
                    item.color === 'orange' ? 'bg-orange-500' :
                    item.color === 'amber' ? 'bg-amber-500' :
                    item.color === 'rose' ? 'bg-rose-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}