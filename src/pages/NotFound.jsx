import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Box } from 'lucide-react';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-bg dark:bg-[#0B1120]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-16 h-16 rounded-lg flex items-center justify-center shadow-sm">
            <Box size={20} className="text-primary" />
          </div>
        ))}
      </motion.div>
      <h1 className="font-display text-5xl font-bold mb-2">404</h1>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">This block doesn't exist on our chain. The page you're looking for may have moved or never existed.</p>
      <Link to="/"><Button icon={Home} size="lg">Back to Home</Button></Link>
    </div>
  );
}
