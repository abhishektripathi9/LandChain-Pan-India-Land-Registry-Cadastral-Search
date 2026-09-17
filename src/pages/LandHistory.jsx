import { useState, useEffect } from 'react';
import { Search, History, ShieldCheck, ExternalLink, MapPin, ArrowLeftRight, Map, CheckCircle2, UserCheck, Calendar } from 'lucide-react';
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

  return (
    <DashboardLayout items={userNav} title="Land Title Provenance & History">
      <Breadcrumb items={[{ label: 'Land History' }]} />

      <div className="grid lg:grid-cols-3 gap-6 max-w-6xl">
        {/* Main Chain of Title (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    Chain of Title · स्वामित्व वंशावली
                  </span>
                  <span className="text-xs text-slate-400">कुल {ownershipChain.length} हस्तांतरण दर्ज</span>
                </div>
                <h2 className="font-display font-semibold text-lg flex items-center gap-2 text-slate-900 dark:text-white">
                  <History size={18} className="text-primary" /> पूर्व स्वामियों का ऐतिहासिक विवरण
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  इस भूमि के अब तक के सभी पंजीकृत स्वामियों की कालक्रमानुसार प्रामाणिक सूची।
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center gap-1 shrink-0">
                <ShieldCheck size={14} /> Verified On-Chain
              </span>
            </div>

            {/* Land Selector */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">
                खसरा / भूमि पार्सल चुनें (Select Parcel to View History):
              </label>
              <select
                value={selectedLandId}
                onChange={(e) => setSelectedLandId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-primary shadow-sm"
              >
                {landsList.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.id} - Khasra #{l.surveyNo} | {l.owner} ({l.village || l.location})
                  </option>
                ))}
              </select>
            </div>

            {/* Visual Provenance Chain */}
            <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {ownershipChain.map((item, idx) => (
                <div key={`${item.owner}-${idx}`} className="relative group">
                  {/* Step Pin */}
                  <div
                    className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] font-bold ${
                      item.isCurrent
                        ? 'bg-emerald-500 border-white text-white shadow-md ring-4 ring-emerald-500/20'
                        : 'bg-white dark:bg-slate-900 border-indigo-400 text-indigo-600 dark:text-indigo-400'
                    }`}
                  >
                    {idx + 1}
                  </div>

                  {/* Card Content */}
                  <div
                    className={`p-4 rounded-xl border transition-all ${
                      item.isCurrent
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {item.owner}
                          </span>
                          {item.isCurrent ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                              <CheckCircle2 size={11} /> वर्तमान सक्रिय स्वामी
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              पूर्व स्वामी (#{idx + 1})
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          पिता/पति: {item.fatherName}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                          📅 {item.date}
                        </span>
                        <span className="text-[10px] text-slate-400">{item.role}</span>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300">
                      <div>
                        <span className="text-slate-400 block text-[10px]">विलेख प्रकार (Deed Type):</span>
                        <strong>{item.deedType}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">प्रतिफल राशि (Sale Price):</span>
                        <strong className="text-emerald-600 dark:text-emerald-400">{item.consideration}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">पंजीकरण क्रमांक / बही विवरण:</span>
                        <span>{item.bahiNo}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">रजिस्ट्रार कार्यालय:</span>
                        <span>{item.subRegistrar}</span>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[10px]">
                      <span className="font-mono text-slate-400 truncate max-w-[280px]">
                        Tx: {item.txHash}
                      </span>
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <ShieldCheck size={11} /> ब्लॉकचेन पर अपरिवर्तनीय दर्ज
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Sidebar Metadata & Quick Actions */}
        {currentLand && (
          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="font-display font-semibold text-sm mb-3">Parcel Snapshot</h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Land ID</span>
                  <span className="font-bold text-primary font-mono">{currentLand.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Survey / Khasra No</span>
                  <span className="font-semibold">{currentLand.surveyNo}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Current Legal Owner</span>
                  <span className="font-bold text-slate-900 dark:text-white">{currentLand.owner}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Village / District</span>
                  <span className="font-medium">{currentLand.village || currentLand.location}, {currentLand.district}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Area Dimension</span>
                  <span className="font-medium">{currentLand.area} · {currentLand.type}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Current Valuation</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{currentLand.value}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Title Status</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    {currentLand.status}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Link to="/bhulekh" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-center text-xs">
                    <Map size={13} className="mr-1.5 text-blue-600" /> भूलेख नक्शे पर देखें
                  </Button>
                </Link>

                <Link to="/transfer" className="block">
                  <Button size="sm" className="w-full justify-center text-xs bg-emerald-600 hover:bg-emerald-500 text-white">
                    <ArrowLeftRight size={13} className="mr-1.5" /> मालिकाना हक ट्रांसफर करें
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-indigo-900 to-slate-900 text-white">
              <div className="flex items-center gap-1.5 text-indigo-300 text-xs font-bold mb-1">
                <ShieldCheck size={14} className="text-emerald-400" /> फ्रॉड-प्रूफ स्वामित्व रिकॉर्ड
              </div>
              <p className="text-[11px] text-slate-300">
                पारंपरिक कागजी रजिस्ट्रियों में पुरानी बिक्री छुपा ली जाती थी। इस ब्लॉकचेन लेजर पर हर पूर्व मालिक का नाम और खरीद-बिक्री की तारीख हमेशा के लिए सार्वजनिक और सुरक्षित रहती है।
              </p>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
