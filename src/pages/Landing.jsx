import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield, Wallet, FileCheck2, History, Search, Lock, Sparkles,
  ChevronDown, Box, Server, Database, Layers, Cpu, Map,
} from 'lucide-react';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Card from '../components/Card';
import { testimonials, faqs, stats } from '../data/dummyData';
import { useWallet } from '../context/WalletContext';

const features = [
  { icon: Map, title: 'Bhoolekh & BhuNaksha GIS', desc: 'On-the-go discovery: Enter any location or use GPS to reveal all surrounding field plots, Khasra numbers, and digital Khatauni records.' },
  { icon: Lock, title: 'Tamper-Proof Records', desc: 'Once recorded on-chain, land data cannot be altered or deleted by any single party.' },
  { icon: Shield, title: 'Government Verified', desc: 'District authorities review and approve every registration before it is finalised.' },
  { icon: History, title: 'Full Ownership History', desc: 'Trace every past owner of a parcel with timestamped, verifiable transactions.' },
  { icon: FileCheck2, title: 'IPFS Document Storage', desc: 'Sale deeds and ID proofs are stored off-chain; only their hash lives on the ledger.' },
  { icon: Search, title: 'Instant Verification', desc: 'Look up any land record by ID, owner, or survey number in seconds.' },
  { icon: Wallet, title: 'Wallet-Based Identity', desc: 'MetaMask signatures confirm every transfer came from the rightful owner.' },
];

const steps = [
  { title: 'Connect your wallet', desc: 'Sign in securely with MetaMask — no passwords to leak or forget.' },
  { title: 'Submit land details', desc: 'Fill in survey number, location and area, then upload supporting documents to IPFS.' },
  { title: 'Authority verification', desc: 'A district registrar reviews your documents and approves the request.' },
  { title: 'Recorded on-chain', desc: 'A unique Land ID is minted and the record becomes part of the permanent ledger.' },
];

const stack = [
  { icon: Layers, name: 'React.js', role: 'Frontend' },
  { icon: Server, name: 'Node.js', role: 'Backend API' },
  { icon: Box, name: 'Solidity', role: 'Smart Contracts' },
  { icon: Cpu, name: 'Ethereum', role: 'Blockchain Layer' },
  { icon: Database, name: 'IPFS', role: 'Document Storage' },
];

function BlockchainHero() {
  return (
    <div className="relative h-64 md:h-full flex items-center justify-center border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/60 dark:bg-slate-900/40">
      <div className="flex items-center gap-3 md:gap-4">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="flex items-center gap-3 md:gap-4"
          >
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-16 h-16 md:w-20 md:h-20 rounded-lg flex flex-col items-center justify-center shadow-sm">
              <Box size={20} className="text-primary" />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">#{19834 + i}</span>
            </div>
            {i < 3 && <div className="w-6 md:w-10 h-px bg-slate-300 dark:bg-slate-700" />}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Landing() {
  const { connect, connecting, address } = useWallet();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-5 pt-16 pb-20 grid lg:grid-cols-2 gap-10 items-center w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-full">
            <Sparkles size={13} /> Built on Ethereum · B.Tech Final Year Project
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-5 leading-tight">
            Land ownership, <span className="text-primary">secured on-chain</span>.
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg max-w-lg">
            A decentralized registry that replaces paper trails and manual verification with tamper-proof blockchain records — transparent, fast, and fraud-resistant.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link to="/bhulekh">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 shadow-lg shadow-emerald-600/20 font-bold">
                <Map size={16} /> भूलेख नक्शा (Bhoolekh)
              </Button>
            </Link>
            <Link to="/search">
              <Button size="lg" variant="outline" className="flex items-center gap-2 font-bold">
                <Search size={16} /> जमीन खोजें (Search)
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-bold">
                लॉगिन (Login)
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg" className="font-bold">
                पंजीकरण (Register)
              </Button>
            </Link>
          </div>
          <div className="flex gap-8 mt-10">
            {[['Registered Lands', stats.registeredLands], ['Verified Authorities', stats.totalAuthorities], ['On-chain Transactions', stats.totalTransactions]].map(([label, val]) => (
              <div key={label}>
                <p className="font-display font-bold text-2xl">{val}+</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <BlockchainHero />
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-5 py-16 w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="font-display text-3xl font-bold">Built for trust, designed for speed</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3">Everything a modern land registry needs, backed by a permanent and public ledger.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <Card key={f.title} className="p-6">
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-primary mb-4">
                <f.icon size={20} />
              </div>
              <h3 className="font-semibold mb-1.5">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 dark:bg-slate-900/40 py-16">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-display text-3xl font-bold">How it works</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-3">From submission to a permanent record — four steps, fully tracked.</p>
          </div>
          <div className="chain-track grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative z-10 glass rounded-2xl p-6"
              >
                <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-display font-semibold text-sm mb-4">{i + 1}</div>
                <h3 className="font-semibold mb-1.5">{s.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-7xl mx-auto px-5 py-16 w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="font-display text-3xl font-bold">Technology stack</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3">A hybrid architecture combining decentralized and traditional infrastructure.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
          {stack.map((t) => (
            <Card key={t.name} className="p-5 text-center" hover>
              <t.icon size={24} className="mx-auto text-primary mb-3" />
              <p className="font-semibold text-sm">{t.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.role}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 dark:bg-slate-900/40 py-16">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-display text-3xl font-bold">Trusted by early users</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <Card key={t.name} className="p-6">
                <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 mt-5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-xs font-semibold">
                    {t.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-5 py-16 w-full">
        <h2 className="font-display text-3xl font-bold text-center mb-10">Frequently asked questions</h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <Card key={i} className="p-0 overflow-hidden" hover={false}>
              <button className="w-full flex items-center justify-between p-5 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span className="font-medium text-sm">{f.q}</span>
                <ChevronDown size={18} className={`transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-5 pb-5 text-sm text-slate-500 dark:text-slate-400">
                  {f.a}
                </motion.p>
              )}
            </Card>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
