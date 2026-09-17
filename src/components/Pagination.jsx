import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onChange }) {
  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-xs text-slate-500 dark:text-slate-400">Page {page} of {totalPages}</p>
      <div className="flex items-center gap-1.5">
        <button disabled={page <= 1} onClick={() => onChange(page - 1)} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"><ChevronLeft size={16} /></button>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button key={i} onClick={() => onChange(i + 1)} className={`w-8 h-8 rounded-lg text-sm ${page === i + 1 ? 'bg-primary text-white' : 'border border-slate-200 dark:border-slate-700'}`}>{i + 1}</button>
        ))}
        <button disabled={page >= totalPages} onClick={() => onChange(page + 1)} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"><ChevronRight size={16} /></button>
      </div>
    </div>
  );
}
