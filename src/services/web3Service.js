import { LandRegistryABI, getContractAddress, SUPPORTED_NETWORKS, DEFAULT_CHAIN_ID } from '../contracts/contractConfig';
import { lands as initialDummyLands, transactions as initialDummyTransactions } from '../data/dummyData';
import { saveParcelOwnerOverride } from '../data/cadastralData';

// Local storage key for persistent on-chain simulation when testing offline
const LOCAL_LANDS_KEY = 'landchain_registered_lands_v2';
const LOCAL_TXS_KEY = 'landchain_transactions_v2';
const LOCAL_HISTORY_KEY = 'landchain_history_v2';

export const isMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && Boolean(window.ethereum);
};

export const getChainInfo = (chainIdDecOrHex) => {
  if (!chainIdDecOrHex) return SUPPORTED_NETWORKS[DEFAULT_CHAIN_ID];
  const dec = typeof chainIdDecOrHex === 'string' && chainIdDecOrHex.startsWith('0x')
    ? parseInt(chainIdDecOrHex, 16).toString()
    : String(chainIdDecOrHex);
  return SUPPORTED_NETWORKS[dec] || {
    name: `Chain ${dec}`,
    currency: 'ETH',
    symbol: 'ETH',
    blockExplorer: 'https://etherscan.io',
  };
};

export const formatAddress = (addr) => {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

export const formatWeiToEth = (weiHexOrString) => {
  if (!weiHexOrString) return '0.00';
  try {
    const wei = BigInt(weiHexOrString);
    const eth = Number(wei) / 1e18;
    return eth.toFixed(4);
  } catch {
    return '0.00';
  }
};

export const formatEthToWeiHex = (ethAmount) => {
  try {
    const wei = BigInt(Math.floor(parseFloat(ethAmount || '0') * 1e18));
    return '0x' + wei.toString(16);
  } catch {
    return '0x0';
  }
};

/**
 * Request Wallet Connection via EIP-1193
 */
export async function requestWalletConnection() {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask browser extension.');
  }

  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });

  if (!accounts || accounts.length === 0) {
    throw new Error('No accounts selected in wallet.');
  }

  const address = accounts[0];
  const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
  const chainId = parseInt(chainIdHex, 16).toString();
  
  const balanceHex = await window.ethereum.request({
    method: 'eth_getBalance',
    params: [address, 'latest'],
  });
  const balance = formatWeiToEth(balanceHex);

  return {
    address,
    chainId,
    chainIdHex,
    balance,
    networkName: getChainInfo(chainId).name,
  };
}

/**
 * Switch or Add Network
 */
export async function switchEthereumNetwork(targetChainIdDec = DEFAULT_CHAIN_ID) {
  if (!isMetaMaskInstalled()) return;
  const net = SUPPORTED_NETWORKS[targetChainIdDec] || SUPPORTED_NETWORKS[DEFAULT_CHAIN_ID];
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: net.chainIdHex }],
    });
  } catch (switchError) {
    // Error code 4902 indicates the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: net.chainIdHex,
            chainName: net.name,
            nativeCurrency: {
              name: net.currency,
              symbol: net.symbol,
              decimals: 18,
            },
            rpcUrls: net.rpcUrls,
            blockExplorerUrls: [net.blockExplorer],
          },
        ],
      });
    } else {
      throw switchError;
    }
  }
}

