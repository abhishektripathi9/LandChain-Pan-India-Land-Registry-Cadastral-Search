# 🌐 LandChain — Pan-India Land Registry & Cadastral GIS Platform

[![Build Status](https://img.shields.io/badge/Build-Passing-emerald)](https://github.com/abhishektripathi9/LandChain-Pan-India-Land-Registry-Cadastral-Search)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-purple)](https://vite.dev/)
[![Blockchain](https://img.shields.io/badge/Blockchain-Ethereum%20Smart%20Contracts-indigo)](https://ethereum.org/)
[![DILRMP Standards](https://img.shields.io/badge/Govt%20Standards-DILRMP%20%2F%20ULPIN-amber)](https://dolr.gov.in/)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

**LandChain** is a state-of-the-art decentralized land records and cadastral GIS search platform built for modern land administration across **all 28 States and 8 Union Territories of India**. Aligned with the Government of India's **Digital India Land Records Modernization Programme (DILRMP)** and official 14-digit **ULPIN (Bhu-Aadhar)** standards.

---

## 🚀 Live Demo & Deployment on Render

### Deploying to Render (in 2 Minutes):

1. Go to **[dashboard.render.com](https://dashboard.render.com)** and log in (with GitHub).
2. Click **New +** ➔ **Static Site**.
3. Connect your GitHub repository:
   `abhishektripathi9/LandChain-Pan-India-Land-Registry-Cadastral-Search`
4. Configure settings:
   - **Name**: `landchain-registry` (or your choice)
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Click **Create Static Site**! Render will automatically build and deploy your app with a free live `.onrender.com` SSL domain.

> **Note on Client-Side Routing**: This repository includes `render.yaml` and `public/_redirects` which automatically handles single-page app (SPA) routing on Render so direct links like `/login` or `/bhulekh` never show 404 errors.

---

## 🌟 Key Features

### 1. 🗺️ Pan-India Bhoolekh Cadastral GIS Engine
- Covers **all 28 States and 8 Union Territories** with localized terminology:
  - **Uttar Pradesh**: UP Bhulekh (खतौनी RoR Form 45, गाटा संख्या)
  - **Maharashtra**: Mahabhulekh (७/१२ सातबारा उतारा, गट क्रमांक)
  - **Karnataka**: Bhoomi RTC (ಪಹಣಿ Pahani, Survey/Hissa)
  - **Gujarat**: AnyROR (૭/૧૨ અને ૮-અ જમીન રેકર્ડ)
  - **Rajasthan**: Apna Khata / E-Dharti (जमाबंदी नकल)
  - **Bihar**: Bihar Bhumi / Dakhil-Kharij (दाखिल-खारिज पंजी-II)
  - **West Bengal**: Banglarbhumi (খতিয়ান ও দাগের তথ্য)
- Search any village, town, or city in India to load interactive field boundary polygons, Khasra numbers, and landowners.
- Consolidated **All Fields Data Register (सम्पूर्ण खसरा पंजी)** with 1-click village printing.

### 2. 🆔 14-Digit ULPIN (भू-आधार) Smart Land Card
- Unique Land Parcel Identification Number (e.g. `UP09-LKO-0441-0091`, `MH27-PUN-0912-0044`) for tamper-proof geo-referencing.
- Interactive **Front & Back Digital Bhu-Aadhar Smart Card** with Lion Capital watermark, holographic chip, QR verification, GPS coordinates, and PDF export.

### 3. 🛡️ Multi-Factor Title Transfer & Mutation
- **2FA Identity Verification**: Seller authorization via Aadhaar e-KYC / OTP prevents unauthorized sales.
- **Clean Title Verification**: Automatic validation for non-encumbrance (ऋणमुक्त) and dispute-free status.
- **Automated Stamp Duty**: State-specific 7% stamp duty and 1% registration fee calculation.
- **Zero Double-Selling**: Smart contract immutable state transitions eliminate duplicate registries.
- **Official Digital Deed**: Instant bilingual Conveyance Deed & Mutation Order certificate generation.

### 4. 📜 Complete Previous Owners Provenance (Chain of Custody)
- Historical lineage tracking from original settlement to current title holder:
  ```
  [Original Settler (2004)] ➔ [First Sale (2016)] ➔ [Second Sale (2023)] ➔ [Latest Transfer (2026)]
  ```
- Detailed records of sellers, buyers, deed numbers, dates, consideration prices, stamp duties, mutation orders, and blockchain transaction hashes.

### 5. 🔑 Authentic, Human-Crafted Login & Register Portal
- Simple, accessible bilingual UI (Hindi + English) inspired by official e-Governance portals (DigiLocker, UIDAI).
- Password and Mobile OTP authentication options.
- Role selectors: **Citizen (नागरिक)**, **Authority / Tehsildar (तहसीलदार)**, and **Admin / Registrar (प्रशासक)**.
- 1-Click test demo account fill for rapid testing.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite 8, TailwindCSS, Framer Motion
- **Maps & GIS**: Leaflet, OpenStreetMap, GeoJSON Polygon Geometry
- **Icons & UI**: Lucide React, Recharts
- **Blockchain**: Ethereum Smart Contract Integration, Web3 / MetaMask Provider, Ethers.js
- **Decentralized Storage**: IPFS (InterPlanetary File System) document hashing

---

## 💻 Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/abhishektripathi9/LandChain-Pan-India-Land-Registry-Cadastral-Search.git

# 2. Enter directory
cd LandChain-Pan-India-Land-Registry-Cadastral-Search

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev

# 5. Open in browser
# http://localhost:5173
```

To build for production:
```bash
npm run build
```

---

## 🗺️ Master Route Directory

| Page | URL | Purpose |
| :--- | :--- | :--- |
| **Home** | `/` | Platform landing page, stats, and architectural overview |
| **Login** | `/login` | Dual-mode login (Password & Mobile OTP) |
| **Register** | `/register` | Pan-India citizen and authority registration |
| **Bhoolekh GIS** | `/bhulekh` | Cadastral satellite maps, plot polygons, and village registers |
| **Search Land** | `/search` | Multi-filter Pan-India land search by ULPIN, Khasra, Owner |
| **Transfer Title** | `/transfer-ownership` | Secure 2FA ownership transfer and digital deed generation |
| **Title History** | `/land-history` | Full generational chain of custody ledger |
| **Dashboard** | `/dashboard` | Citizen holdings, on-the-go land finder, quick actions |
| **Register Land** | `/register-land` | On-chain registration with IPFS document uploads |
| **Verification** | `/verification-status` | 4-stage application tracking |
| **Explorer** | `/explorer` | Blockchain blocks, transactions, and gas logs |
| **Authority** | `/authority` | Tehsildar deed verification and approval panel |
| **Admin** | `/admin` | System admin, analytics charts, and user management |

---

## 📄 License
Licensed under the MIT License. Developed for academic and research purposes aligned with Government of India DILRMP standards.
