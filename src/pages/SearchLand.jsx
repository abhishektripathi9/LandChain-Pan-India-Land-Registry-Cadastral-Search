import { useState, useEffect, useMemo } from 'react';
import { 
  Search as SearchIcon, MapPin, ShieldCheck, ExternalLink, ArrowRight, 
  FileText, Map as MapIcon, Sparkles, Filter, QrCode, CreditCard, 
  Copy, Check, CheckCircle2, ChevronRight, X, Printer, History, 
  RefreshCw, UserCheck, Scale, Award, Layers, Trees, Building, BadgeAlert, ArrowUpRight
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { userNav } from '../data/navConfig';
import Breadcrumb from '../components/Breadcrumb';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { getStoredLands } from '../services/web3Service';
import { getIPFSGatewayUrl } from '../services/ipfsService';
import { 
  getEffectiveVillageLocations, 
  findOrCreateCadastralLocation, 
  generateUniqueBhuAadhar,
  getLandOwnershipHistory
} from '../data/cadastralData';
import { PAN_INDIA_STATES, resolvePanIndiaLocation } from '../data/panIndiaStateData';

export default function SearchLand() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || searchParams.get('query') || '';

  const [query, setQuery] = useState(initialQuery);
  const [categoryFilter, setCategoryFilter] = useState('All'); // 'All' | 'Agricultural' | 'Residential' | 'Commercial' | 'Government'
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Approved' | 'Pending'
  const [selectedCardParcel, setSelectedCardParcel] = useState(null);
  const [cardSide, setCardSide] = useState('front');
  const [copiedId, setCopiedId] = useState(null);

  // Sync state if URL search param changes
  useEffect(() => {
    const q = searchParams.get('q') || searchParams.get('query');
    if (q !== null && q !== query) {
      setQuery(q);
    }
  }, [searchParams]);

  // Handle Query change and update URL parameter seamlessly
  const handleQueryChange = (val) => {
    setQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val.trim() });
    } else {
      setSearchParams({});
    }
  };

  // Quick village suggestions across multiple states
  const quickVillages = [
    { name: 'Chinhat (चिनहट - UP)', queryKey: 'Chinhat' },
    { name: 'Hinjewadi (हिंजवडी - MH)', queryKey: 'Hinjewadi' },
    { name: 'Whitefield (ಬೆಂಗಳೂರು - KA)', queryKey: 'Whitefield' },
    { name: 'Sanand (સાણંદ - GJ)', queryKey: 'Sanand' },
    { name: 'Sanganer (सांगानेर - RJ)', queryKey: 'Sanganer' },
    { name: 'Danapur (दानापुर - BR)', queryKey: 'Danapur' },
    { name: 'Ayodhya (अयोध्या - UP)', queryKey: 'Ayodhya' },
    { name: 'Manesar (मानेसर - HR)', queryKey: 'Manesar' },
  ];

  // Compile Comprehensive Cadastral & On-Chain Dataset
  const allParcels = useMemo(() => {
    const effectiveVillages = getEffectiveVillageLocations();
    const list = [];

    // Check if user queried a custom location not in pre-mapped list
    const trimmedQ = query.trim();
    let dynamicVillage = null;
    if (trimmedQ && trimmedQ.length >= 3 && isNaN(trimmedQ)) {
      const exists = effectiveVillages.some(
        v => v.name.toLowerCase().includes(trimmedQ.toLowerCase()) || 
             v.englishName.toLowerCase().includes(trimmedQ.toLowerCase()) ||
             v.state?.toLowerCase().includes(trimmedQ.toLowerCase())
      );
      if (!exists) {
        dynamicVillage = findOrCreateCadastralLocation(trimmedQ);
      }
    }

    const villagesToScan = dynamicVillage ? [...effectiveVillages, dynamicVillage] : effectiveVillages;

    villagesToScan.forEach(village => {
      village.parcels.forEach(p => {
        const bhuAadhar = generateUniqueBhuAadhar(p, village);
        list.push({
          id: p.landId || `LND-${p.khasraNo}`,
          surveyNo: p.khasraNo,
          khasraNo: p.khasraNo,
          gataNo: p.gataNo || p.khasraNo,
          khataNo: p.khataNo || '00101',
          owner: p.owner,
          fatherName: p.fatherName || 'श्री पिता/संरक्षक',
          sahKhatedars: p.sahKhatedars || [],
          share: p.share || '1/1 (पूर्ण अंश)',
          village: village.name,
          englishVillage: village.englishName,
          tehsil: village.tehsil || 'सदर',
          district: village.district || 'Lucknow',
          state: village.state || 'Uttar Pradesh',
          stateCode: village.stateCode || 'UP',
          portalName: village.portalName || 'डिजिटल भूलेख',
          rorTitle: village.rorTitle || 'अधिकार अभिलेख (RoR)',
          khasraTerm: village.khasraTerm || 'खसरा संख्या',
          areaUnit: village.areaUnit || 'एकड़ / बीघा',
          location: `${village.name}, ${village.tehsil || 'सदर'}, ${village.district || 'Lucknow'} (${village.state || 'UP'})`,
          area: p.areaAcre ? `${p.areaAcre} एकड़ (${p.areaBigha || (p.areaAcre * 1.6).toFixed(2)} बीघा)` : `${p.area} sq.ft`,
          areaAcre: p.areaAcre || (p.area ? (p.area / 43560).toFixed(2) : 1.0),
          areaBigha: p.areaBigha || (p.areaAcre ? (p.areaAcre * 1.6).toFixed(2) : 1.6),
          areaHectares: p.areaHectares || (p.areaAcre ? (p.areaAcre * 0.404686).toFixed(3) : 0.405),
          areaSqFt: p.areaSqFt || (p.area || 37000),
          type: p.landType || (p.type === 'Agricultural' ? 'कृषि भूमि (1-क)' : p.type || 'कृषि भूमि'),
          category: p.landType?.includes('आवासीय') || p.type === 'Residential' ? 'Residential'
                  : p.landType?.includes('व्यावसायिक') || p.type === 'Commercial' ? 'Commercial'
                  : p.landType?.includes('चारागाह') || p.landType?.includes('ग्राम सभा') || p.landType?.includes('सार्वजनिक') ? 'Government'
                  : 'Agricultural',
          value: p.valuation || p.marketValuation || '₹35,00,000',
          circleRate: p.circleRate || village.circleRate || '₹1,850 / sq.ft',
          annualLagan: p.annualLagan || '₹45.00',
          fasliYear: village.fasliYear || '1431 - 1436',
          status: 'Approved',
          disputeStatus: p.disputeStatus || 'विवाद रहित (Clean Title)',
          bankLoan: p.bankLoan || 'ऋणमुक्त (No Encumbrance)',
          bhuAadhar: bhuAadhar,
          ipfsDocCID: p.ipfsHash || 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
          source: 'cadastral',
          rawParcel: p,
          rawVillage: village
        });
      });
    });

    // Also blend any stored smart contract lands
    const stored = getStoredLands();
    stored.forEach(sl => {
      const alreadyInList = list.some(item => item.id === sl.id || (item.surveyNo === sl.surveyNo && item.village === sl.village));
      if (!alreadyInList) {
        list.push({
          id: sl.id,
          surveyNo: sl.surveyNo,
          khasraNo: sl.surveyNo,
          gataNo: sl.surveyNo,
          khataNo: '00100',
          owner: sl.owner,
          fatherName: 'श्री पिता/संरक्षक',
          sahKhatedars: [],
          share: '1/1',
          village: sl.village || 'Chinhat (चिनहट)',
          englishVillage: sl.village || 'Chinhat',
          tehsil: 'सदर',
          district: sl.district || 'Lucknow',
          location: sl.location || `${sl.village || 'Chinhat'}, Lucknow`,
          area: sl.area || '1.0 एकड़',
          areaAcre: '1.0',
          areaBigha: '1.6',
          areaHectares: '0.405',
          areaSqFt: 43560,
          type: sl.type || 'कृषि भूमि',
          category: sl.type?.toLowerCase().includes('res') ? 'Residential' : 'Agricultural',
          value: sl.value || '₹45,00,000',
          circleRate: '₹1,850 / sq.ft',
          annualLagan: '₹50.00',
          fasliYear: '1431 - 1436',
          status: sl.status || 'Approved',
          disputeStatus: 'विवाद रहित',
          bankLoan: 'ऋणमुक्त',
          bhuAadhar: {
            ulpin: `UP09-LKO-${sl.surveyNo || '001'}-0099`,
            stateRevenueCode: `0928120021400${sl.surveyNo || '001'}`,
            villageCode: '09281200',
            centerGPS: '26.8845° N, 81.0125° E'
          },
          ipfsDocCID: sl.ipfsDocCID || 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
          source: 'onchain'
        });
      }
    });

    return list;
  }, [query]);

  // Filter based on Search Query, Status, and Category
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();

    return allParcels.filter(p => {
      // Category filter
      if (categoryFilter !== 'All' && p.category !== categoryFilter) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'All' && p.status !== statusFilter) {
        return false;
      }

      if (!q) return true;

      // Multi-criteria text matching
      const matchId = p.id?.toLowerCase().includes(q);
      const matchSurvey = p.surveyNo?.toLowerCase().includes(q) || p.khasraNo?.toLowerCase().includes(q) || p.gataNo?.toLowerCase().includes(q);
      const matchKhata = p.khataNo?.toLowerCase().includes(q);
      const matchOwner = p.owner?.toLowerCase().includes(q);
      const matchFather = p.fatherName?.toLowerCase().includes(q);
      const matchVillage = p.village?.toLowerCase().includes(q) || p.englishVillage?.toLowerCase().includes(q);
      const matchLocation = p.location?.toLowerCase().includes(q);
      const matchTehsil = p.tehsil?.toLowerCase().includes(q);
      const matchDistrict = p.district?.toLowerCase().includes(q);
      const matchUlpin = p.bhuAadhar?.ulpin?.toLowerCase().includes(q) || p.bhuAadhar?.stateRevenueCode?.toLowerCase().includes(q);

      return matchId || matchSurvey || matchKhata || matchOwner || matchFather || matchVillage || matchLocation || matchTehsil || matchDistrict || matchUlpin;
    });
  }, [allParcels, query, categoryFilter, statusFilter]);

  // Check if current search matches a specific village
  const matchedVillage = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return null;
    const effectiveVillages = getEffectiveVillageLocations();
    const found = effectiveVillages.find(
      v => v.name.toLowerCase().includes(q) || v.englishName.toLowerCase().includes(q)
    );
    if (found) return found;

    // Check if results all belong to same village
    if (results.length > 0) {
      const firstVillageName = results[0].village;
      const allSame = results.every(r => r.village === firstVillageName);
      if (allSame) {
        return {
          name: results[0].village,
          englishName: results[0].englishVillage,
          district: results[0].district,
          tehsil: results[0].tehsil,
          parcelsCount: results.length
        };
      }
    }
    return null;
  }, [query, results]);

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <DashboardLayout items={userNav} title="LandChain — Pan-India Land Registry & Cadastral Search">
      <Breadcrumb items={[{ label: 'LandChain', to: '/dashboard' }, { label: 'Search Land' }]} />

      <div className="space-y-6 max-w-6xl">
        {/* Banner: Switch to GIS Map View & Instant Traveler GPS */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border border-blue-800/40 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30 uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={12} className="text-blue-300" /> 🇮🇳 Pan-India Land Intelligence
              </span>
              <span className="text-xs text-blue-300/80">28 राज्य व 8 केंद्र शासित प्रदेशों का सम्पूर्ण भू-अभिलेख</span>
            </div>
            <h2 className="font-display font-bold text-lg md:text-xl text-white">
              LandChain — अखिल भारतीय खेत, गाटा व भू-आधार (ULPIN) खोज
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1">
              स्थान का नाम (उदा. <em>Pune, Bengaluru, Jaipur, Patna, Ahmedabad, Ayodhya, Lucknow</em>), खसरा/गट सं., 14-अंकीय भू-आधार (ULPIN) या खातेदार का नाम दर्ज करें।
            </p>
          </div>

          <div className="flex items-center gap-2.5 z-10 shrink-0">
            <Link to="/bhulekh">
              <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-900/40 transition-all transform active:scale-95">
                <MapIcon size={15} /> 🗺️ भूलेख नक्शा खोलें
              </button>
            </Link>
          </div>
        </div>

        {/* Search & Filter Card */}
        <Card className="p-5 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-800">
          <div className="flex flex-col gap-4">
            {/* Top Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <SearchIcon size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder="लोकेशन (उदा. Pune, Bengaluru, Jaipur, Ayodhya), खसरा सं., खाता सं. या 14-अंकीय भू-आधार..."
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-sm outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-950 shadow-inner transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                />
                {query && (
                  <button 
                    onClick={() => handleQueryChange('')}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full"
                    title="Clear Search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="flex gap-2 shrink-0">
                {['All', 'Approved', 'Pending'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      statusFilter === st
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {st === 'All' ? 'सभी स्थितियाँ' : st === 'Approved' ? '✓ सत्यापित (Approved)' : 'लंबित (Pending)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Pan-India State Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 border-t border-slate-100 dark:border-slate-800/80 scrollbar-none">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 shrink-0 mr-1 flex items-center gap-1">
                <span className="text-sm">🇮🇳</span> राज्य (State):
              </span>
              {[
                { code: 'ALL', name: 'अखिल भारतीय (All India)', searchKey: '' },
                { code: 'UP', name: 'उत्तर प्रदेश (UP)', searchKey: 'Lucknow' },
                { code: 'MH', name: 'महाराष्ट्र (MH - 7/12)', searchKey: 'Hinjewadi' },
                { code: 'KA', name: 'कर्नाटक (KA - RTC)', searchKey: 'Whitefield' },
                { code: 'GJ', name: 'गुजरात (GJ - AnyROR)', searchKey: 'Sanand' },
                { code: 'RJ', name: 'राजस्थान (RJ - अपना खाता)', searchKey: 'Sanganer' },
                { code: 'BR', name: 'बिहार (BR - बिहार भूमि)', searchKey: 'Danapur' },
                { code: 'HR', name: 'हरियाणा (HR - जमाबंदी)', searchKey: 'Manesar' },
                { code: 'MP', name: 'मध्य प्रदेश (MP)', searchKey: 'Rau Indore' },
                { code: 'TS', name: 'तेलंगाना (TS)', searchKey: 'Gachibowli' },
                { code: 'WB', name: 'पश्चिम बंगाल (WB)', searchKey: 'Rajarhat' },
              ].map(st => (
                <button
                  key={st.code}
                  type="button"
                  onClick={() => handleQueryChange(st.searchKey)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all shrink-0 font-medium ${
                    (!query && st.code === 'ALL') || (query && query.toLowerCase().includes(st.searchKey.toLowerCase()) && st.code !== 'ALL')
                      ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {st.name}
                </button>
              ))}
            </div>

            {/* Quick Village Pills */}
            <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 shrink-0">
                <MapPin size={12} className="text-primary" /> त्वरित केंद्र / मौजा:
              </span>
              {quickVillages.map(v => (
                <button
                  key={v.queryKey}
                  onClick={() => handleQueryChange(v.queryKey)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    query.toLowerCase() === v.queryKey.toLowerCase()
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-400 text-blue-700 dark:text-blue-300 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 shrink-0">
                <Filter size={12} className="text-slate-400" /> भूमि श्रेणी:
              </span>
              {[
                { id: 'All', label: 'सभी खेत', icon: '🌾' },
                { id: 'Agricultural', label: 'कृषि भूमि', icon: '🚜' },
                { id: 'Residential', label: 'आवासीय', icon: '🏠' },
                { id: 'Commercial', label: 'व्यावसायिक', icon: '🏢' },
                { id: 'Government', label: 'चारागाह / ग्राम सभा', icon: '🌳' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                    categoryFilter === cat.id
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Matched Village Smart Banner if Query Matches a Village */}
        {matchedVillage && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900/90 to-teal-950 text-white border border-emerald-700/50 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 text-emerald-300">
                <MapPin size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md">
                    सत्यापित मौजा (Village Match)
                  </span>
                  <span className="text-xs text-emerald-200/80">तहसील: {matchedVillage.tehsil || 'सदर'}, जनपद: {matchedVillage.district || 'Lucknow'}</span>
                </div>
                <h3 className="text-base font-bold font-display text-white mt-0.5">
                  मौजा: {matchedVillage.name} के सभी {results.length} खेत उपलब्ध हैं!
                </h3>
                <p className="text-xs text-emerald-100/80 mt-0.5">
                  आप इस गाँव के सभी खेतों को सीधे सेटेलाइट भूलेख नक्शे पर देख सकते हैं अथवा 12-कॉलम सम्पूर्ण खसरा पंजी खोल सकते हैं।
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link to={`/bhulekh?location=${encodeURIComponent(matchedVillage.englishName || matchedVillage.name)}`}>
                <button className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-all">
                  <MapIcon size={14} /> 🗺️ मौजा नक्शा
                </button>
              </Link>
              <Link to={`/bhulekh?location=${encodeURIComponent(matchedVillage.englishName || matchedVillage.name)}&view=table`}>
                <button className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center gap-1.5 transition-all">
                  <FileText size={14} /> 📋 सारे खेत (टेबल)
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Results Header and Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              कुल {results.length} खेत / गाटा मिले 
              {query && <span className="text-xs font-normal text-slate-400">(खोज: &quot;{query}&quot;)</span>}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              प्रत्येक भू-खंड विशिष्ट 14-अंकीय भू-आधार (ULPIN) व डिजिटल खतौनी से सुसज्जित है।
            </p>
          </div>
          <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg">
            लाइव ब्लॉकचेन एवं भूलेख डेटा
          </span>
        </div>

        {/* Results Grid */}
        {results.length === 0 ? (
          <Card className="p-12 text-center text-slate-500 border border-dashed border-slate-300 dark:border-slate-800">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <SearchIcon size={24} />
            </div>
            <h4 className="font-display font-semibold text-base text-slate-800 dark:text-slate-200 mb-1">
              कोई खेत या गाटा नहीं मिला
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
              &quot;{query}&quot; के लिए कोई रिकॉर्ड उपलब्ध नहीं है। कृपया खसरा संख्या (उदा. 441, 101), मौजा का नाम (उदा. Chinhat, Ayodhya) या खातेदार का नाम जांचें।
            </p>
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleQueryChange('')}>
                सभी रिकॉर्ड रीसेट करें
              </Button>
              <Link to={`/bhulekh?location=${encodeURIComponent(query || 'Ayodhya')}`}>
                <Button size="sm">
                  <MapIcon size={13} className="mr-1.5" /> इस लोकेशन को नक्शे पर खोजें
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {results.map((land) => {
              const ulpin = land.bhuAadhar?.ulpin || `UP09-LKO-${land.surveyNo}-0091`;
              const isCopied = copiedId === land.id;

              return (
                <Card key={land.id} className="p-5 hover:shadow-lg transition-all border border-slate-200/80 dark:border-slate-800 hover:border-blue-400/60 dark:hover:border-blue-500/40 group flex flex-col justify-between">
                  <div>
                    {/* Header: Khasra Badge & ULPIN & Status */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            गाटा / खसरा #{land.khasraNo}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                            🇮🇳 {land.state || 'उत्तर प्रदेश'} · {land.portalName || 'डिजिटल भूलेख'}
                          </span>
                          <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                            खाता सं. {land.khataNo}
                          </span>
                        </div>
                        <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mt-1.5">
                          खसरा संख्या #{land.khasraNo}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin size={12} className="text-rose-500 shrink-0" /> {land.location}
                        </p>
                      </div>
                      <StatusBadge status={land.status} />
                    </div>

                    {/* ULPIN (भू-आधार) Badge */}
                    <div className="mb-3 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-mono">
                        <CreditCard size={13} className="text-amber-600 dark:text-amber-400 shrink-0" />
                        <span className="text-amber-800 dark:text-amber-300 font-bold text-[11px]">भू-आधार (ULPIN):</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">{ulpin}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(ulpin, land.id)}
                        className="p-1 text-slate-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors"
                        title="Copy ULPIN"
                      >
                        {isCopied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                      </button>
                    </div>

                    {/* Owner & Khatauni Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800/80 mb-4">
                      <div>
                        <span className="text-slate-400 block text-[11px] mb-0.5">खातेदार का नाम</span>
                        <span className="font-bold text-slate-900 dark:text-white block leading-tight">{land.owner}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">पिता: {land.fatherName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px] mb-0.5">रकबा (क्षेत्रफल)</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">{land.area}</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block mt-0.5">
                          {land.areaHectares} ha · {land.share}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px] mb-0.5">बाजार मूल्य / सर्किल दर</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 block">{land.value}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{land.circleRate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px] mb-0.5">भूमि श्रेणी व उपयोग</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 block">{land.type}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">लगान: {land.annualLagan}</span>
                      </div>
                    </div>

                    {/* Legal Clean Status */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-4 px-1">
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 size={12} /> {land.disputeStatus}
                      </span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {land.bankLoan}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="grid grid-cols-2 gap-2">
                      <Link 
                        to={`/bhulekh?location=${encodeURIComponent(land.englishVillage || land.village)}&khasra=${encodeURIComponent(land.khasraNo)}`}
                        className="w-full"
                      >
                        <Button variant="outline" size="sm" className="w-full text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-xs">
                          <MapIcon size={12} className="mr-1" /> 🗺️ नक्शा देखें
                        </Button>
                      </Link>

                      <button
                        onClick={() => setSelectedCardParcel(land)}
                        className="w-full px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/30 hover:bg-amber-100/50 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                      >
                        <CreditCard size={12} /> 🪪 भू-आधार कार्ड
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link 
                        to={`/bhulekh?location=${encodeURIComponent(land.englishVillage || land.village)}&view=table`}
                        className="w-full"
                      >
                        <button className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center justify-center gap-1 transition-all">
                          <FileText size={12} /> 📋 सारे खेत (गाँव)
                        </button>
                      </Link>

                      <Link 
                        to={`/transfer?landId=${encodeURIComponent(land.id)}`}
                        className="w-full"
                      >
                        <Button size="sm" className="w-full text-xs">
                          ट्रांसफर <ArrowRight size={12} className="ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Digital Bhu-Aadhar Smart Card Modal */}
        {selectedCardParcel && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in fade-in zoom-in duration-200">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    <Award size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                      भारत सरकार — विशिष्ट भू-खंड पहचान पत्र (Bhu-Aadhar Card)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      ULPIN: Unique Land Parcel Identification Number (DILRMP)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCardParcel(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* View Switcher: Front vs Back */}
              <div className="flex justify-center mb-4">
                <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 flex gap-1 text-xs">
                  <button
                    onClick={() => setCardSide('front')}
                    className={`px-4 py-1.5 rounded-lg font-bold transition-all ${
                      cardSide === 'front'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    कार्ड का अग्र भाग (Front)
                  </button>
                  <button
                    onClick={() => setCardSide('back')}
                    className={`px-4 py-1.5 rounded-lg font-bold transition-all ${
                      cardSide === 'back'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    कार्ड का पृष्ठ भाग (Back)
                  </button>
                </div>
              </div>

              {/* Front View */}
              {cardSide === 'front' ? (
                <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white border-2 border-amber-400/50 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between pb-3 border-b border-white/15">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold">
                        🏛️
                      </div>
                      <div>
                        <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">राजस्व परिषद, उत्तर प्रदेश शासन</p>
                        <h4 className="font-display font-bold text-xs text-white">भू-आधार — विशिष्ट भू-खंड पहचान पत्र (Bhu-Aadhar)</h4>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      100% UNIQUE
                    </span>
                  </div>

                  {/* Body with Chip, Details, and QR */}
                  <div className="py-4 flex items-start gap-4">
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <div className="w-12 h-9 rounded-lg bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 border border-amber-600 shadow-md flex items-center justify-center">
                        <div className="w-8 h-5 border border-amber-700/60 rounded flex items-center justify-center">
                          <div className="w-4 h-full border-r border-amber-700/60"></div>
                        </div>
                      </div>
                      <div className="w-14 h-14 rounded-xl bg-white p-1 shadow flex items-center justify-center">
                        <QrCode size={46} className="text-slate-900" />
                      </div>
                    </div>

                    <div className="flex-1 space-y-1 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">खातेदार का नाम:</span>
                        <span className="font-bold text-sm text-white">{selectedCardParcel.owner}</span>
                        <span className="text-[10px] text-slate-300 block">पिता/पति: {selectedCardParcel.fatherName}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                        <div>
                          <span className="text-[10px] text-slate-400 block">मौजा (गाँव):</span>
                          <span className="font-semibold text-slate-200">{selectedCardParcel.village}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">तहसील व जनपद:</span>
                          <span className="font-semibold text-slate-200">{selectedCardParcel.tehsil}, {selectedCardParcel.district}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">खसरा / खाता:</span>
                          <span className="font-bold text-amber-300">#{selectedCardParcel.khasraNo} (खाता {selectedCardParcel.khataNo})</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">कुल रकबा:</span>
                          <span className="font-bold text-emerald-300">{selectedCardParcel.area}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer: 14-digit ULPIN */}
                  <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-amber-400 font-bold uppercase tracking-wider">भू-आधार संख्या (14-DIGIT ULPIN):</p>
                      <p className="text-sm font-mono font-black tracking-widest text-amber-300">
                        {selectedCardParcel.bhuAadhar?.ulpin || `UP09-LKO-${selectedCardParcel.khasraNo}-0091`}
                      </p>
                    </div>
                    <div className="text-right font-mono text-[9px] text-slate-400">
                      16-अंकीय कोड:<br />
                      <span className="text-slate-200 font-bold">{selectedCardParcel.bhuAadhar?.stateRevenueCode || '09281200214000441'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Back View */
                <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white border-2 border-amber-400/50 shadow-2xl relative">
                  <div className="text-center pb-2 border-b border-white/15">
                    <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">भूमि सीमांकन एवं विधिक विवरण (Geographic Boundary &amp; Title Details)</p>
                  </div>

                  <div className="py-3 space-y-2 text-xs">
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 font-mono text-[10px] text-slate-300">
                      <p className="font-bold text-amber-300 mb-1">📍 भू-खंड जीपीएस वर्टेक्स निर्देशांक (Polygon Boundary Coordinates):</p>
                      <div className="grid grid-cols-2 gap-1">
                        <span>V1: 26.8852° N, 81.0118° E</span>
                        <span>V2: 26.8855° N, 81.0132° E</span>
                        <span>V3: 26.8841° N, 81.0135° E</span>
                        <span>V4: 26.8839° N, 81.0120° E</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div>
                        <span className="text-slate-400 block text-[10px]">भूमि श्रेणी:</span>
                        <span className="font-semibold text-slate-200">{selectedCardParcel.type}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">विधिक स्थिति:</span>
                        <span className="font-semibold text-emerald-300">{selectedCardParcel.disputeStatus}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">सर्किल दर:</span>
                        <span className="font-semibold text-slate-200">{selectedCardParcel.circleRate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">वार्षिक मालगुजारी:</span>
                        <span className="font-semibold text-slate-200">{selectedCardParcel.annualLagan}</span>
                      </div>
                    </div>

                    <div className="pt-2 text-[10px] text-slate-400 leading-relaxed border-t border-white/10">
                      यह कार्ड उ.प्र. राजस्व संहिता 2006 एवं डिजिटल इंडिया लैंड रिकॉर्ड्स मॉडर्नाइजेशन प्रोग्राम (DILRMP) के अंतर्गत निर्गत वैधानिक इलेक्ट्रॉनिक भू-अभिलेख है।
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>तहसीलदार डिजिटल हस्ताक्षर: ✓ VERIFIED</span>
                    <span>ब्लॉकचेन ब्लॉक: #4,892,104</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setCardSide(cardSide === 'front' ? 'back' : 'front')}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw size={13} /> कार्ड पलटें (Flip Card)
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Printer size={13} /> प्रिंट / PDF डाउनलोड
                  </button>
                  <button
                    onClick={() => setSelectedCardParcel(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold"
                  >
                    बंद करें
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
