const map = {
  Approved: 'bg-green-50 text-success dark:bg-green-500/10',
  Pending: 'bg-amber-50 text-warning dark:bg-amber-500/10',
  Rejected: 'bg-red-50 text-danger dark:bg-red-500/10',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${map[status] || 'bg-slate-100 text-slate-600'}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
