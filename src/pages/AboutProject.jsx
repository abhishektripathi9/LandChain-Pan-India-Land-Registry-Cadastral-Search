import { Shield, Target, Layers, Workflow, ThumbsUp, Box, Server, Database, Cpu } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';

const objectives = [
  'Eliminate fraudulent land transactions through immutable records',
  'Ensure transparent and traceable ownership history',
  'Reduce manual intervention and administrative corruption',
  'Speed up the verification and transfer process',
];

const stack = [
  { icon: Layers, name: 'React.js', role: 'Frontend framework' },
  { icon: Server, name: 'Node.js + Express', role: 'Backend API' },
  { icon: Box, name: 'Solidity', role: 'Smart contract language' },
  { icon: Cpu, name: 'Ethereum', role: 'Blockchain network' },
  { icon: Database, name: 'IPFS', role: 'Decentralized document storage' },
];

const workflow = [
  'Owner submits land details and documents',
  'District authority reviews and verifies the submission',
  'Smart contract records the data and mints a unique Land ID',
  'Ownership history becomes publicly traceable on-chain',
];

const advantages = [
  'Tamper-proof audit trail for every land parcel',
  'Faster verification without physical office visits',
  'Reduced legal disputes from unclear ownership',
  'Lower storage cost using hybrid on-chain/off-chain design',
];

export default function AboutProject() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-5xl mx-auto px-5 py-16 w-full">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-full mb-4">
            <Shield size={13} /> Final Year B.Tech Project
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold">Advanced Land Registry DApp</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto">
            A blockchain-based decentralized application that replaces vulnerable, paper-based land registries with a secure, transparent and automated ledger built on Ethereum smart contracts.
          </p>
        </div>

        <Card className="p-6 mb-8">
          <div className="flex items-center gap-2 mb-4"><Target size={18} className="text-primary" /><h2 className="font-display font-semibold text-lg">Objectives</h2></div>
          <ul className="grid sm:grid-cols-2 gap-3">
            {objectives.map((o) => (
              <li key={o} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> {o}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 mb-8">
          <div className="flex items-center gap-2 mb-4"><Layers size={18} className="text-secondary" /><h2 className="font-display font-semibold text-lg">Technology Stack</h2></div>
          <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {stack.map((t) => (
              <div key={t.name} className="text-center p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <t.icon size={22} className="mx-auto text-primary mb-2" />
                <p className="font-medium text-sm">{t.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.role}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 mb-8">
          <div className="flex items-center gap-2 mb-4"><Box size={18} className="text-primary" /><h2 className="font-display font-semibold text-lg">Architecture</h2></div>
          <div className="grid sm:grid-cols-4 gap-3 chain-track">
            {['Presentation Layer (React)', 'Application Layer (Node.js API)', 'Blockchain Layer (Ethereum + Solidity)', 'Storage Layer (IPFS)'].map((l, i) => (
              <div key={l} className="relative z-10 glass rounded-xl p-4 text-center text-sm font-medium">{l}</div>
            ))}
          </div>
        </Card>

        <Card className="p-6 mb-8">
          <div className="flex items-center gap-2 mb-4"><Workflow size={18} className="text-secondary" /><h2 className="font-display font-semibold text-lg">Workflow</h2></div>
          <ol className="space-y-3">
            {workflow.map((w, i) => (
              <li key={w} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center shrink-0 font-medium">{i + 1}</span>
                {w}
              </li>
            ))}
          </ol>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4"><ThumbsUp size={18} className="text-success" /><h2 className="font-display font-semibold text-lg">Advantages</h2></div>
          <ul className="grid sm:grid-cols-2 gap-3">
            {advantages.map((a) => (
              <li key={a} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" /> {a}
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
