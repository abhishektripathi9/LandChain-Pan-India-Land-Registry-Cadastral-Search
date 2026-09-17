import LandRegistryABI from './LandRegistryABI.json';

// Deployed Smart Contract Addresses by Network
export const CONTRACT_ADDRESSES = {
  // Sepolia Testnet (Default Recommended)
  '11155111': import.meta.env.VITE_SEPOLIA_CONTRACT_ADDRESS || '0x3544Db25B129c50E59c47019808De6b5832E5f73',
  // Polygon Amoy Testnet
  '80002': import.meta.env.VITE_POLYGON_AMOY_CONTRACT_ADDRESS || '0x71C2c253b8112d8a57B696009E488d0F12723c31',
  // Local Hardhat / Ganache
  '31337': import.meta.env.VITE_LOCAL_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  '1337': import.meta.env.VITE_LOCAL_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3',
};

export const DEFAULT_CHAIN_ID = '11155111'; // Sepolia

export const SUPPORTED_NETWORKS = {
  '11155111': {
    chainIdHex: '0xaa36a7',
    chainIdDec: 11155111,
    name: 'Sepolia Testnet',
    currency: 'ETH',
    symbol: 'SepoliaETH',
    rpcUrls: ['https://rpc.sepolia.org', 'https://ethereum-sepolia-rpc.publicnode.com'],
    blockExplorer: 'https://sepolia.etherscan.io',
    testnet: true,
  },
  '80002': {
    chainIdHex: '0x13882',
    chainIdDec: 80002,
    name: 'Polygon Amoy',
    currency: 'POL',
    symbol: 'POL',
    rpcUrls: ['https://rpc-amoy.polygon.technology'],
    blockExplorer: 'https://amoy.polygonscan.com',
    testnet: true,
  },
  '31337': {
    chainIdHex: '0x7a69',
    chainIdDec: 31337,
    name: 'Hardhat Localhost',
    currency: 'ETH',
    symbol: 'ETH',
    rpcUrls: ['http://127.0.0.1:8545'],
    blockExplorer: 'http://localhost:8545',
    testnet: true,
  },
};

export const getContractAddress = (chainId) => {
  const normalized = chainId ? String(chainId) : DEFAULT_CHAIN_ID;
  return CONTRACT_ADDRESSES[normalized] || CONTRACT_ADDRESSES[DEFAULT_CHAIN_ID];
};

export const LAND_STATUS_MAP = {
  0: 'Pending',
  1: 'Approved',
  2: 'Rejected',
  Pending: 0,
  Approved: 1,
  Rejected: 2,
};

export { LandRegistryABI };
