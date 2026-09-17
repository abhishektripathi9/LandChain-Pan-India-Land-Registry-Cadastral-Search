import { useState, useEffect } from 'react';
import { Users, LandPlot, Clock, CheckCircle2, Activity, Landmark, ShieldAlert, Check } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import DashboardLayout from '../layouts/DashboardLayout';
import { adminNav } from '../data/navConfig';
import Breadcrumb from '../components/Breadcrumb';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import { chartData } from '../data/dummyData';
import { getStoredLands, getStoredTransactions } from '../services/web3Service';

const COLORS = ['#2563EB', '#4F46E5', '#16A34A', '#F59E0B'];

const initialUsers = [
  { name: 'Ramesh Kumar', role: 'Land Owner', status: 'Active', address: '0x71C...8bA2' },
  { name: 'Ayesha Siddiqui', role: 'Land Owner', status: 'Active', address: '0x992...3F10' },
  { name: 'Dr. S. Rangarajan', role: 'District Authority', status: 'Active', address: '0x32A...E47C' },
  { name: 'Vikram Singh', role: 'Buyer', status: 'Suspended', address: '0x55B...91DF' },
];

export default function AdminDashboard() {
  const [landsList, setLandsList] = useState([]);
  const [txList, setTxList] = useState([]);
  const [users, setUsers] = useState(initialUsers);

  useEffect(() => {
    setLandsList(getStoredLands());
    setTxList(getStoredTransactions());
  }, []);

  const totalRegistered = landsList.length;
  const pendingCount = landsList.filter((l) => l.status === 'Pending').length;
  const approvedCount = landsList.filter((l) => l.status === 'Approved').length;

  const toggleUserStatus = (idx) => {
    setUsers((prev) =>
      prev.map((u, i) =>
        i === idx ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u
      )
    );
  };

  return (
    <DashboardLayout items={adminNav} title="System Administration">
      <Breadcrumb items={[{ label: 'Admin Dashboard' }]} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total Users" value={users.length + 120} icon={Users} tone="primary" />
        <StatCard label="Registered Lands" value={totalRegistered} icon={LandPlot} tone="secondary" />
        <StatCard label="Pending Requests" value={pendingCount} icon={Clock} tone="warning" />
        <StatCard label="Verified Lands" value={approvedCount} icon={CheckCircle2} tone="success" />
        <StatCard label="Transactions" value={txList.length} icon={Activity} tone="primary" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-display font-semibold mb-4 text-sm">Registrations &amp; Transfers Over Time</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData.monthly}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="registrations" stroke="#2563EB" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="transfers" stroke="#4F46E5" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-display font-semibold mb-4 text-sm">Land Classifications</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={chartData.landTypes} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {chartData.landTypes.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {chartData.landTypes.map((d, i) => (
              <span key={d.name} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} /> {d.name}
              </span>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-primary" />
              <h3 className="font-display font-semibold text-sm">User &amp; Authority Access Control</h3>
            </div>
            <span className="text-[11px] text-slate-400">RBAC Enabled</span>
          </div>
          <div className="space-y-1">
            {users.map((u, idx) => (
              <div key={u.name} className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0 text-xs">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{u.name}</p>
                  <p className="text-slate-400 font-mono text-[11px]">{u.role} · {u.address}</p>
                </div>
                <button
                  onClick={() => toggleUserStatus(idx)}
                  className={`text-[11px] px-2.5 py-1 rounded-full font-semibold transition-colors ${
                    u.status === 'Active'
                      ? 'bg-green-50 text-success hover:bg-red-50 hover:text-danger dark:bg-green-500/10'
                      : 'bg-red-50 text-danger hover:bg-green-50 hover:text-success dark:bg-red-500/10'
                  }`}
                >
                  {u.status}
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Landmark size={16} className="text-secondary" />
            <h3 className="font-display font-semibold text-sm">Live Blockchain Ledger Activity</h3>
          </div>
          <div className="space-y-1">
            {txList.slice(0, 4).map((t) => (
              <div key={t.hash} className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0 text-xs">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{t.type} · <span className="text-primary font-mono">{t.landId}</span></p>
                  <p className="text-slate-400 font-mono text-[11px]">{t.hash}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 dark:text-slate-400 block">{t.timestamp}</span>
                  <span className="text-[10px] text-emerald-600 font-mono">{t.gas}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
