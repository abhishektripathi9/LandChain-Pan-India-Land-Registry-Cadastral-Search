export function Spinner({ size = 20 }) {
  return (
    <div
      className="animate-spin rounded-full border-2 border-slate-300 border-t-primary"
      style={{ width: size, height: size }}
    />
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 p-3">
      <div className="skeleton w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3 rounded w-3/4" />
        <div className="skeleton h-3 rounded w-1/2" />
      </div>
    </div>
  );
}
