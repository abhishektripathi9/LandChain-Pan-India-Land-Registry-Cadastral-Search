import { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Search, Layers, ShieldCheck, CheckCircle2, 
  Printer, ExternalLink, Compass, Crosshair, Info, Sparkles, 
  Share2, FileText, ChevronRight, X, Building, Trees, 
  BadgeAlert, ArrowUpRight, Navigation, Phone, Check, RefreshCw,
  History, ArrowLeftRight, UserCheck, Coins, Calendar, Building2,
  Table as TableIcon, Map as MapIcon, ArrowRight, Eye, ShieldAlert, Scale,
  Filter, Download, QrCode, CreditCard, Copy, Fingerprint, Award
} from 'lucide-react';
import L from 'leaflet';
import DashboardLayout from '../layouts/DashboardLayout';
import { userNav } from '../data/navConfig';
import Breadcrumb from '../components/Breadcrumb';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { 
  villageLocations,
  getEffectiveVillageLocations, 
  findClosestCadastralLocation, 
  searchCadastralParcels,
  getLandOwnershipHistory,
  saveParcelOwnerOverride,
  findOrCreateCadastralLocation,
  generateUniqueBhuAadhar
} from '../data/cadastralData';
import { PAN_INDIA_STATES, resolvePanIndiaLocation } from '../data/panIndiaStateData';
import { transferLandOwnershipOnChain } from '../services/web3Service';
import { useWallet } from '../context/WalletContext';
import { getIPFSGatewayUrl } from '../services/ipfsService';
import { Link } from 'react-router-dom';

