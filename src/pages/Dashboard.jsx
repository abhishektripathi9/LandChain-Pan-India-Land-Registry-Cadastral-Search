import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LandPlot, Clock, CheckCircle2, Activity, FilePlus2, UploadCloud, ArrowLeftRight, Search, Map, Sparkles, History, ShieldCheck, ArrowRight } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { userNav } from '../data/navConfig';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { getStoredLands, getStoredTransactions } from '../services/web3Service';
import { useWallet } from '../context/WalletContext';

const quickActions = [
  { to: '/bhulekh', label: 'Bhoolekh (भूलेख नक्शा)', icon: Map },
  { to: '/search', label: 'Search Land (खोजें)', icon: Search },
  { to: '/register-land', label: 'Register Land (नया)', icon: FilePlus2 },
  { to: '/transfer-ownership', label: 'Transfer Title (हस्तांतरण)', icon: ArrowLeftRight },
  { to: '/land-history', label: 'Title History (वंशावली)', icon: History },
  { to: '/verification-status', label: 'Verification (सत्यापन)', icon: ShieldCheck },
];

export default function Dashboard() {
  const { address } = useWallet();
  const [landsList, setLandsList] = useState([]);
  const [txList, setTxList] = useState([]);

  useEffect(() => {
    setLandsList(getStoredLands());
    setTxList(getStoredTransactions());
  }, []);

  const totalRegistered = landsList.length;
  const pendingCount = landsList.filter((l) => l.status === 'Pending').length;
  const approvedCount = landsList.filter((l) => l.status === 'Approved').length;
  const totalTxCount = txList.length;

  return (
    <DashboardLayout items={userNav} title="Citizen Land Portal">
      <Card glass className="p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold">
            Welcome back{address ? `, ${address.slice(0, 6)}...${address.slice(-4)}` : ''} 👋
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Your land ownership, property deeds, and smart contract registry state.
          </p>
        </div>
        <Link to="/register-land">
          <Button icon={FilePlus2}>Register New Land</Button>
        </Link>
      </Card>

      {/* On-The-Go Traveler Discovery Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-blue-200 text-xs font-semibold mb-1">
            <Sparkles size={13} className="text-blue-400" />
            <span>सड़क या यात्रा के दौरान खेत खोजें (On-The-Go Land Finder)</span>
          </div>
          <h3 className="font-display font-bold text-base text-white">
            कही जा रहे हैं और कोई जमीन / खेत पसंद आ गया?
          </h3>
          <p className="text-xs text-blue-200/80 mt-0.5 max-w-2xl">
            लाइव जीपीएस या लोकेशन दर्ज करें — पूरे खसरा नंबर, मेड़ सीमाएँ, खातेदार का नाम, रकबा (बीघा/एकड़) और ब्लॉकचेन सत्यापन सीधे सैटेलाइट मैप पर देखें!
          </p>
        </div>
        <Link to="/bhulekh" className="shrink-0">
          <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md">
            <Map size={14} className="mr-1.5" /> ओपन करें भूलेख नक्शा (GPS)
          </Button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Registered Lands" value={totalRegistered} icon={LandPlot} tone="primary" trend="+Live On-Chain" />
        <StatCard label="Pending Verification" value={pendingCount} icon={Clock} tone="warning" />
        <StatCard label="Approved Titles" value={approvedCount} icon={CheckCircle2} tone="success" trend="Verified" />
        <StatCard label="Blockchain Transactions" value={totalTxCount} icon={Activity} tone="secondary" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">Recent Ledger Activity</h3>
            <Link to="/explorer" className="text-xs text-primary font-semibold hover:underline">View all</Link>
          </div>
          <div className="space-y-1">
            {txList.slice(0, 4).map((t) => (
              <div key={t.hash} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{t.type} · <span className="text-primary font-mono">{t.landId}</span></p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{t.hash}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">{t.timestamp}</span>
                  <span className="text-[10px] text-emerald-600 font-mono">{t.gas}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-display font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {quickActions.map((qa) => (
              <Link
                key={qa.label}
                to={qa.to}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-colors text-center"
              >
                <qa.icon size={18} className="text-primary" />
                <span className="text-[11px] font-medium leading-tight">{qa.label}</span>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold">My Land Holdings (पंजीकृत भूमि अभिलेख)</h3>
          <Link to="/search" className="text-xs text-primary font-semibold hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 text-xs">
                <th className="pb-3 font-medium">Land ID</th>
                <th className="pb-3 font-medium">Survey No</th>
                <th className="pb-3 font-medium">Location</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Valuation</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">त्वरित एक्शन</th>
              </tr>
            </thead>
            <tbody>
              {landsList.slice(0, 5).map((l) => (
                <tr key={l.id} className="border-b border-slate-50 dark:border-slate-800/60 last:border-0 text-xs">
                  <td className="py-3 font-mono font-semibold text-primary">{l.id}</td>
                  <td className="py-3 font-medium">#{l.surveyNo}</td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">{l.location || `${l.village}, ${l.district}`}</td>
                  <td className="py-3">{l.type}</td>
                  <td className="py-3 font-semibold">{l.value}</td>
                  <td className="py-3"><StatusBadge status={l.status} /></td>
                  <td className="py-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <Link to="/bhulekh" className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                        🗺️ नक्शा
                      </Link>
                      <Link to="/transfer-ownership" className="px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                        🤝 ट्रांसफर
                      </Link>
                      <Link to="/land-history" className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-[11px] font-medium text-blue-700 dark:text-blue-300">
                        📜 इतिहास
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
}
