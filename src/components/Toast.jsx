import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-xl animate-in slide-in-from-bottom duration-200">
      {isError ? (
        <AlertCircle size={18} className="text-rose-600 shrink-0" />
      ) : (
        <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
      )}
      <p className="text-xs font-bold text-slate-800">{toast.message}</p>
      <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600">
        <X size={14} />
      </button>
    </div>
  );
}