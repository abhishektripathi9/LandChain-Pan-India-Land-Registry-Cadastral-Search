import { useState } from 'react';
import { Camera, Wallet, LandPlot, Activity } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { userNav } from '../data/navConfig';
import Breadcrumb from '../components/Breadcrumb';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { lands, transactions } from '../data/dummyData';

const tabs = ['Personal Details', 'Registered Lands', 'Transaction History', 'Settings'];

export default function Profile() {
  const [tab, setTab] = useState('Personal Details');

  return (
    <DashboardLayout items={userNav} title="Profile">
      <Breadcrumb items={[{ label: 'Profile' }]} />

      <Card glass className="p-6 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-2xl font-display font-semibold">RK</div>
          <button className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"><Camera size={13} /></button>
        </div>
        <div className="text-center sm:text-left">
          <h2 className="font-display text-xl font-bold">Ramesh Kumar</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 justify-center sm:justify-start mt-1">
            <Wallet size={13} /> 0x71C4a9F2b8E6d1A0c3F7b2D9e4A8c1F5B6d2E0Ba
          </p>
          <div className="flex gap-4 mt-3 justify-center sm:justify-start text-sm">
            <span className="flex items-center gap-1.5"><LandPlot size={14} className="text-primary" /> 6 lands</span>
            <span className="flex items-center gap-1.5"><Activity size={14} className="text-secondary" /> 12 transactions</span>
          </div>
        </div>
      </Card>

      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800 mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${tab === t ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-slate-400'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Personal Details' && (
        <Card className="p-6 max-w-xl">
          <div className="grid sm:grid-cols-2 gap-4">
            {[['Full Name', 'Ramesh Kumar'], ['Email', 'ramesh.kumar@example.com'], ['Phone', '+91 98765 43210'], ['State', 'Uttar Pradesh']].map(([label, val]) => (
              <div key={label}>
                <label className="text-sm font-medium mb-1.5 block">{label}</label>
                <input defaultValue={val} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-primary" />
              </div>
            ))}
          </div>
          <Button className="mt-5">Save Changes</Button>
        </Card>
      )}

      {tab === 'Registered Lands' && (
        <div className="grid sm:grid-cols-2 gap-4">
          {lands.map((l) => (
            <Card key={l.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{l.id}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{l.village}, {l.district}</p>
              </div>
              <StatusBadge status={l.status} />
            </Card>
          ))}
        </div>
      )}

      {tab === 'Transaction History' && (
        <Card className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-3 font-medium">Tx Hash</th><th className="pb-3 font-medium">Type</th><th className="pb-3 font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.hash} className="border-b border-slate-50 dark:border-slate-800/60 last:border-0">
                    <td className="py-3 font-mono text-primary">{t.hash}</td>
                    <td className="py-3">{t.type}</td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">{t.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'Settings' && (
        <Card className="p-6 max-w-xl space-y-4">
          {['Email notifications', 'SMS alerts', 'Two-factor authentication'].map((s) => (
            <div key={s} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
              <span className="text-sm">{s}</span>
              <button className="w-11 h-6 rounded-full bg-primary relative"><span className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-white" /></button>
            </div>
          ))}
        </Card>
      )}
    </DashboardLayout>
  );
}
