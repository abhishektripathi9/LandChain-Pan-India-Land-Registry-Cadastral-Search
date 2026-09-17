import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  isMetaMaskInstalled,
  requestWalletConnection,
  switchEthereumNetwork,
  getChainInfo,
  formatAddress,
  formatWeiToEth,
} from '../services/web3Service';
import { DEFAULT_CHAIN_ID } from '../contracts/contractConfig';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [address, setAddress] = useState(() => localStorage.getItem('landchain_wallet_address') || null);
  const [balance, setBalance] = useState('0.00');
  const [chainId, setChainId] = useState(DEFAULT_CHAIN_ID);
  const [networkName, setNetworkName] = useState('Sepolia Testnet');
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Sync state with injected provider
  const syncAccountData = useCallback(async (accountAddr) => {
    if (!accountAddr || !window.ethereum) return;
    try {
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      const decId = parseInt(chainIdHex, 16).toString();
      setChainId(decId);
      setNetworkName(getChainInfo(decId).name);

      const balHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accountAddr, 'latest'],
      });
      setBalance(formatWeiToEth(balHex));
    } catch (err) {
      console.warn('Failed to fetch balance or chain details', err);
    }
  }, []);

  // Connect Wallet
  const connect = async () => {
    setConnecting(true);
    setError(null);
    try {
      if (isMetaMaskInstalled()) {
        const data = await requestWalletConnection();
        setAddress(data.address);
        setBalance(data.balance);
        setChainId(data.chainId);
        setNetworkName(data.networkName);
        localStorage.setItem('landchain_wallet_address', data.address);
      } else {
        // Fallback for demonstration / no metamask environment
        const fakeAddr = '0x71C836049C240E9A68367F47E82312b98A288bA2';
        setAddress(fakeAddr);
        setBalance('2.4580');
        setChainId(DEFAULT_CHAIN_ID);
        setNetworkName('Sepolia Testnet (Simulated)');
        localStorage.setItem('landchain_wallet_address', fakeAddr);
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setBalance('0.00');
    localStorage.removeItem('landchain_wallet_address');
  };

  const switchNetwork = async (targetChainId) => {
    try {
      await switchEthereumNetwork(targetChainId);
      if (address) await syncAccountData(address);
    } catch (err) {
      console.error('Network switch failed', err);
    }
  };

  // EIP-1193 Event Listeners
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        localStorage.setItem('landchain_wallet_address', accounts[0]);
        syncAccountData(accounts[0]);
      } else {
        disconnect();
      }
    };

    const handleChainChanged = (newChainIdHex) => {
      const decId = parseInt(newChainIdHex, 16).toString();
      setChainId(decId);
      setNetworkName(getChainInfo(decId).name);
      if (address) syncAccountData(address);
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    // Initial check if already connected
    window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        syncAccountData(accounts[0]);
      }
    }).catch(() => {});

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [syncAccountData, address]);

  return (
    <WalletContext.Provider
      value={{
        address,
        shortAddress: formatAddress(address),
        balance,
        chainId,
        networkName,
        connecting,
        error,
        isMetaMask: isMetaMaskInstalled(),
        connect,
        disconnect,
        switchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
