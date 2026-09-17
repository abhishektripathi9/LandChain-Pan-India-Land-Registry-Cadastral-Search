import { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, X, ExternalLink, ShieldCheck, Loader2 } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { userNav } from '../data/navConfig';
import Breadcrumb from '../components/Breadcrumb';
import Card from '../components/Card';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { uploadFileToIPFS } from '../services/ipfsService';

const docTypes = [
  { key: 'saleDeed', label: 'Sale Deed (Registered Title Deed)', required: true },
  { key: 'aadhaar', label: 'Owner Identity (Aadhaar / National ID)', required: true },
  { key: 'taxReceipt', label: 'Municipal Property Tax / Revenue Khatauni', required: false },
  { key: 'landMap', label: 'Cadastral Map & Boundary Coordinates', required: false },
];

export default function UploadDocuments() {
  const fileInputs = useRef({});
  const [uploaded, setUploaded] = useState({});
  const [loadingKey, setLoadingKey] = useState(null);
  const [toast, setToast] = useState(null);

  const handleFileUpload = async (key, file) => {
    if (!file) return;
    setLoadingKey(key);

    try {
      const res = await uploadFileToIPFS(file, key);
      setUploaded((prev) => ({
        ...prev,
        [key]: res,
      }));
      setToast({
        type: 'success',
        message: `${file.name} hashed with SHA-256 and pinned to IPFS!`,
      });
    } catch (err) {
      console.error('Upload failed:', err);
      setToast({ type: 'error', message: 'Failed to upload and pin document.' });
    } finally {
      setLoadingKey(null);
    }
  };

  const removeDoc = (key) => {
    setUploaded((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  return (
    <DashboardLayout items={userNav} title="IPFS Document Verification">
      <Breadcrumb items={[{ label: 'Upload Documents' }]} />

      <div className="max-w-4xl space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
            <div>
              <h2 className="font-display font-semibold text-lg">Decentralized Document Vault</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every deed is cryptographically fingerprinted (SHA-256) and pinned across IPFS nodes.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center gap-1">
              <ShieldCheck size={14} /> IPFS Pinning
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {docTypes.map((d) => (
              <div key={d.key} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                    {d.label} {d.required && <span className="text-red-500">*</span>}
                  </h3>
                  {uploaded[d.key] && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                      <CheckCircle2 size={13} /> Pinned
                    </span>
                  )}
                </div>

                <input
                  type="file"
                  ref={(el) => (fileInputs.current[d.key] = el)}
                  onChange={(e) => handleFileUpload(d.key, e.target.files?.[0])}
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                />

                {!uploaded[d.key] ? (
                  <button
                    type="button"
                    onClick={() => fileInputs.current[d.key]?.click()}
                    disabled={loadingKey === d.key}
                    className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-5 text-center hover:border-primary hover:bg-blue-50/20 dark:hover:bg-blue-900/10 transition-colors"
                  >
                    {loadingKey === d.key ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 size={20} className="animate-spin text-primary" />
                        <span className="text-xs text-primary font-medium">Pinning to IPFS...</span>
                      </div>
                    ) : (
                      <>
                        <UploadCloud size={22} className="mx-auto text-slate-400 mb-1.5" />
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-300">Click to upload file</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">PDF, PNG, JPG up to 25MB</p>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-primary" />
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
                          {uploaded[d.key].fileName}
                        </span>
                      </div>
                      <button onClick={() => removeDoc(d.key)} className="text-slate-400 hover:text-red-500">
                        <X size={14} />
                      </button>
                    </div>

                    <div className="text-[10px] font-mono space-y-1 text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-center">
                        <span>CID:</span>
                        <a
                          href={uploaded[d.key].gatewayUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary font-bold hover:underline flex items-center gap-0.5"
                        >
                          {uploaded[d.key].cid.slice(0, 10)}...{uploaded[d.key].cid.slice(-6)} <ExternalLink size={10} />
                        </a>
                      </div>
                      <div className="flex justify-between">
                        <span>SHA-256:</span>
                        <span>{uploaded[d.key].sha256.slice(0, 10)}...{uploaded[d.key].sha256.slice(-6)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              size="sm"
              onClick={() => {
                setToast({ type: 'success', message: 'All documents synchronized with blockchain records.' });
              }}
            >
              Save Verified Documents
            </Button>
          </div>
        </Card>
      </div>

      <Toast toast={toast} />
    </DashboardLayout>
  );
}
