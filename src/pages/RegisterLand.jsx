import { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, ShieldCheck, ExternalLink, Loader2, Hash, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { userNav } from '../data/navConfig';
import Breadcrumb from '../components/Breadcrumb';
import Card from '../components/Card';
import Button from '../components/Button';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import { useWallet } from '../context/WalletContext';
import { registerLandOnChain } from '../services/web3Service';
import { uploadFileToIPFS } from '../services/ipfsService';

export default function RegisterLand() {
  const { address } = useWallet();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    surveyNo: '',
    ownerName: 'Ramesh Kumar',
    location: 'Plot 42, Gomti Nagar Extension',
    village: 'Chinhat',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    area: '1.25 acres',
    landType: 'Residential',
    marketValue: '₹55,00,000',
    description: 'Clear title freehold residential parcel with approved municipal boundary coordinates.',
  });

  const [docFile, setDocFile] = useState(null);
  const [ipfsResult, setIpfsResult] = useState(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState(null);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocFile(file);
    setUploadingDoc(true);

    try {
      const res = await uploadFileToIPFS(file, 'SaleDeed');
      setIpfsResult(res);
      setToast({
        type: 'success',
        message: 'Document cryptographic hash calculated and pinned to IPFS.',
      });
    } catch (err) {
      console.error('IPFS upload failed:', err);
      setToast({ type: 'error', message: 'Failed to process document for IPFS.' });
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const result = await registerLandOnChain({
        ...formData,
        ipfsDocCID: ipfsResult?.cid || 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
        account: address,
      });

      setSuccessModal(result);
      setToast({
        type: 'success',
        message: `Land ${result.landId} registered on-chain with pending status!`,
      });
    } catch (err) {
      console.error('Registration error:', err);
      setToast({
        type: 'error',
        message: err.message || 'Error executing smart contract registration.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout items={userNav} title="Register Land">
      <Breadcrumb items={[{ label: 'Register Land' }]} />

      <div className="grid lg:grid-cols-3 gap-6 max-w-6xl">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div>
                <h2 className="font-display font-semibold text-lg">Land Registration Form</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Submit deed details to the blockchain registry for district authority verification.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/40 text-primary flex items-center gap-1">
                <ShieldCheck size={14} /> Smart Contract
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 block">
                    Survey / Khasra Number *
                  </label>
                  <input
                    required
                    name="surveyNo"
                    value={formData.surveyNo}
                    onChange={handleChange}
                    placeholder="e.g. SY-441/2A"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 block">
                    Claimant / Owner Name *
                  </label>
                  <input
                    required
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="Full legal name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 block">
                    Village / Town *
                  </label>
                  <input
                    required
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    placeholder="Chinhat"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 block">
                    District *
                  </label>
                  <input
                    required
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="Lucknow"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 block">
                    State *
                  </label>
                  <input
                    required
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Uttar Pradesh"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 block">
                    Area Dimension *
                  </label>
                  <input
                    required
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="1.25 acres / 54,450 sq ft"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 block">
                    Land Type *
                  </label>
                  <select
                    name="landType"
                    value={formData.landType}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-primary"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Agricultural">Agricultural</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 block">
                    Market Valuation (INR) *
                  </label>
                  <input
                    required
                    name="marketValue"
                    value={formData.marketValue}
                    onChange={handleChange}
                    placeholder="₹55,00,000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 block">
                  Detailed Location / Coordinates Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Plot boundaries, landmark, road width..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-primary"
                />
              </div>

              {/* IPFS Deed Upload Section */}
              <div className="pt-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Registered Deed / Supporting Document (PDF / Scan)</span>
                  {ipfsResult && <span className="text-emerald-600 font-mono text-[11px] flex items-center gap-1"><CheckCircle2 size={12} /> IPFS Pinned</span>}
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  className="hidden"
                />

                {!docFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-primary hover:bg-blue-50/20 dark:hover:bg-blue-900/10 transition-all cursor-pointer group"
                  >
                    <UploadCloud size={28} className="mx-auto text-slate-400 group-hover:text-primary transition-colors mb-2" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Click to browse or drop Title Deed document
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Generates SHA-256 fingerprint and pins to decentralized IPFS
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary text-white">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{docFile.name}</p>
                          <p className="text-xs text-slate-500">{(docFile.size / 1024).toFixed(1)} KB · Document</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setDocFile(null);
                          setIpfsResult(null);
                        }}
                        className="text-xs text-slate-400 hover:text-red-500"
                      >
                        Change
                      </button>
                    </div>

                    {uploadingDoc && (
                      <div className="flex items-center gap-2 text-xs text-primary pt-1">
                        <Loader2 size={13} className="animate-spin" />
                        <span>Computing SHA-256 &amp; Pinning to IPFS...</span>
                      </div>
                    )}

                    {ipfsResult && (
                      <div className="space-y-1 text-xs font-mono bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">CID:</span>
                          <a
                            href={ipfsResult.gatewayUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline flex items-center gap-1 font-semibold"
                          >
                            {ipfsResult.cid.slice(0, 16)}...{ipfsResult.cid.slice(-6)} <ExternalLink size={11} />
                          </a>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">SHA-256:</span>
                          <span>{ipfsResult.sha256.slice(0, 12)}...{ipfsResult.sha256.slice(-8)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button type="submit" disabled={submitting || uploadingDoc} className="px-6">
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" /> Submitting to Blockchain...
                    </span>
                  ) : (
                    'Submit for On-Chain Verification'
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Informational Sidebar */}
        <div className="space-y-5">
          <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-slate-900 dark:to-blue-950/40 border-primary/20">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-primary mb-3">
              <Sparkles size={16} /> How Verification Works
            </h3>
            <ol className="text-xs space-y-3 text-slate-600 dark:text-slate-300">
              <li className="flex gap-2">
                <span className="font-bold text-primary">1.</span>
                <span>Deed document is hashed using SHA-256 and stored on decentralized IPFS.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary">2.</span>
                <span>Land parcel record is minted with a Pending status into the Ethereum smart contract.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary">3.</span>
                <span>Authorized District Land Inspector verifies survey coordinates and approves.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary">4.</span>
                <span>Once approved, title is officially registered and eligible for seamless smart transfer.</span>
              </li>
            </ol>
          </Card>

          <Card className="p-5">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Signer Wallet
            </h4>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <p className="text-slate-400 mb-1">Active Address:</p>
              <p className="font-mono font-medium text-slate-800 dark:text-slate-200 break-all">
                {address || '0x71C836049C240E9A68367F47E82312b98A288bA2'}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        open={Boolean(successModal)}
        onClose={() => setSuccessModal(null)}
        title="Land Registered Successfully 🎉"
      >
        {successModal && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200">
              Your land parcel has been submitted to the blockchain registry. It is currently awaiting verification from the district authority.
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Generated Land ID</span>
                <span className="font-bold text-primary font-mono">{successModal.landId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Transaction Hash</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {successModal.txHash.slice(0, 10)}...{successModal.txHash.slice(-8)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Initial Status</span>
                <span className="px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                  Pending Verification
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <Link to="/search" className="flex-1">
                <Button variant="outline" className="w-full">View in Search</Button>
              </Link>
              <Link to="/explorer" className="flex-1">
                <Button className="w-full">View in Explorer</Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>

      <Toast toast={toast} />
    </DashboardLayout>
  );
}
