import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Wallet, Eye, EyeOff, Shield } from 'lucide-react';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { useWallet } from '../context/WalletContext';

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const { connect, connecting } = useWallet();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-center justify-center bg-primary text-white p-12 relative overflow-hidden">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-8">
            <Shield size={38} />
          </div>
          <h2 className="font-display text-3xl font-bold max-w-sm">Secure access to your land records</h2>
          <p className="text-white/80 mt-4 max-w-sm mx-auto">Sign in to manage registrations, track verification and view your ownership history.</p>
        </motion.div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <Link to="/" className="mb-8 inline-block"><Logo /></Link>
          <h1 className="font-display text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-7">Login to continue to your dashboard.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input required type="email" placeholder="you@example.com" className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input required type={showPass ? 'text' : 'password'} placeholder="••••••••" className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-primary" />
                <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-3.5 top-3.5 text-slate-400">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <input type="checkbox" className="rounded accent-primary" /> Remember me
              </label>
              <a href="#" className="text-primary font-medium">Forgot password?</a>
            </div>
            <Button type="submit" className="w-full" size="lg">Login</Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>

          <Button variant="outline" className="w-full" size="lg" icon={Wallet} onClick={connect} disabled={connecting}>
            {connecting ? 'Connecting…' : 'Connect with MetaMask'}
          </Button>

          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-7">
            Don't have an account? <Link to="/register" className="text-primary font-medium">Register</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
