import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-dark shadow-md shadow-blue-600/20',
  secondary: 'bg-secondary text-white hover:opacity-90 shadow-md shadow-indigo-600/20',
  outline: 'border border-slate-300 dark:border-slate-700 text-ink dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800',
  ghost: 'text-ink dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800',
  success: 'bg-success text-white hover:opacity-90',
  danger: 'bg-danger text-white hover:opacity-90',
};

export default function Button({ children, variant = 'primary', size = 'md', icon: Icon, className = '', ...props }) {
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3 text-base' };
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={17} />}
      {children}
    </motion.button>
  );
}
