import { motion } from 'framer-motion';

export default function Card({ children, className = '', glass = false, hover = true, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      whileHover={hover ? { y: -2 } : undefined}
      className={`rounded-xl border border-slate-200 dark:border-slate-800 ${glass ? 'glass' : 'bg-card dark:bg-slate-900'} shadow-sm hover:shadow-md dark:shadow-none transition-shadow duration-300 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
