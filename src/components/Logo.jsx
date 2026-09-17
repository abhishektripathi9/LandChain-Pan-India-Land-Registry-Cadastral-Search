import { Landmark } from 'lucide-react';

export default function Logo({ size = 'md' }) {
  const dims = {
    sm: { box: 'w-8 h-8', icon: 14, text: 'text-base' },
    md: { box: 'w-9 h-9', icon: 17, text: 'text-lg' },
    lg: { box: 'w-14 h-14', icon: 26, text: 'text-2xl' },
  }[size];

  return (
    <span className="flex items-center gap-2 font-display font-bold">
      <span className={`relative ${dims.box} rounded-full bg-primary text-white flex items-center justify-center ring-2 ring-primary/25 ring-offset-2 ring-offset-white dark:ring-offset-slate-950`}>
        <Landmark size={dims.icon} strokeWidth={2.2} />
      </span>
      <span className={dims.text}>LandChain</span>
    </span>
  );
}
