import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, Wallet, Eye, EyeOff, Shield, Phone, 
  CheckCircle2, ArrowRight, UserCheck, Landmark, KeyRound, 
  HelpCircle, Sparkles, Building2, AlertCircle
} from 'lucide-react';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { useWallet } from '../context/WalletContext';

export default function Login() {
  const navigate = useNavigate();
  const { connect, connecting, address } = useWallet();

  // Mode: 'password' | 'otp'
  const [loginMethod, setLoginMethod] = useState('password');
  // Selected Role: 'citizen' | 'authority' | 'admin'
  const [selectedRole, setSelectedRole] = useState('citizen');
  
  // Form fields
  const [identifier, setIdentifier] = useState('ramesh.kumar@example.com');
  const [password, setPassword] = useState('land123');
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP state
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [mockOtp, setMockOtp] = useState('482910');

  // Feedback messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Quick Demo Account Auto-Fill
  const handleQuickDemo = (role) => {
    setSelectedRole(role);
    setErrorMsg('');
    setLoginMethod('password');
    if (role === 'citizen') {
      setIdentifier('ramesh.kumar@example.com');
      setPassword('land123');
    } else if (role === 'authority') {
      setIdentifier('tehsildar.lko@gov.in');
      setPassword('officer123');
    } else if (role === 'admin') {
      setIdentifier('admin.registrar@landchain.gov.in');
      setPassword('admin123');
    }
  };

  // Send Mock OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.length < 10) {
      setErrorMsg('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें (Please enter a valid 10-digit mobile number)');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setOtpSent(true);
      setSuccessMsg(`ओटीपी भेजा गया: ${mockOtp} (डेमो के लिए यह कोड दर्ज करें)`);
      setEnteredOtp(mockOtp);
    }, 600);
  };

  // Submit Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (loginMethod === 'password') {
      if (!identifier.trim()) {
        setErrorMsg('कृपया मोबाइल नंबर या ईमेल आईडी दर्ज करें (Please enter email or mobile)');
        return;
      }
      if (!password || password.length < 4) {
        setErrorMsg('कृपया अपना पासवर्ड दर्ज करें (Please enter your password)');
        return;
      }
    } else {
      if (!enteredOtp || enteredOtp.length < 4) {
        setErrorMsg('कृपया 6 अंकों का ओटीपी दर्ज करें (Please enter OTP)');
        return;
      }
    }

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);

      // Determine user details based on role
      const roleData = {
        citizen: {
          name: 'Ramesh Kumar (रमेश कुमार)',
          email: identifier || 'ramesh.kumar@example.com',
          role: 'citizen',
          roleLabel: 'नागरिक / खातेदार (Landowner)',
          redirect: '/dashboard',
          district: 'Lucknow',
          state: 'Uttar Pradesh'
        },
        authority: {
          name: 'Shri S. K. Verma (तहसीलदार)',
          email: identifier || 'tehsildar.lko@gov.in',
          role: 'authority',
          roleLabel: 'राजस्व अधिकारी / तहसीलदार (Tehsildar)',
          redirect: '/authority',
          district: 'Lucknow Sadar',
          state: 'Uttar Pradesh'
        },
        admin: {
          name: 'District Registrar / Admin',
          email: identifier || 'admin.registrar@landchain.gov.in',
          role: 'admin',
          roleLabel: 'प्रशासक / उप-निबंधक (Registrar)',
          redirect: '/admin',
          district: 'State Headquarters',
          state: 'National'
        }
      };

      const user = roleData[selectedRole] || roleData.citizen;
      localStorage.setItem('landchain_current_user', JSON.stringify(user));
      localStorage.setItem('landchain_auth_token', 'demo_jwt_token_' + Date.now());

      navigate(user.redirect);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between text-slate-800 dark:text-slate-100">
      {/* Top Official Portal Header Strip */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-3 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Logo size="sm" />
            <div className="hidden sm:block border-l border-slate-200 dark:border-slate-700 pl-3">
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block">
                डिजिटल भूलेख एवं कैडस्ट्रल पोर्टल
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                LandChain Portal — Government of India DILRMP Standards
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3 text-xs">
            <Link to="/" className="text-slate-500 hover:text-primary font-medium hidden sm:inline-block">
              ← मुख्य पृष्ठ (Home)
            </Link>
            <Link to="/search" className="text-slate-500 hover:text-primary font-medium">
              🔍 जमीन खोजें
            </Link>
          </div>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Card Top Branding */}
          <div className="bg-slate-900 text-white p-6 pb-5 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                  <Shield size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold font-display text-white">पोर्टल लॉगिन (Portal Login)</h2>
                  <p className="text-[11px] text-slate-300">सुरक्षित पहचान व ब्लॉकचेन भू-अभिलेख प्रणाली</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                SSL SECURED
              </span>
            </div>

            {/* Role Selection Tabs */}
            <div className="grid grid-cols-3 gap-1.5 pt-3 border-t border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickDemo('citizen')}
                className={`py-1.5 px-2 rounded-lg font-medium transition-all text-center flex flex-col items-center gap-0.5 ${
                  selectedRole === 'citizen'
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>👤 नागरिक</span>
                <span className="text-[9px] opacity-80">Citizen</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('authority')}
                className={`py-1.5 px-2 rounded-lg font-medium transition-all text-center flex flex-col items-center gap-0.5 ${
                  selectedRole === 'authority'
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>🏛️ तहसीलदार</span>
                <span className="text-[9px] opacity-80">Authority</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className={`py-1.5 px-2 rounded-lg font-medium transition-all text-center flex flex-col items-center gap-0.5 ${
                  selectedRole === 'admin'
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>🔑 प्रशासक</span>
                <span className="text-[9px] opacity-80">Admin</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Login Method Switcher: Password vs Mobile OTP */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 mb-5">
              <button
                type="button"
                onClick={() => { setLoginMethod('password'); setErrorMsg(''); }}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                  loginMethod === 'password'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <Lock size={13} /> पासवर्ड द्वारा लॉगिन (Password)
              </button>
              <button
                type="button"
                onClick={() => { setLoginMethod('otp'); setErrorMsg(''); }}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                  loginMethod === 'otp'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <Phone size={13} /> ओटीपी लॉगिन (Mobile OTP)
              </button>
            </div>

            {/* Alert / Feedback message */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 size={15} className="shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Password Login Form */}
            {loginMethod === 'password' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    ईमेल आईडी या मोबाइल नंबर (Email / Mobile)
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      required
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="उदा. ramesh.kumar@example.com या मोबाइल नंबर"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-blue-600 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                      पासवर्ड (Password)
                    </label>
                    <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('डेमो पासवर्ड: land123'); }} className="text-[11px] text-blue-600 hover:underline">
                      पासवर्ड भूल गए?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      required
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:border-blue-600 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded accent-blue-600"
                    />
                    <span>मुझे याद रखें (Remember me)</span>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full font-bold text-xs py-2.5 shadow-md"
                  disabled={submitting}
                >
                  {submitting ? 'सत्यापित हो रहा है...' : 'लॉगिन करें (Sign In) →'}
                </Button>
              </form>
            ) : (
              /* Mobile OTP Login Form */
              <form onSubmit={otpSent ? handleLoginSubmit : handleSendOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    पंजीकृत मोबाइल नंबर (Registered Mobile)
                  </label>
                  <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 px-3 py-2.5 text-xs font-bold border-r border-slate-200 dark:border-slate-700 flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 text-xs outline-none"
                    />
                  </div>
                </div>

                {otpSent && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                        6-अंकीय ओटीपी (Enter 6-Digit OTP)
                      </label>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-[11px] text-blue-600 hover:underline"
                      >
                        पुनः भेजें (Resend OTP)
                      </button>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="482910"
                      className="w-full text-center tracking-widest font-mono text-base font-bold py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-blue-600"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full font-bold text-xs py-2.5 shadow-md"
                  disabled={submitting}
                >
                  {submitting
                    ? 'कृपया प्रतीक्षा करें...'
                    : otpSent
                    ? 'ओटीपी सत्यापित कर लॉगिन करें →'
                    : 'ओटीपी प्राप्त करें (Send OTP) →'}
                </Button>
              </form>
            )}

            {/* Quick 1-Click Demo Buttons */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2 text-center">
                त्वरित डेमो लॉगिन (1-Click Test Access):
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('citizen')}
                  className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 text-center transition-all"
                >
                  👤 रमेश (नागरिक)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('authority')}
                  className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 text-center transition-all"
                >
                  🏛️ तहसीलदार
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 text-center transition-all"
                >
                  🔑 रजिस्ट्रार
                </button>
              </div>
            </div>

            {/* Web3 Wallet Option */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                className="w-full text-xs py-2 flex items-center justify-center gap-2"
                onClick={connect}
                disabled={connecting}
              >
                <Wallet size={14} className="text-amber-500" />
                {connecting ? 'वॉलेट कनेक्ट हो रहा है...' : address ? `वॉलेट कनेक्टेड: ${address.slice(0, 6)}...${address.slice(-4)}` : 'MetaMask / Web3 वॉलेट से लॉगिन करें'}
              </Button>
            </div>

            {/* Link to Register */}
            <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
              नया खाता बनाना चाहते हैं?{' '}
              <Link to="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                यहाँ नया पंजीकरण करें (Register)
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Official Footer Strip */}
      <footer className="py-3 px-5 border-t border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-400 bg-white dark:bg-slate-900">
        LandChain — सुरक्षित डिजिटल भूलेख एवं रजिस्ट्रीकरण मंच | राष्ट्रीय ई-गवर्नेंस मानक DILRMP के अनुरूप
      </footer>
    </div>
  );
}