export default function BhulekhMap() {
  const { address } = useWallet();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersGroupRef = useRef(null);
  const userMarkerRef = useRef(null);

  // Active village and parcel state with dynamic overrides and URL parameter support
  const effectiveVillages = getEffectiveVillageLocations();
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialLocParam = urlParams?.get('location');
  const initialVillage = initialLocParam ? findOrCreateCadastralLocation(initialLocParam) : effectiveVillages[0];
  const [selectedVillage, setSelectedVillage] = useState(initialVillage);
  const [selectedParcel, setSelectedParcel] = useState(initialVillage.parcels[0]);
  const [selectedStateCode, setSelectedStateCode] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState(initialLocParam || '');
  const [searchResults, setSearchResults] = useState([]);
  const [activeBaseLayer, setActiveBaseLayer] = useState('satellite'); // 'satellite' | 'hybrid' | 'streets'
  const [activeViewMode, setActiveViewMode] = useState(urlParams?.get('view') === 'table' ? 'all-khets' : 'map'); // 'map' | 'all-khets'
  const [filterKhasraText, setFilterKhasraText] = useState('');
  const [showVillagePrintModal, setShowVillagePrintModal] = useState(urlParams?.get('modal') === 'print');
  const [locatingUser, setLocatingUser] = useState(false);
  const [gpsNotice, setGpsNotice] = useState(null);
  const [filterType, setFilterType] = useState('All'); // 'All' | 'Agricultural' | 'Residential' | 'Commercial'
  const [showKhatauniModal, setShowKhatauniModal] = useState(false);
  const [showBhuAadharModal, setShowBhuAadharModal] = useState(urlParams?.get('modal') === 'bhu-aadhar');
  const [cardSide, setCardSide] = useState('front'); // 'front' | 'back'
  const [copiedBhuAadhar, setCopiedBhuAadhar] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', offerPrice: '', message: '' });

  // Ownership History (Chain of Title) and Direct Transfer state
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(null);
  const [transferForm, setTransferForm] = useState({
    buyerName: '',
    fatherName: '',
    buyerAddress: '',
    salePrice: '₹45,00,000',
    transferReason: 'पंजीकृत विक्रय विलेख (Registered Sale Deed & Mutation)',
  });

  // Map Tile Layers
  const tileLayers = useRef({
    satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; World Imagery',
      maxZoom: 19,
    }),
    hybrid: L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CartoDB &copy; OpenStreetMap',
      maxZoom: 19,
    }),
    streets: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }),
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: selectedVillage.coordinates,
        zoom: selectedVillage.zoomLevel || 16,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Add default tile layer
      tileLayers.current.satellite.addTo(map);

      // Create layer group for parcel polygons & labels
      const group = L.featureGroup().addTo(map);
      layersGroupRef.current = group;
      mapInstanceRef.current = map;

      // Handle resize
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when layer switch changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    Object.values(tileLayers.current).forEach((l) => map.removeLayer(l));
    tileLayers.current[activeBaseLayer].addTo(map);
  }, [activeBaseLayer]);

  // Render Village & Parcels on Map
  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;
    const group = layersGroupRef.current;
    group.clearLayers();

    const filteredParcels = selectedVillage.parcels.filter((p) => {
      if (filterType === 'All') return true;
      if (filterType === 'Agricultural') return p.landType.includes('Agricultural') || p.landType.includes('कृषि');
      if (filterType === 'Residential') return p.landType.includes('Residential') || p.landType.includes('आवासीय');
      if (filterType === 'Commercial') return p.landType.includes('Commercial') || p.landType.includes('Industrial');
      return true;
    });

    filteredParcels.forEach((parcel) => {
      const isSelected = selectedParcel && selectedParcel.khasraNo === parcel.khasraNo;

      // Determine polygon styling based on status and type
      let strokeColor = '#3B82F6';
      let fillColor = '#3B82F6';

      if (parcel.landType.includes('Government') || parcel.khasraNo.includes('Gram')) {
        strokeColor = '#EF4444';
        fillColor = '#EF4444';
      } else if (parcel.blockchainStatus === 'Approved') {
        strokeColor = '#10B981';
        fillColor = '#10B981';
      } else if (parcel.blockchainStatus === 'Pending') {
        strokeColor = '#F59E0B';
        fillColor = '#F59E0B';
      }

      if (isSelected) {
        strokeColor = '#2563EB';
        fillColor = '#3B82F6';
      }

      const polygon = L.polygon(parcel.polygon, {
        color: isSelected ? '#60A5FA' : strokeColor,
        weight: isSelected ? 3.5 : 2,
        fillColor: fillColor,
        fillOpacity: isSelected ? 0.45 : 0.22,
        dashArray: isSelected ? '4, 4' : null,
      });

      // Hover tooltip
      polygon.bindTooltip(
        `<div class="text-xs p-1">
          <div class="font-bold text-slate-900">खसरा सं. ${parcel.khasraNo}</div>
          <div class="text-slate-600">${parcel.owner}</div>
          <div class="text-emerald-600 font-semibold">${parcel.areaAcre} एकड़ (${parcel.areaBigha} बीघा)</div>
        </div>`,
        { permanent: false, direction: 'top', className: 'rounded-lg shadow-lg' }
      );

      // On parcel click
      polygon.on('click', () => {
        setSelectedParcel(parcel);
      });

      group.addLayer(polygon);

      // Add prominent Khasra Number badge at parcel center
      const labelHtml = `
        <div class="khasra-label-badge ${isSelected ? 'active-parcel' : ''}">
          <span style="font-size: 10px; opacity: 0.85;">खसरा </span>${parcel.khasraNo}
        </div>
      `;

      const labelMarker = L.marker(parcel.center, {
        icon: L.divIcon({
          className: 'custom-khasra-badge',
          html: labelHtml,
          iconSize: [80, 24],
          iconAnchor: [40, 12],
        }),
      });

      labelMarker.on('click', () => {
        setSelectedParcel(parcel);
      });

      group.addLayer(labelMarker);
    });

    // Fly to village if village changed
    mapInstanceRef.current.flyTo(selectedVillage.coordinates, selectedVillage.zoomLevel || 16, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [selectedVillage, selectedParcel?.khasraNo, filterType]);

  // Handle Search Input
  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (!val || val.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const res = searchCadastralParcels(val);
    setSearchResults(res.slice(0, 6));
  };

  const handleSelectSearchResult = (result) => {
    const allVils = getEffectiveVillageLocations();
    const foundVillage = allVils.find((v) => v.id === result.villageId);
    if (foundVillage) {
      setSelectedVillage(foundVillage);
      const foundParcel = foundVillage.parcels.find((p) => p.khasraNo === result.khasraNo);
      if (foundParcel) {
        setSelectedParcel(foundParcel);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo(foundParcel.center, 17, { duration: 1.2 });
        }
      }
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery || !searchQuery.trim()) return;

    const village = findOrCreateCadastralLocation(searchQuery);
    if (village) {
      setSelectedVillage(village);
      setSelectedParcel(village.parcels[0]);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo(village.coordinates, village.zoomLevel || 16, { duration: 1.2 });
      }
      setSearchQuery('');
      setSearchResults([]);
      setGpsNotice(`✅ मौजा ${village.name} के सभी ${village.parcels.length} खेतों का सम्पूर्ण भूलेख विवरण लोड हो गया!`);
    }
  };

  // Live GPS Location Detection (On-the-go Traveler Mode)
  const handleLocateMe = () => {
    setLocatingUser(true);
    setGpsNotice('Detecting your GPS coordinates on the road...');

    if (!navigator.geolocation) {
      // Fallback simulation for browsers without GPS permission
      simulateUserGpsLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        applyDetectedLocation(latitude, longitude);
      },
      (err) => {
        console.warn('Geolocation denied or failed, using simulated field location near Lucknow:', err.message);
        // Realistic simulation near Chinhat so user sees instantaneous on-the-go detection
        simulateUserGpsLocation();
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  const simulateUserGpsLocation = () => {
    // Road spot adjacent to Chinhat agricultural field 441/2A
    const simLat = 26.8856;
    const simLng = 81.0150;
    setTimeout(() => {
      applyDetectedLocation(simLat, simLng);
    }, 600);
  };

  const applyDetectedLocation = (lat, lng) => {
    setLocatingUser(false);
    const result = findClosestCadastralLocation(lat, lng);

    setSelectedVillage(result.village);
    setSelectedParcel(result.parcel);

    setGpsNotice(`📍 You are standing near ${result.village.name}, Khasra #${result.parcel.khasraNo} (${result.parcel.owner})`);

    if (mapInstanceRef.current) {
      // Remove previous GPS marker if any
      if (userMarkerRef.current) {
        mapInstanceRef.current.removeLayer(userMarkerRef.current);
      }

      const gpsIcon = L.divIcon({
        className: 'pulsing-gps-container',
        html: `
          <div class="pulsing-gps-pin">
            <div class="pulse-wave"></div>
            <div class="core-dot"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([lat, lng], { icon: gpsIcon }).addTo(mapInstanceRef.current);
      marker.bindPopup(`<b>📍 Your Current Location</b><br/>Next to Khasra #${result.parcel.khasraNo}`).openPopup();
      userMarkerRef.current = marker;

      mapInstanceRef.current.flyTo([lat, lng], 17, { duration: 1.5 });
    }

    setTimeout(() => {
      setGpsNotice(null);
    }, 9000);
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => {
      setShowInquiryModal(false);
      setInquirySent(false);
      setInquiryForm({ name: '', phone: '', offerPrice: '', message: '' });
    }, 2000);
  };

  const generateTestAddress = () => {
    const randomHex = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setTransferForm((prev) => ({ ...prev, buyerAddress: randomHex }));
  };

  const handleExecuteTransfer = async (e) => {
    e.preventDefault();
    if (!transferForm.buyerName || !transferForm.buyerAddress) return;
    setTransferring(true);
    setTransferSuccess(null);

    try {
      const res = await transferLandOwnershipOnChain({
        landId: selectedParcel.landId,
        buyerName: transferForm.buyerName,
        buyerAddress: transferForm.buyerAddress,
        fatherName: transferForm.fatherName,
        transferReason: transferForm.transferReason,
        salePrice: transferForm.salePrice,
        account: address,
      });

      // Update parcel in current state
      const updatedParcel = {
        ...selectedParcel,
        owner: transferForm.buyerName,
        fatherName: transferForm.fatherName || selectedParcel.fatherName,
        registrationTx: res.txHash,
      };

      setSelectedParcel(updatedParcel);
      setTransferSuccess({
        ...res,
        newOwner: transferForm.buyerName,
        previousOwner: selectedParcel.owner,
      });

      // Refresh village locations
      const refreshed = getEffectiveVillageLocations();
      const currentVil = refreshed.find((v) => v.id === selectedVillage.id);
      if (currentVil) setSelectedVillage(currentVil);
    } catch (err) {
      console.error('Transfer failed', err);
    } finally {
      setTransferring(false);
    }
  };

  // Helper to fly to parcel on map
  const handleFocusOnMap = (parcel) => {
    setSelectedParcel(parcel);
    setActiveViewMode('map');
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo(parcel.center, 17, { duration: 1.2 });
      }
    }, 150);
  };

  // Ensure Leaflet resizes properly when switching back to Map view
  useEffect(() => {
    if (activeViewMode === 'map' && mapInstanceRef.current) {
      const timer = setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [activeViewMode]);

  // Aggregated Village Statistics for All Fields View
  const totalParcelsCount = selectedVillage.parcels?.length || 0;
  const totalAcreArea = selectedVillage.parcels
    ? selectedVillage.parcels.reduce((sum, p) => sum + (Number(p.areaAcre) || 0), 0).toFixed(2)
    : '0.00';
  const totalHectareArea = selectedVillage.parcels
    ? selectedVillage.parcels.reduce((sum, p) => sum + (Number(p.areaHectare) || 0), 0).toFixed(3)
    : '0.000';
  const totalBighaArea = (Number(totalAcreArea) * 1.6).toFixed(2);
  const uniqueOwners = new Set(selectedVillage.parcels?.map((p) => p.owner) || []);
  const totalOwnersCount = uniqueOwners.size;

  const totalValuationNumber = selectedVillage.parcels
    ? selectedVillage.parcels.reduce((sum, p) => {
        const cleaned = (p.marketValue || '').replace(/[^\d]/g, '');
        return sum + (Number(cleaned) || 0);
      }, 0)
    : 0;

  const formattedTotalValuation =
    totalValuationNumber >= 10000000
      ? `₹${(totalValuationNumber / 10000000).toFixed(2)} करोड़`
      : totalValuationNumber >= 100000
      ? `₹${(totalValuationNumber / 100000).toFixed(1)} लाख`
      : `₹${totalValuationNumber.toLocaleString('en-IN')}`;

  const cleanTitleCount = selectedVillage.parcels
    ? selectedVillage.parcels.filter(
        (p) =>
          !p.encumbranceStatus?.toLowerCase().includes('bank') &&
          !p.encumbranceStatus?.toLowerCase().includes('loan') &&
          !p.encumbranceStatus?.toLowerCase().includes('बंधक')
      ).length
    : 0;
  const cleanTitlePct = totalParcelsCount > 0 ? Math.round((cleanTitleCount / totalParcelsCount) * 100) : 100;

  // Filtered parcels for the table
  const tableParcels = (selectedVillage.parcels || []).filter((p) => {
    if (filterType !== 'All') {
      if (filterType === 'Agricultural' && !p.landType.includes('Agricultural') && !p.landType.includes('कृषि')) return false;
      if (filterType === 'Residential' && !p.landType.includes('Residential') && !p.landType.includes('आवासीय') && !p.landType.includes('आबादी')) return false;
      if (filterType === 'Commercial' && !p.landType.includes('Commercial') && !p.landType.includes('Industrial') && !p.landType.includes('वेयरहाउसिंग')) return false;
      if (filterType === 'Government' && !p.landType.includes('Government') && !p.khasraNo.includes('Gram') && !p.khasraNo.includes('चारागाह')) return false;
    }
    if (!filterKhasraText || !filterKhasraText.trim()) return true;
    const q = filterKhasraText.toLowerCase().trim();
    return (
      p.khasraNo?.toLowerCase().includes(q) ||
      p.gataNo?.toLowerCase().includes(q) ||
      p.khataNo?.toLowerCase().includes(q) ||
      p.owner?.toLowerCase().includes(q) ||
      p.fatherName?.toLowerCase().includes(q) ||
      p.landId?.toLowerCase().includes(q)
    );
  });

  const activeBhuAadhar = selectedParcel ? generateUniqueBhuAadhar(selectedParcel, selectedVillage) : null;
  const handleCopyBhuAadhar = (text) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedBhuAadhar(true);
    setTimeout(() => setCopiedBhuAadhar(false), 2000);
  };

  return (
    <DashboardLayout items={userNav} title="LandChain — Pan-India Cadastral GIS & Land Records">
      <Breadcrumb items={[{ label: 'LandChain', to: '/dashboard' }, { label: 'Search Land', to: '/search' }, { label: 'Cadastral GIS (RoR)' }]} />

      {/* Top Traveler Alert & Action Bar */}
      <div className="mb-4">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30 uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={11} /> 🇮🇳 Pan-India Digital Land Records
              </span>
              <span className="text-xs text-slate-300">28 राज्य व 8 केंद्र शासित प्रदेश (All States &amp; UTs)</span>
            </div>
            <h1 className="text-lg md:text-xl font-display font-bold text-white">
              LandChain Cadastral GIS — All-India Khet &amp; Khasra Explorer
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
              Spotted a farm or plot anywhere in India? Enter any location (उदा. <em>Pune, Bengaluru, Jaipur, Patna, Ahmedabad, Ayodhya, Lucknow</em>) or tap <strong>&quot;Locate Me&quot;</strong> to reveal boundary plots, state RoR, and 14-digit Bhu-Aadhar!
            </p>
          </div>

          <div className="flex items-center gap-2.5 z-10 shrink-0">
            <button
              onClick={handleLocateMe}
              disabled={locatingUser}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md hover:shadow-emerald-500/25 transition-all transform active:scale-95 disabled:opacity-50"
            >
              <Crosshair size={15} className={locatingUser ? 'animate-spin' : ''} />
              {locatingUser ? 'Detecting Location...' : '📍 Meri Live Location (GPS)'}
            </button>
            
            <Link to="/search">
              <button className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs backdrop-blur-sm border border-white/15 transition-colors">
                List View
              </button>
            </Link>
          </div>
        </div>

        {/* GPS Notification Toast if active */}
        {gpsNotice && (
          <div className="mt-2.5 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between shadow-sm animate-fadeIn">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
              {gpsNotice}
            </span>
            <button onClick={() => setGpsNotice(null)} className="text-emerald-600 hover:text-emerald-800">
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Search, Layer & Quick Village Selection Bar */}
      <Card className="p-3.5 mb-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Location / Khasra Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="लोकेशन या गाँव दर्ज करें (उदा. Chinhat, Malihabad, Gomti Nagar, Ayodhya, Sitapur) या खसरा नं...."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-primary shadow-sm"
              />

              {/* Autocomplete Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden max-h-72 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-semibold tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-800">
                    Cadastral Results ({searchResults.length})
                  </div>
                  {searchResults.map((res) => (
                    <button
                      key={`${res.villageId}-${res.khasraNo}`}
                      type="button"
                      onClick={() => handleSelectSearchResult(res)}
                      className="w-full px-3.5 py-2.5 text-left text-xs hover:bg-blue-50 dark:hover:bg-slate-800/80 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 last:border-0"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white mr-2">
                          खसरा #{res.khasraNo}
                        </span>
                        <span className="text-slate-500">· {res.owner}</span>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {res.villageName} ({res.tehsil}, {res.district})
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold text-emerald-600 block">{res.areaAcre} एकड़</span>
                        <span className="text-[10px] text-primary">{res.landType.split('/')[0]}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all shrink-0 active:scale-95"
            >
              <Search size={14} />
              <span>खोजें</span>
            </button>
          </form>

          {/* Map Base Layer Switcher (Satellite / BhuNaksha / Topo) */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 w-full md:w-auto justify-center">
            <button
              onClick={() => setActiveBaseLayer('satellite')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeBaseLayer === 'satellite'
                  ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              🛰️ Satellite
            </button>
            <button
              onClick={() => setActiveBaseLayer('hybrid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeBaseLayer === 'hybrid'
                  ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              🗺️ BhuNaksha
            </button>
            <button
              onClick={() => setActiveBaseLayer('streets')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeBaseLayer === 'streets'
                  ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              🗾 Topo
            </button>
          </div>
        </div>

        {/* Pan-India State Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 pb-1 border-t border-slate-100 dark:border-slate-800 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <span className="text-sm">🇮🇳</span> राज्य (State):
          </span>
          {[
            { code: 'ALL', name: 'अखिल भारतीय (All India)', sampleLoc: 'Chinhat' },
            { code: 'UP', name: 'उत्तर प्रदेश (UP - भूलेख)', sampleLoc: 'Chinhat' },
            { code: 'MH', name: 'महाराष्ट्र (MH - महाभूलेख ७/१२)', sampleLoc: 'Hinjewadi Pune' },
            { code: 'KA', name: 'कर्नाटक (KA - Bhoomi RTC)', sampleLoc: 'Whitefield Bengaluru' },
            { code: 'GJ', name: 'गुजरात (GJ - AnyROR)', sampleLoc: 'Sanand Ahmedabad' },
            { code: 'RJ', name: 'राजस्थान (RJ - अपना खाता)', sampleLoc: 'Sanganer Jaipur' },
            { code: 'BR', name: 'बिहार (BR - बिहार भूमि)', sampleLoc: 'Danapur Patna' },
            { code: 'HR', name: 'हरियाणा (HR - जमाबंदी)', sampleLoc: 'Manesar Gurugram' },
            { code: 'MP', name: 'मध्य प्रदेश (MP - भूलेख)', sampleLoc: 'Rau Indore' },
            { code: 'TS', name: 'तेलंगाना (TS - Dharani)', sampleLoc: 'Gachibowli Hyderabad' },
            { code: 'WB', name: 'पश्चिम बंगाल (WB - Banglarbhumi)', sampleLoc: 'Rajarhat Kolkata' },
            { code: 'DL', name: 'दिल्ली (DL - DLRC)', sampleLoc: 'Mehrauli Delhi' },
            { code: 'PB', name: 'पंजाब (PB - PLRS)', sampleLoc: 'Ludhiana Punjab' },
            { code: 'UK', name: 'उत्तराखंड (UK - देवभूमि)', sampleLoc: 'Dehradun' },
          ].map((st) => (
            <button
              key={st.code}
              type="button"
              onClick={() => {
                setSelectedStateCode(st.code);
                const targetVil = findOrCreateCadastralLocation(st.sampleLoc);
                setSelectedVillage(targetVil);
                setSelectedParcel(targetVil.parcels[0]);
                if (mapInstanceRef.current && targetVil.coordinates) {
                  mapInstanceRef.current.flyTo(targetVil.coordinates, targetVil.zoomLevel || 16, { duration: 1.2 });
                }
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                selectedStateCode === st.code
                  ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/30 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st.name}
            </button>
          ))}
        </div>

        {/* Quick Village Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Building2 size={12} /> मौजा / गाँव:
          </span>
          {effectiveVillages.map((vil) => (
            <button
              key={vil.id}
              onClick={() => {
                setSelectedVillage(vil);
                setSelectedParcel(vil.parcels[0]);
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.flyTo(vil.coordinates, vil.zoomLevel || 16, { duration: 1.2 });
                }
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-all ${
                selectedVillage.id === vil.id
                  ? 'bg-primary text-white shadow-sm ring-2 ring-primary/30 font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {vil.name}
            </button>
          ))}
        </div>
      </Card>

      {/* Mauja Header & View Mode Switcher Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-primary flex items-center justify-center font-bold text-xl shadow-inner shrink-0">
            🏛️
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display font-bold text-base md:text-lg text-slate-900 dark:text-white">
                मौजा: {selectedVillage.name}
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-300 dark:border-emerald-800">
                🇮🇳 {selectedVillage.state || 'उत्तर प्रदेश'} ({selectedVillage.portalName || 'डिजिटल भूलेख'})
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/40 text-primary font-semibold text-xs border border-blue-200 dark:border-blue-800">
                तहसील: {selectedVillage.tehsil}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs">
                जनपद: {selectedVillage.district}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>अभिलेख: <strong>{selectedVillage.rorTitle || 'खतौनी (RoR)'}</strong></span>
              <span>• सर्किल दर: <strong className="text-slate-700 dark:text-slate-300">{selectedVillage.circleRatePerSqFt}</strong></span>
              <span>• कुल भू-खंड (खेत): <strong className="text-emerald-600">{selectedVillage.parcels.length} खसरा/गाटा</strong></span>
            </p>
          </div>
        </div>

        {/* Mode Switcher + Print Village Button */}
        <div className="flex flex-wrap items-center gap-2.5 justify-end">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shadow-inner border border-slate-200/50 dark:border-slate-700/50">
            <button
              onClick={() => setActiveViewMode('map')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeViewMode === 'map'
                  ? 'bg-white dark:bg-slate-900 text-primary shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MapIcon size={14} />
              <span>भूलेख नक्शा (Map View)</span>
            </button>
            <button
              onClick={() => setActiveViewMode('all-khets')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeViewMode === 'all-khets'
                  ? 'bg-white dark:bg-slate-900 text-primary shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <TableIcon size={14} />
              <span>सारे खेत का विवरण ({selectedVillage.parcels.length})</span>
            </button>
          </div>

          <button
            onClick={() => setShowVillagePrintModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm shrink-0"
            title="इस मौजा के सभी खेतों का सम्मिलित खतौनी रजिस्टर प्रिंट करें"
          >
            <Printer size={14} className="text-blue-400" />
            <span>सम्पूर्ण मौजा खतौनी प्रिंट</span>
          </button>
        </div>
      </div>

      {/* Conditional Content: Map View OR All Fields Data Register */}
      {activeViewMode === 'map' ? (
        <div className="grid lg:grid-cols-12 gap-5 items-start">
          {/* Left Side: Map Viewport + Khasra Chips (8 Cols) */}
          <div className="lg:col-span-8 space-y-3">
            {/* Leaflet Map Display Box */}
            <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md relative">
              {/* Map Header Indicator Overlay */}
              <div className="absolute top-3 left-3 z-[400] bg-slate-900/85 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl border border-white/10 shadow-lg text-xs flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span>
                  <strong>{selectedVillage.name}</strong> · {selectedVillage.parcels.length} Khasras Mapped
                </span>
                <span className="text-slate-400 text-[10px] border-l border-slate-700 pl-2">
                  Circle: {selectedVillage.circleRatePerSqFt}
                </span>
              </div>

              {/* Map Legend Overlay */}
              <div className="absolute bottom-3 left-3 z-[400] bg-slate-900/85 backdrop-blur-md text-white p-2.5 rounded-xl border border-white/10 shadow-lg text-[11px] space-y-1 hidden sm:block">
                <div className="font-semibold text-slate-300 text-[10px] uppercase tracking-wider mb-1">
                  नक्शा संकेत (Legend)
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-emerald-500 border border-white/40"></span>
                  <span>सत्यापित ऑन-चेन (Approved)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-amber-500 border border-white/40"></span>
                  <span>जांच प्रक्रियाधीन (Pending)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-blue-500 border border-white/40"></span>
                  <span>आवासीय / व्यावसायिक (Commercial)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-red-500 border border-white/40"></span>
                  <span>ग्राम सभा / चारागाह (Govt Land)</span>
                </div>
              </div>

              {/* Map Viewport */}
              <div
                ref={mapContainerRef}
                className="w-full h-[520px] md:h-[600px] z-0 cursor-crosshair bg-slate-950"
              />
            </Card>

            {/* Khasra Quick Select Chips within this Village */}
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Compass size={14} className="text-primary" />
                  मौजा {selectedVillage.name} के कुल खसरा नंबर ({selectedVillage.parcels.length})
                </span>
                <span className="text-[11px] text-slate-400">Click any plot to focus</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {selectedVillage.parcels.map((p) => {
                  const isSelected = selectedParcel && selectedParcel.khasraNo === p.khasraNo;
                  return (
                    <button
                      key={p.khasraNo}
                      onClick={() => {
                        setSelectedParcel(p);
                        if (mapInstanceRef.current) {
                          mapInstanceRef.current.flyTo(p.center, 17, { duration: 1 });
                        }
                      }}
                      className={`p-2 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10 ring-2 ring-primary/40 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                          #{p.khasraNo}
                        </span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            p.blockchainStatus === 'Approved'
                              ? 'bg-emerald-500'
                              : p.blockchainStatus === 'Pending'
                              ? 'bg-amber-500'
                              : 'bg-blue-500'
                          }`}
                        />
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">{p.owner.split(' ')[0]}</div>
                      <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {p.areaAcre} ac
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side: Bhoolekh Khatauni & Plot Details Inspector (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            {selectedParcel ? (
              <Card className="p-5 shadow-lg border border-slate-200 dark:border-slate-800 relative">
                {/* Card Official Header */}
                <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-primary font-mono text-[11px] font-bold">
                        गाटा सं. {selectedParcel.gataNo || selectedParcel.khasraNo}
                      </span>
                      <span className="text-[11px] text-slate-400">खाता सं. {selectedParcel.khataNo}</span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mt-1">
                      खसरा संख्या #{selectedParcel.khasraNo}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={12} className="text-slate-400" />
                      {selectedVillage.name}, {selectedVillage.tehsil}
                    </p>
                  </div>
                  <StatusBadge status={selectedParcel.blockchainStatus} />
                </div>

                {/* Khatauni Details Grid */}
                <div className="space-y-3 text-xs">
                  {/* Primary Owner Box */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      खातेदार का नाम (Landowner)
                    </span>
                    <div className="font-semibold text-sm text-slate-900 dark:text-white">
                      {selectedParcel.owner}
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      पिता/पति: {selectedParcel.fatherName}
                    </div>
                    {selectedParcel.coOwners && selectedParcel.coOwners.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                        <span className="font-medium text-slate-700 dark:text-slate-300">सह-खातेदार: </span>
                        {selectedParcel.coOwners.join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Area Metrics Multi-Unit Matrix */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                      क्षेत्रफल विवरण (Area Dimensions)
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 block font-medium">एकड़ (Acre)</span>
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{selectedParcel.areaAcre} एकड़</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium">बीघा - बिस्वा</span>
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {selectedParcel.areaBigha} बीघा ({selectedParcel.areaBiswa} बिस्वा)
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                        <span className="text-[10px] text-slate-400 block">हेक्टेयर (Hectare)</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedParcel.areaHectare} ha</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                        <span className="text-[10px] text-slate-400 block">वर्ग फीट (Sq. Ft)</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {selectedParcel.areaSqFt?.toLocaleString()} sq.ft
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Valuation & Classification */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">भूमि प्रकार</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedParcel.landType}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">भूमि श्रेणी</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{selectedParcel.landCategory || 'संक्रमणीय भूमिधर'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">मृदा / सिंचाई</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{selectedParcel.soilIrrigation}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">सड़क संपर्क (Road)</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{selectedParcel.roadFrontage}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500">अनुमानित बाजार मूल्य</span>
                      <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                        {selectedParcel.marketValue}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">शासकीय सर्किल वैल्यू</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{selectedParcel.circleValue}</span>
                    </div>
                  </div>

                  {/* Encumbrance & Legal Health */}
                  <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-semibold text-xs">
                      <ShieldCheck size={14} /> विधिक एवं विवाद जांच (Legal Status)
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                      • बंधक/ऋण: <strong className="text-slate-800 dark:text-slate-200">{selectedParcel.encumbranceStatus}</strong>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                      • न्यायालय वाद: <strong className="text-slate-800 dark:text-slate-200">{selectedParcel.disputeStatus}</strong>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                      • लगान स्थिति: <strong className="text-slate-800 dark:text-slate-200">{selectedParcel.annualRevenueLagan || selectedParcel.taxStatus}</strong>
                    </div>
                  </div>

                  {/* Blockchain Proof Bar */}
                  <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1">
                        <Sparkles size={12} className="text-primary" /> स्मार्ट कॉन्ट्रैक्ट लेजर आईडी
                      </span>
                      <span className="font-mono text-[11px] font-bold text-primary">{selectedParcel.landId}</span>
                    </div>
                    <div className="font-mono text-[10px] text-slate-400 truncate">
                      Tx: {selectedParcel.registrationTx}
                    </div>
                    {selectedParcel.ipfsDocCID && (
                      <div className="mt-1.5">
                        <a
                          href={getIPFSGatewayUrl(selectedParcel.ipfsDocCID)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-primary font-semibold hover:underline flex items-center gap-1"
                        >
                          <FileText size={12} /> IPFS प्रमाणित सेल डीड अभिलेख <ExternalLink size={10} />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Unique Bhu-Aadhar (ULPIN) & 16-Digit Revenue Code Box */}
                  {activeBhuAadhar && (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-emerald-500/10 to-blue-500/15 border border-amber-300/80 dark:border-amber-600/50 shadow-sm relative overflow-hidden">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                          <span className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1">
                            <Fingerprint size={13} className="text-amber-600 dark:text-amber-400" />
                            विशिष्ट भू-आधार (ULPIN)
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          100% Unique Parcel
                        </span>
                      </div>

                      <div className="bg-white/90 dark:bg-slate-900/90 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 font-mono">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 dark:text-slate-400 text-[10px]">14-अंकीय भू-आधार:</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-amber-600 dark:text-amber-400 tracking-wider">
                              {activeBhuAadhar.ulpin}
                            </span>
                            <button
                              onClick={() => handleCopyBhuAadhar(activeBhuAadhar.ulpin)}
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
                              title="कॉपी करें"
                            >
                              <Copy size={12} className={copiedBhuAadhar ? 'text-emerald-500' : ''} />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 dark:text-slate-400 text-[10px]">16-अंकीय राजस्व कोड:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {activeBhuAadhar.revenueCode16}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                          <span>जियो-टैग वर्टिसेस:</span>
                          <span className="text-emerald-600 font-semibold">{activeBhuAadhar.geoHash}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setCardSide('front');
                          setShowBhuAadharModal(true);
                        }}
                        className="w-full mt-2.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                      >
                        <CreditCard size={14} />
                        <span>🪪 डिजिटल भू-आधार कार्ड देखें (ID Card)</span>
                      </button>
                    </div>
                  )}

                  {/* Primary Action Buttons */}
                  <div className="space-y-2 pt-2">
                    {/* History & Transfer Title Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => setShowHistoryModal(true)}
                        className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <History size={14} /> पूर्व मालिक इतिहास
                      </Button>

                      <Button
                        onClick={() => {
                          setTransferSuccess(null);
                          setTransferForm({
                            buyerName: '',
                            fatherName: '',
                            buyerAddress: '',
                            salePrice: selectedParcel.marketValue || '₹45,00,000',
                            transferReason: 'पंजीकृत विक्रय विलेख (Registered Sale Deed & Mutation)',
                          });
                          setShowTransferModal(true);
                        }}
                        className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <ArrowLeftRight size={14} /> मालिकाना हक ट्रांसफर
                      </Button>
                    </div>

                    <Button
                      onClick={() => setShowKhatauniModal(true)}
                      className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-md text-xs flex items-center gap-2"
                    >
                      <Printer size={15} /> प्रमाणित डिजिटल खतौनी पर्ची (Print ROR)
                    </Button>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedParcel.center[0]},${selectedParcel.center[1]}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full"
                      >
                        <Button variant="outline" size="sm" className="w-full justify-center text-xs">
                          <Navigation size={13} className="mr-1 text-emerald-600" /> खेत का रास्ता
                        </Button>
                      </a>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowInquiryModal(true)}
                        className="w-full justify-center text-xs text-primary"
                      >
                        खरीदने हेतु पूछताछ
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center text-slate-400">
                <MapPin size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Click any khet / field on the map to inspect its complete official Bhulekh Khatauni record.</p>
              </Card>
            )}
          </div>
        </div>
      ) : (
        /* activeViewMode === 'all-khets' -> Render Comprehensive Bhoolekh Register of ALL FIELDS */
        <div className="space-y-4">
          {/* Location Summary KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">🌾 कुल खेत / गाटा</span>
              <div className="text-xl font-display font-bold text-slate-900 dark:text-white mt-1">
                {totalParcelsCount} खसरा
              </div>
              <span className="text-[10px] text-emerald-600 font-medium mt-0.5 block">100% जियो-रेफरेन्स्ड</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">📐 कुल रकबा (मौजा)</span>
              <div className="text-xl font-display font-bold text-slate-900 dark:text-white mt-1">
                {totalAcreArea} एकड़
              </div>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
                {totalHectareArea} ha · {totalBighaArea} बीघा
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">👥 कुल खातेदार</span>
              <div className="text-xl font-display font-bold text-slate-900 dark:text-white mt-1">
                {totalOwnersCount} व्यक्ति
              </div>
              <span className="text-[10px] text-blue-600 font-medium mt-0.5 block">सत्यापित पहचान</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">💰 कुल बाजार मूल्य</span>
              <div className="text-xl font-display font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {formattedTotalValuation}
              </div>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">वर्तमान प्रचलित दर</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm col-span-2 md:col-span-1">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">🛡️ ऋण-मुक्त खेत</span>
              <div className="text-xl font-display font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                {cleanTitlePct}%
              </div>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">{cleanTitleCount} में से {totalParcelsCount} स्वच्छ स्वत्व</span>
            </div>
          </div>

          {/* Table Filter & In-Village Search Bar */}
          <Card className="p-4 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Filter Search Input */}
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={filterKhasraText}
                  onChange={(e) => setFilterKhasraText(e.target.value)}
                  placeholder="खसरा सं., खाता सं. या खातेदार के नाम से छांटें (उदा. 441, रामफल, रमेश)..."
                  className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-primary shadow-sm"
                />
                {filterKhasraText && (
                  <button
                    onClick={() => setFilterKhasraText('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                  श्रेणी:
                </span>
                {[
                  { id: 'All', label: 'सभी खेत' },
                  { id: 'Agricultural', label: '🌾 कृषि' },
                  { id: 'Residential', label: '🏠 आवासीय' },
                  { id: 'Commercial', label: '🏢 व्यावसायिक' },
                  { id: 'Government', label: '🌳 चारागाह / ग्राम सभा' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilterType(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                      filterType === cat.id
                        ? 'bg-primary text-white shadow-sm ring-1 ring-primary/40'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Table Container */}
          <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-wider font-bold">
                    <th className="p-3">क्र.</th>
                    <th className="p-3">खसरा / गाटा सं.</th>
                    <th className="p-3">खाता सं.</th>
                    <th className="p-3">खातेदार का नाम व पिता</th>
                    <th className="p-3">हिस्सा</th>
                    <th className="p-3">रकबा (क्षेत्रफल)</th>
                    <th className="p-3">वार्षिक लगान</th>
                    <th className="p-3">भूमि श्रेणी</th>
                    <th className="p-3">बंधक / ऋण</th>
                    <th className="p-3">विवाद स्थिति</th>
                    <th className="p-3">बाजार व सर्किल भाव</th>
                    <th className="p-3">लेजर स्थिति</th>
                    <th className="p-3 text-center">कार्रवाई</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {tableParcels.map((parcel, pIdx) => {
                    const isGovt = parcel.khasraNo?.includes('Gram') || parcel.khasraNo?.includes('चारागाह') || parcel.landType?.includes('Government');
                    const hasMortgage = parcel.encumbranceStatus?.toLowerCase().includes('bank') || parcel.encumbranceStatus?.toLowerCase().includes('loan') || parcel.encumbranceStatus?.toLowerCase().includes('बंधक');

                    return (
                      <tr
                        key={parcel.khasraNo}
                        className="hover:bg-blue-50/50 dark:hover:bg-slate-800/60 transition-colors group"
                      >
                        <td className="p-3 font-mono text-slate-400 text-center">
                          {pIdx + 1}
                        </td>

                        <td className="p-3">
                          <div className="font-mono font-bold text-sm text-primary flex items-center gap-1">
                            #{parcel.khasraNo}
                          </div>
                          <span className="font-mono text-[10px] text-slate-400 block mt-0.5">
                            {parcel.landId}
                          </span>
                          <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400 font-semibold block mt-0.5">
                            🆔 {generateUniqueBhuAadhar(parcel, selectedVillage)?.ulpin}
                          </span>
                        </td>

                        <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                          {parcel.khataNo}
                        </td>

                        <td className="p-3">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {parcel.owner}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            पिता: {parcel.fatherName}
                          </div>
                          {parcel.coOwners && parcel.coOwners.length > 0 && (
                            <div className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-0.5">
                              सह: {parcel.coOwners.join(', ')}
                            </div>
                          )}
                        </td>

                        <td className="p-3 font-medium text-slate-600 dark:text-slate-300">
                          {parcel.khataShare || (parcel.coOwners?.length > 0 ? '1/2 अंश' : '1/1 पूर्ण अंश')}
                        </td>

                        <td className="p-3">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {parcel.areaAcre} एकड़
                          </div>
                          <div className="text-[11px] text-emerald-600 font-medium">
                            {parcel.areaBigha} बीघा ({parcel.areaBiswa} बिस्वा)
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {parcel.areaHectare} ha · {parcel.areaSqFt?.toLocaleString()} sq.ft
                          </div>
                        </td>

                        <td className="p-3 font-mono text-slate-700 dark:text-slate-300">
                          {parcel.annualRevenueLagan || `₹ ${(Number(parcel.areaAcre || 1) * 22.5).toFixed(2)}`}
                        </td>

                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold block w-fit ${
                            isGovt
                              ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                              : parcel.landType?.includes('Residential')
                              ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          }`}>
                            {parcel.landCategory || parcel.landType?.split('/')[0]}
                          </span>
                        </td>

                        <td className="p-3">
                          {hasMortgage ? (
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold block w-fit">
                              ⚠️ {parcel.encumbranceStatus}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold block w-fit">
                              ✓ {parcel.encumbranceStatus || 'ऋणमुक्त (Clean)'}
                            </span>
                          )}
                        </td>

                        <td className="p-3">
                          <span className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1">
                            <ShieldCheck size={13} className="text-emerald-500 shrink-0" />
                            {parcel.disputeStatus || 'विवाद रहित'}
                          </span>
                        </td>

                        <td className="p-3">
                          <div className="font-bold text-emerald-600 dark:text-emerald-400">
                            {parcel.marketValue}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            सर्किल: {parcel.circleValue}
                          </div>
                        </td>

                        <td className="p-3">
                          <StatusBadge status={parcel.blockchainStatus} />
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleFocusOnMap(parcel)}
                              className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-primary transition-colors text-xs flex items-center gap-1"
                              title="नक्शे पर देखें"
                            >
                              <MapPin size={13} />
                              <span className="hidden sm:inline text-[11px] font-medium">नक्शा</span>
                            </button>

                            <button
                              onClick={() => {
                                setSelectedParcel(parcel);
                                setCardSide('front');
                                setShowBhuAadharModal(true);
                              }}
                              className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-700 dark:text-amber-400 transition-colors text-xs flex items-center gap-1 font-semibold"
                              title="डिजिटल भू-आधार कार्ड देखें"
                            >
                              <CreditCard size={13} />
                              <span className="hidden sm:inline text-[11px]">भू-आधार</span>
                            </button>

                            <button
                              onClick={() => {
                                setSelectedParcel(parcel);
                                setShowKhatauniModal(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors text-xs flex items-center gap-1"
                              title="खतौनी पर्ची प्रिंट"
                            >
                              <Printer size={13} />
                              <span className="hidden sm:inline text-[11px] font-medium">खतौनी</span>
                            </button>

                            <button
                              onClick={() => {
                                setSelectedParcel(parcel);
                                setShowHistoryModal(true);
                              }}
                              className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 transition-colors text-xs flex items-center gap-1"
                              title="पूर्व मालिक इतिहास (Chain of Title)"
                            >
                              <History size={13} />
                              <span className="hidden sm:inline text-[11px] font-medium">इतिहास</span>
                            </button>

                            {!isGovt && (
                              <button
                                onClick={() => {
                                  setSelectedParcel(parcel);
                                  setTransferSuccess(null);
                                  setTransferForm({
                                    buyerName: '',
                                    fatherName: '',
                                    buyerAddress: '',
                                    salePrice: parcel.marketValue || '₹45,00,000',
                                    transferReason: 'पंजीकृत विक्रय विलेख (Registered Sale Deed & Mutation)',
                                  });
                                  setShowTransferModal(true);
                                }}
                                className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400 transition-colors text-xs flex items-center gap-1 font-semibold"
                                title="स्वामित्व ट्रांसफर करें"
                              >
                                <ArrowLeftRight size={13} />
                                <span className="hidden sm:inline text-[11px]">ट्रांसफर</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {tableParcels.length === 0 && (
                <div className="p-8 text-center text-slate-400">
                  <p className="text-sm">कोई खसरा या खेत इस फ़िल्टर में नहीं मिला।</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Official Printable Digital Khatauni Modal (डिजिटल खतौनी पर्ची) */}
      {showKhatauniModal && selectedParcel && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-fadeIn my-6">
            {/* Modal Top Bar */}
            <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span className="font-semibold text-xs tracking-wide">
                  उत्तर प्रदेश भू-राजस्व परिषद — डिजिटल खतौनी अभिलेख
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Printer size={13} /> प्रिंट / PDF
                </button>
                <button
                  onClick={() => setShowKhatauniModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div id="printable-khatauni" className="p-6 space-y-4 text-xs font-sans">
              {/* Government Header */}
              <div className="text-center pb-4 border-b-2 border-slate-900">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  राजस्व परिषद, उत्तर प्रदेश (Board of Revenue, UP)
                </div>
                <h2 className="font-display text-lg font-extrabold text-slate-900 mt-0.5">
                  भूलेख उद्धरण — कम्प्यूटरीकृत खतौनी (ROR)
                </h2>
                <div className="text-[10px] text-slate-600 mt-0.5">
                  भू-अभिलेख नियमावली के अंतर्गत ब्लॉकचेन लेजर प्रमाणित प्रति
                </div>
              </div>

              {/* Region Metadata Table */}
              <div className="grid grid-cols-4 gap-2 text-[11px] p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-500 block">जनपद (District):</span>
                  <span className="font-bold">{selectedVillage.district}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">तहसील (Tehsil):</span>
                  <span className="font-bold">{selectedVillage.tehsil}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">परगना / ग्राम:</span>
                  <span className="font-bold">{selectedVillage.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">फसली वर्ष:</span>
                  <span className="font-bold">1431 - 1436 (2026)</span>
                </div>
              </div>

              {/* Cadastral Records Table */}
              <table className="w-full border-collapse border border-slate-300 text-left">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                    <th className="border border-slate-300 p-2">खाता सं.</th>
                    <th className="border border-slate-300 p-2">खसरा / गाटा संख्या</th>
                    <th className="border border-slate-300 p-2">खातेदार का नाम व निवास</th>
                    <th className="border border-slate-300 p-2">क्षेत्रफल (रकबा)</th>
                    <th className="border border-slate-300 p-2">आदेश / टिप्पणी</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 p-2 font-mono font-bold align-top">
                      {selectedParcel.khataNo}
                    </td>
                    <td className="border border-slate-300 p-2 font-mono font-bold text-primary align-top">
                      {selectedParcel.khasraNo}
                    </td>
                    <td className="border border-slate-300 p-2 align-top">
                      <div className="font-bold text-slate-900">{selectedParcel.owner}</div>
                      <div className="text-slate-600">पुत्र: {selectedParcel.fatherName}</div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        निवास: ग्राम {selectedVillage.englishName}, {selectedVillage.district}
                      </div>
                      {selectedParcel.coOwners?.length > 0 && (
                        <div className="mt-1 text-[10px] text-slate-500">
                          सह-खातेदार: {selectedParcel.coOwners.join(', ')}
                        </div>
                      )}
                    </td>
                    <td className="border border-slate-300 p-2 align-top">
                      <div className="font-bold">{selectedParcel.areaHectare} हेक्टेयर</div>
                      <div className="text-slate-600 font-semibold">{selectedParcel.areaAcre} एकड़</div>
                      <div className="text-slate-500">{selectedParcel.areaBigha} बीघा ({selectedParcel.areaBiswa} बिस्वा)</div>
                      <div className="text-slate-400 text-[10px]">{selectedParcel.areaSqFt.toLocaleString()} वर्ग फीट</div>
                    </td>
                    <td className="border border-slate-300 p-2 text-[10px] align-top space-y-1">
                      <div>• स्थिति: <strong>{selectedParcel.encumbranceStatus}</strong></div>
                      <div>• वाद: <strong>{selectedParcel.disputeStatus}</strong></div>
                      <div>• सर्किल रेट: <strong>{selectedParcel.circleValue}</strong></div>
                      <div className="text-emerald-700 font-bold">• ब्लॉकचेन सत्यापित: {selectedParcel.blockchainStatus}</div>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Verification & Security Footer */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                <div>
                  <div>स्मार्ट कॉन्ट्रैक्ट आईडी: <span className="font-mono font-bold">{selectedParcel.landId}</span></div>
                  <div className="font-mono text-[9px]">Hash: {selectedParcel.registrationTx}</div>
                  <div>जारी दिनांक: {new Date().toLocaleDateString('hi-IN')} {new Date().toLocaleTimeString()}</div>
                </div>
                <div className="text-right">
                  <div className="w-16 h-16 border border-slate-300 rounded bg-slate-50 flex items-center justify-center text-[8px] text-slate-400 font-mono ml-auto">
                    [QR SECURE]
                  </div>
                  <div className="text-[9px] text-slate-400 mt-1">डिजिटल रूप से प्रमाणित प्रति</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Consolidated Village Register Print Modal (सम्पूर्ण मौजा खतौनी रजिस्टर - प्रपत्र 45) */}
      {showVillagePrintModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-fadeIn my-6">
            {/* Modal Top Bar */}
            <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span className="font-semibold text-xs tracking-wide">
                  उत्तर प्रदेश भू-राजस्व परिषद — सम्पूर्ण मौजा खतौनी पंजी (Form 45)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Printer size={13} /> प्रिंट / PDF
                </button>
                <button
                  onClick={() => setShowVillagePrintModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Printable Village Register Document Body */}
            <div className="p-6 space-y-4 text-xs font-sans max-h-[80vh] overflow-y-auto">
              {/* Government Register Header */}
              <div className="text-center pb-4 border-b-2 border-slate-900">
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">
                  राजस्व परिषद, उत्तर प्रदेश शासन (Board of Revenue, Government of Uttar Pradesh)
                </div>
                <h2 className="font-display text-xl font-black text-slate-900 mt-1">
                  प्रपत्र ४५ — ग्राम खतौनी सम्पूर्ण खसरा पंजी (Consolidated Land Register)
                </h2>
                <div className="text-[11px] text-slate-600 mt-1">
                  भू-अभिलेख नियमावली के अंतर्गत ब्लॉकचेन डिसेंट्रलाइज्ड लेजर सत्यापित आधिकारिक प्रतिलिपि
                </div>
              </div>

              {/* Village Metadata Header Table */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px]">
                <div>
                  <span className="text-slate-500 block">मौजा / ग्राम:</span>
                  <strong className="text-slate-900 text-sm">{selectedVillage.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">तहसील:</span>
                  <strong className="text-slate-900">{selectedVillage.tehsil}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">जनपद (District):</span>
                  <strong className="text-slate-900">{selectedVillage.district}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">फसली वर्ष:</span>
                  <strong className="text-slate-900">1431 - 1436 (2026)</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">कुल खसरा संख्या:</span>
                  <strong className="text-emerald-700">{totalParcelsCount} खेत</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">कुल मौजा रकबा:</span>
                  <strong className="text-slate-900">{totalAcreArea} एकड़ ({totalHectareArea} ha)</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">सर्किल दर:</span>
                  <strong className="text-slate-900">{selectedVillage.circleRatePerSqFt}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">लेजर स्थिति:</span>
                  <strong className="text-emerald-600 font-mono">100% On-Chain Verified</strong>
                </div>
              </div>

              {/* Full Register Table */}
              <table className="w-full border-collapse border border-slate-300 text-left text-[11px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px]">
                    <th className="border border-slate-300 p-2">क्र.</th>
                    <th className="border border-slate-300 p-2">खाता सं.</th>
                    <th className="border border-slate-300 p-2">खसरा / गाटा सं.</th>
                    <th className="border border-slate-300 p-2">खातेदार व पिता का नाम</th>
                    <th className="border border-slate-300 p-2">क्षेत्रफल (रकबा)</th>
                    <th className="border border-slate-300 p-2">वार्षिक लगान</th>
                    <th className="border border-slate-300 p-2">भूमि श्रेणी</th>
                    <th className="border border-slate-300 p-2">ऋण / कैफियत</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedVillage.parcels.map((parcel, idx) => (
                    <tr key={parcel.khasraNo} className="hover:bg-slate-50">
                      <td className="border border-slate-300 p-2 text-center font-mono">{idx + 1}</td>
                      <td className="border border-slate-300 p-2 font-mono font-bold">{parcel.khataNo}</td>
                      <td className="border border-slate-300 p-2 font-mono font-bold text-primary">#{parcel.khasraNo}</td>
                      <td className="border border-slate-300 p-2">
                        <div className="font-bold text-slate-900">{parcel.owner}</div>
                        <div className="text-slate-600 text-[10px]">पिता: {parcel.fatherName}</div>
                        {parcel.coOwners?.length > 0 && (
                          <div className="text-slate-500 text-[9px]">सह: {parcel.coOwners.join(', ')}</div>
                        )}
                      </td>
                      <td className="border border-slate-300 p-2">
                        <div className="font-bold">{parcel.areaAcre} एकड़</div>
                        <div className="text-slate-600 text-[10px]">{parcel.areaBigha} बीघा ({parcel.areaBiswa} बिस्वा)</div>
                        <div className="text-slate-500 text-[9px]">{parcel.areaHectare} ha · {parcel.areaSqFt?.toLocaleString()} sqft</div>
                      </td>
                      <td className="border border-slate-300 p-2 font-mono">
                        {parcel.annualRevenueLagan || `₹ ${(Number(parcel.areaAcre || 1) * 22.5).toFixed(2)}`}
                      </td>
                      <td className="border border-slate-300 p-2 text-[10px]">
                        {parcel.landCategory || parcel.landType?.split('/')[0]}
                      </td>
                      <td className="border border-slate-300 p-2 text-[10px]">
                        <div>• {parcel.encumbranceStatus}</div>
                        <div>• {parcel.disputeStatus}</div>
                        <div className="text-emerald-700 font-bold font-mono text-[9px]">• {parcel.blockchainStatus}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-bold text-slate-900">
                    <td colSpan={4} className="border border-slate-300 p-2 text-right">
                      कुल योग (Grand Totals):
                    </td>
                    <td className="border border-slate-300 p-2 text-emerald-700">
                      {totalAcreArea} एकड़ ({totalHectareArea} ha)
                    </td>
                    <td colSpan={3} className="border border-slate-300 p-2 text-slate-700">
                      कुल {totalParcelsCount} भू-खंड पंजीकृत
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Endorsement and Signatures Footer */}
              <div className="pt-4 border-t-2 border-slate-900 grid grid-cols-3 gap-4 text-[10px] text-slate-600">
                <div>
                  <div className="font-bold text-slate-800">राजस्व निरीक्षक / लेखपाल</div>
                  <div className="mt-6 border-b border-dashed border-slate-400 w-32"></div>
                  <div className="mt-1 text-slate-500">हस्ताक्षर एवं मुहर</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 border border-slate-300 rounded bg-slate-50 flex items-center justify-center text-[8px] text-slate-400 font-mono mx-auto">
                    [LEGAL QR]
                  </div>
                  <div className="text-[9px] text-slate-500 mt-1">डिजिटल रूप से प्रमाणित</div>
                  <div className="font-mono text-[8px] text-slate-400">{new Date().toISOString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-800">तहसीलदार / सब-रजिस्ट्रार</div>
                  <div className="mt-6 border-b border-dashed border-slate-400 w-32 ml-auto"></div>
                  <div className="mt-1 text-slate-500">तहसील {selectedVillage.tehsil}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Digital Bhu-Aadhar (ULPIN) ID Card Modal (विशिष्ट भू-आधार पहचान पत्र) */}
      {showBhuAadharModal && selectedParcel && activeBhuAadhar && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-slate-900 text-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-amber-500/30 animate-fadeIn my-6 relative">
            {/* Modal Top Bar */}
            <div className="px-6 py-3.5 bg-slate-950 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-amber-400" />
                <div>
                  <h4 className="font-bold text-xs tracking-wide text-white">
                    भारत सरकार — विशिष्ट भू-खंड पहचान पत्र (Bhu-Aadhar Card)
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    ULPIN: Unique Land Parcel Identification Number (DILRMP)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Printer size={13} /> प्रिंट / PDF
                </button>
                <button
                  onClick={() => setShowBhuAadharModal(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* View Flipper Toggle */}
            <div className="px-6 pt-3 pb-1 flex justify-center">
              <div className="flex bg-slate-800 p-1 rounded-xl border border-white/10 text-xs">
                <button
                  onClick={() => setCardSide('front')}
                  className={`px-4 py-1 rounded-lg font-bold transition-all ${
                    cardSide === 'front'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  कार्ड का अग्र भाग (Front)
                </button>
                <button
                  onClick={() => setCardSide('back')}
                  className={`px-4 py-1 rounded-lg font-bold transition-all ${
                    cardSide === 'back'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  कार्ड का पृष्ठ भाग (Back)
                </button>
              </div>
            </div>

            {/* Simulated Smart Land Card (Printable) */}
            <div className="p-6">
              {cardSide === 'front' ? (
                /* FRONT OF CARD */
                <div
                  id="printable-bhu-aadhar-front"
                  className="relative rounded-2xl p-5 overflow-hidden shadow-2xl border-2 border-amber-400/60 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(245, 158, 11, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 40%)'
                  }}
                >
                  {/* Subtle Guilloche Watermark Lines */}
                  <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-amber-400/30 mb-3 relative z-10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center font-bold text-amber-400 text-sm">
                        🏛️
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest leading-none">
                          राजस्व परिषद, उत्तर प्रदेश शासन
                        </div>
                        <div className="text-xs font-black text-white tracking-wide mt-0.5">
                          भू-आधार — विशिष्ट भू-खंड पहचान पत्र (Bhu-Aadhar)
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        100% UNIQUE
                      </span>
                    </div>
                  </div>

                  {/* Card Main Info Grid */}
                  <div className="grid grid-cols-12 gap-3 items-center relative z-10 my-2">
                    {/* Left: Holographic Chip & Avatar */}
                    <div className="col-span-4 flex flex-col items-center justify-center space-y-2.5">
                      {/* Holographic Chip Simulation */}
                      <div className="w-11 h-9 rounded-md bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 shadow-inner border border-amber-600 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                        <div className="w-7 h-5 border border-amber-800/40 rounded-sm grid grid-cols-2">
                          <div className="border-r border-b border-amber-800/40"></div>
                          <div className="border-b border-amber-800/40"></div>
                          <div className="border-r border-amber-800/40"></div>
                          <div></div>
                        </div>
                      </div>

                      {/* Cadastral Polygon Mini-Map */}
                      <div className="w-20 h-16 rounded-lg bg-slate-800 border border-amber-400/30 overflow-hidden relative flex items-center justify-center">
                        <div className="text-[9px] text-amber-300 font-mono text-center font-bold leading-tight">
                          गाटा #{selectedParcel.khasraNo}<br/>
                          <span className="text-[8px] text-slate-400">{selectedParcel.areaAcre} ac</span>
                        </div>
                        <span className="absolute bottom-0 inset-x-0 bg-emerald-600 text-[7px] text-center text-white font-bold py-0.5">
                          GEO-VERIFIED
                        </span>
                      </div>
                    </div>

                    {/* Right: Key Land & Owner Attributes */}
                    <div className="col-span-8 space-y-1.5 text-xs">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider block">खातेदार का नाम:</span>
                        <div className="font-bold text-white text-sm leading-tight">{selectedParcel.owner}</div>
                        <div className="text-[10px] text-slate-400">पिता/पति: {selectedParcel.fatherName}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div>
                          <span className="text-[9px] text-slate-400 block">मौजा (गाँव):</span>
                          <strong className="text-amber-200">{selectedVillage.name}</strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block">तहसील व जनपद:</span>
                          <strong className="text-slate-200">{selectedVillage.tehsil}, {selectedVillage.district}</strong>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-[9px] text-slate-400 block">खसरा / खाता:</span>
                          <strong className="text-white">#{selectedParcel.khasraNo} (खाता {selectedParcel.khataNo})</strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block">कुल रकबा:</span>
                          <strong className="text-emerald-400">{selectedParcel.areaAcre} एकड़ ({selectedParcel.areaBigha} बीघा)</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 14-Digit ULPIN Display Bar */}
                  <div className="mt-3 pt-2.5 border-t border-amber-400/30 flex items-center justify-between relative z-10">
                    <div>
                      <span className="text-[9px] text-amber-300 font-bold uppercase tracking-widest block">
                        भू-आधार संख्या (14-Digit ULPIN):
                      </span>
                      <div className="font-mono font-black text-base tracking-widest text-amber-400">
                        {activeBhuAadhar.formattedUlpin}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] text-slate-400 block">16-अंकीय कोड:</span>
                      <span className="font-mono text-[10px] font-bold text-slate-300">
                        {activeBhuAadhar.revenueCode16}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* BACK OF CARD */
                <div
                  id="printable-bhu-aadhar-back"
                  className="relative rounded-2xl p-5 overflow-hidden shadow-2xl border-2 border-amber-400/60 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-amber-400/30">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      विधिक एवं तकनीकी सर्वेक्षण विवरण (Legal & Survey Metrics)
                    </span>
                    <span className="font-mono text-[9px] text-slate-400">
                      Card ID: {activeBhuAadhar.cardSerialNo}
                    </span>
                  </div>

                  {/* Survey Vertices Coordinates */}
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5 space-y-1 font-mono text-[10px]">
                    <span className="text-[9px] text-amber-400 font-bold uppercase block">
                      भू-निर्देशांक (GPS Boundary Coordinates):
                    </span>
                    <div className="text-slate-300 truncate">
                      {activeBhuAadhar.coordinatesList}
                    </div>
                    <div className="text-[9px] text-slate-400 pt-0.5 flex justify-between">
                      <span>केंद्र बिंदु: {activeBhuAadhar.geoHash}</span>
                      <span className="text-emerald-400 font-bold">0% Overlap (Non-disputed)</span>
                    </div>
                  </div>

                  {/* Revenue Classification Matrix */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-800/50 p-2.5 rounded-lg border border-white/5">
                    <div>
                      <span className="text-[9px] text-slate-400 block">भू-श्रेणी (Category):</span>
                      <strong className="text-slate-200">{selectedParcel.landCategory || '1-क संक्रमणीय भूमिधर'}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block">वार्षिक लगान (Revenue):</span>
                      <strong className="text-emerald-400">{selectedParcel.annualRevenueLagan || '₹ 22.50 वार्षिक'}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block">सर्किल रेट दर:</span>
                      <strong className="text-slate-200">{selectedVillage.circleRatePerSqFt}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block">बंधक स्थिति:</span>
                      <strong className="text-slate-200">{selectedParcel.encumbranceStatus}</strong>
                    </div>
                  </div>

                  {/* Smart Contract Blockchain Proof */}
                  <div className="pt-1 text-[9px] text-slate-400 space-y-0.5 font-mono">
                    <div>लेजर आईडी: <span className="text-amber-400 font-bold">{selectedParcel.landId}</span></div>
                    <div className="truncate">Tx: {selectedParcel.registrationTx}</div>
                  </div>

                  {/* Statutory Disclaimer & Seal */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-slate-400">
                    <p className="max-w-[340px] text-[8px] text-slate-400 leading-tight">
                      यह भू-आधार कार्ड राजस्व परिषद उत्तर प्रदेश एवं डिजिटल इंडिया लैंड रिकॉर्ड्स मॉडर्नाइजेशन प्रोग्राम (DILRMP) के अंतर्गत ब्लॉकचेन डिसेंट्रलाइज्ड लेजर पर कानूनी रूप से संरक्षित है।
                    </p>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-amber-400 block">तहसीलदार / सब-रजिस्ट्रार</span>
                      <span className="text-[8px] text-slate-500">डिजिटल रूप से हस्ताक्षरित</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons in Modal Footer */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  <span>{cardSide === 'front' ? 'अग्र भाग (Front View)' : 'पृष्ठ भाग (Back View)'}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCardSide(cardSide === 'front' ? 'back' : 'front')}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
                  >
                    कार्ड पलटें (Flip Card)
                  </button>
                  <Button
                    onClick={() => window.print()}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-md"
                  >
                    <Printer size={13} /> प्रिंट / PDF डाउनलोड
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Express Interest to Buy Inquiry Modal */}
      {showInquiryModal && selectedParcel && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  खेत खरीद पूछताछ (Purchase Inquiry)
                </h3>
                <p className="text-xs text-slate-500">
                  खसरा #{selectedParcel.khasraNo} · {selectedParcel.owner}
                </p>
              </div>
              <button onClick={() => setShowInquiryModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            {inquirySent ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <Check size={24} />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">पूछताछ दर्ज हो गई!</h4>
                <p className="text-xs text-slate-500">
                  आपकी खरीद रुचि सीधे खातेदार एवं अधिकृत सब-रजिस्ट्रार डेस्क को प्रेषित कर दी गई है।
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    आपका नाम (Your Full Name) *
                  </label>
                  <input
                    required
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    मोबाइल नंबर (Contact Number) *
                  </label>
                  <input
                    required
                    type="tel"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    प्रस्तावित खरीद मूल्य (Offer Amount - INR)
                  </label>
                  <input
                    value={inquiryForm.offerPrice}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, offerPrice: e.target.value })}
                    placeholder={`Market Est: ${selectedParcel.marketValue}`}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    संदेश / टिप्पणी (Message)
                  </label>
                  <textarea
                    rows={2}
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    placeholder="I visited this location and am interested in direct title verification and deal discussion."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-primary"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowInquiryModal(false)} className="flex-1">
                    रद्द करें
                  </Button>
                  <Button type="submit" className="flex-1 justify-center bg-primary">
                    पूछताछ भेजें
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Chain of Title / Past Owners History Modal (पूर्व स्वामियों की नामावली) */}
      {showHistoryModal && selectedParcel && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-fadeIn my-6">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <History size={11} /> स्वामित्व वंशावली (Chain of Title)
                  </span>
                  <span className="font-mono text-xs text-indigo-200">
                    खसरा #{selectedParcel.khasraNo} · {selectedParcel.landId}
                  </span>
                </div>
                <h3 className="font-display font-bold text-base text-white">
                  पूर्व स्वामियों का ऐतिहासिक विवरण (Ownership Provenance)
                </h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* History List */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
                <Info size={16} className="text-primary shrink-0 mt-0.5" />
                <div>
                  <strong>भूमि स्वामित्व पारदर्शिता:</strong> यह अभिलेख दर्शाता है कि यह खेत (खसरा #{selectedParcel.khasraNo}) कब-कब, किस-किस व्यक्ति के नाम पंजीकृत रहा है और किस विलेख (बैनामा, वरासत, आवंटन) द्वारा अंतरित हुआ है।
                </div>
              </div>

              {/* Timeline Items */}
              <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {getLandOwnershipHistory(selectedParcel.landId, selectedParcel.owner).map((hist, idx) => (
                  <div key={`${hist.owner}-${idx}`} className="relative group">
                    {/* Node Dot */}
                    <div
                      className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] font-bold ${
                        hist.isCurrent
                          ? 'bg-emerald-500 border-white text-white shadow-md ring-4 ring-emerald-500/20'
                          : 'bg-white dark:bg-slate-900 border-indigo-400 text-indigo-600 dark:text-indigo-400'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <div
                      className={`p-4 rounded-xl border transition-all ${
                        hist.isCurrent
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/80 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {hist.owner}
                            </span>
                            {hist.isCurrent ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                                🟢 वर्तमान सक्रिय स्वामी
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                पूर्व स्वामी (#{idx + 1})
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            पिता/पति: {hist.fatherName}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                            📅 {hist.date}
                          </span>
                          <span className="text-[10px] text-slate-400">{hist.role}</span>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300">
                        <div>
                          <span className="text-slate-400 block text-[10px]">विलेख प्रकार (Deed / Mutation):</span>
                          <strong>{hist.deedType}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">प्रतिफल राशि (Sale Price):</span>
                          <strong className="text-emerald-600 dark:text-emerald-400">{hist.consideration}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">पंजीकरण विवरण (Bahi / Order):</span>
                          <span>{hist.bahiNo}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">रजिस्ट्रार कार्यालय:</span>
                          <span>{hist.subRegistrar}</span>
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[10px]">
                        <span className="font-mono text-slate-400 truncate max-w-[280px]">
                          Tx: {hist.txHash}
                        </span>
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <ShieldCheck size={11} /> लेजर प्रमाणित
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <Button onClick={() => setShowHistoryModal(false)} variant="outline" size="sm">
                बंद करें
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Ownership Transfer Modal (मालिकाना हक हस्तांतरण) */}
      {showTransferModal && selectedParcel && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-fadeIn my-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold uppercase tracking-wider mb-0.5">
                  <ArrowLeftRight size={13} /> दाखिल-खारिज व मालिकाना हक अंतरण
                </div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  Transfer Title — खसरा #{selectedParcel.khasraNo}
                </h3>
                <p className="text-xs text-slate-500">
                  वर्तमान स्वामी: <strong className="text-slate-700 dark:text-slate-300">{selectedParcel.owner}</strong> ({selectedVillage.name})
                </p>
              </div>
              <button
                onClick={() => setShowTransferModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            {transferSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                  <Check size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    मालिकाना हक सफलतापूर्वक ट्रांसफर हो गया!
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    खसरा संख्या <strong>#{selectedParcel.khasraNo}</strong> का नया पंजीकृत स्वामी अब{' '}
                    <strong className="text-emerald-600">{transferSuccess.newOwner}</strong> दर्ज हो गया है।
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] font-mono text-slate-500 text-left space-y-1">
                  <div>• पुराना स्वामी: {transferSuccess.previousOwner}</div>
                  <div>• नया स्वामी: {transferSuccess.newOwner}</div>
                  <div className="truncate">• Tx Hash: {transferSuccess.txHash}</div>
                </div>

                <div className="pt-2 flex gap-2">
                  <Button
                    onClick={() => {
                      setShowTransferModal(false);
                      setShowHistoryModal(true);
                    }}
                    className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2 rounded-xl"
                  >
                    <History size={13} className="mr-1.5" /> अपडेटेड स्वामित्व इतिहास देखें
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowTransferModal(false)}
                    className="shrink-0 text-xs"
                  >
                    पूर्ण
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleExecuteTransfer} className="space-y-3 text-xs">
                {/* Notice */}
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-[11px] flex items-center gap-2">
                  <Sparkles size={14} className="shrink-0 text-amber-600" />
                  <span>
                    ट्रांसफर होते ही ब्लॉकचेन लेजर पर नया स्वामी दर्ज होगा और पूर्व मालिक का नाम इतिहास में सुरक्षित रहेगा।
                  </span>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    नए क्रेता / स्वामी का नाम (New Buyer Full Name) *
                  </label>
                  <input
                    required
                    value={transferForm.buyerName}
                    onChange={(e) => setTransferForm({ ...transferForm, buyerName: e.target.value })}
                    placeholder="e.g. Amit Kumar Singh (अमित कुमार सिंह)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-primary text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    पिता / पति का नाम (Father / Husband Name) *
                  </label>
                  <input
                    required
                    value={transferForm.fatherName}
                    onChange={(e) => setTransferForm({ ...transferForm, fatherName: e.target.value })}
                    placeholder="e.g. Satyendra Pal Singh"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-primary text-xs"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      क्रेता का एथेरियम वॉलेट पता (Buyer Wallet Address) *
                    </label>
                    <button
                      type="button"
                      onClick={generateTestAddress}
                      className="text-[10px] text-primary hover:underline font-semibold flex items-center gap-0.5"
                    >
                      ⚡ टेस्ट एड्रेस भरें
                    </button>
                  </div>
                  <input
                    required
                    value={transferForm.buyerAddress}
                    onChange={(e) => setTransferForm({ ...transferForm, buyerAddress: e.target.value })}
                    placeholder="0x71C...8bA2 (42-character address)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-primary font-mono text-[11px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      विक्रय प्रतिफल (Sale Amount)
                    </label>
                    <input
                      value={transferForm.salePrice}
                      onChange={(e) => setTransferForm({ ...transferForm, salePrice: e.target.value })}
                      placeholder="₹45,00,000"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-primary text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      अंतरण प्रकार (Reason)
                    </label>
                    <select
                      value={transferForm.transferReason}
                      onChange={(e) => setTransferForm({ ...transferForm, transferReason: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-primary text-xs"
                    >
                      <option value="पंजीकृत विक्रय विलेख (Registered Sale Deed & Mutation)">बैनामा (Sale Deed)</option>
                      <option value="वरासत / उत्तराधिकार (Succession / Inheritance)">वरासत (Inheritance)</option>
                      <option value="पंजीकृत दान विलेख (Registered Gift Deed)">उपहार (Gift Deed)</option>
                      <option value="पारिवारिक विभाजन (Family Partition Deed)">बंटवारा (Partition)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowTransferModal(false)}
                    className="flex-1 text-xs"
                  >
                    रद्द करें
                  </Button>
                  <Button
                    type="submit"
                    disabled={transferring}
                    className="flex-1 justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    {transferring ? 'ऑन-चेन प्रोसेस जारी...' : 'हस्तांतरण पुष्टि करें'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

