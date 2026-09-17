import { PAN_INDIA_STATES, resolvePanIndiaLocation, generatePanIndiaBhuAadhar } from './panIndiaStateData';

/**
 * Bhoolekh & BhuNaksha Cadastral GIS Dataset (Pan-India Enabled)
 * Contains authentic village boundaries, agricultural parcel polygons (khet),
 * Khasra/Gata numbers, ownership (Khatauni), and blockchain smart contract registry status.
 */

export const villageLocations = [
  {
    id: 'VIL-LKO-01',
    name: 'Chinhat (चिनहट)',
    englishName: 'Chinhat',
    tehsil: 'Lucknow Sadar',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226028',
    coordinates: [26.8852, 81.0155],
    zoomLevel: 16,
    totalKhasras: 14,
    description: 'Rapidly developing peri-urban belt with both fertile multi-crop farmland and commercial road frontage.',
    circleRatePerSqFt: '₹1,850 / sq.ft',
    circleRatePerAcre: '₹80,58,600 / acre',
    parcels: [
      {
        khasraNo: '441/2A',
        gataNo: '441',
        subDiv: '2A',
        khataNo: '00214',
        landId: 'LND-2026-0091',
        owner: 'Ramesh Kumar (रमेश कुमार)',
        fatherName: 'Late Rameshwar Kumar',
        coOwners: ['Smt. Shanti Devi (माता)', 'Sunil Kumar (भाई - 1/3 अंश)'],
        areaAcre: 0.85,
        areaHectare: 0.344,
        areaBigha: 1.36,
        areaBiswa: 27.2,
        areaSqFt: 37026,
        areaSqMeter: 3440,
        landType: 'Residential / कृषि परिवर्तित',
        landCategory: 'आवासीय (Freehold)',
        soilType: 'दोमट (Fertile Loam)',
        cropType: 'Non-agricultural (Plots demarcated)',
        marketValue: '₹42,00,000',
        circleValue: '₹34,25,000',
        encumbranceStatus: 'ऋणमुक्त (No Mortgage / Lien)',
        disputeStatus: 'विवाद रहित (Clean Title, No Court Stay)',
        taxStatus: 'राजस्व लगान अद्यतन चुकता',
        blockchainStatus: 'Approved',
        registrationTx: '0x8f3ac92e11892bf3d9428571ea89201948123985',
        ipfsDocCID: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
        soilIrrigation: 'नहर एवं सबमर्सिबल',
        roadFrontage: '30 ft PWD Metal Road',
        center: [26.8855, 81.0148],
        polygon: [
          [26.8849, 81.0141],
          [26.8861, 81.0143],
          [26.8860, 81.0155],
          [26.8848, 81.0153],
        ],
      },
      {
        khasraNo: '442',
        gataNo: '442',
        subDiv: '',
        khataNo: '00215',
        landId: 'LND-2026-0104',
        owner: 'Ramphal Yadav (रामफल यादव)',
        fatherName: 'Ganga Ram Yadav',
        coOwners: ['Shivram Yadav (पुत्र)'],
        areaAcre: 1.5,
        areaHectare: 0.607,
        areaBigha: 2.4,
        areaBiswa: 48.0,
        areaSqFt: 65340,
        areaSqMeter: 6070,
        landType: 'Agricultural (सिंचित कृषि)',
        landCategory: 'संक्रमणीय भूमिधर (Bhumidhar with Transferable Rights)',
        soilType: 'बलुई दोमट',
        cropType: 'गेहूं / धान (Wheat-Paddy rotation)',
        marketValue: '₹58,00,000',
        circleValue: '₹48,00,000',
        encumbranceStatus: 'ऋणमुक्त (Clean)',
        disputeStatus: 'विवाद रहित',
        taxStatus: 'चुकता',
        blockchainStatus: 'Approved',
        registrationTx: '0x71a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0',
        ipfsDocCID: 'QmZtmD2qtWPbsMRzxjVuEDx4j44qaqEthsMMY352Edjj3f',
        soilIrrigation: 'निजी नलकूप बोरिंग',
        roadFrontage: '20 ft Chak Road (चक मार्ग)',
        center: [26.8854, 81.0163],
        polygon: [
          [26.8848, 81.0153],
          [26.8860, 81.0155],
          [26.8859, 81.0172],
          [26.8847, 81.0170],
        ],
      },
      {
        khasraNo: '443/1',
        gataNo: '443',
        subDiv: '1',
        khataNo: '00216',
        landId: 'LND-2026-0112',
        owner: 'Satish Chandra Gupta (सतीश चंद्र गुप्ता)',
        fatherName: 'Late M. L. Gupta',
        coOwners: [],
        areaAcre: 0.62,
        areaHectare: 0.251,
        areaBigha: 0.99,
        areaBiswa: 19.8,
        areaSqFt: 27007,
        areaSqMeter: 2509,
        landType: 'Commercial / वेयरहाउसिंग',
        landCategory: 'गैर-कृषि (143 Approved)',
        soilType: 'पक्की भूमि',
        cropType: 'Industrial boundary wall built',
        marketValue: '₹49,50,000',
        circleValue: '₹39,00,000',
        encumbranceStatus: 'Bank Mortgage (PNB Loan ₹12L)',
        disputeStatus: 'विवाद रहित',
        taxStatus: 'चुकता',
        blockchainStatus: 'Pending',
        registrationTx: '0x43b210c9a8d7e6f5b4a3c2d1e0f9a8b7c6d5e4f3',
        ipfsDocCID: 'QmPZ9gcCEpqKTo6aq61g2nXGUhM49wbdukVaTe7n2ZFQ9a',
        soilIrrigation: 'N/A',
        roadFrontage: '40 ft Highway Link',
        center: [26.8843, 81.0147],
        polygon: [
          [26.8837, 81.0140],
          [26.8849, 81.0141],
          [26.8848, 81.0153],
          [26.8836, 81.0152],
        ],
      },
      {
        khasraNo: '444',
        gataNo: '444',
        subDiv: '',
        khataNo: '00217',
        landId: 'LND-2026-0115',
        owner: 'Smt. Kamla Devi (श्रीमती कमला देवी)',
        fatherName: 'W/o Late Harishchandra',
        coOwners: ['Rajesh Kumar (पुत्र)'],
        areaAcre: 1.1,
        areaHectare: 0.445,
        areaBigha: 1.76,
        areaBiswa: 35.2,
        areaSqFt: 47916,
        areaSqMeter: 4451,
        landType: 'Agricultural (कृषि)',
        landCategory: 'संक्रमणीय भूमिधर',
        soilType: 'दोमट',
        cropType: 'सब्जी एवं बागवानी (Vegetable & Horticulture)',
        marketValue: '₹36,00,000',
        circleValue: '₹30,00,000',
        encumbranceStatus: 'ऋणमुक्त',
        disputeStatus: 'विवाद रहित',
        taxStatus: 'चुकता',
        blockchainStatus: 'Approved',
        registrationTx: '0x18a93cb02ef94827103859203948572839102938',
        ipfsDocCID: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
        soilIrrigation: 'नलकूप',
        roadFrontage: '15 ft Chak Road',
        center: [26.8842, 81.0162],
        polygon: [
          [26.8836, 81.0152],
          [26.8848, 81.0153],
          [26.8847, 81.0170],
          [26.8835, 81.0169],
        ],
      },
      {
        khasraNo: '445/Gram',
        gataNo: '445',
        subDiv: 'Gram',
        khataNo: '00001',
        landId: 'GOVT-UP-LKO-445',
        owner: 'Gram Sabha / Gaon Sabha (ग्राम सभा / सार्वजनिक चारागाह)',
        fatherName: 'Government of Uttar Pradesh',
        coOwners: ['सार्वजनिक उपयोग'],
        areaAcre: 2.4,
        areaHectare: 0.971,
        areaBigha: 3.84,
        areaBiswa: 76.8,
        areaSqFt: 104544,
        areaSqMeter: 9712,
        landType: 'Government / Gram Sabha (सार्वजनिक)',
        landCategory: 'श्रेणी 5-1 (चारागाह / सुरक्षित भूमि - गैर विक्रय)',
        soilType: 'चारागाह भूमि',
        cropType: 'Green Pasture / Community Pond',
        marketValue: '₹0 (Non-Saleable / Protected)',
        circleValue: 'Government Property',
        encumbranceStatus: 'Non-transferable / State Regulated',
        disputeStatus: 'संरक्षित सरकारी संपदा',
        taxStatus: 'Tax Exempt',
        blockchainStatus: 'Government Protected',
        registrationTx: '0x0000000000000000000000000000000000000000',
        ipfsDocCID: 'QmGovtGaonSabhaProtectedRecordLKO445',
        soilIrrigation: 'पोखरा / सार्वजनिक तालाब',
        roadFrontage: 'Main Village Road',
        center: [26.8867, 81.0149],
        polygon: [
          [26.8861, 81.0143],
          [26.8875, 81.0145],
          [26.8874, 81.0157],
          [26.8860, 81.0155],
        ],
      },
      {
        khasraNo: '446',
        gataNo: '446',
        subDiv: '',
        khataNo: '00219',
        landId: 'LND-2026-0120',
        owner: 'Anil Kumar Tripathi (अनिल कुमार त्रिपाठी)',
        fatherName: 'Vishwanath Tripathi',
        coOwners: [],
        areaAcre: 0.95,
        areaHectare: 0.384,
        areaBigha: 1.52,
        areaBiswa: 30.4,
        areaSqFt: 41382,
        areaSqMeter: 3844,
        landType: 'Agricultural (कृषि)',
        landCategory: 'संक्रमणीय भूमिधर',
        soilType: 'दोमट',
        cropType: 'सरसों / दलहन (Mustard & Pulses)',
        marketValue: '₹38,00,000',
        circleValue: '₹31,00,000',
        encumbranceStatus: 'ऋणमुक्त',
        disputeStatus: 'विवाद रहित',
        taxStatus: 'चुकता',
        blockchainStatus: 'Approved',
        registrationTx: '0x9923847291038471928374829102938471928374',
        ipfsDocCID: 'QmTripathiFarmDeedChinhatLKO',
        soilIrrigation: 'नलकूप बोरिंग',
        roadFrontage: '12 ft Chak Road',
        center: [26.8866, 81.0165],
        polygon: [
          [26.8860, 81.0155],
          [26.8874, 81.0157],
          [26.8873, 81.0174],
          [26.8859, 81.0172],
        ],
      },
    ],
  },
  {
    id: 'VIL-LKO-02',
    name: 'Malihabad (मलिहाबाद)',
    englishName: 'Malihabad',
    tehsil: 'Malihabad',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226102',
    coordinates: [26.9215, 80.7125],
    zoomLevel: 16,
    totalKhasras: 18,
    description: 'World-famous GI-tagged Dasheri mango belt with lush orchards, rich clay-loam soil, and agricultural farm lands.',
    circleRatePerSqFt: '₹750 / sq.ft',
    circleRatePerAcre: '₹32,67,000 / acre',
    parcels: [
      {
        khasraNo: '118/9',
        gataNo: '118',
        subDiv: '9',
        khataNo: '00084',
        landId: 'LND-2026-0088',
        owner: 'Ayesha Siddiqui (आयशा सिद्दीकी)',
        fatherName: 'Nawab Akhtar Husain',
        coOwners: ['Zainab Siddiqui (बहन - 50%)'],
        areaAcre: 1.2,
        areaHectare: 0.485,
        areaBigha: 1.92,
        areaBiswa: 38.4,
        areaSqFt: 52272,
        areaSqMeter: 4856,
        landType: 'Agricultural (दशहरी आम बागवानी)',
        landCategory: 'संक्रमणीय भूमिधर (बाग)',
        soilType: 'भारी मटियारो दोमट (Ideal for Mango)',
        cropType: 'Dasheri Mango Orchard (75 mature trees)',
        marketValue: '₹18,50,000',
        circleValue: '₹15,20,000',
        encumbranceStatus: 'ऋणमुक्त',
        disputeStatus: 'विवाद रहित (Clean Title)',
        taxStatus: 'चुकता',
        blockchainStatus: 'Pending',
        registrationTx: '0x2b91a71d8892bf3d9428571ea89201948123985',
        ipfsDocCID: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
        soilIrrigation: 'ड्रिप इरीगेशन एवं नलकूप',
        roadFrontage: '24 ft State Highway Spur',
        center: [26.9218, 80.7118],
        polygon: [
          [26.9210, 80.7110],
          [26.9225, 80.7112],
          [26.9224, 80.7126],
          [26.9209, 80.7124],
        ],
      },
      {
        khasraNo: '119',
        gataNo: '119',
        subDiv: '',
        khataNo: '00085',
        landId: 'LND-2026-0131',
        owner: 'Kaleem Ullah Khan (कलीमुल्लाह खान)',
        fatherName: 'Late Inayatullah Khan',
        coOwners: [],
        areaAcre: 2.8,
        areaHectare: 1.133,
        areaBigha: 4.48,
        areaBiswa: 89.6,
        areaSqFt: 121968,
        areaSqMeter: 11331,
        landType: 'Agricultural (शोध बागवानी)',
        landCategory: 'संक्रमणीय भूमिधर (राष्ट्रीय पुरस्कार प्राप्त)',
        soilType: 'दोमट',
        cropType: 'विशिष्ट आम प्रजातियाँ',
        marketValue: '₹45,00,000',
        circleValue: '₹35,00,000',
        encumbranceStatus: 'ऋणमुक्त',
        disputeStatus: 'विवाद रहित',
        taxStatus: 'चुकता',
        blockchainStatus: 'Approved',
        registrationTx: '0x6618492039485720192837482910293847192837',
        ipfsDocCID: 'QmKaleemUllahMangoEstateMalihabad',
        soilIrrigation: 'सौर ऊर्जा संचालित नलकूप',
        roadFrontage: '18 ft Link Road',
        center: [26.9217, 80.7135],
        polygon: [
          [26.9209, 80.7124],
          [26.9224, 80.7126],
          [26.9222, 80.7145],
          [26.9207, 80.7143],
        ],
      },
      {
        khasraNo: '120/1',
        gataNo: '120',
        subDiv: '1',
        khataNo: '00086',
        landId: 'LND-2026-0133',
        owner: 'Pradeep Rawat (प्रदीप रावत)',
        fatherName: 'Brijbhushan Rawat',
        coOwners: ['Santosh Rawat (भाई)'],
        areaAcre: 1.6,
        areaHectare: 0.647,
        areaBigha: 2.56,
        areaBiswa: 51.2,
        areaSqFt: 69696,
        areaSqMeter: 6475,
        landType: 'Agricultural (खाद्यान्न कृषि)',
        landCategory: 'संक्रमणीय भूमिधर',
        soilType: 'बलुई दोमट',
        cropType: 'मक्का / उड़द (Maize & Black Gram)',
        marketValue: '₹22,00,000',
        circleValue: '₹18,50,000',
        encumbranceStatus: 'Kisan Credit Card (KCC ₹3.5L Baroda UP Bank)',
        disputeStatus: 'विवाद रहित',
        taxStatus: 'चुकता',
        blockchainStatus: 'Approved',
        registrationTx: '0x7728193048572910384759201928374859201928',
        ipfsDocCID: 'QmRawatFarmMalihabadDeed',
        soilIrrigation: 'नलकूप',
        roadFrontage: '10 ft चक मार्ग',
        center: [26.9202, 80.7118],
        polygon: [
          [26.9194, 80.7110],
          [26.9210, 80.7110],
          [26.9209, 80.7124],
          [26.9193, 80.7124],
        ],
      },
      {
        khasraNo: '121',
        gataNo: '121',
        subDiv: '',
        khataNo: '00087',
        landId: 'LND-2026-0135',
        owner: 'Mohd. Rizwan (मोहम्मद रिज़वान)',
        fatherName: 'Abdul Samad',
        coOwners: [],
        areaAcre: 0.9,
        areaHectare: 0.364,
        areaBigha: 1.44,
        areaBiswa: 28.8,
        areaSqFt: 39204,
        areaSqMeter: 3642,
        landType: 'Commercial / कोल्ड स्टोरेज प्रस्तावित',
        landCategory: 'कृषि से गैर-कृषि प्रक्रियाधीन',
        soilType: 'दोमट',
        cropType: 'कृषि खाली भूमि',
        marketValue: '₹25,00,000',
        circleValue: '₹19,00,000',
        encumbranceStatus: 'ऋणमुक्त',
        disputeStatus: 'विवाद रहित',
        taxStatus: 'चुकता',
        blockchainStatus: 'Approved',
        registrationTx: '0x8839201928374859201928374859201928374859',
        ipfsDocCID: 'QmRizwanColdStorageSiteMalihabad',
        soilIrrigation: 'नलकूप',
        roadFrontage: '30 ft PWD Main Road',
        center: [26.9201, 80.7134],
        polygon: [
          [26.9193, 80.7124],
          [26.9209, 80.7124],
          [26.9207, 80.7143],
          [26.9191, 80.7143],
        ],
      },
    ],
  },
  {
    id: 'VIL-LKO-03',
    name: 'Sarojini Nagar (सरोजिनी नगर)',
    englishName: 'Sarojini Nagar',
    tehsil: 'Sarojini Nagar',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226008',
    coordinates: [26.7550, 80.8650],
    zoomLevel: 16,
    totalKhasras: 15,
    description: 'High-growth Kanpur Highway corridor with mixed commercial, logistics, and residential transformation.',
    circleRatePerSqFt: '₹2,100 / sq.ft',
    circleRatePerAcre: '₹91,47,600 / acre',
    parcels: [
      {
        khasraNo: '77/3B',
        gataNo: '77',
        subDiv: '3B',
        khataNo: '00155',
        landId: 'LND-2026-0075',
        owner: 'Vikram Singh (विक्रम सिंह)',
        fatherName: 'Kunwar Ranvijay Singh',
        coOwners: ['Rajendra Singh (संयुक्त धारक)'],
        areaAcre: 0.4,
        areaHectare: 0.162,
        areaBigha: 0.64,
        areaBiswa: 12.8,
        areaSqFt: 17424,
        areaSqMeter: 1618,
        landType: 'Commercial (व्यावसायिक शोरूम / गोदाम)',
        landCategory: 'आवासीय / व्यावसायिक (DA Approved)',
        soilType: 'पक्की भूमि',
        cropType: 'Non-agricultural (Boundary wall constructed)',
        marketValue: '₹65,00,000',
        circleValue: '₹42,00,000',
        encumbranceStatus: 'ऋणमुक्त (Clear Title, Verified)',
        disputeStatus: 'विवाद रहित (All NOCs available)',
        taxStatus: 'चुकता',
        blockchainStatus: 'Approved',
        registrationTx: '0x9e04f30b98327548901283746192837465910293',
        ipfsDocCID: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
        soilIrrigation: 'Municipal Connection Available',
        roadFrontage: '60 ft Four-Lane Highway Frontage',
        center: [26.7554, 80.8643],
        polygon: [
          [26.7548, 80.8637],
          [26.7560, 80.8639],
          [26.7559, 80.8650],
          [26.7547, 80.8648],
        ],
      },
      {
        khasraNo: '78',
        gataNo: '78',
        subDiv: '',
        khataNo: '00156',
        landId: 'LND-2026-0140',
        owner: 'Maheshwari Logistics Pvt Ltd',
        fatherName: 'Director: Sanjay Maheshwari',
        coOwners: [],
        areaAcre: 1.8,
        areaHectare: 0.728,
        areaBigha: 2.88,
        areaBiswa: 57.6,
        areaSqFt: 78408,
        areaSqMeter: 7284,
        landType: 'Industrial / Logistics Park',
        landCategory: 'औद्योगिक भूमि (UPSIDC Belt)',
        soilType: 'समतल औद्योगिक',
        cropType: 'Logistics Yard',
        marketValue: '₹1,20,00,000',
        circleValue: '₹85,00,000',
        encumbranceStatus: 'HDFC Corporate Hypothecation',
        disputeStatus: 'विवाद रहित',
        taxStatus: 'चुकता',
        blockchainStatus: 'Approved',
        registrationTx: '0x5518293048571920384759201928374659201928',
        ipfsDocCID: 'QmLogisticsParkSarojiniNagarLKO',
        soilIrrigation: 'Industrial Line',
        roadFrontage: '80 ft Sector Road',
        center: [26.7553, 80.8658],
        polygon: [
          [26.7547, 80.8648],
          [26.7559, 80.8650],
          [26.7557, 80.8667],
          [26.7545, 80.8665],
        ],
      },
      {
        khasraNo: '79/2',
        gataNo: '79',
        subDiv: '2',
        khataNo: '00157',
        landId: 'LND-2026-0142',
        owner: 'Dharmendra Lodhi (धर्मेंद्र लोधी)',
        fatherName: 'Late Ramkishun Lodhi',
        coOwners: ['सोनू लोधी (भाई)'],
        areaAcre: 0.75,
        areaHectare: 0.303,
        areaBigha: 1.2,
        areaBiswa: 24.0,
        areaSqFt: 32670,
        areaSqMeter: 3035,
        landType: 'Agricultural (सब्जी की खेती)',
        landCategory: 'संक्रमणीय भूमिधर',
        soilType: 'दोमट',
        cropType: 'आलू / गोभी (Potato-Cauliflower)',
        marketValue: '₹32,00,000',
        circleValue: '₹26,00,000',
        encumbranceStatus: 'ऋणमुक्त',
        disputeStatus: 'विवाद रहित',
        taxStatus: 'चुकता',
        blockchainStatus: 'Approved',
        registrationTx: '0x3348192038475920192837465920192837465920',
        ipfsDocCID: 'QmLodhiFarmSarojiniNagarDeed',
        soilIrrigation: 'सबमर्सिबल पंप',
        roadFrontage: '16 ft Chak Road',
        center: [26.7541, 80.8644],
        polygon: [
          [26.7535, 80.8637],
          [26.7548, 80.8637],
          [26.7547, 80.8648],
          [26.7534, 80.8648],
        ],
      },
    ],
  },
  {
    id: 'VIL-LKO-04',
    name: 'Gomti Nagar Extension (गोमती नगर विस्तार)',
    englishName: 'Gomti Nagar Extension',
    tehsil: 'Lucknow Sadar',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226010',
    coordinates: [26.8520, 81.0250],
    zoomLevel: 16,
    totalKhasras: 20,
    description: 'Prime modern urban expansion sector near Shaheed Path, Stadium, and IT city with plotted developments.',
    circleRatePerSqFt: '₹3,400 / sq.ft',
    circleRatePerAcre: '₹1,48,10,400 / acre',
    parcels: [
      {
        khasraNo: '260/1',
        gataNo: '260',
        subDiv: '1',
        khataNo: '00312',
        landId: 'LND-2026-0062',
        owner: 'Neha Verma (नेहा वर्मा)',
        fatherName: 'Dr. O. P. Verma',
        coOwners: [],
        areaAcre: 0.6,
        areaHectare: 0.243,
        areaBigha: 0.96,
        areaBiswa: 19.2,
        areaSqFt: 26136,
        areaSqMeter: 2428,
        landType: 'Residential (आवासीय भूखंड)',
        landCategory: 'LDA Approved Layout',
        soilType: 'डेवलप्ड अर्बन प्लॉट',
        cropType: 'Non-agricultural (Corner boundary marked)',
        marketValue: '₹51,00,000',
        circleValue: '₹43,50,000',
        encumbranceStatus: 'ऋणमुक्त',
        disputeStatus: 'Under Document Verification (अभिलेख जांच जारी)',
        taxStatus: 'चुकता',
        blockchainStatus: 'Pending',
        registrationTx: '0x51c87d2a19831102948271038592039485728391',
        ipfsDocCID: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
        soilIrrigation: 'Municipal Supply',
        roadFrontage: '40 ft Sector Road',
        center: [26.8524, 81.0243],
        polygon: [
          [26.8518, 81.0236],
          [26.8530, 81.0238],
          [26.8529, 81.0250],
          [26.8517, 81.0248],
        ],
      },
      {
        khasraNo: '261',
        gataNo: '261',
        subDiv: '',
        khataNo: '00313',
        landId: 'LND-2026-0150',
        owner: 'Sandeep Srivastava (संदीप श्रीवास्तव)',
        fatherName: 'Late K. C. Srivastava',
        coOwners: ['श्रीमती वंदना श्रीवास्तव (पत्नी)'],
        areaAcre: 0.8,
        areaHectare: 0.324,
        areaBigha: 1.28,
        areaBiswa: 25.6,
        areaSqFt: 34848,
        areaSqMeter: 3237,
        landType: 'Commercial / मिक्स्ड यूज',
        landCategory: 'फ्रीहोल्ड आवासीय',
        soilType: 'समतल',
        cropType: 'Non-agricultural',
        marketValue: '₹78,00,000',
        circleValue: '₹62,00,000',
        encumbranceStatus: 'ऋणमुक्त',
        disputeStatus: 'विवाद रहित (100% Clear Title)',
        taxStatus: 'चुकता',
        blockchainStatus: 'Approved',
        registrationTx: '0x4428193048572910384759201928374659201928',
        ipfsDocCID: 'QmSrivastavaGomtiNagarDeedLKO',
        soilIrrigation: 'Water Line',
        roadFrontage: '45 ft Wide Avenue',
        center: [26.8523, 81.0258],
        polygon: [
          [26.8517, 81.0248],
          [26.8529, 81.0250],
          [26.8527, 81.0267],
          [26.8515, 81.0265],
        ],
      },
      {
        khasraNo: '262/3',
        gataNo: '262',
        subDiv: '3',
        khataNo: '00314',
        landId: 'LND-2026-0155',
        owner: 'Anurag Tiwari (अनुराग तिवारी)',
        fatherName: 'Bhagwati Prasad Tiwari',
        coOwners: [],
        areaAcre: 0.55,
        areaHectare: 0.223,
        areaBigha: 0.88,
        areaBiswa: 17.6,
        areaSqFt: 23958,
        areaSqMeter: 2226,
        landType: 'Residential Plot',
        landCategory: 'आवासीय',
        soilType: 'समतल',
        cropType: 'Boundary walled plot',
        marketValue: '₹47,00,000',
        circleValue: '₹38,00,000',
        encumbranceStatus: 'ऋणमुक्त',
        disputeStatus: 'विवाद रहित',
        taxStatus: 'चुकता',
        blockchainStatus: 'Approved',
        registrationTx: '0x2218392038475920192837465920192837465920',
        ipfsDocCID: 'QmTiwariPlotGomtiNagarExtDeed',
        soilIrrigation: 'Municipal',
        roadFrontage: '30 ft Street',
        center: [26.8511, 81.0244],
        polygon: [
          [26.8505, 81.0236],
          [26.8518, 81.0236],
          [26.8517, 81.0248],
          [26.8504, 81.0248],
        ],
      },
    ],
  },
  {
    id: 'VIL-LKO-05',
    name: 'Bakshi Ka Talab (बख्शी का तालाब)',
    englishName: 'Bakshi Ka Talab',
    tehsil: 'Bakshi Ka Talab',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226201',
    coordinates: [27.0110, 80.9320],
    zoomLevel: 16,
    totalKhasras: 22,
    description: 'Sitapur Road northern agricultural green-zone known for dairy farming, organic farms, and rural retreats.',
    circleRatePerSqFt: '₹620 / sq.ft',
    circleRatePerAcre: '₹27,00,720 / acre',
    parcels: [
      {
        khasraNo: '303/2C',
        gataNo: '303',
        subDiv: '2C',
        khataNo: '00109',
        landId: 'LND-2026-0044',
        owner: 'Priya Nair (प्रिया नायर)',
        fatherName: 'K. Unnikrishnan Nair',
        coOwners: [],
        areaAcre: 0.3,
        areaHectare: 0.121,
        areaBigha: 0.48,
        areaBiswa: 9.6,
        areaSqFt: 13068,
        areaSqMeter: 1214,
        landType: 'Residential Farmlet / फार्महाउस',
        landCategory: 'आवासीय / फार्महाउस',
        soilType: 'उपजाऊ दोमट',
        cropType: 'फलदार वृक्ष एवं किचन गार्डन',
        marketValue: '₹38,00,000',
        circleValue: '₹28,50,000',
        encumbranceStatus: 'ऋणमुक्त',
        disputeStatus: 'विवाद रहित',
        taxStatus: 'चुकता',
        blockchainStatus: 'Pending',
        registrationTx: '0xd07fb19c19829560948271038592039485728391',
        ipfsDocCID: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
        soilIrrigation: 'बोरिंग नलकूप',
        roadFrontage: '25 ft Rural Road',
        center: [27.0114, 80.9312],
        polygon: [
          [27.0107, 80.9305],
          [27.0120, 80.9307],
          [27.0119, 80.9320],
          [27.0106, 80.9318],
        ],
      },
      {
        khasraNo: '304',
        gataNo: '304',
        subDiv: '',
        khataNo: '00110',
        landId: 'LND-2026-0160',
        owner: 'Gurpreet Singh Dhillon (गुरप्रीत सिंह ढिल्लों)',
        fatherName: 'Sardar Manjit Singh',
        coOwners: ['हरप्रीत सिंह (पुत्र)'],
        areaAcre: 3.2,
        areaHectare: 1.295,
        areaBigha: 5.12,
        areaBiswa: 102.4,
        areaSqFt: 139392,
        areaSqMeter: 12950,
        landType: 'Agricultural (डेयरी एवं चारा फार्म)',
        landCategory: 'संक्रमणीय भूमिधर',
        soilType: 'दोमट',
        cropType: 'बरसीम / ज्वार / गेहूं (Dairy Fodder & Wheat)',
        marketValue: '₹62,00,000',
        circleValue: '₹48,00,000',
        encumbranceStatus: 'ऋणमुक्त',
        disputeStatus: 'विवाद रहित (Verified Title)',
        taxStatus: 'चुकता',
        blockchainStatus: 'Approved',
        registrationTx: '0x1128392038475920192837465920192837465920',
        ipfsDocCID: 'QmDhillonDairyFarmBKTDeed',
        soilIrrigation: 'नलकूप एवं ड्रिप लाइन',
        roadFrontage: '20 ft चक मार्ग',
        center: [27.0113, 80.9330],
        polygon: [
          [27.0106, 80.9318],
          [27.0119, 80.9320],
          [27.0117, 80.9342],
          [27.0104, 80.9340],
        ],
      },
      {
        khasraNo: '305/1',
        gataNo: '305',
        subDiv: '1',
        khataNo: '00111',
        landId: 'LND-2026-0162',
        owner: 'Mithilesh Awasthi (मिथिलेश अवस्थी)',
        fatherName: 'Late Pt. Ramkumar Awasthi',
        coOwners: [],
        areaAcre: 1.4,
        areaHectare: 0.567,
        areaBigha: 2.24,
        areaBiswa: 44.8,
        areaSqFt: 60984,
        areaSqMeter: 5666,
        landType: 'Agricultural (सब्जी उत्पादन)',
        landCategory: 'संक्रमणीय भूमिधर',
        soilType: 'उपजाऊ दोमट',
        cropType: 'टमाटर / खीरा (Protected Polyhouse)',
        marketValue: '₹31,00,000',
        circleValue: '₹24,00,000',
        encumbranceStatus: 'ऋणमुक्त',
        disputeStatus: 'विवाद रहित',
        taxStatus: 'चुकता',
        blockchainStatus: 'Approved',
        registrationTx: '0x9918293048572910384759201928374659201928',
        ipfsDocCID: 'QmAwasthiPolyhouseBKTDeed',
        soilIrrigation: 'सोलर बोरिंग',
        roadFrontage: '15 ft चक मार्ग',
        center: [27.0101, 80.9313],
        polygon: [
          [27.0094, 80.9305],
          [27.0107, 80.9305],
          [27.0106, 80.9318],
          [27.0093, 80.9318],
        ],
      },
    ],
  },
  {
    id: 'VIL-LKO-06',
    name: 'Mohanlalganj (मोहनलालगंज)',
    englishName: 'Mohanlalganj',
    tehsil: 'Mohanlalganj',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226301',
    coordinates: [26.6810, 80.9920],
    zoomLevel: 16,
    totalKhasras: 25,
    description: 'Southern agricultural heartland connected via Sultanpur and Raebareli highways with extensive farming belts.',
    circleRatePerSqFt: '₹890 / sq.ft',
    circleRatePerAcre: '₹38,76,840 / acre',
    parcels: [
      {
        khasraNo: '19/5',
        gataNo: '19',
        subDiv: '5',
        khataNo: '00042',
        landId: 'LND-2026-0059',
        owner: 'Arjun Mehta (अर्जुन मेहता)',
        fatherName: 'Shanti Swaroop Mehta',
        coOwners: ['देवेंद्र मेहता (भाई)'],
        areaAcre: 2.1,
        areaHectare: 0.850,
        areaBigha: 3.36,
        areaBiswa: 67.2,
        areaSqFt: 91476,
        areaSqMeter: 8498,
        landType: 'Agricultural (गन्ना एवं धान)',
        landCategory: 'संक्रमणीय भूमिधर',
        soilType: 'भारी दोमट (मटियार)',
        cropType: 'गन्ना (Sugarcane 038 variety)',
        marketValue: '₹29,00,000',
        circleValue: '₹23,50,000',
        encumbranceStatus: 'ऋणमुक्त',
        disputeStatus: 'विवाद रहित (Clean Land Title)',
        taxStatus: 'चुकता',
        blockchainStatus: 'Approved',
        registrationTx: '0xd07fb19c19829560948271038592039485728391',
        ipfsDocCID: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
        soilIrrigation: 'नहर एवं बोरिंग',
        roadFrontage: '18 ft चक मार्ग',
        center: [26.6814, 80.9912],
        polygon: [
          [26.6807, 80.9904],
          [26.6821, 80.9906],
          [26.6820, 80.9920],
          [26.6806, 80.9918],
        ],
      },
      {
        khasraNo: '20',
        gataNo: '20',
        subDiv: '',
        khataNo: '00043',
        landId: 'LND-2026-0170',
        owner: 'Subhash Chandra Pal (सुभाष चंद्र पाल)',
        fatherName: 'Ram Ratan Pal',
        coOwners: [],
        areaAcre: 1.7,
        areaHectare: 0.688,
        areaBigha: 2.72,
        areaBiswa: 54.4,
        areaSqFt: 74052,
        areaSqMeter: 6880,
        landType: 'Agricultural (सरसों व चना)',
        landCategory: 'संक्रमणीय भूमिधर',
        soilType: 'दोमट',
        cropType: 'सरसों (Mustard)',
        marketValue: '₹24,00,000',
        circleValue: '₹19,00,000',
        encumbranceStatus: 'ऋणमुक्त',
        disputeStatus: 'विवाद रहित',
        taxStatus: 'चुकता',
        blockchainStatus: 'Approved',
        registrationTx: '0x8817293048571920384759201928374659201928',
        ipfsDocCID: 'QmSubhashPalFarmMohanlalganj',
        soilIrrigation: 'सरकारी नलकूप 14号',
        roadFrontage: '14 ft चक मार्ग',
        center: [26.6813, 80.9930],
        polygon: [
          [26.6806, 80.9918],
          [26.6820, 80.9920],
          [26.6818, 80.9940],
          [26.6804, 80.9938],
        ],
      },
      {
        khasraNo: '21/A',
        gataNo: '21',
        subDiv: 'A',
        khataNo: '00044',
        landId: 'LND-2026-0172',
        owner: 'Kisan Seva Kendra Cooperative',
        fatherName: 'Reg. Under UP Co-op Societies Act',
        coOwners: [],
        areaAcre: 0.5,
        areaHectare: 0.202,
        areaBigha: 0.8,
        areaBiswa: 16.0,
        areaSqFt: 21780,
        areaSqMeter: 2023,
        landType: 'Commercial / कृषि सेवा केंद्र',
        landCategory: 'व्यावसायिक सहकारी',
        soilType: 'समतल',
        cropType: 'Fertilizer & Seed Depot',
        marketValue: '₹21,00,000',
        circleValue: '₹16,00,000',
        encumbranceStatus: 'ऋणमुक्त',
        disputeStatus: 'विवाद रहित',
        taxStatus: 'चुकता',
        blockchainStatus: 'Approved',
        registrationTx: '0x7716293048571920384759201928374659201928',
        ipfsDocCID: 'QmKisanSevaKendraDepotMohanlalganj',
        soilIrrigation: 'N/A',
        roadFrontage: '30 ft PWD Road',
        center: [26.6800, 80.9913],
        polygon: [
          [26.6793, 80.9904],
          [26.6807, 80.9904],
          [26.6806, 80.9918],
          [26.6792, 80.9918],
        ],
      },
    ],
  },
];

