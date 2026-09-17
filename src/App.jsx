import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { WalletProvider } from './context/WalletContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RegisterLand from './pages/RegisterLand';
import UploadDocuments from './pages/UploadDocuments';
import VerificationStatus from './pages/VerificationStatus';
import TransferOwnership from './pages/TransferOwnership';
import BlockchainExplorer from './pages/BlockchainExplorer';
import LandHistory from './pages/LandHistory';
import SearchLand from './pages/SearchLand';
import BhulekhMap from './pages/BhulekhMap';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import AuthorityDashboard from './pages/AuthorityDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AboutProject from './pages/AboutProject';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ThemeProvider>
      <WalletProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register-land" element={<RegisterLand />} />
            <Route path="/upload-documents" element={<UploadDocuments />} />
            <Route path="/verification-status" element={<VerificationStatus />} />
            <Route path="/transfer-ownership" element={<TransferOwnership />} />
            <Route path="/explorer" element={<BlockchainExplorer />} />
            <Route path="/land-history" element={<LandHistory />} />
            <Route path="/search" element={<SearchLand />} />
            <Route path="/bhulekh" element={<BhulekhMap />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/authority" element={<AuthorityDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/about" element={<AboutProject />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WalletProvider>
    </ThemeProvider>
  );
}