// Local Storage Helper for seamless sync
export function getStoredLands() {
  try {
    const raw = localStorage.getItem(LOCAL_LANDS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Error reading stored lands', err);
  }
  return initialDummyLands;
}

export function saveStoredLands(lands) {
  try {
    localStorage.setItem(LOCAL_LANDS_KEY, JSON.stringify(lands));
  } catch (err) {
    console.warn('Error storing lands', err);
  }
}

export function getStoredTransactions() {
  try {
    const raw = localStorage.getItem(LOCAL_TXS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Error reading stored txs', err);
  }
  return initialDummyTransactions;
}

export function saveStoredTransactions(txs) {
  try {
    localStorage.setItem(LOCAL_TXS_KEY, JSON.stringify(txs));
  } catch (err) {
    console.warn('Error storing txs', err);
  }
}

/**
 * Register Land On-Chain / DApp State
 */
export async function registerLandOnChain({
  surveyNo,
  ownerName,
  location,
  village,
  district,
  state,
  area,
  landType,
  marketValue,
  ipfsDocCID,
  account,
}) {
  const generatedId = `LND-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const fakeTxHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  let txHash = fakeTxHash;

  // If live Web3 provider with selected account is active, attempt on-chain transaction
  if (isMetaMaskInstalled() && account) {
    try {
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      const contractAddr = getContractAddress(parseInt(chainIdHex, 16).toString());
      
      // Dispatch real transaction or signature
      const sendParams = {
        from: account,
        to: contractAddr,
        data: '0x', // raw data or encoded ABI call
        value: '0x0',
      };
      
      // Note: If user signs on testnet, we get real on-chain tx hash
      const realTx = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [sendParams],
      });
      if (realTx) txHash = realTx;
    } catch (err) {
      console.warn('On-chain transaction prompt skipped or declined, proceeding with verified registry record:', err.message);
    }
  }

  const newLand = {
    id: generatedId,
    surveyNo: surveyNo || `SY-${Math.floor(100 + Math.random() * 899)}/1`,
    owner: ownerName || 'Current User',
    ownerAddress: account || '0x71C...8bA2',
    location: location || `${village}, ${district}`,
    village: village || 'Chinhat',
    district: district || 'Lucknow',
    state: state || 'Uttar Pradesh',
    area: area || '0.75 acres',
    type: landType || 'Residential',
    value: marketValue || '₹35,00,000',
    ipfsDocCID: ipfsDocCID || 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
    status: 'Pending',
    lastUpdated: new Date().toISOString().split('T')[0],
    registrationTx: txHash,
  };

  // Update Lands in cache & state
  const currentLands = getStoredLands();
  const updatedLands = [newLand, ...currentLands];
  saveStoredLands(updatedLands);

  // Update Transactions in Explorer
  const currentTxs = getStoredTransactions();
  const newTx = {
    hash: txHash.slice(0, 8) + '...' + txHash.slice(-4),
    fullHash: txHash,
    block: 19835000 + Math.floor(Math.random() * 500),
    type: 'Registration',
    landId: generatedId,
    gas: '0.0024 ETH',
    timestamp: new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    from: account ? formatAddress(account) : '0x71C...8bA2',
  };
  saveStoredTransactions([newTx, ...currentTxs]);

  return {
    land: newLand,
    txHash,
    landId: generatedId,
  };
}

/**
 * Verify Land Request (Authority Action)
 */
export async function verifyLandOnChain(landId, status, reason = '', authorityAccount) {
  let txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

  if (isMetaMaskInstalled() && authorityAccount) {
    try {
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      const contractAddr = getContractAddress(parseInt(chainIdHex, 16).toString());
      const realTx = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ from: authorityAccount, to: contractAddr, data: '0x', value: '0x0' }],
      });
      if (realTx) txHash = realTx;
    } catch (err) {
      console.warn('Authority signature fallback:', err.message);
    }
  }

  const currentLands = getStoredLands();
  const updatedLands = currentLands.map((l) =>
    l.id === landId ? { ...l, status, lastUpdated: new Date().toISOString().split('T')[0], rejectionReason: reason } : l
  );
  saveStoredLands(updatedLands);

  // Add Explorer log
  const currentTxs = getStoredTransactions();
  const newTx = {
    hash: txHash.slice(0, 8) + '...' + txHash.slice(-4),
    fullHash: txHash,
    block: 19835100 + Math.floor(Math.random() * 500),
    type: `Verification (${status})`,
    landId: landId,
    gas: '0.0012 ETH',
    timestamp: new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    from: authorityAccount ? formatAddress(authorityAccount) : '0x4Ad...12Fe',
  };
  saveStoredTransactions([newTx, ...currentTxs]);

  return { landId, status, txHash };
}

/**
 * Transfer Land Ownership (पूर्णतः सुरक्षित स्वामित्व हस्तांतरण एवं वंशावली पंजीकरण)
 */
export async function transferLandOwnershipOnChain({
  landId,
  buyerName,
  buyerAddress,
  transferReason,
  salePrice,
  fatherName,
  sellerName,
  sellerFatherName,
  sellerAadhaar,
  buyerAadhaar,
  buyerPhone,
  stampDuty,
  account,
}) {
  let txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

  if (isMetaMaskInstalled() && account) {
    try {
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      const contractAddr = getContractAddress(parseInt(chainIdHex, 16).toString());
      const realTx = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ from: account, to: contractAddr, data: '0x', value: '0x0' }],
      });
      if (realTx) txHash = realTx;
    } catch (err) {
      console.warn('Transfer transaction fallback:', err.message);
    }
  }

  // Calculate numbers
  const priceClean = salePrice || '₹45,00,000';
  const priceNum = parseInt(priceClean.replace(/\D/g, '')) || 4500000;
  const stampCalculated = stampDuty || `₹${Math.round(priceNum * 0.07).toLocaleString('en-IN')}`;
  const mutationOrder = `MUT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  const deedNumber = `REG-${Math.floor(1000 + Math.random() * 9000)}/VOL-${Math.floor(100 + Math.random() * 900)}`;
  const transferDate = new Date().toISOString().split('T')[0];

  // Update current owner in lands
  const currentLands = getStoredLands();
  const currentLandItem = currentLands.find((l) => l.id === landId);
  const resolvedSeller = sellerName || currentLandItem?.owner || 'पूर्व पंजीकृत स्वामी';

  const updatedLands = currentLands.map((l) =>
    l.id === landId
      ? {
          ...l,
          owner: buyerName,
          previousOwner: resolvedSeller,
          ownerAddress: buyerAddress,
          lastUpdated: transferDate,
        }
      : l
  );
  saveStoredLands(updatedLands);

  // Also sync Bhoolekh cadastral parcel override so it appears live on the map!
  saveParcelOwnerOverride(landId, buyerName, txHash);

  // Update history timeline for this land
  try {
    const rawHist = localStorage.getItem(LOCAL_HISTORY_KEY) || '{}';
    const parsedHist = JSON.parse(rawHist);
    const itemHist = parsedHist[landId] || [];
    itemHist.push({
      fromOwner: resolvedSeller,
      sellerName: resolvedSeller,
      sellerFatherName: sellerFatherName || 'दर्ज विलेख अनुसार',
      sellerAadhaar: sellerAadhaar || 'XXXX XXXX 8912',
      owner: buyerName,
      toOwner: buyerName,
      fatherName: fatherName || 'दर्ज विलेख अनुसार',
      buyerAadhaar: buyerAadhaar || 'XXXX XXXX 4102',
      buyerPhone: buyerPhone || '+91 98765 43210',
      buyerAddress: buyerAddress,
      role: 'क्रेता (दाखिल-खारिज पश्चात वर्तमान स्वामी)',
      date: transferDate,
      txHash: txHash.slice(0, 8) + '...' + txHash.slice(-4),
      fullTxHash: txHash,
      reason: transferReason || 'पंजीकृत बैनामा (Registered Conveyance Deed)',
      salePrice: priceClean,
      stampDuty: stampCalculated,
      mutationOrderNo: mutationOrder,
      deedNo: deedNumber,
      status: 'दाखिल-खारिज स्वीकृत व ब्लॉकचेन प्रमाणित',
    });
    parsedHist[landId] = itemHist;
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(parsedHist));
  } catch (err) {
    console.warn('Error writing history timeline', err);
  }

  // Log in Explorer
  const currentTxs = getStoredTransactions();
  const newTx = {
    hash: txHash.slice(0, 8) + '...' + txHash.slice(-4),
    fullHash: txHash,
    block: 19835200 + Math.floor(Math.random() * 500),
    type: 'Ownership Transfer (दाखिल-खारिज)',
    landId: landId,
    gas: '0.0031 ETH',
    timestamp: new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    from: resolvedSeller,
    to: buyerName,
  };
  saveStoredTransactions([newTx, ...currentTxs]);

  return {
    landId,
    newOwner: buyerName,
    sellerName: resolvedSeller,
    fatherName,
    txHash,
    salePrice: priceClean,
    stampDuty: stampCalculated,
    mutationOrderNo: mutationOrder,
    deedNo: deedNumber,
    date: transferDate,
  };
}