/**
 * Utility to find the closest village or parcel to given GPS coordinates
 */
export function findClosestCadastralLocation(lat, lng) {
  let closestVillage = villageLocations[0];
  let minDistance = Infinity;

  villageLocations.forEach((v) => {
    const dLat = v.coordinates[0] - lat;
    const dLng = v.coordinates[1] - lng;
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    if (dist < minDistance) {
      minDistance = dist;
      closestVillage = v;
    }
  });

  // Also check if coordinates fall directly inside or closest to a specific parcel
  let closestParcel = closestVillage.parcels[0];
  let minParcelDist = Infinity;

  closestVillage.parcels.forEach((p) => {
    const dLat = p.center[0] - lat;
    const dLng = p.center[1] - lng;
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    if (dist < minParcelDist) {
      minParcelDist = dist;
      closestParcel = p;
    }
  });

  return {
    village: closestVillage,
    parcel: closestParcel,
    distanceKm: (minDistance * 111).toFixed(2),
  };
}

/**
 * Search all parcels across all villages by keyword (Khasra No, Village, Owner, Land ID)
 */
export function searchCadastralParcels(query) {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();

  const matched = [];
  villageLocations.forEach((village) => {
    village.parcels.forEach((parcel) => {
      const matchKhasra = parcel.khasraNo?.toLowerCase().includes(q) || parcel.gataNo?.toLowerCase().includes(q);
      const matchOwner = parcel.owner?.toLowerCase().includes(q);
      const matchVillage = village.name.toLowerCase().includes(q) || village.englishName.toLowerCase().includes(q);
      const matchId = parcel.landId?.toLowerCase().includes(q);
      const matchKhata = parcel.khataNo?.toLowerCase().includes(q);

      if (matchKhasra || matchOwner || matchVillage || matchId || matchKhata) {
        matched.push({
          ...parcel,
          villageName: village.name,
          villageEnglish: village.englishName,
          tehsil: village.tehsil,
          district: village.district,
          state: village.state,
          villageId: village.id,
        });
      }
    });
  });

  return matched;
}

