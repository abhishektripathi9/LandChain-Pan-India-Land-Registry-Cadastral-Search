export const stats = {
  registeredLands: 128,
  pendingVerification: 14,
  approvedLands: 109,
  totalTransactions: 342,
  totalUsers: 1284,
  totalAuthorities: 12,
};

export const lands = [
  { id: 'LND-2026-0091', surveyNo: 'SY-441/2A', owner: 'Ramesh Kumar', village: 'Chinhat', district: 'Lucknow', state: 'Uttar Pradesh', area: '0.85 acres', type: 'Residential', value: '₹42,00,000', status: 'Approved', lastUpdated: '2026-07-18' },
  { id: 'LND-2026-0088', surveyNo: 'SY-118/9', owner: 'Ayesha Siddiqui', village: 'Malihabad', district: 'Lucknow', state: 'Uttar Pradesh', area: '1.2 acres', type: 'Agricultural', value: '₹18,50,000', status: 'Pending', lastUpdated: '2026-07-25' },
  { id: 'LND-2026-0075', surveyNo: 'SY-77/3B', owner: 'Vikram Singh', village: 'Sarojini Nagar', district: 'Lucknow', state: 'Uttar Pradesh', area: '0.4 acres', type: 'Commercial', value: '₹65,00,000', status: 'Approved', lastUpdated: '2026-06-30' },
  { id: 'LND-2026-0062', surveyNo: 'SY-260/1', owner: 'Neha Verma', village: 'Gomti Nagar', district: 'Lucknow', state: 'Uttar Pradesh', area: '0.6 acres', type: 'Residential', value: '₹51,00,000', status: 'Rejected', lastUpdated: '2026-06-12' },
  { id: 'LND-2026-0059', surveyNo: 'SY-19/5', owner: 'Arjun Mehta', village: 'Alambagh', district: 'Lucknow', state: 'Uttar Pradesh', area: '2.1 acres', type: 'Agricultural', value: '₹29,00,000', status: 'Approved', lastUpdated: '2026-05-29' },
  { id: 'LND-2026-0044', surveyNo: 'SY-303/2C', owner: 'Priya Nair', village: 'Indira Nagar', district: 'Lucknow', state: 'Uttar Pradesh', area: '0.3 acres', type: 'Residential', value: '₹38,00,000', status: 'Pending', lastUpdated: '2026-05-14' },
];

export const transactions = [
  { hash: '0x8f3a...c92e', block: 19834211, type: 'Registration', landId: 'LND-2026-0091', gas: '0.0021 ETH', timestamp: '2026-07-18 10:42', from: '0x71C...8bA2' },
  { hash: '0x2b91...a71d', block: 19833980, type: 'Verification', landId: 'LND-2026-0088', gas: '0.0009 ETH', timestamp: '2026-07-17 16:05', from: '0x4Ad...12Fe' },
  { hash: '0x9e04...f30b', block: 19832754, type: 'Ownership Transfer', landId: 'LND-2026-0075', gas: '0.0034 ETH', timestamp: '2026-07-15 09:12', from: '0x9F1...caB0' },
  { hash: '0x51c8...7d2a', block: 19831102, type: 'Registration', landId: 'LND-2026-0062', gas: '0.0018 ETH', timestamp: '2026-07-11 13:47', from: '0x2Eb...44D1' },
  { hash: '0xd07f...b19c', block: 19829560, type: 'Ownership Transfer', landId: 'LND-2026-0059', gas: '0.0029 ETH', timestamp: '2026-07-06 08:20', from: '0x88A...9c3E' },
];

export const notifications = [
  { id: 1, type: 'approval', title: 'Land verification approved', message: 'LND-2026-0091 has been verified and approved by the district authority.', time: '2h ago', unread: true },
  { id: 2, type: 'transfer', title: 'Ownership transfer completed', message: 'Transfer of LND-2026-0075 to new owner confirmed on chain.', time: '1d ago', unread: true },
  { id: 3, type: 'rejection', title: 'Document rejected', message: 'Sale deed for LND-2026-0062 was rejected. Re-upload required.', time: '3d ago', unread: false },
  { id: 4, type: 'blockchain', title: 'Blockchain confirmation', message: 'Transaction 0x8f3a...c92e confirmed with 12 block confirmations.', time: '5d ago', unread: false },
];

export const ownershipTimeline = [
  { owner: 'Suresh Chandra', role: 'Original Owner', date: '2011-03-14', txHash: '0x1a2b...9f0e' },
  { owner: 'Meera Joshi', role: 'Purchased', date: '2016-08-02', txHash: '0x3c4d...7e1a' },
  { owner: 'Ramesh Kumar', role: 'Purchased', date: '2022-11-21', txHash: '0x5e6f...2b3c' },
  { owner: 'Ramesh Kumar', role: 'Current Owner', date: '2026-07-18', txHash: '0x8f3a...c92e' },
];

export const verificationRequests = [
  { id: 'REQ-3391', landId: 'LND-2026-0088', owner: 'Ayesha Siddiqui', submitted: '2026-07-25', status: 'Pending', documents: 4 },
  { id: 'REQ-3388', landId: 'LND-2026-0044', owner: 'Priya Nair', submitted: '2026-07-20', status: 'Pending', documents: 3 },
  { id: 'REQ-3379', landId: 'LND-2026-0062', owner: 'Neha Verma', submitted: '2026-07-10', status: 'Rejected', documents: 4 },
  { id: 'REQ-3360', landId: 'LND-2026-0091', owner: 'Ramesh Kumar', submitted: '2026-06-30', status: 'Approved', documents: 5 },
];

export const chartData = {
  monthly: [
    { month: 'Feb', registrations: 14, transfers: 6 },
    { month: 'Mar', registrations: 19, transfers: 9 },
    { month: 'Apr', registrations: 22, transfers: 11 },
    { month: 'May', registrations: 18, transfers: 14 },
    { month: 'Jun', registrations: 27, transfers: 16 },
    { month: 'Jul', registrations: 31, transfers: 20 },
  ],
  landTypes: [
    { name: 'Residential', value: 54 },
    { name: 'Agricultural', value: 38 },
    { name: 'Commercial', value: 26 },
    { name: 'Industrial', value: 10 },
  ],
  gasUsage: [
    { month: 'Feb', gas: 0.041 },
    { month: 'Mar', gas: 0.052 },
    { month: 'Apr', gas: 0.048 },
    { month: 'May', gas: 0.061 },
    { month: 'Jun', gas: 0.073 },
    { month: 'Jul', gas: 0.069 },
  ],
};

export const testimonials = [
  { name: 'Dr. S. Rangarajan', role: 'District Registrar, Lucknow', quote: 'Verification time dropped from weeks to hours once records moved on-chain.' },
  { name: 'Ayesha Siddiqui', role: 'Landowner', quote: 'I could track my registration status without a single office visit.' },
  { name: 'Vikram Singh', role: 'Property Buyer', quote: 'Seeing the full ownership chain before buying gave me real confidence.' },
];

export const faqs = [
  { q: 'How does blockchain prevent land fraud?', a: 'Every record is cryptographically linked to the previous one, so past entries cannot be altered without detection.' },
  { q: 'Do I need a MetaMask wallet?', a: 'Yes, MetaMask is used to sign transactions and verify your identity on-chain.' },
  { q: 'Where are my documents stored?', a: 'Documents are stored on IPFS; only their hash is recorded on the blockchain to keep storage costs low.' },
  { q: 'Can the government still approve records?', a: 'Yes, district authorities review and approve submissions through a dedicated dashboard before they are finalised.' },
];
