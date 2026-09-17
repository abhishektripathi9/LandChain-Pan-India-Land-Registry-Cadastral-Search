import { motion } from 'framer-motion';
import { UserRound, Link2 } from 'lucide-react';

export default function Timeline({ items }) {
  return (
    <div className="relative pl-8">
      <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary via-secondary to-slate-300 dark:to-slate-700" />
      <div className="space-y-6">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="relative"
          >
            <span className="absolute -left-8 top-0 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-primary flex items-center justify-center">
              <UserRound size={14} className="text-primary" />
            </span>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">{item.owner}</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-primary dark:bg-blue-500/10">{item.role}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.date}</p>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-2"><Link2 size={12} /> {item.txHash}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
