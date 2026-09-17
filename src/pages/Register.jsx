import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, 
  MapPin, CheckCircle2, AlertCircle, Sparkles, Building, Landmark,
  FileText, HelpCircle, ArrowRight
} from 'lucide-react';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { PAN_INDIA_STATES } from '../data/panIndiaStateData';

export default function Register() {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    guardianName: '',
    mobile: '',
    email: '',
    stateCode: 'UP',
    district: 'Lucknow',
    aadhaarNumber: '',
    role: 'citizen',
    password: '',
    confirmPassword: '',
    agreed: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current selected state details
  const currentState = PAN_INDIA_STATES.find(s => s.code === formData.stateCode) || PAN_INDIA_STATES[0];

  const handleStateChange = (newCode) => {
    const st = PAN_INDIA_STATES.find(s => s.code === newCode) || PAN_INDIA_STATES[0];
    setFormData(prev => ({
      ...prev,
      stateCode: newCode,
      district: st.districts && st.districts.length > 0 ? st.districts[0] : 'Headquarters'
    }));
  };

  // Quick 1-Click Sample Data Fill (makes testing quick & human-friendly)
  const handleQuickSampleFill = () => {
    setFormData({
      fullName: 'सुरेश प्रसाद शर्मा (Suresh Sharma)',
      guardianName: 'श्री रामेश्वर शर्मा (Rameshwar Sharma)',
      mobile: '9812345678',
      email: 'suresh.sharma@example.com',
      stateCode: 'UP',
      district: 'Ayodhya',
      aadhaarNumber: '5482 9102 3847',
      role: 'citizen',
      password: 'password123',
      confirmPassword: 'password123',
      agreed: true
    });
    setErrorMsg('');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!formData.fullName.trim()) {
      setErrorMsg('कृपया अपना पूरा नाम दर्ज करें (Please enter your full name)');
      return;
    }

    if (!formData.mobile || formData.mobile.replace(/\D/g, '').length < 10) {
      setErrorMsg('कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें (Please enter a valid 10-digit mobile number)');
      return;
    }

    if (!formData.email || !formData.email.includes('@')) {
      setErrorMsg('कृपया एक मान्य ईमेल आईडी दर्ज करें (Please enter a valid email address)');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setErrorMsg('पासवर्ड न्यूनतम 6 अक्षरों का होना चाहिए (Password must be at least 6 characters)');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते (Passwords do not match)');
      return;
    }

    if (!formData.agreed) {
      setErrorMsg('पंजीकरण आगे बढ़ाने के लिए नियम व शर्तों की सहमति आवश्यक है (Please accept declaration)');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Save user to registered users database in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('landchain_registered_users') || '[]');
      const newUser = {
        id: 'USR-' + Date.now(),
        name: formData.fullName,
        guardianName: formData.guardianName,
        mobile: formData.mobile,
        email: formData.email,
        state: currentState.name,
        stateHindi: currentState.hindiName,
        district: formData.district,
        aadhaarMasked: formData.aadhaarNumber ? `XXXX XXXX ${formData.aadhaarNumber.replace(/\s+/g, '').slice(-4)}` : 'XXXX XXXX 8921',
        role: formData.role,
        roleLabel: formData.role === 'citizen' ? 'नागरिक / खातेदार (Citizen)' : 'राजस्व अधिकारी (Revenue Authority)',
        registeredAt: new Date().toISOString()
      };

      existingUsers.push(newUser);
      localStorage.setItem('landchain_registered_users', JSON.stringify(existingUsers));

      // Also set default pre-filled credentials for login
      localStorage.setItem('landchain_last_registered_email', formData.email);

      setIsSubmitting(false);
      setSuccessMsg('आपका खाता सफलतापूर्वक बन गया है! लॉगिन पृष्ठ पर भेजा जा रहा है... (Account created successfully! Redirecting to login...)');

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between text-slate-800 dark:text-slate-100 font-sans">
      {/* Top Official Portal Header Strip */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-3 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Logo size="sm" />
            <div className="hidden sm:block border-l border-slate-200 dark:border-slate-700 pl-3">
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block">
                राष्ट्रीय भू-अभिलेख एवं कैडस्ट्रल पोर्टल
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                LandChain Portal — DILRMP National Land Registry Standards
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-xs">
            <Link to="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1">
              ← पहले से खाता है? लॉगिन करें (Sign In)
            </Link>
          </div>
        </div>
      </header>

      {/* Main Registration Form */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          
          {/* Form Header */}
          <div className="bg-slate-900 text-white p-6 pb-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h1 className="text-lg font-bold font-display text-white">
                    नया नागरिक / हितधारक पंजीकरण (New Registration)
                  </h1>
                  <p className="text-xs text-slate-300">
                    पारदर्शी डिजिटल भू-अभिलेख, खतौनी और कैडस्ट्रल सेवाओं के लिए खाता बनाएं
                  </p>
                </div>
              </div>

              {/* 1-Click Sample Fill button */}
              <button
                type="button"
                onClick={handleQuickSampleFill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors"
                title="डेमो के लिए तुरंत फॉर्म भरें"
              >
                <Sparkles size={13} />
                <span>त्वरित नमूना भरें (Quick Fill)</span>
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Feedback Alert */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2.5">
                <AlertCircle size={16} className="shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
                <span className="font-medium">{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Section 1: खाता प्रकार (Role Selection) */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  १. उपयोगकर्ता खाता प्रकार (Select User Role)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label 
                    onClick={() => handleInputChange('role', 'citizen')}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      formData.role === 'citizen'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="role" 
                      value="citizen" 
                      checked={formData.role === 'citizen'} 
                      onChange={() => handleInputChange('role', 'citizen')} 
                      className="mt-0.5 accent-blue-600"
                    />
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <User size={14} className="text-blue-600" />
                        <span>नागरिक / खातेदार (Citizen)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        अपनी जमीन देखना, खतौनी 7/12 डाउनलोड, स्वामित्व अंतरण व आवेदन हेतु
                      </p>
                    </div>
                  </label>

                  <label 
                    onClick={() => handleInputChange('role', 'authority')}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      formData.role === 'authority'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="role" 
                      value="authority" 
                      checked={formData.role === 'authority'} 
                      onChange={() => handleInputChange('role', 'authority')} 
                      className="mt-0.5 accent-blue-600"
                    />
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <Landmark size={14} className="text-emerald-600" />
                        <span>राजस्व अधिकारी (Authority)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        तहसीलदार, कानूनगो, लेखपाल व उप-निबंधक सत्यापन अधिकारी
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Section 2: व्यक्तिगत विवरण (Personal Details) */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                  २. व्यक्तिगत पहचान विवरण (Personal Information)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                      पूरा नाम (Full Name) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        required
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="उदा. रमेश कुमार शर्मा (Ramesh Kumar)"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  {/* Father/Husband Name */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                      पिता / पति का नाम (Father / Guardian)
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={formData.guardianName}
                        onChange={(e) => handleInputChange('guardianName', e.target.value)}
                        placeholder="उदा. श्री दिनेश शर्मा (Dinesh Sharma)"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                      मोबाइल नंबर (Mobile Number) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-2.5 text-xs font-bold border-r border-slate-200 dark:border-slate-700 flex items-center">
                        +91
                      </span>
                      <input
                        required
                        type="tel"
                        maxLength={10}
                        value={formData.mobile}
                        onChange={(e) => handleInputChange('mobile', e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 text-xs outline-none focus:bg-slate-50 dark:focus:bg-slate-800"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                      ईमेल पता (Email Address) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="ramesh.kumar@example.com"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: राज्य व क्षेत्राधिकार (Jurisdiction & ID) */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                  ३. राज्य व पहचान विवरण (State & Identity)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* State Selection */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                      राज्य (State) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.stateCode}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-blue-600"
                    >
                      {PAN_INDIA_STATES.map((st) => (
                        <option key={st.code} value={st.code}>
                          {st.name} ({st.hindiName})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District Selection */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                      जिला (District) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-blue-600"
                    >
                      {currentState.districts && currentState.districts.length > 0 ? (
                        currentState.districts.map((dst) => (
                          <option key={dst} value={dst}>{dst}</option>
                        ))
                      ) : (
                        <option value="Headquarters">Headquarters</option>
                      )}
                    </select>
                  </div>

                  {/* Aadhaar / ID (Masked) */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                      आधार / वोटर आईडी (Aadhaar / ID)
                    </label>
                    <div className="relative">
                      <FileText size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        maxLength={14}
                        value={formData.aadhaarNumber}
                        onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
                        placeholder="XXXX XXXX 8921"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>

                {/* State Portal Notice */}
                <div className="mt-3 px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between flex-wrap gap-2">
                  <span>
                    राजस्व विभाग: <strong className="text-slate-700 dark:text-slate-300">{currentState.department}</strong>
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {currentState.portalName} • RoR: {currentState.rorTitle.split('(')[0]}
                  </span>
                </div>
              </div>

              {/* Section 4: पासवर्ड व सुरक्षा (Password & Security) */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                  ४. पासवर्ड व सुरक्षा (Password & Credentials)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Password */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                      पासवर्ड बनाएं (Create Password) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        required
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="न्यूनतम 6 अक्षर (Min 6 chars)"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-blue-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 p-0.5"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                      पासवर्ड पुष्टि करें (Confirm Password) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        required
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="पासवर्ड पुनः दर्ज करें"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-blue-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 p-0.5"
                      >
                        {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 5: घोषणा (Declaration) */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.agreed}
                    onChange={(e) => handleInputChange('agreed', e.target.checked)}
                    className="mt-0.5 rounded accent-blue-600 shrink-0"
                  />
                  <span>
                    मैं सत्यनिष्ठा से प्रतिज्ञा करता/करती हूँ कि मेरे द्वारा दी गई सभी जानकारी पूर्णतः सत्य है। मैं LandChain डिजिटल भू-अभिलेख पोर्टल के सेवा नियमों एवं डिजिटल हस्ताक्षरों से सहमत हूँ।
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full font-bold text-sm py-3 shadow-md bg-blue-600 hover:bg-blue-500 text-white rounded-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'खाता तैयार किया जा रहा है...' : 'पंजीकरण पूर्ण करें (Complete Registration) →'}
              </Button>
            </form>

            {/* Bottom Help & Navigation */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-4 flex-wrap">
              <span>
                पहले से पंजीकृत हैं?{' '}
                <Link to="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                  यहाँ लॉगिन करें (Sign In)
                </Link>
              </span>
              <span>•</span>
              <Link to="/search" className="text-slate-500 hover:text-primary">
                भूमि खोजें (Search Land)
              </Link>
              <span>•</span>
              <Link to="/bhulekh" className="text-slate-500 hover:text-primary">
                भूलेख नक्शा (Bhoolekh GIS)
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Official Footer Strip */}
      <footer className="py-3 px-5 border-t border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-400 bg-white dark:bg-slate-900">
        LandChain — राष्ट्रीय डिजिटल भू-अभिलेख आधुनिकीकरण कार्यक्रम (DILRMP) | सर्वाधिकार सुरक्षित
      </footer>
    </div>
  );
}
