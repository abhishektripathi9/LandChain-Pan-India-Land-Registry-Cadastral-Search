# 🌍 LandChain DApp - Complete Full-Stack & Deployment Guide

This guide covers everything required to run, test, and deploy the **LandChain Decentralized Land Registry DApp** with **Real Smart Contracts**, **IPFS Document Pinning (Pinata)**, **Node.js/Express Backend with MongoDB**, and **React/Vite Frontend on Netlify**.

---

## 🏛️ Architecture Overview

```
 ┌─────────────────────────────────────────────────────────┐
 │                   React + Vite Frontend                 │
 │  (WalletContext · Web3Service · IPFSService · ApiService)│
 └──────────────┬──────────────────────────┬───────────────┘
                │                          │
        MetaMask / Ethers.js         REST API / Axios
                │                          │
                ▼                          ▼
 ┌─────────────────────────┐   ┌───────────────────────────┐
 │ Ethereum Smart Contract │   │   Node.js/Express Backend │
 │   (LandRegistry.sol)    │   │  (MongoDB + IPFS Relay)   │
 └─────────────────────────┘   └─────────────┬─────────────┘
                                             │
                                             ▼
                               ┌───────────────────────────┐
                               │  IPFS Network / Pinata    │
                               │   (Document Storage)      │
                               └───────────────────────────┘
```

---

## 1. 📜 Smart Contract Deployment

The Solidity contract is located at `contracts/LandRegistry.sol` and compiled ABI at `src/contracts/LandRegistryABI.json`.

### Option A: Deploy via Remix IDE (Easiest for Sepolia Testnet)
1. Open [Remix IDE](https://remix.ethereum.org/).
2. Create `LandRegistry.sol` and paste the contents of `contracts/LandRegistry.sol`.
3. In the **Solidity Compiler** tab, select version `0.8.20` or higher and click **Compile LandRegistry.sol**.
4. In the **Deploy & Run Transactions** tab:
   - Environment: `Injected Provider - MetaMask`
   - Ensure your MetaMask is connected to **Sepolia Testnet** or **Polygon Amoy**.
   - Click **Deploy** and confirm the transaction in MetaMask.
5. Copy the deployed contract address.
6. Open `.env` (or `src/contracts/contractConfig.js`) and set:
   ```env
   VITE_LAND_REGISTRY_CONTRACT_ADDRESS=0xYourDeployedContractAddressHere
   ```

### Option B: Deploy via Hardhat
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat run scripts/deploy.js --network sepolia
```

---

## 2. 📁 IPFS Integration (Pinata / Web3.Storage)

LandChain computes a cryptographic **SHA-256 fingerprint** of every title deed before pinning it to IPFS.

1. Sign up at [Pinata Cloud](https://www.pinata.cloud/).
2. Navigate to **API Keys** and generate a new key with `pinFileToIPFS` and `pinJSONToIPFS` permissions.
3. Copy the **JWT Token** or **API Key + Secret**.
4. Add them to your `.env` file:
   ```env
   VITE_PINATA_JWT=your_pinata_jwt_token_here
   # OR
   VITE_PINATA_API_KEY=your_pinata_api_key
   VITE_PINATA_SECRET_API_KEY=your_pinata_secret_key
   ```
*(Note: If no API keys are provided in development, LandChain uses client-side SHA-256 hashing and deterministic IPFS CID generation with public gateways so you can test immediately!)*

---

## 3. 🖥️ Backend Server Setup (Node.js & MongoDB)

The backend provides MongoDB persistence, JWT authentication, and administrative audit logging.

```bash
cd backend
npm install
```

### Environment Configuration (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/landregistry?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_landchain_2026
PINATA_JWT=your_pinata_jwt_token_here
FRONTEND_URL=http://localhost:5173
```

### Start the Backend:
```bash
npm run dev
# Server will run on http://localhost:5000 with auto-fallback if MongoDB is offline.
```

---

## 4. 💻 Running the Frontend Locally

```bash
# In the root project directory:
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 5. 🚀 Deploying Frontend to Netlify

The project is pre-configured with `netlify.toml` and `public/_redirects` for Single Page Application (SPA) routing.

### Method 1: Git-Connected Deploy (Recommended)
1. Push this repository to GitHub or GitLab.
2. Log in to [Netlify](https://app.netlify.com/).
3. Click **Add new site** > **Import an existing project**.
4. Select your repository.
5. Netlify will automatically detect the settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. In **Site Configuration** > **Environment variables**, add:
   - `VITE_LAND_REGISTRY_CONTRACT_ADDRESS`
   - `VITE_DEFAULT_CHAIN_ID` (`11155111` for Sepolia or `1337` for Localhost)
   - `VITE_PINATA_JWT`
   - `VITE_API_BASE_URL` (URL of your deployed backend)
7. Click **Deploy Site**.

### Method 2: Netlify CLI
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

---

## 🧪 End-to-End User Flow

1. **Connect Wallet**: Click "Connect Wallet" on the top navigation bar and approve in MetaMask (supports Sepolia, Polygon Amoy, and Localhost).
2. **Citizen Registers Land**:
   - Go to `/register-land`.
   - Fill in Survey Number, Location, Valuation, and Upload Deed Document.
   - Click "Register Land on Blockchain".
   - The file is hashed with SHA-256, pinned to IPFS, and a transaction is recorded on the smart contract.
3. **Authority Verification**:
   - Go to `/authority`.
   - The pending parcel appears in the verification queue.
   - Click "Review & Sign", inspect the IPFS deed link, and click "Approve & Sign On-Chain".
4. **Transfer Title**:
   - Go to `/transfer`.
   - Select the approved parcel, enter the buyer's Ethereum address, and execute the transfer.
5. **Inspect Provenance & Explorer**:
   - View `/history` for the chronological provenance timeline.
   - View `/explorer` to inspect block heights, gas fees, and tx hashes.
