import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mb-6" aria-label="Breadcrumb">
      <Link to="/dashboard" className="hover:text-primary flex items-center"><Home size={14} /></Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight size={14} />
          {item.to ? <Link to={item.to} className="hover:text-primary">{item.label}</Link> : <span className="text-ink dark:text-slate-200 font-medium">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
