import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ total, limit, currentPage, onPageChange }) {
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-2 text-xs text-slate-500">
      <div>
        Showing <span className="font-semibold text-slate-900">{Math.min((currentPage - 1) * limit + 1, total)}</span>–
        <span className="font-semibold text-slate-900">{Math.min(currentPage * limit, total)}</span> of{' '}
        <span className="font-bold text-slate-900">{total}</span> listings
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-700 font-semibold transition cursor-pointer disabled:cursor-not-allowed shadow-2xs"
        >
          <ChevronLeft size={14} /> Previous
        </button>

        <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 shadow-2xs">
          {currentPage} / {totalPages}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-700 font-semibold transition cursor-pointer disabled:cursor-not-allowed shadow-2xs"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}