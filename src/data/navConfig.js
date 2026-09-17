import {
  LayoutDashboard, FilePlus2, UploadCloud, ShieldCheck, ArrowLeftRight,
  History, Search, Bell, User, Landmark, Settings, Compass, Map,
} from 'lucide-react';

export const userNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/bhulekh', label: 'Bhoolekh (भूलेख नक्शा)', icon: Map },
  { to: '/search', label: 'Search Land', icon: Search },
  { to: '/register-land', label: 'Register Land', icon: FilePlus2 },
  { to: '/upload-documents', label: 'Upload Documents', icon: UploadCloud },
  { to: '/verification-status', label: 'Verification Status', icon: ShieldCheck },
  { to: '/transfer-ownership', label: 'Transfer Ownership', icon: ArrowLeftRight },
  { to: '/land-history', label: 'Land History', icon: History },
  { to: '/explorer', label: 'Blockchain Explorer', icon: Compass },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
];

export const authorityNav = [
  { to: '/authority', label: 'Authority Dashboard', icon: Landmark, end: true },
  { to: '/bhulekh', label: 'Bhoolekh (भूलेख नक्शा)', icon: Map },
  { to: '/verification-status', label: 'Verification Status', icon: ShieldCheck },
  { to: '/explorer', label: 'Blockchain Explorer', icon: Compass },
  { to: '/search', label: 'Search Land', icon: Search },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
];

export const adminNav = [
  { to: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard, end: true },
  { to: '/bhulekh', label: 'Bhoolekh (भूलेख नक्शा)', icon: Map },
  { to: '/authority', label: 'Authority Panel', icon: Landmark },
  { to: '/explorer', label: 'Blockchain Explorer', icon: Compass },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/admin', label: 'Settings', icon: Settings },
];
