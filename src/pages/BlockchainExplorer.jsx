import { useState, useEffect } from 'react';
import { Search, ExternalLink, Activity, Copy, Check, ShieldCheck } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { userNav } from '../data/navConfig';
import Breadcrumb from '../components/Breadcrumb';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { getStoredTransactions } from '../services/web3Service';
import { SUPPORTED_NETWORKS, DEFAULT_CHAIN_ID } from '../contracts/contractConfig';
import { useWallet } from '../context/WalletContext';

export default function BlockchainExplorer() {
  const { chainId } = useWallet();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [txList, setTxList] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTxList(getStoredTransactions());
  }, []);

  const explorerBase = SUPPORTED_NETWORKS[chainId]?.blockExplorer || SUPPORTED_NETWORKS[DEFAULT_CHAIN_ID].blockExplorer;

  const filtered = txList.filter(
    (t) =>
      t.hash?.toLowerCase().includes(query.toLowerCase()) ||
      t.fullHash?.toLowerCase().includes(query.toLowerCase()) ||
      t.landId?.toLowerCase().includes(query.toLowerCase()) ||
      t.type?.toLowerCase().includes(query.toLowerCase())
  );

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout items={userNav} title="Blockchain Ledger Explorer">
      <Breadcrumb items={[{ label: 'Blockchain Explorer' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-lg">
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by transaction hash, land ID or type…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-primary shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Live Ledger Sync · Blocks mined every ~12s</span>
        </div>
      </div>

      <Card className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 text-xs">
                <th className="pb-3 font-semibold">Tx Hash</th>
                <th className="pb-3 font-semibold">Block</th>
                <th className="pb-3 font-semibold">Operation Type</th>
                <th className="pb-3 font-semibold">Target Parcel</th>
                <th className="pb-3 font-semibold">Gas Fee</th>
                <th className="pb-3 font-semibold">Timestamp</th>
                <th className="pb-3 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.hash} className="border-b border-slate-50 dark:border-slate-800/60 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 text-xs">
                  <td className="py-3 font-mono text-primary font-medium">{t.hash}</td>
                  <td className="py-3 font-mono">{t.block}</td>
                  <td className="py-3 font-medium">{t.type}</td>
                  <td className="py-3 font-mono font-semibold text-slate-700 dark:text-slate-300">{t.landId}</td>
                  <td className="py-3 text-slate-500">{t.gas}</td>
                  <td className="py-3 text-slate-500">{t.timestamp}</td>
                  <td className="py-3">
                    <button
                      onClick={() => setSelected(t)}
                      className="flex items-center gap-1 text-primary hover:underline font-semibold"
                    >
                      View <ExternalLink size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Transaction Details Modal */}
      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title="On-Chain Transaction Details">
        {selected && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div>
                <span className="text-slate-400 block mb-0.5">Full Transaction Hash</span>
                <div className="flex items-center justify-between font-mono bg-white dark:bg-slate-950 p-2 rounded border border-slate-100 dark:border-slate-800 break-all">
                  <span>{selected.fullHash || selected.hash}</span>
                  <button onClick={() => copyToClipboard(selected.fullHash || selected.hash)} className="ml-2 text-slate-400 hover:text-primary">
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-slate-400 block">Block Height</span>
                  <span className="font-semibold font-mono">{selected.block}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Operation</span>
                  <span className="font-semibold">{selected.type}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Target Land ID</span>
                  <span className="font-semibold font-mono text-primary">{selected.landId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Gas Fee</span>
                  <span className="font-mono text-slate-600 dark:text-slate-300">{selected.gas}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">From Address</span>
                  <span className="font-mono text-slate-600 dark:text-slate-300">{selected.from || '0x71C...8bA2'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Confirmation Time</span>
                  <span className="text-slate-600 dark:text-slate-300">{selected.timestamp}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <a
                href={`${explorerBase}/tx/${selected.fullHash || selected.hash}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-primary text-white font-medium text-xs flex items-center gap-1.5 hover:bg-primary-dark transition-colors"
              >
                View on Etherscan <ExternalLink size={13} />
              </a>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
