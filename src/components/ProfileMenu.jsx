import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-semibold text-sm">
        RK
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2">
          <p className="px-3 py-2 text-sm font-medium">Ramesh Kumar</p>
          <p className="px-3 pb-2 text-xs text-slate-400 -mt-1">0x71C...8bA2</p>
          <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-slate-800"><User size={16} /> Profile</Link>
          <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-slate-800"><Settings size={16} /> Settings</Link>
          <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-danger hover:bg-red-50 dark:hover:bg-red-500/10"><LogOut size={16} /> Logout</Link>
        </div>
      )}
    </div>
  );
}
