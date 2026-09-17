import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

const icons = { success: CheckCircle2, error: XCircle, info: Info };
const colors = { success: 'text-success', error: 'text-danger', info: 'text-primary' };

export default function Toast({ toast }) {
  const Icon = icons[toast?.type] || Info;
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="glass shadow-xl rounded-xl px-4 py-3 flex items-center gap-2.5 min-w-[260px]"
          >
            <Icon size={18} className={colors[toast.type]} />
            <p className="text-sm font-medium">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
