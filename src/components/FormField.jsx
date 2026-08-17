export default function FormField({ label, error, children, required, hint }) {
  return (
    <div className="space-y-1 w-full">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label} {required && <span className="text-orange-500">*</span>}
        </label>
        {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-[11px] text-rose-500 font-semibold tracking-tight animate-in fade-in">{error}</p>}
    </div>
  );
}