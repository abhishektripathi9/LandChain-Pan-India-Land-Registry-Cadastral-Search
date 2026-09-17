import { useState } from 'react';
import { CheckCircle2, Clock, FileSearch, ShieldCheck } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { userNav } from '../data/navConfig';
import Breadcrumb from '../components/Breadcrumb';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import { verificationRequests } from '../data/dummyData';

const stages = [
  { label: 'Submitted', icon: FileSearch },
  { label: 'Document Review', icon: Clock },
  { label: 'Authority Approval', icon: ShieldCheck },
  { label: 'On-Chain', icon: CheckCircle2 },
];

export default function VerificationStatus() {
  const [page, setPage] = useState(1);

  return (
    <DashboardLayout items={userNav} title="Verification Status">
      <Breadcrumb items={[{ label: 'Verification Status' }]} />

      <Card className="p-6 mb-6">
        <h3 className="font-display font-semibold mb-6">Current progress · LND-2026-0088</h3>
        <div className="flex items-center">
          {stages.map((s, i) => (
            <div key={s.label} className="flex-1 flex items-center">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i <= 1 ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                  <s.icon size={16} />
                </div>
                <span className="text-xs font-medium max-w-[80px]">{s.label}</span>
              </div>
              {i < stages.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < 1 ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`} />}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-display font-semibold mb-4">All requests</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="pb-3 font-medium">Request ID</th>
                <th className="pb-3 font-medium">Land ID</th>
                <th className="pb-3 font-medium">Owner</th>
                <th className="pb-3 font-medium">Submitted</th>
                <th className="pb-3 font-medium">Documents</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {verificationRequests.map((r) => (
                <tr key={r.id} className="border-b border-slate-50 dark:border-slate-800/60 last:border-0">
                  <td className="py-3 font-medium">{r.id}</td>
                  <td className="py-3">{r.landId}</td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">{r.owner}</td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">{r.submitted}</td>
                  <td className="py-3">{r.documents} files</td>
                  <td className="py-3"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={3} onChange={setPage} />
      </Card>
    </DashboardLayout>
  );
}