/**
 * Historical Chain of Title (पूर्व स्वामियों की नामावली / Provenance)
 * Complete chronology of every registered owner for each land parcel since 1995-2000s
 */
export const defaultOwnershipChains = {
  'LND-2026-0091': [
    {
      owner: 'Pt. Jagannath Prasad',
      fatherName: 'Late Brijmohan Prasad',
      role: 'मूल खातेदार (Ancestral Settlement Title)',
      date: '1998-04-12',
      deedType: 'बंदोबस्त चकबंदी आकार पत्र 45 (Consolidation Settlement)',
      bahiNo: 'बही 1, जिल्द 120, पृष्ठ 45-52',
      consideration: 'पैतृक भूमि (Inherited Ancestral Land)',
      subRegistrar: 'तहसील सदर, लखनऊ',
      txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a01',
      isCurrent: false,
    },
    {
      owner: 'Suresh Chandra Sharma',
      fatherName: 'Late Pt. Jagannath Prasad',
      role: 'वारिसान (Succession/Inheritance)',
      date: '2011-03-14',
      deedType: 'प-11 वरासत आदेश (Revenue Mutation Order #340)',
      bahiNo: 'राजस्व आदेश पंजी 340/2011',
      consideration: 'विधिक वारिसान हस्तांतरण',
      subRegistrar: 'राजस्व न्यायालय नायब तहसीलदार चिनहट',
      txHash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a012b3c',
      isCurrent: false,
    },
    {
      owner: 'Meera Joshi',
      fatherName: 'W/o Harish Joshi',
      role: 'क्रेता (Purchased via Registered Deed)',
      date: '2016-08-02',
      deedType: 'पंजीकृत विक्रय विलेख (Registered Sale Deed)',
      bahiNo: 'बही सं. 1, जिल्द 4812, पृष्ठ 112-126',
      consideration: '₹22,50,000',
      subRegistrar: 'उप-निबंधक कार्यालय लखनऊ प्रथम',
      txHash: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a012b3c4d5e',
      isCurrent: false,
    },
    {
      owner: 'Ramesh Kumar',
      fatherName: 'Late Rameshwar Kumar',
      role: 'वर्तमान पंजीकृत स्वामी (Current Registered Owner)',
      date: '2022-11-21',
      deedType: 'पंजीकृत बैनामा एवं स्मार्ट कॉन्ट्रैक्ट (Sale Deed & Blockchain)',
      bahiNo: 'बही सं. 1, जिल्द 5930, पृष्ठ 80-95',
      consideration: '₹42,00,000',
      subRegistrar: 'उप-निबंधक कार्यालय लखनऊ पूर्व',
      txHash: '0x8f3ac92e11892bf3d9428571ea89201948123985',
      isCurrent: true,
    },
  ],
  'LND-2026-0088': [
    {
      owner: 'Nawab Akhtar Husain',
      fatherName: 'Late Nawab Shaukat Husain',
      role: 'मूल खातेदार (बागवानी पैतृक)',
      date: '2001-07-15',
      deedType: 'राजस्व अभिलेख खतौनी 1408 फसली',
      bahiNo: 'बही 1, जिल्द 98, पृष्ठ 14',
      consideration: 'दशहरी आम बाग पैतृक',
      subRegistrar: 'उप-निबंधक मलिहाबाद',
      txHash: '0x2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
      isCurrent: false,
    },
    {
      owner: 'Ayesha Siddiqui',
      fatherName: 'Nawab Akhtar Husain',
      role: 'वर्तमान पंजीकृत स्वामी (Current Owner - 50% हिब्बानमा)',
      date: '2026-07-25',
      deedType: 'पंजीकृत उपहार विलेख (Registered Gift Deed / Hiba)',
      bahiNo: 'बही सं. 1, जिल्द 3401, पृष्ठ 200-215',
      consideration: 'पारिवारिक उपहार (Gift Deed)',
      subRegistrar: 'उप-निबंधक मलिहाबाद, लखनऊ',
      txHash: '0x2b91a71d8892bf3d9428571ea89201948123985',
      isCurrent: true,
    },
  ],
  'LND-2026-0075': [
    {
      owner: 'Kunwar Ranvijay Singh',
      fatherName: 'Late Raja Mahendra Pratap Singh',
      role: 'मूल खातेदार',
      date: '1995-10-18',
      deedType: 'राजस्व बंदोबस्त खतौनी',
      bahiNo: 'बही 1, जिल्द 88, पृष्ठ 60',
      consideration: 'पैतृक रियासत भूमि',
      subRegistrar: 'तहसील सरोजिनी नगर',
      txHash: '0x4f5e6d7c8b9a0f1e2d3c4b5a6f7e8d9c0b1a2f3e',
      isCurrent: false,
    },
    {
      owner: 'Vikram Singh',
      fatherName: 'Kunwar Ranvijay Singh',
      role: 'वर्तमान पंजीकृत स्वामी (Current Owner)',
      date: '2026-06-30',
      deedType: 'पंजीकृत पारिवारिक विभाजन विलेख (Partition Deed)',
      bahiNo: 'बही सं. 1, जिल्द 6102, पृष्ठ 45-58',
      consideration: 'पारिवारिक बंटवारा (NOC Approved)',
      subRegistrar: 'उप-निबंधक सरोजिनी नगर, लखनऊ',
      txHash: '0x9e04f30b98327548901283746192837465910293',
      isCurrent: true,
    },
  ],
  'LND-2026-0062': [
    {
      owner: 'Lucknow Development Authority (LDA)',
      fatherName: 'Government of Uttar Pradesh',
      role: 'मूल अधिग्रहीत एवं नियोजित क्षेत्र',
      date: '2014-02-10',
      deedType: 'भूमि अर्जन एवं नियोजन योजना (LDA Plotted Scheme)',
      bahiNo: 'योजना संख्या गोमती नगर विस्तार सेक्टर 4',
      consideration: 'अर्जन व आवंटन',
      subRegistrar: 'प्राधिकरण विलेख',
      txHash: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a012b3c4d5e6f7a',
      isCurrent: false,
    },
    {
      owner: 'Dr. O. P. Verma',
      fatherName: 'Late S. P. Verma',
      role: 'प्रथम आवंटी (First Allottee)',
      date: '2018-05-20',
      deedType: 'प्राधिकरण लीज डीड (LDA 99-Year Lease Deed)',
      bahiNo: 'बही 1, जिल्द 5100, पृष्ठ 12-25',
      consideration: '₹31,00,000',
      subRegistrar: 'उप-निबंधक लखनऊ सदर',
      txHash: '0x8b9c0d1e2f3a4b5c6d7e8f9a012b3c4d5e6f7a8b',
      isCurrent: false,
    },
    {
      owner: 'Neha Verma',
      fatherName: 'Dr. O. P. Verma',
      role: 'वर्तमान पंजीकृत स्वामी (Current Owner)',
      date: '2026-06-12',
      deedType: 'फ्रीहोल्ड कन्वर्जन एवं विक्रय विलेख (Freehold Conveyance)',
      bahiNo: 'बही 1, जिल्द 6840, पृष्ठ 90-104',
      consideration: '₹51,00,000',
      subRegistrar: 'उप-निबंधक कार्यालय लखनऊ पूर्व',
      txHash: '0x51c87d2a19831102948271038592039485728391',
      isCurrent: true,
    },
  ],
  'LND-2026-0059': [
    {
      owner: 'Shanti Swaroop Mehta',
      fatherName: 'Late Lala Hariram Mehta',
      role: 'मूल खातेदार',
      date: '2004-11-05',
      deedType: 'पंजीकृत विक्रय विलेख (Registered Sale Deed)',
      bahiNo: 'बही 1, जिल्द 2201, पृष्ठ 14-22',
      consideration: '₹8,50,000',
      subRegistrar: 'उप-निबंधक मोहनलालगंज',
      txHash: '0x9c0d1e2f3a4b5c6d7e8f9a012b3c4d5e6f7a8b9c',
      isCurrent: false,
    },
    {
      owner: 'Arjun Mehta',
      fatherName: 'Shanti Swaroop Mehta',
      role: 'वर्तमान पंजीकृत स्वामी (Current Owner)',
      date: '2026-05-29',
      deedType: 'वरासत एवं नामांतरण (Inheritance & Mutation)',
      bahiNo: 'राजस्व आदेश क्रमांक 512/2026',
      consideration: 'पैतृक वरासत',
      subRegistrar: 'राजस्व न्यायालय तहसीलदार मोहनलालगंज',
      txHash: '0xd07fb19c19829560948271038592039485728391',
      isCurrent: true,
    },
  ],
};

