import { Link, NavLink } from 'react-router-dom';
import { Sun, Moon, Menu, X, Wallet, Phone, Mail, ChevronDown, Check, ExternalLink, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useWallet } from '../context/WalletContext';
import { SUPPORTED_NETWORKS } from '../contracts/contractConfig';
import Button from './Button';
import Logo from './Logo';

const links = [
  { to: '/bhulekh', label: 'Bhoolekh (भूलेख नक्शा)' },
  { to: '/search', label: 'Registry Search' },
  { to: '/explorer', label: 'Explorer' },
  { to: '/dashboard', label: 'Portal' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Helpdesk' },
];

export default function Navbar() {
  const { dark, toggle } = useTheme();
  const { address, shortAddress, balance, chainId, networkName, connecting, connect, disconnect, switchNetwork } = useWallet();
  const [open, setOpen] = useState(false);
  const [walletDropdown, setWalletDropdown] = useState(false);
  const [networkDropdown, setNetworkDropdown] = useState(false);

  return (
    <>
      <div className="gov-strip hidden sm:block text-xs bg-slate-900 text-slate-300 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-5 h-8 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Ministry of Revenue &amp; Land Records — Government of Uttar Pradesh (Blockchain Testnet)
          </span>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5"><Phone size={11} /> 1800-180-0101</span>
            <span className="flex items-center gap-1.5"><Mail size={11} /> registry@landchain.gov.in</span>
          </div>
        </div>
      </div>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/"><Logo /></Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `hover:text-primary transition-colors ${
                    isActive ? 'text-primary font-semibold' : 'text-slate-600 dark:text-slate-300'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            >
              {dark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
            </button>

            {/* Network Selector */}
            {address && (
              <div className="relative">
                <button
                  onClick={() => { setNetworkDropdown(!networkDropdown); setWalletDropdown(false); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-primary transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                  <span>{networkName}</span>
                  <ChevronDown size={13} className="text-slate-400" />
                </button>

                {networkDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                      Switch Network
                    </div>
                    {Object.entries(SUPPORTED_NETWORKS).map(([netChainId, net]) => (
                      <button
                        key={netChainId}
                        onClick={() => {
                          switchNetwork(netChainId);
                          setNetworkDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                      >
                        <span>{net.name}</span>
                        {String(chainId) === String(netChainId) && <Check size={14} className="text-primary" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wallet Connect / Account Pill */}
            {!address ? (
              <Button variant="primary" size="sm" icon={Wallet} onClick={connect} disabled={connecting}>
                {connecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => { setWalletDropdown(!walletDropdown); setNetworkDropdown(false); }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-primary/30 bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 transition-colors text-xs font-medium text-slate-800 dark:text-slate-100"
                >
                  <span className="font-mono text-primary font-bold">{balance} ETH</span>
                  <span className="text-slate-400">|</span>
                  <span className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    {shortAddress}
                  </span>
                  <ChevronDown size={13} className="text-slate-400" />
                </button>

                {walletDropdown && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                      <span className="text-xs font-semibold text-slate-500">Connected Wallet</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 font-mono">Active</span>
                    </div>
                    <p className="text-xs font-mono break-all text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg mb-2">
                      {address}
                    </p>
                    <div className="text-xs text-slate-500 mb-3 flex justify-between">
                      <span>Balance:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100 font-mono">{balance} ETH</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Link
                        to="/dashboard"
                        onClick={() => setWalletDropdown(false)}
                        className="text-xs text-center py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          disconnect();
                          setWalletDropdown(false);
                        }}
                        className="text-xs text-center py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-medium hover:bg-red-100"
                      >
                        Disconnect Wallet
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {open && (
          <div className="md:hidden px-5 pb-5 flex flex-col gap-3 border-t border-slate-200 dark:border-slate-800 pt-4 bg-white dark:bg-slate-950">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-sm font-medium py-1.5 text-slate-600 dark:text-slate-300"
              >
                {l.label}
              </NavLink>
            ))}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500">Theme</span>
              <button onClick={toggle} className="p-2 rounded-md border border-slate-200 dark:border-slate-700">
                {dark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
              </button>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={Wallet}
              onClick={() => {
                connect();
                setOpen(false);
              }}
            >
              {address ? shortAddress : 'Connect Wallet'}
            </Button>
          </div>
        )}
      </header>
    </>
  );
}
