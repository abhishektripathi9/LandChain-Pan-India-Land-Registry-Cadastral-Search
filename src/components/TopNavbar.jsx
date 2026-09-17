import { Menu, Sun, Moon, Bell, Search } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { notifications } from '../data/dummyData';
import ProfileMenu from './ProfileMenu';

export default function TopNavbar({ onMenuClick, title }) {
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [topQuery, setTopQuery] = useState('');
  const [showNotif, setShowNotif] = useState(false);
  const ref = useRef(null);
  const unread = notifications.filter((n) => n.unread).length;

  const handleTopSearch = (e) => {
    e.preventDefault();
    if (topQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(topQuery.trim())}`);
    }
  };

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setShowNotif(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button className="lg:hidden p-2" onClick={onMenuClick} aria-label="Open menu"><Menu size={20} /></button>
        <h1 className="font-display font-semibold text-lg hidden sm:block">{title}</h1>
      </div>

      <form onSubmit={handleTopSearch} className="hidden md:flex items-center flex-1 max-w-md mx-6 relative">
        <Search size={16} className="absolute left-3 text-slate-400" />
        <input 
          value={topQuery}
          onChange={(e) => setTopQuery(e.target.value)}
          placeholder="Search land ID, owner, khasra, village…" 
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border border-transparent focus:border-primary outline-none" 
        />
      </form>

      <div className="flex items-center gap-2">
        <button onClick={toggle} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Toggle theme">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="relative" ref={ref}>
          <button onClick={() => setShowNotif((s) => !s)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 relative" aria-label="Notifications">
            <Bell size={18} />
            {unread > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger" />}
          </button>
          {showNotif && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 max-h-96 overflow-y-auto">
              {notifications.slice(0, 4).map((n) => (
                <div key={n.id} className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{n.time}</p>
                </div>
              ))}
              <Link to="/notifications" className="block text-center text-sm text-primary py-2">View all</Link>
            </div>
          )}
        </div>
        <ProfileMenu />
      </div>
    </header>
  );
}