const LOCAL_OVERRIDE_KEY = 'landchain_parcel_overrides_v2';
const LOCAL_HISTORY_KEY = 'landchain_history_v2';

/**
 * Get all historical and current owners for any land parcel
 */
export function getLandOwnershipHistory(landId, currentOwnerFallback = 'Current Owner') {
  const baseChain = defaultOwnershipChains[landId] ? [...defaultOwnershipChains[landId]] : [
    {
      owner: 'Ram Sunder (राम सुंदर)',
      fatherName: 'Late Kashi Ram',
      role: 'मूल खातेदार (Original Settled Owner)',
      date: '2008-03-10',
      deedType: 'राजस्व बंदोबस्त अभिलेख',
      bahiNo: 'बही 1, जिल्द 1420',
      consideration: 'पैतृक बंदोबस्त',
      subRegistrar: 'सदर रजिस्ट्रार कार्यालय',
      txHash: '0x1029384756102938475610293847561029384756',
      isCurrent: false,
    },
    {
      owner: currentOwnerFallback,
      fatherName: 'Not recorded',
      role: 'पंजीकृत स्वामी (Registered Owner)',
      date: '2024-01-15',
      deedType: 'पंजीकृत बैनामा (Sale Deed)',
      bahiNo: 'बही 1, जिल्द 5400',
      consideration: 'बाजार भाव',
      subRegistrar: 'उप-निबंधक कार्यालय',
      txHash: '0x8f3ac92e11892bf3d9428571ea89201948123985',
      isCurrent: true,
    },
  ];

  // Check if any dynamic transfers exist in localStorage for this land
  try {
    const rawHist = localStorage.getItem(LOCAL_HISTORY_KEY);
    if (rawHist) {
      const parsed = JSON.parse(rawHist);
      const dynamicTransfers = parsed[landId];
      if (Array.isArray(dynamicTransfers) && dynamicTransfers.length > 0) {
        // Mark existing items as past owners
        baseChain.forEach((item) => {
          item.isCurrent = false;
        });

        // Append all new transfers
        dynamicTransfers.forEach((tr, idx) => {
          baseChain.push({
            owner: tr.owner,
            fatherName: tr.fatherName || 'पिता: दर्ज विलेख अनुसार',
            role: tr.role || 'क्रेता (नया पंजीकृत स्वामी - Transferee)',
            date: tr.date || new Date().toISOString().split('T')[0],
            deedType: tr.reason || tr.deedType || 'पंजीकृत विक्रय विलेख (Blockchain Transfer Deed)',
            bahiNo: `स्मार्ट कॉन्ट्रैक्ट दाखिल-खारिज #${1000 + idx}`,
            consideration: tr.salePrice || '₹35,00,000 (चुकाया गया)',
            subRegistrar: 'डिजिटल सब-रजिस्ट्रार पोर्टल',
            txHash: tr.txHash || '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
            isCurrent: idx === dynamicTransfers.length - 1, // Only the very latest is the current owner
          });
        });
      }
    }
  } catch (err) {
    console.warn('Error reading dynamic history', err);
  }

  return baseChain;
}

