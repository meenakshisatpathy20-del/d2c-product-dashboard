import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({ title, value, icon: Icon, color, trend, trendLabel, subtitle }) {
  const colorMap = {
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-2xs flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`p-2.5 rounded-xl border ${colorMap[color] || colorMap.blue}`}>
          <Icon size={20} />
        </div>
      </div>
      
      <div className="mt-3 text-xs flex items-center justify-between">
        {trend !== undefined ? (
          <span className={`font-bold flex items-center ${trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend)}% {trendLabel}
          </span>
        ) : (
          <span className="text-slate-500 font-medium">{subtitle}</span>
        )}
      </div>
    </div>
  );
}