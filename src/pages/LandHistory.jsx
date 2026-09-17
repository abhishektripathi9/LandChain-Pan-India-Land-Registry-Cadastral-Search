import { useState, useEffect } from 'react';
import { 
  Search, History, ShieldCheck, ExternalLink, MapPin, ArrowLeftRight, 
  Map, CheckCircle2, UserCheck, Calendar, ArrowRight, BadgeCheck,
  FileText, Landmark, Printer, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { userNav } from '../data/navConfig';
import Breadcrumb from '../components/Breadcrumb';
import Card from '../components/Card';
import Button from '../components/Button';
import { getStoredLands } from '../services/web3Service';
import { getLandOwnershipHistory } from '../data/cadastralData';

export default function LandHistory() {
  const [landsList, setLandsList] = useState([]);
  const [selectedLandId, setSelectedLandId] = useState('');
  const [ownershipChain, setOwnershipChain] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const all = getStoredLands();
    setLandsList(all);
    if (all.length > 0) {
      setSelectedLandId(all[0].id);
    }
  }, []);

  useEffect(() => {
    if (!selectedLandId) return;
    const currentLand = landsList.find((l) => l.id === selectedLandId);
    const chain = getLandOwnershipHistory(selectedLandId, currentLand?.owner);
    setOwnershipChain(chain);
  }, [selectedLandId, landsList]);

  const currentLand = landsList.find((l) => l.id === selectedLandId) || landsList[0];

  // Filter lands by search query
  const filteredLands = landsList.filter((l) => {
    const q = searchTerm.toLowerCase();
    return (
      l.id.toLowerCase().includes(q) ||
      (l.surveyNo && l.surveyNo.toLowerCase().includes(q)) ||
      (l.owner && l.owner.toLowerCase().includes(q)) ||
      (l.village && l.village.toLowerCase().includes(q)) ||
      (l.location && l.location.toLowerCase().includes(q))
    );
  });

  return (
    <DashboardLayout items={userNav} title="Land Title Provenance & History">
      <Breadcrumb items={[{ label: 'Land History' }]} />

      <div className="space-y-6 max-w-6xl">
        
        {/* Top Header Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white shadow-md flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <History size={22} />
            </div>
            <div>
              <h1 className="text-base font-bold font-display text-white">
                सम्पूर्ण स्वामित्व वंशावली एवं ऐतिहासिक नामांतरण लेजर (Title Lineage &amp; Provenance)
              </h1>
              <p className="text-xs text-slate-300">
                मूल राजस्व चकबंदी बंदोबस्त से लेकर आज तक — जिस-जिसके नाम पर जमीन दर्ज हुई उसका प्रामाणिक इतिहास
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
            <ShieldCheck size={14} /> 100% अपरिवर्तनीय ब्लॉकचेन अभिलेख
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Chain of Title (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 border-slate-200 dark:border-slate-800">
              
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                      Chain of Title · पूर्व स्वामियों की नामावली
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      कुल {ownershipChain.length} विधिक हस्तांतरण दर्ज
                    </span>
                  </div>
                  <h2 className="font-display font-semibold text-base flex items-center gap-2 text-slate-900 dark:text-white">
                    <History size={17} className="text-blue-600" /> 
                    पार्सल #{currentLand?.id} — ऐतिहासिक वंशावली विवरण
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 text-slate-700 dark:text-slate-300"
                  >
                    <Printer size={13} /> वंशावली प्रिंट
                  </button>
                </div>
              </div>

              {/* Land Selector with Search */}
              <div className="mb-6 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    खसरा / भूमि पार्सल चुनें (Select Parcel to View History):
                  </label>
                  <span className="text-[11px] text-slate-400">{filteredLands.length} पार्सल उपलब्ध</span>
                </div>

                <div className="grid sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <select
                      value={selectedLandId}
                      onChange={(e) => setSelectedLandId(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-blue-600 shadow-xs"
                    >
                      {filteredLands.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.id} • खसरा #{l.surveyNo} • {l.owner} ({l.village || l.location})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="🔍 खसरा या नाम खोजें..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Visual Node Transfer Pathway */}
              <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 overflow-x-auto">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                  स्वामित्व यात्रा प्रवाह (Generational Ownership Flow):
                </span>
                <div className="flex items-center gap-2.5 min-w-[550px] pb-1">
                  {ownershipChain.map((node, i) => (
                    <div key={`flow-hist-${i}`} className="flex items-center gap-2 shrink-0">
                      <div className={`p-2 rounded-xl border text-xs max-w-[150px] ${
                        node.isCurrent
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm font-bold'
                          : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      }`}>
                        <div className="text-[9px] opacity-75">
                          {i === 0 ? 'मूल खातेदार' : `क्रेता #${i}`} ({node.date.split('-')[0]})
                        </div>
                        <div className="truncate text-xs font-bold">
                          {node.toOwner || node.owner}
                        </div>
                        <div className="text-[9px] opacity-75 truncate">
                          {node.deedType.split('(')[0]}
                        </div>
                      </div>

                      {i < ownershipChain.length - 1 && (
                        <ArrowRight size={14} className="text-blue-500 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Detailed Timeline of Every Past Owner */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {ownershipChain.map((item, idx) => (
                  <div key={`${item.owner}-${idx}`} className="relative group">
                    {/* Step Pin Number */}
                    <div
                      className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] font-bold ${
                        item.isCurrent
                          ? 'bg-emerald-500 border-white text-white shadow-md ring-4 ring-emerald-500/20'
                          : 'bg-white dark:bg-slate-900 border-blue-500 text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    {/* Step Details Box */}
                    <div
                      className={`p-4 rounded-xl border transition-all ${
                        item.isCurrent
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {/* Top Row: Owner & Current status */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {item.toOwner || item.owner}
                            </span>
                            {item.isCurrent ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 flex items-center gap-1">
                                <CheckCircle2 size={11} /> वर्तमान सक्रिय स्वामी (Current Owner)
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                पूर्व स्वामी #{idx + 1} (Previous Title Holder)
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-3 flex-wrap">
                            <span>पिता/पति: <strong>{item.fatherName}</strong></span>
                            {item.fromOwner && (
                              <span className="text-blue-600 dark:text-blue-400 font-medium">
                                हस्तांतरक / विक्रेता: {item.fromOwner}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-left sm:text-right shrink-0">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block font-mono">
                            📅 {item.date}
                          </span>
                          <span className="text-[10px] text-slate-400">{item.role}</span>
                        </div>
                      </div>

                      {/* Detail Metrics Grid */}
                      <div className="grid sm:grid-cols-2 gap-2 text-xs pt-2.5 border-t border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300">
                        <div>
                          <span className="text-slate-400 block text-[10px]">विलेख प्रकार (Deed Type):</span>
                          <strong className="text-slate-800 dark:text-slate-200">{item.deedType}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">क्रय प्रतिफल राशि (Sale Price):</span>
                          <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{item.consideration}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">पंजीकरण बही विवरण / जिल्द:</span>
                          <span className="font-mono text-[11px]">{item.bahiNo}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">तहसीलदार दाखिल-खारिज आदेश सं.:</span>
                          <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{item.mutationOrderNo}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">स्टाम्प शुल्क:</span>
                          <span className="text-slate-700 dark:text-slate-300">{item.stampDuty}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">सत्यापन कार्यालय:</span>
                          <span>{item.subRegistrar}</span>
                        </div>
                      </div>

                      {/* Cryptographic hash proof */}
                      <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="truncate max-w-[280px]">TxHash: {item.txHash}</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <ShieldCheck size={11} /> ब्लॉकचेन पर स्थायी रूप से सुरक्षित
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Sidebar: Parcel Snapshot & Instant Actions */}
          {currentLand && (
            <div className="space-y-4">
              <Card className="p-5 border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
                  <FileText size={15} className="text-blue-600" /> पार्सल विवरण (Snapshot)
                </h3>
                
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">भूमि आईडी (Land ID):</span>
                    <span className="font-bold font-mono text-blue-600 dark:text-blue-400">{currentLand.id}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">खसरा / गाटा संख्या:</span>
                    <span className="font-bold font-mono">#{currentLand.surveyNo}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">वर्तमान विधिक स्वामी:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{currentLand.owner}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">ग्राम व जिला:</span>
                    <span className="font-medium">{currentLand.village || currentLand.location}, {currentLand.district}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">रकबा / क्षेत्रफल:</span>
                    <span className="font-medium">{currentLand.area}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">सरकारी सर्किल मूल्यांकन:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{currentLand.value}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">स्वत्व स्थिति:</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {currentLand.status}
                    </span>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="space-y-2 mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Link to="/transfer-ownership" className="block">
                    <Button size="sm" className="w-full justify-center text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold">
                      <ArrowLeftRight size={13} className="mr-1.5" /> इस जमीन का स्वामित्व ट्रांसफर करें →
                    </Button>
                  </Link>

                  <Link to="/bhulekh" className="block">
                    <Button variant="outline" size="sm" className="w-full justify-center text-xs">
                      <Map size={13} className="mr-1.5 text-blue-600" /> भूलेख नक्शे पर स्थिति देखें
                    </Button>
                  </Link>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-0 shadow-md">
                <div className="flex items-center gap-1.5 text-indigo-300 text-xs font-bold mb-2">
                  <ShieldCheck size={15} className="text-emerald-400" /> सम्पूर्ण सुरक्षा गारंटी
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  इस पार्सल की वंशावली में एक भी पूर्व मालिक को बदला या हटाया नहीं जा सकता। भूमि के प्रत्येक पिछले बैनामे का पूरा विवरण, तारीख, मूल्य और रजिस्ट्री क्रमांक हमेशा के लिए संरक्षित रहता है।
                </p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