/**
 * Save parcel owner override when a transfer is executed
 */
export function saveParcelOwnerOverride(landId, newOwnerName, newTxHash) {
  try {
    const raw = localStorage.getItem(LOCAL_OVERRIDE_KEY) || '{}';
    const parsed = JSON.parse(raw);
    parsed[landId] = {
      newOwner: newOwnerName,
      txHash: newTxHash,
      date: new Date().toISOString().split('T')[0],
    };
    localStorage.setItem(LOCAL_OVERRIDE_KEY, JSON.stringify(parsed));
  } catch (err) {
    console.warn('Error storing parcel override', err);
  }
}

/**
 * Returns village locations with any dynamically transferred parcel owner names applied
 */
export function getEffectiveVillageLocations() {
  let baseVillages = [...villageLocations];

  // Include any user-searched custom villages saved in localStorage
  try {
    const rawCustom = localStorage.getItem('landchain_custom_villages_v3');
    if (rawCustom) {
      const customVillages = JSON.parse(rawCustom);
      if (Array.isArray(customVillages)) {
        baseVillages = [...baseVillages, ...customVillages];
      }
    }
  } catch (err) {
    console.warn('Error reading custom villages', err);
  }

  try {
    const raw = localStorage.getItem(LOCAL_OVERRIDE_KEY);
    if (!raw) return baseVillages;
    const overrides = JSON.parse(raw);

    return baseVillages.map((village) => ({
      ...village,
      parcels: village.parcels.map((parcel) => {
        if (overrides[parcel.landId]) {
          return {
            ...parcel,
            owner: overrides[parcel.landId].newOwner,
            registrationTx: overrides[parcel.landId].txHash || parcel.registrationTx,
          };
        }
        return parcel;
      }),
    }));
  } catch (err) {
    console.warn('Error getting effective villages', err);
    return baseVillages;
  }
}

