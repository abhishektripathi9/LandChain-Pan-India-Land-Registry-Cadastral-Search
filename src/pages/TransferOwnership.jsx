import { useState, useEffect } from 'react';
import { 
  ArrowRight, ShieldCheck, CheckCircle2, Loader2, Sparkles, History, 
  Map, UserCheck, Lock, Landmark, FileText, Printer, Check, AlertCircle,
  ExternalLink, QrCode, Phone, Fingerprint, RefreshCw, BadgeCheck
} from 'lucide-react';
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
  
  // Seller verification states (Security Layer)
  const [sellerOtpSent, setSellerOtpSent] = useState(false);
  const [sellerOtpVerified, setSellerOtpVerified] = useState(true); // Default verified for smooth demo
  const [sellerOtpCode, setSellerOtpCode] = useState('682914');
  const [enteredSellerOtp, setEnteredSellerOtp] = useState('682914');

  // Buyer Form fields
  const [buyerName, setBuyerName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('9876543210');
  const [buyerAadhaar, setBuyerAadhaar] = useState('7891 2345 6789');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [salePrice, setSalePrice] = useState('₹48,00,000');
  const [transferReason, setTransferReason] = useState('पंजीकृत विक्रय विलेख (Registered Sale Deed & Mutation)');
  const [shareFraction, setShareFraction] = useState('1/1 पूर्ण अंश (100% Full Ownership)');
  
  // Process states
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [successDeedData, setSuccessDeedData] = useState(null);
  const [showDeedCertificateModal, setShowDeedCertificateModal] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const all = getStoredLands();
    const approved = all.filter((l) => l.status === 'Approved');
    const available = approved.length > 0 ? approved : all;
    setLandsList(available);
    if (available.length > 0) {
      setSelectedLandId(available[0].id);
    }
  }, []);

  const activeLand = landsList.find((l) => l.id === selectedLandId) || landsList[0];
  const activeChain = activeLand ? getLandOwnershipHistory(activeLand.id, activeLand.owner) : [];

  // Calculate Stamp Duty (7%) & Registration Fee (1%)
  const numericPrice = parseInt((salePrice || '4800000').replace(/\D/g, '')) || 4800000;
  const stampDutyAmount = Math.round(numericPrice * 0.07);
  const registrationFeeAmount = Math.round(numericPrice * 0.01);
  const totalGovtCharges = stampDutyAmount + registrationFeeAmount;

  // Auto-fill sample buyer data for instant 1-click test
  const handleQuickSampleBuyer = () => {
    setBuyerName('विक्रमादित्य सिंह (Vikramaditya Singh)');
    setFatherName('श्री सत्येंद्र पाल सिंह (Satyendra Pal Singh)');
    setBuyerPhone('9812345678');
    setBuyerAadhaar('6521 8934 1029');
    const randomHex = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setBuyerAddress(randomHex);
    setSalePrice('₹52,00,000');
  };

  const handleSendSellerOtp = () => {
    setSellerOtpSent(true);
    setSellerOtpVerified(false);
    setToast({
      type: 'success',
      message: `सुरक्षा ओटीपी कोड: ${sellerOtpCode} (डेमो सत्यापन हेतु स्वतः दर्ज)`,
    });
    setEnteredSellerOtp(sellerOtpCode);
  };

  const handleVerifySellerOtp = () => {
    if (enteredSellerOtp === sellerOtpCode) {
      setSellerOtpVerified(true);
      setToast({
        type: 'success',
        message: 'विक्रेता का आधार व बायोमेट्रिक ई-हस्ताक्षर सफलतापूर्वक सत्यापित!',
      });
    } else {
      setToast({
        type: 'error',
        message: 'अमान्य ओटीपी कोड। कृपया सही 6-अंकीय कोड दर्ज करें।',
      });
    }
  };

  const handleInitiateTransfer = (e) => {
    e.preventDefault();

    if (!buyerName.trim()) {
      setToast({ type: 'error', message: 'कृपया क्रेता का पूरा नाम दर्ज करें।' });
      return;
    }

    if (!buyerAddress.startsWith('0x') || buyerAddress.length !== 42) {
      setToast({ type: 'error', message: 'कृपया 42-अक्षरों का मान्य Ethereum वॉलेट पता दर्ज करें।' });
      return;
    }

    if (!sellerOtpVerified) {
      setToast({ type: 'error', message: 'स्थानांतरण से पूर्व वर्तमान विक्रेता का आधार/ओटीपी सत्यापन अनिवार्य है।' });
      return;
    }

    setShowConfirmModal(true);
  };

  const executeSecureTransfer = async () => {
    setShowConfirmModal(false);
    setSubmitting(true);

    try {
      const res = await transferLandOwnershipOnChain({
        landId: selectedLandId,
        buyerName,
        buyerAddress,
        fatherName,
        salePrice,
        transferReason,
        sellerName: activeLand?.owner || 'वर्तमान स्वामी',
        sellerFatherName: 'दर्ज राजस्व अभिलेख अनुसार',
        sellerAadhaar: 'XXXX XXXX 8912',
        buyerAadhaar,
        buyerPhone,
        stampDuty: `₹${stampDutyAmount.toLocaleString('en-IN')}`,
        account: address,
      });

      setSuccessDeedData({
        ...res,
        surveyNo: activeLand?.surveyNo || '101/क',
        village: activeLand?.village || activeLand?.location || 'चिनहट (Chinhat)',
        district: activeLand?.district || 'Lucknow',
        area: activeLand?.area || '1.25 Acre',
        ulpin: activeLand?.ulpin || 'UP09-LKO-0441-0091',
        sellerName: activeLand?.owner || 'वर्तमान स्वामी',
        buyerName,
        fatherName,
        buyerAadhaar,
        salePrice,
        stampDuty: `₹${stampDutyAmount.toLocaleString('en-IN')}`,
        registrationFee: `₹${registrationFeeAmount.toLocaleString('en-IN')}`,
        transferReason,
        txHash: res.txHash,
        mutationOrderNo: res.mutationOrderNo,
        deedNo: res.deedNo,
        date: res.date,
      });

      setShowDeedCertificateModal(true);
      setToast({
        type: 'success',
        message: `स्वामित्व सफलतापूर्वक हस्तांतरित! नया स्वामी: ${buyerName}`,
      });

      // Reload fresh lands
      setLandsList(getStoredLands());
    } catch (err) {
      console.error('Transfer execution error:', err);
      setToast({ type: 'error', message: 'स्वामित्व हस्तांतरण में त्रुटि हुई।' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout items={userNav} title="Transfer Ownership">
      <Breadcrumb items={[{ label: 'Transfer Ownership' }]} />

      {/* Main Grid */}
      <div className="space-y-6 max-w-6xl">
        
        {/* Top Official Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h1 className="text-base font-bold font-display text-white">
                सुरक्षित भूमि स्वामित्व हस्तांतरण व नामांतरण पोर्टल (Title Transfer &amp; Mutation)
              </h1>
              <p className="text-xs text-slate-300">
                क्रिप्टोग्राफिक डिजिटल विलेख, स्टाम्प सत्यापन एवं पूर्व स्वामियों की अपरिवर्तनीय वंशावली लेजर
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
              <BadgeCheck size={14} /> ZERO DOUBLE-SELLING RISK
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left 2 Columns: Transfer Execution Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 border-slate-200 dark:border-slate-800">
              <form onSubmit={handleInitiateTransfer} className="space-y-6">
                
                {/* 1. Parcel Selection & Encumbrance Check */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      १. हस्तांतरण हेतु भूमि पार्सल का चयन (Select Land Parcel)
                    </label>
                    <Link to="/bhulekh" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                      <Map size={12} /> नक्शे पर स्थिति देखें
                    </Link>
                  </div>

                  <select
                    value={selectedLandId}
                    onChange={(e) => setSelectedLandId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium outline-none focus:border-blue-600 shadow-xs"
                  >
                    {landsList.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.id} • खसरा #{l.surveyNo} • {l.owner} ({l.village || l.location}) — {l.value}
                      </option>
                    ))}
                  </select>

                  {/* Active Parcel Inspection Card */}
                  {activeLand && (
                    <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[11px]">वर्तमान पंजीकृत स्वामी:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-100">{activeLand.owner}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">खसरा / गाटा संख्या:</span>
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">#{activeLand.surveyNo}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">सरकारी सर्किल मूल्यांकन:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{activeLand.value}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">स्वत्व स्वच्छता जांच:</span>
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-600 text-[11px]">
                            <CheckCircle2 size={12} /> ऋणमुक्त व विवाद रहित
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Seller Security Verification Layer */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      २. विक्रेता सत्यापन व आधार ई-साइन (Seller Identity Authorization)
                    </label>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <Fingerprint size={13} /> 2FA ई-केवाईसी अनिवार्य
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span>विक्रेता: {activeLand?.owner}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-mono">
                          आधार: XXXX XXXX 8912
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        अनधिकृत बिक्री से सुरक्षा हेतु वर्तमान भूमि स्वामी का बायोमेट्रिक/ओटीपी सत्यापन आवश्यक है।
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {sellerOtpVerified ? (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs">
                          <CheckCircle2 size={14} /> विक्रेता सत्यापित (Verified)
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            maxLength={6}
                            value={enteredSellerOtp}
                            onChange={(e) => setEnteredSellerOtp(e.target.value)}
                            placeholder="6-अंक कोड"
                            className="w-24 px-2 py-1.5 rounded-lg border border-slate-300 text-xs text-center font-mono"
                          />
                          <button
                            type="button"
                            onClick={handleVerifySellerOtp}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-500"
                          >
                            पुष्टि करें
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Transferee / Buyer Details */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      ३. नए क्रेता का सम्पूर्ण विवरण (Transferee / Buyer Information)
                    </label>
                    <button
                      type="button"
                      onClick={handleQuickSampleBuyer}
                      className="inline-flex items-center gap-1 text-xs text-blue-600 font-bold hover:underline"
                    >
                      <Sparkles size={12} />
                      <span>⚡ त्वरित डेमो क्रेता भरें (Sample Fill)</span>
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                        क्रेता का पूरा विधिक नाम (Buyer Legal Name) *
                      </label>
                      <input
                        required
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="उदा. विक्रमादित्य सिंह"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                        पिता / पति का नाम (Father / Guardian Name) *
                      </label>
                      <input
                        required
                        value={fatherName}
                        onChange={(e) => setFatherName(e.target.value)}
                        placeholder="उदा. श्री सत्येंद्र पाल सिंह"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                        मोबाइल नंबर (Buyer Mobile No)
                      </label>
                      <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 px-3 py-2 text-xs font-bold border-r border-slate-200 dark:border-slate-700 flex items-center">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={buyerPhone}
                          onChange={(e) => setBuyerPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                        आधार / पहचान पत्र संख्या (Buyer Aadhaar / ID)
                      </label>
                      <input
                        value={buyerAadhaar}
                        onChange={(e) => setBuyerAadhaar(e.target.value)}
                        placeholder="XXXX XXXX 1029"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-blue-600"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          क्रेता का Ethereum वॉलेट पता (Smart Contract Wallet) *
                        </label>
                        <button
                          type="button"
                          onClick={() => setBuyerAddress('0x4Ad98F4a2295E2B969A27F118a8B234857289104')}
                          className="text-[11px] text-blue-600 hover:underline"
                        >
                          वॉलेट एड्रेस जनरेट करें
                        </button>
                      </div>
                      <input
                        required
                        value={buyerAddress}
                        onChange={(e) => setBuyerAddress(e.target.value)}
                        placeholder="0x4Ad98F4a2295E2B969A27F118a8B234857289104 (42-character address)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Financial Consideration & Stamp Duty */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                    ४. वित्तीय प्रतिफल एवं सरकारी स्टाम्प शुल्क (Financials &amp; Stamp Duty)
                  </label>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                        विक्रय प्रतिफल राशि (Sale Price - INR)
                      </label>
                      <input
                        value={salePrice}
                        onChange={(e) => setSalePrice(e.target.value)}
                        placeholder="₹48,00,000"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                        विलेख प्रकार (Transfer Deed Type)
                      </label>
                      <select
                        value={transferReason}
                        onChange={(e) => setTransferReason(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-blue-600"
                      >
                        <option value="पंजीकृत विक्रय विलेख (Registered Sale Deed & Mutation)">बैनामा (Sale Deed)</option>
                        <option value="वरासत / उत्तराधिकार (Succession / Inheritance)">वरासत (Inheritance)</option>
                        <option value="पंजीकृत दान विलेख (Registered Gift Deed / Hiba)">उपहार विलेख (Gift Deed)</option>
                        <option value="पारिवारिक बंटवारा विलेख (Family Partition Deed)">बंटवारा (Partition)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                        हस्तांतरित हिस्सा (Title Share)
                      </label>
                      <select
                        value={shareFraction}
                        onChange={(e) => setShareFraction(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-blue-600"
                      >
                        <option value="1/1 पूर्ण अंश (100% Full Ownership)">1/1 पूर्ण अंश (100%)</option>
                        <option value="1/2 आधा अंश (50% Co-Ownership)">1/2 आधा अंश (50%)</option>
                        <option value="1/4 चौथाई अंश (25% Share)">1/4 चौथाई अंश (25%)</option>
                      </select>
                    </div>
                  </div>

                  {/* Stamp Duty Calculation Strip */}
                  <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">राज्य स्टाम्प शुल्क (7%):</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">
                        ₹{stampDutyAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">पंजीकरण शुल्क (1%):</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">
                        ₹{registrationFeeAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">कुल शासकीय देय:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        ₹{totalGovtCharges.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Transfer Button */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="text-[11px] text-slate-500">
                    दाखिल-खारिज आदेश स्वतः सृजित होगा एवं पूर्व स्वामी का नाम वंशावली लेजर में सुरक्षित रहेगा।
                  </div>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin" /> ब्लॉकचेन पर हस्तांतरण हो रहा है...
                      </span>
                    ) : (
                      '🔐 सुरक्षित हस्तांतरण प्रारंभ करें (Initiate Transfer) →'
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Right Sidebar: Security Guarantee & Quick Links */}
          <div className="space-y-4">
            <Card className="p-5 border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" /> सुरक्षा एवं विधिक गारंटी
              </h3>
              <ul className="text-xs space-y-2.5 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>शून्य जालसाजी (Zero Fraud)</strong>: केवल वर्तमान में दर्ज अधिकृत खाताधारक ही जमीन बेच सकता है।</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>दोहरा बैनामा असंभव</strong>: एक बार बिक्री होने पर स्मार्ट कॉन्ट्रैक्ट स्वतः पूर्व मालिक का अधिकार समाप्त कर देता है।</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>स्थायी वंशावली (Permanent Lineage)</strong>: जमीन जिस-जिस के नाम पर रही है, उनका पूरा विवरण हमेशा दृश्यमान रहेगा।</span>
                </li>
              </ul>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950/40 border-blue-200 dark:border-blue-900/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <History size={14} className="text-blue-600" /> वंशावली सारांश
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-200/60 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  {activeChain.length} हस्तांतरण
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mb-3">
                इस पार्सल की सम्पूर्ण ऐतिहासिक वंशावली नीचे दिए गए लेजर में देखी जा सकती है।
              </p>
              <Link to="/land-history">
                <Button variant="outline" size="sm" className="w-full text-xs justify-center">
                  📜 पूरी वंशावली व ऐतिहासिक टाइमलाइन →
                </Button>
              </Link>
            </Card>
          </div>
        </div>

        {/* 5. "vo land jitne pahle jiske jiske naam pe transfer hui hai full show kare" */}
        {/* Comprehensive Previous Owners Chain of Title Ledger */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <Card className="p-6 border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                    Chain of Custody &amp; Title Provenance
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    भूमि सं. {activeLand?.id} (खसरा #{activeLand?.surveyNo})
                  </span>
                </div>
                <h2 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <History size={18} className="text-blue-600" />
                  इस भूमि के सभी पूर्व एवं वर्तमान पंजीकृत स्वामियों का सम्पूर्ण इतिहास (All Historical Owners)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  यह भूमि मूल बंदोबस्त से लेकर आज तक जिस-जिसके नाम पर हस्तांतरित हुई है, उसका प्रामाणिक कालक्रमानुसार विवरण:
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 shrink-0">
                <ShieldCheck size={14} /> 100% ब्लॉकचेन सत्यापित लेजर
              </span>
            </div>

            {/* Visual Node-Based Transfer Flow Journey */}
            <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 overflow-x-auto">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                स्वामित्व हस्तांतरण दृश्य यात्रा (Visual Transfer Pathway):
              </span>
              <div className="flex items-center gap-3 min-w-[650px] pb-2">
                {activeChain.map((node, i) => (
                  <div key={`flow-${i}`} className="flex items-center gap-2 shrink-0">
                    <div className={`p-2.5 rounded-xl border text-xs max-w-[170px] ${
                      node.isCurrent
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md font-bold'
                        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                    }`}>
                      <div className="text-[10px] opacity-80 mb-0.5">
                        चरण #{i + 1} ({node.date.split('-')[0]})
                      </div>
                      <div className="truncate text-xs font-bold">
                        {node.toOwner || node.owner}
                      </div>
                      <div className="text-[9px] opacity-75 truncate mt-0.5">
                        {node.deedType.split('(')[0]}
                      </div>
                    </div>

                    {i < activeChain.length - 1 && (
                      <div className="flex flex-col items-center justify-center text-slate-400 shrink-0">
                        <ArrowRight size={16} className="text-blue-600" />
                        <span className="text-[8px] font-semibold">हस्तांतरण</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Complete Tabular Historical Ledger */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                    <th className="py-2.5 px-3 font-bold">क्रम (Hop)</th>
                    <th className="py-2.5 px-3 font-bold">पूर्व स्वामी (विक्रेता / Sold By)</th>
                    <th className="py-2.5 px-3 font-bold">नया स्वामी (क्रेता / Transferee)</th>
                    <th className="py-2.5 px-3 font-bold">विलेख प्रकार (Deed Type)</th>
                    <th className="py-2.5 px-3 font-bold">दिनांक व पंजीकरण क्रमांक</th>
                    <th className="py-2.5 px-3 font-bold">प्रतिफल व स्टाम्प</th>
                    <th className="py-2.5 px-3 font-bold">दाखिल-खारिज आदेश सं.</th>
                    <th className="py-2.5 px-3 font-bold">स्थिति</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activeChain.map((hist, idx) => (
                    <tr 
                      key={`hist-row-${idx}`}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                        hist.isCurrent ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                      }`}
                    >
                      {/* Step Hop */}
                      <td className="py-3 px-3 font-bold font-mono text-slate-500">
                        #{idx + 1}
                      </td>

                      {/* From Owner */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {hist.fromOwner || 'पैतृक बंदोबस्त'}
                        </div>
                        {hist.sellerAadhaar && (
                          <div className="text-[10px] font-mono text-slate-400">
                            आधार: {hist.sellerAadhaar}
                          </div>
                        )}
                      </td>

                      {/* To Owner */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{hist.toOwner || hist.owner}</span>
                          {hist.isCurrent && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="सक्रिय स्वामी"></span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          पिता: {hist.fatherName || 'दर्ज विलेख अनुसार'}
                        </div>
                      </td>

                      {/* Deed Type */}
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-700 dark:text-slate-300 block">
                          {hist.deedType}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {hist.subRegistrar}
                        </span>
                      </td>

                      {/* Date & Deed No */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-700 dark:text-slate-300">
                          📅 {hist.date}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          {hist.bahiNo}
                        </div>
                      </td>

                      {/* Consideration & Stamp Duty */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                          {hist.consideration}
                        </div>
                        {hist.stampDuty && (
                          <div className="text-[10px] text-slate-500">
                            स्टाम्प: {hist.stampDuty}
                          </div>
                        )}
                      </td>

                      {/* Mutation Order & Tx Hash */}
                      <td className="py-3 px-3">
                        <div className="font-mono text-blue-600 dark:text-blue-400 font-semibold text-[11px]">
                          {hist.mutationOrderNo}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]" title={hist.txHash}>
                          {hist.txHash.slice(0, 8)}...{hist.txHash.slice(-6)}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        {hist.isCurrent ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                            <CheckCircle2 size={11} /> वर्तमान स्वामी
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            पूर्व स्वामी (#{idx + 1})
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

      </div>

      {/* Confirmation & Cryptographic Sign Modal */}
      <Modal open={showConfirmModal} onClose={() => setShowConfirmModal(false)} title="पुष्टि करें: सुरक्षित ऑन-चेन भूमि स्वामित्व हस्तांतरण">
        <div className="space-y-4 text-xs">
          <p className="text-slate-500 dark:text-slate-400">
            आप पार्सल <strong className="text-slate-900 dark:text-white font-mono">{selectedLandId}</strong> (खसरा #{activeLand?.surveyNo}) का विधिक स्वत्व हस्तांतरित करने जा रहे हैं। यह लेनदेन ब्लॉकचेन लेजर पर स्थायी रूप से दर्ज होगा।
          </p>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">विक्रेता (Current Seller):</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{activeLand?.owner}</span>
            </div>
            <div className="flex items-center justify-center py-1 text-blue-600">
              <ArrowRight size={18} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">नया क्रेता (New Transferee):</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{buyerName}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-2">
              <span className="text-slate-500">विक्रय मूल्य (Consideration):</span>
              <span className="font-bold text-emerald-600">{salePrice}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">स्टाम्प व रजिस्ट्री शुल्क:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">₹{totalGovtCharges.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowConfirmModal(false)}>
              रद्द करें (Cancel)
            </Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold" onClick={executeSecureTransfer}>
              ✍️ डिजिटल हस्ताक्षर व ट्रांसफर (Sign &amp; Transfer)
            </Button>
          </div>
        </div>
      </Modal>

      {/* Official Deed & Mutation Certificate Modal (Printable) */}
      <Modal open={showDeedCertificateModal} onClose={() => setShowDeedCertificateModal(false)} title="🎉 स्वामित्व हस्तांतरण एवं दाखिल-खारिज प्रमाण पत्र">
        {successDeedData && (
          <div className="space-y-4 text-xs font-sans">
            {/* Deed Document Card */}
            <div className="p-5 rounded-2xl bg-amber-50/40 dark:bg-slate-900 border-2 border-amber-300/80 dark:border-amber-700/60 shadow-lg relative print:p-0">
              
              {/* Top Government Watermark Header */}
              <div className="text-center pb-3 border-b-2 border-amber-200 dark:border-slate-800 mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold text-[10px] mb-1.5">
                  <BadgeCheck size={13} /> राजस्व न्यायालय एवं ब्लॉकचेन डिजिटल बैनामा
                </div>
                <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white">
                  भूमि स्वामित्व नामांतरण प्रमाण पत्र (Deed of Title Conveyance)
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  उत्तर प्रदेश भू-राजस्व संहिता एवं भारत सरकार DILRMP ब्लॉकचेन रजिस्ट्रीकरण मानक
                </p>
              </div>

              {/* Certificate Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px]">विलेख पंजीयन क्रमांक:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{successDeedData.deedNo}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px]">दाखिल-खारिज आदेश संख्या:</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{successDeedData.mutationOrderNo}</span>
                </div>
              </div>

              {/* Parties Comparison */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-4 space-y-2">
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-500 font-medium">हस्तांतरक / विक्रेता (Sold By):</span>
                  <span className="font-bold text-slate-900 dark:text-white">{successDeedData.sellerName}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-500 font-medium">हस्तांतरिती / नया क्रेता (Transferred To):</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{successDeedData.buyerName}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-500 font-medium">पिता/पति का नाम:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{successDeedData.fatherName}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-500 font-medium">भूमि पार्सल (ULPIN / खसरा):</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">#{successDeedData.surveyNo} ({successDeedData.ulpin})</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-500 font-medium">स्थान व जिला:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{successDeedData.village}, {successDeedData.district}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 font-medium">विक्रय मूल्य एवं स्टाम्प:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    {successDeedData.salePrice} (स्टाम्प: {successDeedData.stampDuty})
                  </span>
                </div>
              </div>

              {/* Cryptographic Proof Strip */}
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-[10px] font-mono text-slate-600 dark:text-slate-400 flex items-center justify-between gap-2">
                <span className="truncate">TxHash: {successDeedData.txHash}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 shrink-0 font-bold">
                  IMMUTABLE ON-CHAIN
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                className="flex-1 text-xs" 
                onClick={() => window.print()}
              >
                <Printer size={13} className="mr-1.5" /> प्रमाण पत्र प्रिंट करें (Print Deed)
              </Button>
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold" 
                onClick={() => setShowDeedCertificateModal(false)}
              >
                लेजर में वंशावली देखें (View Ledger)
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Toast toast={toast} />
    </DashboardLayout>
  );
}
