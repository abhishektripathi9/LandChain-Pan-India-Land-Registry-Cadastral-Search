import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Wallet, Lock } from 'lucide-react';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { useWallet } from '../context/WalletContext';

const fields = [
  { name: 'fullName', label: 'Full Name', icon: User, type: 'text', placeholder: 'Ramesh Kumar' },
  { name: 'email', label: 'Email', icon: Mail, type: 'email', placeholder: 'you@example.com' },
  { name: 'phone', label: 'Phone', icon: Phone, type: 'tel', placeholder: '+91 98765 43210' },
  { name: 'wallet', label: 'Wallet Address', icon: Wallet, type: 'text', placeholder: '0x71C...8bA2' },
  { name: 'password', label: 'Password', icon: Lock, type: 'password', placeholder: '••••••••' },
  { name: 'confirmPassword', label: 'Confirm Password', icon: Lock, type: 'password', placeholder: '••••••••' },
];

export default function Register() {
  const navigate = useNavigate();
  const { address, connect } = useWallet();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg dark:bg-[#0B1120] px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-8">
        <Link to="/" className="mb-6 flex justify-center"><Logo /></Link>
        <h1 className="font-display text-2xl font-bold text-center mb-1">Create your account</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-7">Register to start managing your land records on-chain.</p>

        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.name} className={f.name === 'fullName' || f.name === 'wallet' ? 'sm:col-span-2' : ''}>
              <label className="text-sm font-medium mb-1.5 block">{f.label}</label>
              <div className="relative">
                <f.icon size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                {f.name === 'wallet' ? (
                  <div className="flex gap-2">
                    <input readOnly value={address || ''} placeholder={f.placeholder} className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none" />
                    <Button type="button" variant="outline" size="sm" onClick={connect} className="shrink-0">{address ? 'Connected' : 'Connect'}</Button>
                  </div>
                ) : (
                  <input required type={f.type} placeholder={f.placeholder} className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-primary" />
                )}
              </div>
            </div>
          ))}
          <Button type="submit" className="w-full sm:col-span-2 mt-1" size="lg">Register</Button>
        </form>

        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-6">
          Already have an account? <Link to="/login" className="text-primary font-medium">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