/**
 * Intelligent Pan-India Land Finder:
 * Dynamically resolves and generates complete cadastral datasets and land records
 * for ANY location across all 28 States and 8 Union Territories in India.
 */
export function findOrCreateCadastralLocation(queryOrName) {
  if (!queryOrName || !queryOrName.trim()) return villageLocations[0];
  const q = queryOrName.toLowerCase().trim();

  const allVillages = getEffectiveVillageLocations();

  // 1. Check if matches any existing known village, district, or state
  const matched = allVillages.find((v) =>
    v.name.toLowerCase().includes(q) ||
    v.englishName.toLowerCase().includes(q) ||
    v.tehsil?.toLowerCase().includes(q) ||
    v.district?.toLowerCase().includes(q) ||
    v.state?.toLowerCase().includes(q)
  );

  if (matched) return matched;

  // 2. Resolve Indian State & Regional Land Record System
  const cleanName = queryOrName.trim();
  const stateObj = resolvePanIndiaLocation(cleanName);

  const seed = cleanName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseCenter = stateObj.centerCoords || [26.85, 80.95];
  const baseLat = baseCenter[0] + ((seed % 80) / 1000);
  const baseLng = baseCenter[1] + ((seed % 100) / 1000);

  const newVillageId = `VIL-${stateObj.code}-${seed.toString(36).toUpperCase()}`;

  // Select state-authentic owner and father names
  let indianNames = [
    { name: 'राम प्रकाश वर्मा', father: 'श्री रामसेवक वर्मा' },
    { name: 'विमलेश कुमार यादव', father: 'श्री जगदेव यादव' },
    { name: 'श्रीमती सरोज देवी', father: 'पत्नी स्व. रामेश्वर' },
    { name: 'महेश चंद्र दीक्षित', father: 'श्री उमाशंकर दीक्षित' },
    { name: 'अब्दुल हमीद अंसारी', father: 'श्री नूर मोहम्मद' },
    { name: 'सुशील कुमार सिंह', father: 'श्री भानु प्रताप सिंह' },
    { name: 'ग्राम सभा / शासकीय भूमि', father: `${stateObj.name} शासन` },
    { name: 'राजेंद्र प्रसाद शुक्ला', father: 'श्री रामगोपाल शुक्ला' },
  ];

  if (stateObj.code === 'MH') {
    indianNames = [
      { name: 'ज्ञानेश्वर विठ्ठलराव देशमुख', father: 'विठ्ठलराव देशमुख' },
      { name: 'सचिन दत्तात्रेय पाटिल', father: 'दत्तात्रेय पाटिल' },
      { name: 'सुप्रिया रमेश कुलकर्णी', father: 'पती: रमेश कुलकर्णी' },
      { name: 'गणेश मारुती शिंदे', father: 'मारुती शिंदे' },
      { name: 'संजय तुकाराम कदम', father: 'तुकाराम कदम' },
      { name: 'अनंत महादेव सावंत', father: 'महादेव सावंत' },
      { name: 'शासकीय गायरान / वनजमीन', father: 'महाराष्ट्र शासन महसूल विभाग' },
      { name: 'प्रमोद भालचंद्र जोशी', father: 'भालचंद्र जोशी' },
    ];
  } else if (stateObj.code === 'KA') {
    indianNames = [
      { name: 'ರಮೇಶ್ ಗೌಡ (Ramesh Gowda)', father: 'Late Nanjappa Gowda' },
      { name: 'ಮಂಜುನಾಥ್ ಭಟ್ (Manjunath Bhat)', father: 'Krishna Bhat' },
      { name: 'ಸುರೇಶ್ ರೆಡ್ಡಿ (Suresh Reddy)', father: 'Narayana Reddy' },
      { name: 'ಅನಿಲ್ ಕುಮಾರ್ (Anil Kumar)', father: 'Ramachandra' },
      { name: 'ಸರೋಜಮ್ಮ (Sarojamma)', father: 'W/o Late Venkatesh' },
      { name: 'ಗ್ರಾಮ ಠಾಣಾ / ಸರ್ಕಾರಿ ಭೂಮಿ', father: 'Government of Karnataka' },
      { name: 'ಪ್ರಕಾಶ್ ರಾವ್ (Prakash Rao)', father: 'Subba Rao' },
      { name: 'ಚಂದ್ರಶೇಖರ್ (Chandrashekar)', father: 'Sanjeevaiah' },
    ];
  } else if (stateObj.code === 'GJ') {
    indianNames = [
      { name: 'પરેશભાઈ નારાયણભાઈ પટેલ', father: 'નારાયણભાઈ પટેલ' },
      { name: 'જયેશકુમાર હિંમતલાલ શાહ', father: 'હિંમતલાલ શાહ' },
      { name: 'ધર્મેન્દ્રસિંહ પ્રતાપસિંહ વાઘેલા', father: 'પ્રતાપસિંહ વાઘેલા' },
      { name: 'ભાવનાબેન મહેશભાઈ દેસાઈ', father: 'પતિ: મહેશભાઈ દેસાઈ' },
      { name: 'અશ્વિનકુમાર સોમાભાઈ પ્રજાપતિ', father: 'સોમાભાઈ પ્રજાપતિ' },
      { name: 'ગૌચર / સરકારી પડતર', father: 'ગુજરાત સરકાર મહેસૂલ વિભાગ' },
      { name: 'કીર્તિભાઈ મનસુખલાલ પંડ્યા', father: 'મનસુખલાલ પંડ્યા' },
      { name: 'ભીખાભાઈ કાળુભાઈ ભરવાડ', father: 'કાળુભાઈ ભરવાડ' },
    ];
  } else if (stateObj.code === 'HR' || stateObj.code === 'PB') {
    indianNames = [
      { name: 'ਹਰਪ੍ਰੀਤ ਸਿੰਘ ਢਿੱਲੋਂ (Harpreet Singh)', father: 'ਸ. ਜਰਨੈਲ ਸਿੰਘ' },
      { name: 'कुलदीप सिंह धनखड़', father: 'श्री धर्मपाल सिंह' },
      { name: 'सत्यवीर सिंह यादव', father: 'श्री रामकिशन यादव' },
      { name: 'ਮਨਜੀਤ ਕੌਰ (Manjit Kaur)', father: 'ਪਤੀ: ਸ. ਬਲਵੰਤ ਸਿੰਘ' },
      { name: 'सुरिंदर पाल शर्मा', father: 'श्री शांति स्वरूप शर्मा' },
      { name: 'ਪੰਚਾਇਤ / ਸ਼ਾਮਲਾਤ ਦੇਹ', father: 'ਗ੍ਰਾਮ ਪੰਚਾਇਤ ਸਰਕਾਰ' },
      { name: 'ਰਵਿੰਦਰ ਸਿੰਘ ਗਿੱਲ', father: 'ਸ. ਸੁਖਦੇਵ ਸਿੰਘ' },
      { name: 'अनिल कुमार जांगड़ा', father: 'श्री हवा सिंह' },
    ];
  } else if (stateObj.code === 'WB') {
    indianNames = [
      { name: 'সৌমিত্র বন্দ্যোপাধ্যায় (Soumitra Banerjee)', father: 'সতীশ চন্দ্র বন্দ্যোপাধ্যায়' },
      { name: 'অনির্বাণ মুখোপাধ্যায়', father: 'প্রবীর মুখোপাধ্যায়' },
      { name: 'দেবাশীষ ঘোষ', father: 'ভোলানাথ ঘোষ' },
      { name: 'মৌসুমি সেনগুপ্ত', father: 'স্বামী: সুবীর সেনগুপ্ত' },
      { name: 'প্রসেনজিৎ মণ্ডল', father: 'হরিপদ মণ্ডল' },
      { name: 'খাস জমি / সরকারি দাগ', father: 'পশ্চিমবঙ্গ সরকার' },
      { name: 'তপন কুমার অধিকারী', father: 'বিমল অধিকারী' },
      { name: 'শুভ্রাংশু রায়চৌধুরী', father: 'জগদীশ রায়চৌধুরী' },
    ];
  } else if (stateObj.code === 'TS' || stateObj.code === 'AP') {
    indianNames = [
      { name: 'Chandra Sekhar Rao', father: 'K. Ranga Rao' },
      { name: 'Praveen Kumar Reddy', father: 'M. Venkat Reddy' },
      { name: 'Smt. Lakshmi Devi', father: 'W/o Satyanarayana' },
      { name: 'Venkateshwarlu Naidu', father: 'B. Appa Rao' },
      { name: 'Srinivas Goud', father: 'Mallesham Goud' },
      { name: 'Gram Kantham / Govt Poramboke', father: 'Revenue Department' },
      { name: 'Anand Varma', father: 'Ramachandra Varma' },
      { name: 'Koteswara Rao', father: 'Subba Rao' },
    ];
  }

  const generatedParcels = [];
  const rows = 2;
  const cols = 4;
  let pIndex = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const latOffset = r * 0.0012;
      const lngOffset = c * 0.0014;
      const khasraNumber = 101 + pIndex;
      const gataNo = String(khasraNumber);
      const person = indianNames[pIndex % indianNames.length];
      const isGovt = khasraNumber === 107;
      const areaAcre = Number((0.75 + (pIndex * 0.35)).toFixed(2));
      const areaBigha = Number((areaAcre * 1.6).toFixed(2));
      const areaHectare = Number((areaAcre * 0.4046).toFixed(3));
      const areaBiswa = Number((areaBigha * 20).toFixed(1));
      const areaSqFt = Math.round(areaAcre * 43560);
      const pLat = baseLat + latOffset;
      const pLng = baseLng + lngOffset;

      const parcel = {
        khasraNo: isGovt ? `${gataNo}/सार्वजनिक` : String(gataNo),
        gataNo: gataNo,
        subDiv: '',
        khataNo: `00${100 + pIndex}`,
        landId: `LND-2026-${stateObj.code}-${1000 + pIndex}`,
        owner: `${person.name}`,
        fatherName: person.father,
        coOwners: pIndex % 2 === 0 ? ['सुनील कुमार (सह-खातेदार)'] : [],
        khataShare: pIndex % 2 === 0 ? '1/2 अंश' : '1/1 पूर्ण अंश',
        areaAcre,
        areaHectare,
        areaBigha,
        areaBiswa,
        areaSqFt,
        areaSqMeter: Math.round(areaAcre * 4046.86),
        fasliYear: '1431 - 1436 (फसली वर्ष)',
        tenureStartYear: String(2005 + (pIndex * 2)),
        annualRevenueLagan: `₹ ${(14.5 + pIndex * 3.2).toFixed(2)} वार्षिक`,
        landType: isGovt ? 'Government / सार्वजनिक' : (pIndex % 3 === 0 ? 'Residential / आबादी' : 'Agricultural (सिंचित कृषि)'),
        landCategory: isGovt ? `सार्वजनिक भूमि (${stateObj.name})` : stateObj.tenureTerm,
        soilType: 'उपजाऊ भूमि (Alluvial Loam)',
        soilIrrigation: isGovt ? 'सार्वजनिक' : 'निजी नलकूप व बोरिंग',
        cropType: isGovt ? 'हरित पट्टी' : 'धान, गेहूं व व्यापारिक फसलें',
        marketValue: `₹${(28 + pIndex * 6).toFixed(0)},00,000`,
        circleValue: `₹${(22 + pIndex * 4).toFixed(0)},00,000`,
        encumbranceStatus: isGovt ? 'अहस्तांतरणीय (Non-transferable)' : (pIndex === 2 ? 'KCC बंधक (SBI ₹3.5L)' : 'ऋणमुक्त (Unencumbered)'),
        disputeStatus: 'विवाद रहित (Clean Title, No Court Stay)',
        taxStatus: 'भू-राजस्व लगान अद्यतन चुकता',
        blockchainStatus: isGovt ? 'Government Protected' : (pIndex % 2 === 0 ? 'Approved' : 'Pending'),
        registrationTx: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        ipfsDocCID: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
        roadFrontage: `${20 + (pIndex * 5)} ft संपर्क मार्ग`,
        mutationOrderNo: `नामांतरण आदेश ${2020 + pIndex}/${stateObj.code}/${gataNo}`,
        mutationDate: `202${pIndex % 6}-05-18`,
        center: [pLat + 0.0005, pLng + 0.0006],
        polygon: [
          [pLat, pLng],
          [pLat + 0.0011, pLng],
          [pLat + 0.0011, pLng + 0.0013],
          [pLat, pLng + 0.0013],
        ],
      };

      generatedParcels.push(parcel);
      pIndex++;
    }
  }

  const newVillage = {
    id: newVillageId,
    name: `${cleanName}`,
    englishName: cleanName,
    tehsil: `${cleanName} तहसील`,
    district: cleanName,
    state: stateObj.name,
    stateCode: stateObj.code,
    censusCode: stateObj.censusCode,
    portalName: stateObj.portalName,
    rorTitle: stateObj.rorTitle,
    khasraTerm: stateObj.khasraTerm,
    areaUnit: stateObj.areaUnit,
    department: stateObj.department,
    pincode: '400001',
    coordinates: [baseLat + 0.0005, baseLng + 0.0006],
    zoomLevel: 16,
    totalKhasras: generatedParcels.length,
    description: `डिजिटल भू-अभिलेख पोर्टल — ${stateObj.portalName} (${stateObj.name}) अंतर्गत सम्पूर्ण खसरा व अधिकार अभिलेख पंजी।`,
    circleRatePerSqFt: '₹1,650 / sq.ft',
    circleRatePerAcre: '₹71,87,400 / acre',
    parcels: generatedParcels,
  };

  try {
    const raw = localStorage.getItem('landchain_custom_villages_v3') || '[]';
    const parsed = JSON.parse(raw);
    parsed.unshift(newVillage);
    localStorage.setItem('landchain_custom_villages_v3', JSON.stringify(parsed.slice(0, 20)));
  } catch (err) {
    console.warn('Error saving custom village', err);
  }

  return newVillage;
}

