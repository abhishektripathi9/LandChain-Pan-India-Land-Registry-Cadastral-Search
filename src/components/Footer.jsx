import { Link } from 'react-router-dom';
import { Globe, Code2, Users } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-5 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <div className="mb-3"><Logo /></div>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            A blockchain-based land registry platform bringing tamper-proof records and transparent verification to land administration.
          </p>
          <div className="flex gap-3 mt-4">
            {[Globe, Code2, Users].map((Icon, i) => (
              <a key={i} href="#" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary transition-colors">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold text-sm mb-3">Platform</p>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li><Link to="/search" className="hover:text-primary">Search Land</Link></li>
            <li><Link to="/explorer" className="hover:text-primary">Blockchain Explorer</Link></li>
            <li><Link to="/about" className="hover:text-primary">About Project</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-sm mb-3">Support</p>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li><Link to="/contact" className="hover:text-primary">Contact Us</Link></li>
            <li><Link to="/login" className="hover:text-primary">Login</Link></li>
            <li><Link to="/register" className="hover:text-primary">Register</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800 py-5 text-center text-xs text-slate-400">
        © 2026 LandChain — Final Year B.Tech Project. Built on Ethereum.
      </div>
    </footer>
  );
}
