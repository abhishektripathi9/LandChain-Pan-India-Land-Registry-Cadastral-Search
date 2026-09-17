import { useState } from 'react';
import { CheckCircle2, XCircle, ArrowLeftRight, Link2 } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { userNav } from '../data/navConfig';
import Breadcrumb from '../components/Breadcrumb';
import Card from '../components/Card';
import { notifications as initialNotifications } from '../data/dummyData';

const icons = { approval: CheckCircle2, rejection: XCircle, transfer: ArrowLeftRight, blockchain: Link2 };
const tones = { approval: 'text-success bg-green-50 dark:bg-green-500/10', rejection: 'text-danger bg-red-50 dark:bg-red-500/10', transfer: 'text-secondary bg-indigo-50 dark:bg-indigo-500/10', blockchain: 'text-primary bg-blue-50 dark:bg-blue-500/10' };

export default function Notifications() {
  const [items, setItems] = useState(initialNotifications);
  const unreadCount = items.filter((n) => n.unread).length;

  return (
    <DashboardLayout items={userNav} title="Notifications">
      <Breadcrumb items={[{ label: 'Notifications' }]} />

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-slate-500 dark:text-slate-400">{unreadCount} unread notification{unreadCount !== 1 && 's'}</p>
        <button onClick={() => setItems((its) => its.map((n) => ({ ...n, unread: false })))} className="text-sm text-primary font-medium">Mark all as read</button>
      </div>

      <div className="space-y-3">
        {items.map((n) => {
          const Icon = icons[n.type];
          return (
            <Card key={n.id} className="p-4 flex items-start gap-4" hover={false}>
              <div className={`p-2.5 rounded-xl shrink-0 ${tones[n.type]}`}><Icon size={18} /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{n.title}</p>
                  {n.unread && <span className="w-2 h-2 rounded-full bg-danger shrink-0" />}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                <p className="text-xs text-slate-400 mt-1.5">{n.time}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
