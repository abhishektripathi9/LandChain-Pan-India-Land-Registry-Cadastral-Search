import Card from './Card';

const tones = {
  primary: 'text-primary bg-blue-50 dark:bg-blue-500/10',
  success: 'text-success bg-green-50 dark:bg-green-500/10',
  warning: 'text-warning bg-amber-50 dark:bg-amber-500/10',
  secondary: 'text-secondary bg-indigo-50 dark:bg-indigo-500/10',
};

export default function StatCard({ label, value, icon: Icon, tone = 'primary', trend }) {
  return (
    <Card className="p-5 flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-display font-bold mt-1">{value}</p>
        {trend && <p className="text-xs text-success mt-2">{trend}</p>}
      </div>
      <div className={`p-3 rounded-xl ${tones[tone]}`}>
        <Icon size={20} />
      </div>
    </Card>
  );
}
