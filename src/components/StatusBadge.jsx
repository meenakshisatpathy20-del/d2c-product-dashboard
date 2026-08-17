import { CheckCircle2, FileEdit, AlertCircle, AlertTriangle } from 'lucide-react';

export default function StatusBadge({ status, type }) {
  if (type === 'discrepancy') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
        <AlertTriangle size={11} className="shrink-0" /> Dispute (+{status}kg)
      </span>
    );
  }

  const map = {
    Published: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <CheckCircle2 size={11} className="shrink-0" />
    },
    Draft: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: <FileEdit size={11} className="shrink-0" />
    },
    Inactive: {
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      icon: <AlertCircle size={11} className="shrink-0" />
    }
  };

  const current = map[status] || map.Published;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${current.bg}`}>
      {current.icon}
      {status}
    </span>
  );
}