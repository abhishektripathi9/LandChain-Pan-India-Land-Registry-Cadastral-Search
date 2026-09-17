import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';

export default function DashboardLayout({ items, title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-bg dark:bg-[#0B1120]">
      <Sidebar items={items} open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopNavbar onMenuClick={() => setOpen(true)} title={title} />
        <motion.main
          key={title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 p-4 lg:p-6 max-w-[1400px] w-full mx-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
