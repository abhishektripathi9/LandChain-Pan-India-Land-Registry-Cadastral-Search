import { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2, Loader2, Sparkles, History, Map, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { userNav } from '../data/navConfig';
import Breadcrumb from '../components/Breadcrumb';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { useWallet } from '../context/WalletContext';
import { getStoredLands, transferLandOwnershipOnChain } from '../services/web3Service';
import { getLandOwnershipHistory } from '../data/cadastralData';

export default function TransferOwnership() {
  const { address } = useWallet();
  const [landsList, setLandsList] = useState([]);
  const [selectedLandId, setSelectedLandId] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [salePrice, setSalePrice] = useState('₹45,00,000');
  const [transferReason, setTransferReason] = useState('पंजीकृत विक्रय विलेख (Registered Sale Deed & Mutation)');
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const all = getStoredLands();
    const approved = all.filter((l) => l.status === 'Approved');
    setLandsList(approved.length > 0 ? approved : all);
    if (approved.length > 0) {
      setSelectedLandId(approved[0].id);
    } else if (all.length > 0) {
      setSelectedLandId(all[0].id);
    }
  }, []);

  const activeLand = landsList.find((l) => l.id === selectedLandId) || landsList[0];
  const activeChain = activeLand ? getLandOwnershipHistory(activeLand.id, activeLand.owner) : [];

  const fillTestAddress = () => {
    const randomHex = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setBuyerAddress(randomHex);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!buyerAddress.startsWith('0x') || buyerAddress.length !== 42) {
      setToast({ type: 'error', message: 'Please provide a valid 42-character Ethereum address (0x...).' });
      return;
    }
    setShowModal(true);
  };

  const confirmTransfer = async () => {
    setShowModal(false);
    setSubmitting(true);
    try {
      const res = await transferLandOwnershipOnChain({
        landId: selectedLandId,
        buyerName,
        buyerAddress,
        fatherName,
        salePrice,
        transferReason,
        account: address,
      });

      setSuccessData(res);
      setToast({
        type: 'success',
        message: `Ownership of ${selectedLandId} transferred successfully on-chain!`,
      });
      // Refresh lands list
      setLandsList(getStoredLands());
    } catch (err) {
      console.error('Transfer error:', err);
      setToast({ type: 'error', message: 'Error executing ownership transfer.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout items={userNav} title="Transfer Ownership">
      <Breadcrumb items={[{ label: 'Transfer Ownership' }]} />

      <div className="grid lg:grid-cols-3 gap-6 max-w-5xl">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div>
                <h2 className="font-display font-semibold text-lg">Transfer Land Title</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Execute an immutable ownership transfer recorded directly on the blockchain.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center gap-1">
                <ShieldCheck size={14} /> Smart Contract
              </span>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 block">
                  Select Land Parcel to Transfer *
                </label>
                <select
                  value={selectedLandId}
                  onChange={(e) => setSelectedLandId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-primary"
                >
                  {landsList.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.id} - {l.surveyNo} ({l.location || l.village}) [{l.status}]
                    </option>
                  ))}
                </select>
              </div>

              {activeLand && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Current Legal Owner</span>
                    <span className="font-semibold">{activeLand.owner}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Valuation</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{activeLand.value}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Registry Status</span>
                    <span className="font-semibold text-primary">{activeLand.status}</span>
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 block">
                    Buyer Legal Name (क्रेता का नाम) *
                  </label>
                  <input
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. Vikramaditya Singh"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 block">
                    Father / Husband Name (पिता/पति का नाम) *
                  </label>
                  <input
                    required
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="e.g. Satyendra Pal Singh"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Buyer Ethereum Wallet Address (क्रेता का वॉलेट पता) *
                  </label>
                  <button
                    type="button"
                    onClick={fillTestAddress}
                    className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1"
                  >
                    ⚡ टेस्ट एड्रेस भरें (Fill Test Address)
                  </button>
                </div>
                <input
                  required
                  value={buyerAddress}
                  onChange={(e) => setBuyerAddress(e.target.value)}
                  placeholder="0x4Ad98F4a2295E2B969A27F... (42-character address)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-mono outline-none focus:border-primary"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 block">
                    Sale Consideration Amount (विक्रय राशि - INR)
                  </label>
                  <input
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="₹45,00,000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 block">
                    Transfer Deed Type (विलेख प्रकार)
                  </label>
                  <select
                    value={transferReason}
                    onChange={(e) => setTransferReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-primary"
                  >
                    <option value="पंजीकृत विक्रय विलेख (Registered Sale Deed & Mutation)">बैनामा (Sale Deed)</option>
                    <option value="वरासत / उत्तराधिकार (Succession / Inheritance)">वरासत (Inheritance)</option>
                    <option value="पंजीकृत दान विलेख (Registered Gift Deed)">उपहार विलेख (Gift Deed)</option>
                    <option value="पारिवारिक बंटवारा (Family Partition Deed)">बंटवारा (Partition)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" /> Processing Transfer...
                    </span>
                  ) : (
                    'Initiate On-Chain Transfer (दाखिल-खारिज पुष्टि)'
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Sidebar: Previous Owners History Chain */}
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
                <History size={15} className="text-primary" /> इस जमीन के पूर्व मालिक
              </h3>
              <span className="text-[10px] text-slate-400">{activeChain.length} रिकॉर्ड</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              इस पार्सल के पहले के सभी पंजीकृत स्वामियों की वंशावली:
            </p>

            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {activeChain.map((ownerItem, idx) => (
                <div
                  key={`${ownerItem.owner}-${idx}`}
                  className={`p-2.5 rounded-xl border text-xs ${
                    ownerItem.isCurrent
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                      #{idx + 1} {ownerItem.owner}
                    </span>
                    {ownerItem.isCurrent && (
                      <span className="text-[10px] font-bold text-emerald-600">वर्तमान स्वामी</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {ownerItem.deedType} · 📅 {ownerItem.date}
                  </div>
                  {ownerItem.consideration && (
                    <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                      प्रतिफल: {ownerItem.consideration}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Link to="/bhulekh">
                <Button variant="outline" size="sm" className="w-full justify-center text-xs">
                  <Map size={13} className="mr-1.5 text-blue-600" /> भूलेख नक्शे पर स्थिति देखें
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-indigo-950/40 border-primary/20">
            <h3 className="text-xs font-bold flex items-center gap-1.5 text-primary mb-2">
              <Sparkles size={14} /> Immutable Blockchain Transfer
            </h3>
            <ul className="text-[11px] space-y-1.5 text-slate-600 dark:text-slate-300">
              <li>• ट्रांसफर होते ही पुराना मालिक हटकर नया मालिक दर्ज हो जाता है।</li>
              <li>• पूर्व मालिक का नाम इतिहास लेजर में हमेशा के लिए सुरक्षित रहता है।</li>
              <li>• दोहरा बैनामा (Double Selling Fraud) तकनीकी रूप से असंभव है।</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Confirm Blockchain Transfer">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          You are about to transfer the on-chain title of parcel <strong className="text-slate-800 dark:text-slate-200">{selectedLandId}</strong>. This transaction is cryptographically signed and permanent.
        </p>
        <div className="flex items-center justify-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl mb-5 text-xs font-semibold">
          <span className="text-slate-600 dark:text-slate-300">{activeLand?.owner || 'Current Owner'}</span>
          <ArrowRight size={16} className="text-primary" />
          <span className="text-primary">{buyerName || 'New Owner'}</span>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button className="flex-1" onClick={confirmTransfer}>Confirm &amp; Sign</Button>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal open={Boolean(successData)} onClose={() => setSuccessData(null)} title="Ownership Transferred! 🎉">
        {successData && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200">
              Ownership record successfully updated in the smart contract registry.
            </div>
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Land ID</span>
                <span className="font-bold font-mono">{successData.landId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">New Owner</span>
                <span className="font-semibold text-primary">{successData.newOwner}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Tx Hash</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {successData.txHash.slice(0, 10)}...{successData.txHash.slice(-8)}
                </span>
              </div>
            </div>
            <div className="flex gap-3 pt-3">
              <Link to="/history" className="flex-1">
                <Button variant="outline" className="w-full">View History Timeline</Button>
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
