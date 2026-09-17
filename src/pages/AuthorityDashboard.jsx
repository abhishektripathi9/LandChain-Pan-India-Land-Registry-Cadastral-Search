import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, FileText, Search as SearchIcon, ExternalLink, ShieldCheck, Clock, Check, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import DashboardLayout from '../layouts/DashboardLayout';
import { authorityNav } from '../data/navConfig';
import Breadcrumb from '../components/Breadcrumb';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { chartData } from '../data/dummyData';
import { useWallet } from '../context/WalletContext';
import { getStoredLands, verifyLandOnChain } from '../services/web3Service';
import { getIPFSGatewayUrl } from '../services/ipfsService';

export default function AuthorityDashboard() {
  const { address } = useWallet();
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [toast, setToast] = useState(null);
  const [landsList, setLandsList] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    setLandsList(getStoredLands());
  }, []);

  const pendingCount = landsList.filter((l) => l.status === 'Pending').length;
  const approvedCount = landsList.filter((l) => l.status === 'Approved').length;
  const rejectedCount = landsList.filter((l) => l.status === 'Rejected').length;

  const filtered = landsList.filter((l) => {
    const matchesFilter = filter === 'All' || l.status === filter;
    const matchesQuery =
      l.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.surveyNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.owner?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const handleVerify = async (landId, status) => {
    setActionLoading(true);
    try {
      await verifyLandOnChain(landId, status, rejectionReason, address);
      setLandsList(getStoredLands());
      setSelected(null);
      setRejectionReason('');
      setToast({
        type: status === 'Approved' ? 'success' : 'error',
        message: `Land ${landId} marked as ${status} on smart contract!`,
      });
    } catch (err) {
      console.error('Verification error', err);
      setToast({ type: 'error', message: 'Failed to complete verification.' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout items={authorityNav} title="District Authority Portal">
      <Breadcrumb items={[{ label: 'Authority Verification' }]} />

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Pending Verifications" value={pendingCount} icon={Clock} tone="warning" />
        <StatCard label="Approved Parcels" value={approvedCount} icon={CheckCircle2} tone="success" />
        <StatCard label="Rejected Claims" value={rejectedCount} icon={XCircle} tone="primary" />
      </div>

      <Card className="p-5 mb-6">
        <h3 className="font-display font-semibold mb-4 text-sm">Monthly Registrations vs Title Transfers</h3>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={chartData.monthly}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="registrations" fill="#2563EB" radius={[6, 6, 0, 0]} name="New Registrations" />
            <Bar dataKey="transfers" fill="#10B981" radius={[6, 6, 0, 0]} name="Transfers" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="font-display font-semibold text-base">Land Verification Queue</h3>
            <p className="text-xs text-slate-500">Inspect deed proofs and sign approval on Ethereum</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <SearchIcon size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search survey / owner…"
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-primary"
              />
            </div>
            <Dropdown label="Status" options={['All', 'Pending', 'Approved', 'Rejected']} value={filter} onChange={setFilter} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 text-xs">
                <th className="pb-3 font-semibold">Land ID</th>
                <th className="pb-3 font-semibold">Survey No</th>
                <th className="pb-3 font-semibold">Owner Name</th>
                <th className="pb-3 font-semibold">Location</th>
                <th className="pb-3 font-semibold">Value</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-slate-50 dark:border-slate-800/60 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <td className="py-3 font-medium font-mono text-primary text-xs">{r.id}</td>
                  <td className="py-3 text-xs">{r.surveyNo}</td>
                  <td className="py-3 text-slate-700 dark:text-slate-300 text-xs">{r.owner}</td>
                  <td className="py-3 text-slate-500 dark:text-slate-400 text-xs">{r.village || r.location}</td>
                  <td className="py-3 font-semibold text-xs">{r.value}</td>
                  <td className="py-3"><StatusBadge status={r.status} /></td>
                  <td className="py-3">
                    <Button size="sm" variant={r.status === 'Pending' ? 'primary' : 'outline'} onClick={() => setSelected(r)}>
                      {r.status === 'Pending' ? 'Review & Sign' : 'View Details'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Inspection Modal */}
      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected ? `Inspect Land: ${selected.id}` : ''}>
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-slate-400 block mb-0.5">Survey Number</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{selected.surveyNo}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Current Owner</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{selected.owner}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Location</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{selected.location || `${selected.village}, ${selected.district}`}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Area &amp; Type</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{selected.area} · {selected.type}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Market Valuation</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{selected.value}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Owner Wallet</span>
                <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
                  {selected.ownerAddress ? `${selected.ownerAddress.slice(0, 8)}...${selected.ownerAddress.slice(-6)}` : '0x71C...8bA2'}
                </span>
              </div>
            </div>

            {/* IPFS Document Viewer Link */}
            <div className="p-3 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-primary" />
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Deed Document &amp; Map</p>
                  <p className="text-[11px] font-mono text-slate-500">CID: {selected.ipfsDocCID ? selected.ipfsDocCID.slice(0, 16) + '...' : 'Available on IPFS'}</p>
                </div>
              </div>
              <a
                href={getIPFSGatewayUrl(selected.ipfsDocCID)}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors flex items-center gap-1 text-[11px]"
              >
                Inspect IPFS <ExternalLink size={11} />
              </a>
            </div>

            {selected.status === 'Pending' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Inspection Remarks (Required for rejection):
                  </label>
                  <input
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Survey coordinates match revenue department maps."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:border-primary"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="danger"
                    disabled={actionLoading}
                    className="flex-1"
                    onClick={() => handleVerify(selected.id, 'Rejected')}
                  >
                    <XCircle size={15} className="mr-1" /> Reject Deed
                  </Button>
                  <Button
                    variant="success"
                    disabled={actionLoading}
                    className="flex-1"
                    onClick={() => handleVerify(selected.id, 'Approved')}
                  >
                    <CheckCircle2 size={15} className="mr-1" /> Approve &amp; Sign On-Chain
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Toast toast={toast} />
    </DashboardLayout>
  );
}