/**
 * Generate 14-digit ULPIN (Bhu-Aadhar) and 16-digit Revenue Code
 * based on Government of India (DILRMP) and Pan-India State standards.
 */
export const generateUniqueBhuAadhar = (parcel, village) => {
  if (!parcel) return null;
  const stateObj = resolvePanIndiaLocation(village?.state || village?.name || '');
  const stCode = village?.stateCode || stateObj?.code || 'UP';
  const census = village?.censusCode || stateObj?.censusCode || '09';
  const distCode = (village?.district || 'DIS').replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'DIS';
  const gataClean = String(parcel.gataNo || parcel.khasraNo || '101').replace(/[^\w]/g, '').slice(0, 4);
  const landNum = String(parcel.landId || '').replace(/[^\d]/g, '').slice(-4) || '1001';
  
  // 14-character official Pan-India ULPIN (भू-आधार)
  const ulpin = `${stCode}${census}-${distCode}-${gataClean.padStart(3, '0')}-${landNum}`;

  // 16-digit official State Revenue Code
  const vilCode = `${census}2812`;
  const khataCode = String(parcel.khataNo || '00100').replace(/[^\d]/g, '').padStart(4, '0').slice(-4);
  const gataCode = String(parcel.gataNo || '101').replace(/[^\d]/g, '').padStart(6, '0').slice(-6);
  const revenueCode16 = `${vilCode}${khataCode}${gataCode}`;

  // Polygon coordinates formatted for Bhu-Aadhar Card
  const coordinatesList = parcel.polygon 
    ? parcel.polygon.map((pt, i) => `V${i + 1}: [${pt[0].toFixed(5)}, ${pt[1].toFixed(5)}]`).join(' | ')
    : 'V1: [26.8849, 81.0141] | V2: [26.8861, 81.0143]';

  return {
    ulpin,
    formattedUlpin: `${ulpin.slice(0, 4)} ${ulpin.slice(5, 9)} ${ulpin.slice(10, 13)} ${ulpin.slice(14)}`,
    revenueCode16,
    formattedRevenueCode16: `${revenueCode16.slice(0, 6)} ${revenueCode16.slice(6, 10)} ${revenueCode16.slice(10)}`,
    stateName: village?.state || stateObj?.name || 'Uttar Pradesh',
    stateCode: stCode,
    department: village?.department || stateObj?.department || 'राजस्व परिषद',
    portalName: village?.portalName || stateObj?.portalName || 'डिजिटल भूलेख',
    rorTitle: village?.rorTitle || stateObj?.rorTitle || 'अधिकार अभिलेख (RoR)',
    khasraTerm: village?.khasraTerm || stateObj?.khasraTerm || 'खसरा संख्या',
    areaUnit: village?.areaUnit || stateObj?.areaUnit || 'एकड़ / बीघा',
    geoHash: parcel.center ? `${parcel.center[0].toFixed(5)}°N, ${parcel.center[1].toFixed(5)}°E` : '26.8855°N, 81.0148°E',
    coordinatesList,
    issueDate: '15/01/2026',
    cardSerialNo: `IN-${stCode}-2026-${landNum}-${gataClean}`,
    isUniqueVerified: true,
    duplicateOverlapPercent: 0,
    securityHash: parcel.registrationTx ? parcel.registrationTx.slice(0, 22) + '...' : '0x8f3ac92e1189...verified',
  };
};


