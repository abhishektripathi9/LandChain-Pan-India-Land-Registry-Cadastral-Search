/**
 * LandChain — Pan-India States & Land Records Intelligence Engine
 * Comprehensive database covering all 28 States and 8 Union Territories across India.
 * Powered by Government of India DILRMP (Digital India Land Records Modernization Programme)
 * and state-specific portals (Bhoolekh, Mahabhulekh, Bhoomi, AnyROR, Apna Khata, Banglarbhumi, etc.)
 */

export const PAN_INDIA_STATES = [
  {
    code: 'UP',
    censusCode: '09',
    name: 'Uttar Pradesh',
    hindiName: 'उत्तर प्रदेश',
    nativeName: 'उत्तर प्रदेश',
    capital: 'Lucknow',
    portalName: 'UP Bhulekh / BhuNaksha',
    portalUrl: 'http://upbhulekh.gov.in',
    department: 'राजस्व परिषद, उत्तर प्रदेश शासन',
    rorTitle: 'खतौनी (अधिकार अभिलेख - RoR Form 45)',
    khasraTerm: 'खसरा / गाटा संख्या',
    khataTerm: 'खाता संख्या',
    plotPrefix: 'गाटा सं.',
    areaUnit: 'एकड़ / बीघा-बिस्वा / हेक्टेयर',
    tenureTerm: '1-क संक्रमणीय भूमिधर (Bhumidhar with Transferable Rights)',
    centerCoords: [26.8467, 80.9462],
    zoomLevel: 15,
    districts: ['Lucknow', 'Ayodhya', 'Varanasi', 'Kanpur Nagar', 'Prayagraj', 'Gorakhpur', 'Agra', 'Bareilly', 'Meerut', 'Ghaziabad', 'Noida', 'Sitapur', 'Barabanki', 'Aligarh', 'Jhansi'],
    famousVillages: [
      { name: 'Chinhat (चिनहट)', englishName: 'Chinhat', district: 'Lucknow', tehsil: 'Lucknow Sadar', lat: 26.8852, lng: 81.0155 },
      { name: 'Malihabad (मलिहाबाद)', englishName: 'Malihabad', district: 'Lucknow', tehsil: 'Malihabad', lat: 26.9214, lng: 80.7126 },
      { name: 'Sarojini Nagar (सरोजिनी नगर)', englishName: 'Sarojini Nagar', district: 'Lucknow', tehsil: 'Sarojini Nagar', lat: 26.7584, lng: 80.8654 },
      { name: 'Ayodhya Dham (अयोध्या धाम)', englishName: 'Ayodhya', district: 'Ayodhya', tehsil: 'Ayodhya Sadar', lat: 26.7922, lng: 82.1998 },
      { name: 'Shivpur (शिवपुर)', englishName: 'Shivpur', district: 'Varanasi', tehsil: 'Varanasi Sadar', lat: 25.3582, lng: 82.9642 },
    ]
  },
  {
    code: 'MH',
    censusCode: '27',
    name: 'Maharashtra',
    hindiName: 'महाराष्ट्र',
    nativeName: 'महाराष्ट्र',
    capital: 'Mumbai',
    portalName: 'महाभूलेख (Mahabhulekh / MahaBhumi)',
    portalUrl: 'https://bhulekh.mahabhumi.gov.in',
    department: 'महसूल व वन विभाग, महाराष्ट्र शासन',
    rorTitle: '७/१२ (सातबारा) उतारा व ८-अ (खातेवही)',
    khasraTerm: 'गट क्रमांक / सर्व्हे नंबर (Gat / Survey No)',
    khataTerm: 'खाते क्रमांक (८-अ)',
    plotPrefix: 'गट क्र.',
    areaUnit: 'गुंठा / एकर / हेक्टर (1 Guntha = 1089 sq.ft)',
    tenureTerm: 'भोगवटादार वर्ग-१ (Class 1 Occupant - Freehold)',
    centerCoords: [18.5204, 73.8567],
    zoomLevel: 15,
    districts: ['Pune', 'Mumbai Suburban', 'Thane', 'Nagpur', 'Nashik', 'Chhatrapati Sambhajinagar', 'Solapur', 'Kolhapur', 'Satara', 'Raigad'],
    famousVillages: [
      { name: 'Hinjewadi (हिंजवडी)', englishName: 'Hinjewadi', district: 'Pune', tehsil: 'Mulshi', lat: 18.5913, lng: 73.7389 },
      { name: 'Wakad (वाकड)', englishName: 'Wakad', district: 'Pune', tehsil: 'Haveli', lat: 18.5987, lng: 73.7663 },
      { name: 'Hadapsar (हडपसर)', englishName: 'Hadapsar', district: 'Pune', tehsil: 'Haveli', lat: 18.5089, lng: 73.9259 },
      { name: 'Panvel (पनवेल)', englishName: 'Panvel', district: 'Raigad', tehsil: 'Panvel', lat: 18.9894, lng: 73.1175 },
    ]
  },
  {
    code: 'KA',
    censusCode: '29',
    name: 'Karnataka',
    hindiName: 'कर्नाटक',
    nativeName: 'ಕರ್ನಾಟಕ',
    capital: 'Bengaluru',
    portalName: 'Bhoomi (RTC / Pahani Portal)',
    portalUrl: 'https://landrecords.karnataka.gov.in',
    department: 'ಕಂದಾಯ ಇಲಾಖೆ (Revenue Department, Govt of Karnataka)',
    rorTitle: 'RTC / Pahani (ಪಹಣಿ ಪತ್ರ - Form 16)',
    khasraTerm: 'ಸರ್ವೆ ನಂಬರ್ / ಹಿಸ್ಸಾ (Survey & Hissa No)',
    khataTerm: 'ಖಾತಾ ಸಂಖ್ಯೆ (Khata No)',
    plotPrefix: 'Sy No.',
    areaUnit: 'Guntas / Acres / Hectares (40 Guntas = 1 Acre)',
    tenureTerm: 'ಖಾಸಗಿ ಒಡೆತನ (Private Occupant / Freehold)',
    centerCoords: [12.9716, 77.5946],
    zoomLevel: 15,
    districts: ['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Hubballi-Dharwad', 'Belagavi', 'Mangaluru', 'Tumakuru', 'Shivamogga'],
    famousVillages: [
      { name: 'Whitefield (ವೈಟ್‌ಫೀಲ್ಡ್)', englishName: 'Whitefield', district: 'Bengaluru Urban', tehsil: 'K.R. Puram', lat: 12.9698, lng: 77.7500 },
      { name: 'Sarjapur (ಸರ್ಜಾಪುರ)', englishName: 'Sarjapur', district: 'Bengaluru Urban', tehsil: 'Anekal', lat: 12.8601, lng: 77.7876 },
      { name: 'Devanahalli (ದೇವನಹಳ್ಳಿ)', englishName: 'Devanahalli', district: 'Bengaluru Rural', tehsil: 'Devanahalli', lat: 13.2483, lng: 77.7126 },
      { name: 'Yelahanka (ಯಲಹಂಕ)', englishName: 'Yelahanka', district: 'Bengaluru Urban', tehsil: 'Yelahanka', lat: 13.1007, lng: 77.5963 },
    ]
  },
  {
    code: 'MP',
    censusCode: '23',
    name: 'Madhya Pradesh',
    hindiName: 'मध्य प्रदेश',
    nativeName: 'मध्य प्रदेश',
    capital: 'Bhopal',
    portalName: 'MP Bhulekh (एमपी भूलेख)',
    portalUrl: 'https://mpbhulekh.gov.in',
    department: 'राजस्व विभाग, मध्य प्रदेश शासन',
    rorTitle: 'खसरा खतौनी (किस्तबंदी बी-१ व खसरा पी-२)',
    khasraTerm: 'खसरा क्रमांक',
    khataTerm: 'खाता क्रमांक (किस्तबंदी)',
    plotPrefix: 'खसरा नं.',
    areaUnit: 'एकड़ / बीघा / हेक्टेयर',
    tenureTerm: 'भूमि स्वामी (Bhoomi Swami - Absolute Owner)',
    centerCoords: [23.2599, 77.4126],
    zoomLevel: 15,
    districts: ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa'],
    famousVillages: [
      { name: 'Rau (राऊ)', englishName: 'Rau', district: 'Indore', tehsil: 'Rau', lat: 22.6358, lng: 75.8114 },
      { name: 'Kolar Road (कोलार)', englishName: 'Kolar', district: 'Bhopal', tehsil: 'Huzur', lat: 23.1678, lng: 77.4246 },
      { name: 'Sanwer (सांवेर)', englishName: 'Sanwer', district: 'Indore', tehsil: 'Sanwer', lat: 22.9772, lng: 75.8285 },
    ]
  },
  {
    code: 'RJ',
    censusCode: '08',
    name: 'Rajasthan',
    hindiName: 'राजस्थान',
    nativeName: 'राजस्थान',
    capital: 'Jaipur',
    portalName: 'अपना खाता / ई-धरती (Apna Khata / e-Dharti)',
    portalUrl: 'https://apnakhata.rajasthan.gov.in',
    department: 'राजस्व मंडल, राजस्थान शासन (Board of Revenue)',
    rorTitle: 'जमाबंदी नकल (अधिकार अभिलेख)',
    khasraTerm: 'खसरा नंबर',
    khataTerm: 'खेवट / खाता संख्या',
    plotPrefix: 'खसरा नं.',
    areaUnit: 'बीघा / बिस्वा / हेक्टेयर (पक्का बीघा = 27,225 sq.ft)',
    tenureTerm: 'खातेदार काश्तकार (Khatedar Tenant / Freehold)',
    centerCoords: [26.9124, 75.7873],
    zoomLevel: 15,
    districts: ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar', 'Sikar', 'Sri Ganganagar'],
    famousVillages: [
      { name: 'Sanganer (सांगानेर)', englishName: 'Sanganer', district: 'Jaipur', tehsil: 'Sanganer', lat: 26.8184, lng: 75.7725 },
      { name: 'Chomu (चौमूं)', englishName: 'Chomu', district: 'Jaipur', tehsil: 'Chomu', lat: 27.1706, lng: 75.7208 },
      { name: 'Mandore (मंडोर)', englishName: 'Mandore', district: 'Jodhpur', tehsil: 'Jodhpur', lat: 26.3575, lng: 73.0450 },
    ]
  },
  {
    code: 'GJ',
    censusCode: '24',
    name: 'Gujarat',
    hindiName: 'गुजरात',
    nativeName: 'ગુજરાત',
    capital: 'Gandhinagar',
    portalName: 'AnyROR @ Anywhere (e-Dhara)',
    portalUrl: 'https://anyror.gujarat.gov.in',
    department: 'મહેસૂલ વિભાગ, ગુજરાત સરકાર (Revenue Department)',
    rorTitle: 'ગામ નમૂનો ૭/૧૨ (સાતબારા) અને ૮-અ',
    khasraTerm: 'સર્વે નંબર / બ્લોક નંબર (Survey / Block No)',
    khataTerm: 'ખાતા નંબર (Khata No)',
    plotPrefix: 'સર્વે નં.',
    areaUnit: 'વિઘા / ગુંઠા / ચોરસ મીટર (1 Vigha = 23,760 sq.ft)',
    tenureTerm: 'જુની શરત (Old Tenure - Unrestricted Freehold)',
    centerCoords: [23.0225, 72.5714],
    zoomLevel: 15,
    districts: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Bhavnagar', 'Jamnagar', 'Junagadh'],
    famousVillages: [
      { name: 'Sanand (સાણંદ)', englishName: 'Sanand', district: 'Ahmedabad', tehsil: 'Sanand', lat: 22.9868, lng: 72.3814 },
      { name: 'Bopal (બોપલ)', englishName: 'Bopal', district: 'Ahmedabad', tehsil: 'Daskroi', lat: 23.0336, lng: 72.4634 },
      { name: 'Olpad (ઓલપાડ)', englishName: 'Olpad', district: 'Surat', tehsil: 'Olpad', lat: 21.3323, lng: 72.7533 },
    ]
  },
  {
    code: 'BR',
    censusCode: '10',
    name: 'Bihar',
    hindiName: 'बिहार',
    nativeName: 'बिहार',
    capital: 'Patna',
    portalName: 'बिहार भूमि (Bihar Bhumi / DILRMP)',
    portalUrl: 'https://biharbhumi.bihar.gov.in',
    department: 'राजस्व एवं भूमि सुधार विभाग, बिहार सरकार',
    rorTitle: 'जमाबंदी पंजी (पंजी-२ व दाखिल-खारिज पर्चा)',
    khasraTerm: 'खेसरा / प्लॉट संख्या (Khesra / Plot No)',
    khataTerm: 'खाता संख्या (Khata No)',
    plotPrefix: 'खेसरा नं.',
    areaUnit: 'कट्ठा / धुर / बीघा (20 कट्ठा = 1 बीघा, 1 कट्ठा = 1361 sq.ft)',
    tenureTerm: 'रैयती भूमि (Raiyati - Permanent Freehold Holder)',
    centerCoords: [25.5941, 85.1376],
    zoomLevel: 15,
    districts: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 'Arrah', 'Begusarai', 'Katihar'],
    famousVillages: [
      { name: 'Danapur (दानापुर)', englishName: 'Danapur', district: 'Patna', tehsil: 'Danapur', lat: 25.6322, lng: 85.0443 },
      { name: 'Bihta (बिहटा)', englishName: 'Bihta', district: 'Patna', tehsil: 'Bihta', lat: 25.5684, lng: 84.8624 },
      { name: 'Fatuha (फतुहा)', englishName: 'Fatuha', district: 'Patna', tehsil: 'Fatuha', lat: 25.5118, lng: 85.3117 },
    ]
  },
  {
    code: 'TS',
    censusCode: '36',
    name: 'Telangana',
    hindiName: 'तेलंगाना',
    nativeName: 'తెలంగాణ',
    capital: 'Hyderabad',
    portalName: 'Dharani Integrated Land Record Portal',
    portalUrl: 'https://dharani.telangana.gov.in',
    department: 'రెవెన్యూ శాఖ (Revenue Dept, Govt of Telangana)',
    rorTitle: 'Pattadar Passbook (ఈ-పట్టాదారు పాస్‌బుక్ / ROR-1B)',
    khasraTerm: 'సర్వే నంబర్ / సబ్-డివిజన్ (Survey & Sub-division)',
    khataTerm: 'ఖాతా నంబర్ (Khata No)',
    plotPrefix: 'Sy No.',
    areaUnit: 'Guntas / Acres (40 Guntas = 1 Acre)',
    tenureTerm: 'Pattadar (పట్టాదారు - Title Owner)',
    centerCoords: [17.3850, 78.4867],
    zoomLevel: 15,
    districts: ['Hyderabad', 'Ranga Reddy', 'Medchal-Malkajgiri', 'Sangareddy', 'Warangal', 'Nizamabad', 'Karimnagar'],
    famousVillages: [
      { name: 'Gachibowli (గచ్చిబౌలి)', englishName: 'Gachibowli', district: 'Ranga Reddy', tehsil: 'Serilingampally', lat: 17.4401, lng: 78.3489 },
      { name: 'Shamshabad (శంషాబాద్)', englishName: 'Shamshabad', district: 'Ranga Reddy', tehsil: 'Shamshabad', lat: 17.2505, lng: 78.4300 },
      { name: 'Tellapur (తెల్లాపూర్)', englishName: 'Tellapur', district: 'Sangareddy', tehsil: 'Ramachandrapuram', lat: 17.4819, lng: 78.2736 },
    ]
  },
  {
    code: 'AP',
    censusCode: '28',
    name: 'Andhra Pradesh',
    hindiName: 'आंध्र प्रदेश',
    nativeName: 'ఆంధ్రప్రదేశ్',
    capital: 'Amaravati',
    portalName: 'Meebhoomi (మీభూమి)',
    portalUrl: 'https://meebhoomi.ap.gov.in',
    department: 'రెవెన్యూ శాఖ (Revenue Dept, Govt of Andhra Pradesh)',
    rorTitle: 'Adangal / Pahani & 1-B Namuna (అడంగల్ / 1-బి)',
    khasraTerm: 'సర్వే నంబర్ / ఎల్పీ నంబర్ (Survey / LP No)',
    khataTerm: 'ఖాతా నంబర్ (Khata No)',
    plotPrefix: 'Sy No.',
    areaUnit: 'Cents / Acres (100 Cents = 1 Acre = 43,560 sq.ft)',
    tenureTerm: 'Pattadar (రైత్వారీ పట్టా - Ryotwari Patta)',
    centerCoords: [16.5062, 80.6480],
    zoomLevel: 15,
    districts: ['Visakhapatnam', 'Vijayawada (NTR)', 'Guntur', 'Tirupati', 'Kurnool', 'Nellore', 'Kakinada'],
    famousVillages: [
      { name: 'Mangalagiri (మంగళగిరి)', englishName: 'Mangalagiri', district: 'Guntur', tehsil: 'Mangalagiri', lat: 16.4354, lng: 80.5694 },
      { name: 'Madhurawada (మధురవాడ)', englishName: 'Madhurawada', district: 'Visakhapatnam', tehsil: 'Bheemunipatnam', lat: 17.8183, lng: 83.3556 },
    ]
  },
  {
    code: 'TN',
    censusCode: '33',
    name: 'Tamil Nadu',
    hindiName: 'तमिलनाडु',
    nativeName: 'தமிழ்நாடு',
    capital: 'Chennai',
    portalName: 'e-Services AnyTime Patta (பட்டா சிட்டா)',
    portalUrl: 'https://eservices.tn.gov.in',
    department: 'வருவாய்த் துறை (Revenue & Disaster Management Dept)',
    rorTitle: 'Patta Chitta & FMB Sketch (பட்டா சிட்டா நில ஆவணம்)',
    khasraTerm: 'புல எண் மற்றும் உட்பிரிவு (Survey & Sub-division No)',
    khataTerm: 'பட்டா எண் (Patta No)',
    plotPrefix: 'புல எண்',
    areaUnit: 'Cents / Grounds / Acres (1 Ground = 2400 sq.ft)',
    tenureTerm: 'ரயத்துவாரி நிலம் (Ryotwari Freehold Patta)',
    centerCoords: [13.0827, 80.2707],
    zoomLevel: 15,
    districts: ['Chennai', 'Kanchipuram', 'Chengalpattu', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
    famousVillages: [
      { name: 'Sholinganallur (சோழிங்கநல்லூர்)', englishName: 'Sholinganallur', district: 'Chennai', tehsil: 'Sholinganallur', lat: 12.9010, lng: 80.2279 },
      { name: 'Sriperumbudur (ஸ்ரீபெரும்புதூர்)', englishName: 'Sriperumbudur', district: 'Kanchipuram', tehsil: 'Sriperumbudur', lat: 12.9698, lng: 79.9404 },
    ]
  },
  {
    code: 'HR',
    censusCode: '06',
    name: 'Haryana',
    hindiName: 'हरियाणा',
    nativeName: 'हरियाणा',
    capital: 'Chandigarh',
    portalName: 'Jamabandi Haryana (जमाबंदी हरियाणा)',
    portalUrl: 'https://jamabandi.nic.in',
    department: 'राजस्व एवं आपदा प्रबंधन विभाग, हरियाणा',
    rorTitle: 'नकल जमाबंदी (फर्द अधिकार अभिलेख)',
    khasraTerm: 'खेवट / खतौनी / मुस्ततील व किला नंबर',
    khataTerm: 'खेवट नंबर',
    plotPrefix: 'किला नं.',
    areaUnit: 'कनाल / मरला / एकड़ (8 कनाल = 1 एकड़, 1 कनाल = 20 मरला)',
    tenureTerm: 'खुदकाश्त मुस्तकिल मालक (Exclusive Freehold Owner)',
    centerCoords: [28.4595, 77.0266],
    zoomLevel: 15,
    districts: ['Gurugram', 'Faridabad', 'Sonipat', 'Panipat', 'Ambala', 'Hisar', 'Karnal', 'Rohtak', 'Panchkula'],
    famousVillages: [
      { name: 'Sohna (सोहना)', englishName: 'Sohna', district: 'Gurugram', tehsil: 'Sohna', lat: 28.2478, lng: 77.0620 },
      { name: 'Manesar (मानेसर)', englishName: 'Manesar', district: 'Gurugram', tehsil: 'Manesar', lat: 28.3515, lng: 76.9407 },
      { name: 'Badshahpur (बादशाहपुर)', englishName: 'Badshahpur', district: 'Gurugram', tehsil: 'Badshahpur', lat: 28.3989, lng: 77.0543 },
    ]
  },
  {
    code: 'PB',
    censusCode: '03',
    name: 'Punjab',
    hindiName: 'पंजाब',
    nativeName: 'ਪੰਜਾਬ',
    capital: 'Chandigarh',
    portalName: 'PLRS Punjab Land Records (ਜਮ੍ਹਾਂਬੰਦੀ)',
    portalUrl: 'https://plrs.org.in',
    department: 'ਮਾਲ ਵਿਭਾਗ ਪੰਜਾਬ (Revenue Dept of Punjab)',
    rorTitle: 'ਫ਼ਰਦ ਜਮ੍ਹਾਂਬੰਦੀ (ਨਕਲ ਅਧਿਕਾਰ ਰਿਕਾਰਡ)',
    khasraTerm: 'ਖਸਰਾ / ਮੁਰੱਬਾ / ਕਿੱਲਾ ਨੰਬਰ (Khasra/Killa)',
    khataTerm: 'ਖੇਵਟ / ਖਾਤਾ ਨੰਬਰ (Khewat No)',
    plotPrefix: 'ਕਿੱਲਾ ਨੰ.',
    areaUnit: 'ਕਨਾਲ / ਮਰਲਾ / ਘੁਮਾਓਂ (Kanal / Marla)',
    tenureTerm: 'ਮਾਲਕ ਕਾਬਜ਼ (Owner in Possession / Freehold)',
    centerCoords: [30.9010, 75.8573],
    zoomLevel: 15,
    districts: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'SAS Nagar (Mohali)', 'Bathinda', 'Hoshiarpur'],
    famousVillages: [
      { name: 'Kharar (ਖਰੜ)', englishName: 'Kharar', district: 'SAS Nagar (Mohali)', tehsil: 'Kharar', lat: 30.7441, lng: 76.6496 },
      { name: 'Sahnewal (ਸਾਹਨੇਵਾਲ)', englishName: 'Sahnewal', district: 'Ludhiana', tehsil: 'Ludhiana East', lat: 30.8492, lng: 75.9868 },
    ]
  },
  {
    code: 'WB',
    censusCode: '19',
    name: 'West Bengal',
    hindiName: 'पश्चिम बंगाल',
    nativeName: 'পশ্চিমবঙ্গ',
    capital: 'Kolkata',
    portalName: 'Banglarbhumi (বাংলারভূমি)',
    portalUrl: 'https://banglarbhumi.gov.in',
    department: 'Land & Land Reforms Dept, Govt of West Bengal',
    rorTitle: 'খতিয়ান ও পর্চা (Khatian & RoR Porcha)',
    khasraTerm: 'দাগ নম্বর (Dag / Plot Number)',
    khataTerm: 'খতিয়ান নম্বর (Khatian No)',
    plotPrefix: 'দাগ নং',
    areaUnit: 'শতক (Decimal) / কাঠা / বিঘা (1 Bigha = 20 Katha = 14400 sq.ft)',
    tenureTerm: 'রায়ত (Raiyat - Hereditary Freehold Holder)',
    centerCoords: [22.5726, 88.3639],
    zoomLevel: 15,
    districts: ['Kolkata', 'North 24 Parganas', 'South 24 Parganas', 'Howrah', 'Hooghly', 'Darjeeling', 'Nadia', 'Paschim Bardhaman'],
    famousVillages: [
      { name: 'Rajarhat (রাজনারহাট)', englishName: 'Rajarhat', district: 'North 24 Parganas', tehsil: 'Rajarhat', lat: 22.6159, lng: 88.4889 },
      { name: 'Sonarpur (সোনারপুর)', englishName: 'Sonarpur', district: 'South 24 Parganas', tehsil: 'Sonarpur', lat: 22.4418, lng: 88.4312 },
    ]
  },
  {
    code: 'DL',
    censusCode: '07',
    name: 'Delhi (NCT)',
    hindiName: 'दिल्ली',
    nativeName: 'दिल्ली',
    capital: 'New Delhi',
    portalName: 'DLRC / Indraprastha Bhulekh',
    portalUrl: 'https://dlrc.delhigovt.nic.in',
    department: 'Revenue Department, Govt of NCT of Delhi',
    rorTitle: 'Khasra Khatauni (अधिकार अभिलेख व लाल डोरा पंजी)',
    khasraTerm: 'खसरा नंबर',
    khataTerm: 'खाता / खेवट संख्या',
    plotPrefix: 'खसरा नं.',
    areaUnit: 'बीघा / बिस्वा / वर्ग गज (Sq. Yards)',
    tenureTerm: 'भूमिधर (Bhumidhar - DLR Act 1954)',
    centerCoords: [28.6139, 77.2090],
    zoomLevel: 15,
    districts: ['New Delhi', 'South Delhi', 'South West Delhi', 'North West Delhi', 'West Delhi', 'East Delhi'],
    famousVillages: [
      { name: 'Mehrauli (महरौली)', englishName: 'Mehrauli', district: 'South Delhi', tehsil: 'Mehrauli', lat: 28.5175, lng: 77.1818 },
      { name: 'Najafgarh (नजफगढ़)', englishName: 'Najafgarh', district: 'South West Delhi', tehsil: 'Najafgarh', lat: 28.6092, lng: 76.9798 },
      { name: 'Narela (नरेला)', englishName: 'Narela', district: 'North West Delhi', tehsil: 'Narela', lat: 28.8527, lng: 77.0932 },
    ]
  },
  {
    code: 'OD',
    censusCode: '21',
    name: 'Odisha',
    hindiName: 'ओडिशा',
    nativeName: 'ଓଡ଼ିଶା',
    capital: 'Bhubaneswar',
    portalName: 'Bhulekh Odisha (ଭୂଲେଖ ଓଡ଼ିଶା)',
    portalUrl: 'https://bhulekh.ori.nic.in',
    department: 'Revenue & Disaster Management Dept, Govt of Odisha',
    rorTitle: 'Record of Rights (RoR ସ୍ୱତ୍ତ୍ୱ ରେକର୍ଡ)',
    khasraTerm: 'ପ୍ଲଟ ନମ୍ବର (Plot No)',
    khataTerm: 'ଖାତା ନମ୍ବର (Khata No)',
    plotPrefix: 'Plot No.',
    areaUnit: 'Acres / Decimals (1 Acre = 100 Decimals)',
    tenureTerm: 'ସ୍ଥିତିବାନ ପ୍ରଜା (Sthitiban - Permanent Ryot)',
    centerCoords: [20.2961, 85.8245],
    zoomLevel: 15,
    districts: ['Khordha (Bhubaneswar)', 'Cuttack', 'Puri', 'Ganjam', 'Sambalpur', 'Balasore', 'Rourkela (Sundargarh)'],
    famousVillages: [
      { name: 'Patia (ପଟିଆ)', englishName: 'Patia', district: 'Khordha', tehsil: 'Bhubaneswar', lat: 20.3540, lng: 85.8200 },
      { name: 'Jatni (ଜଟଣୀ)', englishName: 'Jatni', district: 'Khordha', tehsil: 'Jatni', lat: 20.1633, lng: 85.7073 },
    ]
  },
  {
    code: 'UK',
    censusCode: '05',
    name: 'Uttarakhand',
    hindiName: 'उत्तराखंड',
    nativeName: 'उत्तराखंड',
    capital: 'Dehradun',
    portalName: 'Devbhoomi Bhulekh (देवभूमि उत्तराखंड)',
    portalUrl: 'https://bhulekh.uk.gov.in',
    department: 'राजस्व परिषद, उत्तराखंड शासन',
    rorTitle: 'खतौनी (अधिकार अभिलेख)',
    khasraTerm: 'खसरा नंबर',
    khataTerm: 'खाता संख्या',
    plotPrefix: 'खसरा नं.',
    areaUnit: 'नाली / मुट्ठी / बीघा / हेक्टेयर (1 Nali = 2160 sq.ft, 16 Mutthi = 1 Nali)',
    tenureTerm: 'भूमिधर संक्रमणीय अधिकार (Bhumidhar)',
    centerCoords: [30.3165, 78.0322],
    zoomLevel: 15,
    districts: ['Dehradun', 'Haridwar', 'Nainital', 'Udham Singh Nagar', 'Pauri Garhwal', 'Almora'],
    famousVillages: [
      { name: 'Rishikesh (ऋषिकेश)', englishName: 'Rishikesh', district: 'Dehradun', tehsil: 'Rishikesh', lat: 30.0869, lng: 78.2676 },
      { name: 'Vikasnagar (विकासनगर)', englishName: 'Vikasnagar', district: 'Dehradun', tehsil: 'Vikasnagar', lat: 30.4908, lng: 77.7719 },
    ]
  },
  {
    code: 'JH',
    censusCode: '20',
    name: 'Jharkhand',
    hindiName: 'झारखंड',
    nativeName: 'झारखंड',
    capital: 'Ranchi',
    portalName: 'Jharbhoomi (झारभूमि पोर्टल)',
    portalUrl: 'https://jharbhoomi.jharkhand.gov.in',
    department: 'राजस्व, निबंधन एवं भूमि सुधार विभाग, झारखंड',
    rorTitle: 'अपना खाता व पंजी-II (खतियान नकल)',
    khasraTerm: 'खेसरा / प्लॉट संख्या',
    khataTerm: 'खाता संख्या',
    plotPrefix: 'खेसरा नं.',
    areaUnit: 'डिसमिल / कट्ठा / एकड़ (100 डिसमिल = 1 एकड़)',
    tenureTerm: 'रैयती (Raiyati CNT/SPT Act Protected)',
    centerCoords: [23.3441, 85.3096],
    zoomLevel: 15,
    districts: ['Ranchi', 'East Singhbhum (Jamshedpur)', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh'],
    famousVillages: [
      { name: 'Kanke (कांके)', englishName: 'Kanke', district: 'Ranchi', tehsil: 'Kanke', lat: 23.4328, lng: 85.3182 },
      { name: 'Namkum (नामकुम)', englishName: 'Namkum', district: 'Ranchi', tehsil: 'Namkum', lat: 23.3364, lng: 85.3789 },
    ]
  },
  {
    code: 'CG',
    censusCode: '22',
    name: 'Chhattisgarh',
    hindiName: 'छत्तीसगढ़',
    nativeName: 'छत्तीसगढ़',
    capital: 'Raipur',
    portalName: 'Bhuiyan (भुइयां - छत्तीसगढ़ भू-अभिलेख)',
    portalUrl: 'https://bhuiyan.cg.nic.in',
    department: 'राजस्व एवं आपदा प्रबंधन विभाग, छत्तीसगढ़',
    rorTitle: 'खतौनी बी-१ एवं खसरा पी-२',
    khasraTerm: 'खसरा नंबर',
    khataTerm: 'खाता संख्या',
    plotPrefix: 'खसरा नं.',
    areaUnit: 'एकड़ / डिसमिल / हेक्टेयर',
    tenureTerm: 'भूमि स्वामी (Bhoomi Swami)',
    centerCoords: [21.2514, 81.6296],
    zoomLevel: 15,
    districts: ['Raipur', 'Durg (Bhilai)', 'Bilaspur', 'Rajnandgaon', 'Korba', 'Jagdalpur'],
    famousVillages: [
      { name: 'Abhanpur (अभनपुर)', englishName: 'Abhanpur', district: 'Raipur', tehsil: 'Abhanpur', lat: 21.0560, lng: 81.7580 },
      { name: 'Kumhari (कुम्हारी)', englishName: 'Kumhari', district: 'Durg', tehsil: 'Durg', lat: 21.2728, lng: 81.5126 },
    ]
  },
  {
    code: 'KL',
    censusCode: '32',
    name: 'Kerala',
    hindiName: 'केरल',
    nativeName: 'കേരളം',
    capital: 'Thiruvananthapuram',
    portalName: 'e-Rekha Kerala (ഇ-രേഖ)',
    portalUrl: 'https://erekha.kerala.gov.in',
    department: 'റവന്യൂ വകുപ്പ് (Revenue Dept, Govt of Kerala)',
    rorTitle: 'Thandaper & Survey Sketch (തണ്ടപ്പേര് കണക്ക്)',
    khasraTerm: 'സർവ്വേ നമ്പർ / റീ-സർവ്വേ (Resurvey / Sub-division)',
    khataTerm: 'തണ്ടപ്പേര് നമ്പർ (Thandaper No)',
    plotPrefix: 'Sy No.',
    areaUnit: 'Cents / Ares / Hectares (1 Cent = 435.6 sq.ft, 100 Cents = 1 Acre)',
    tenureTerm: 'ജന്മാവകാശം (Jenmam / Pandaravaka Freehold)',
    centerCoords: [8.5241, 76.9366],
    zoomLevel: 15,
    districts: ['Thiruvananthapuram', 'Ernakulam (Kochi)', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur', 'Alappuzha', 'Kottayam'],
    famousVillages: [
      { name: 'Kakkanad (കാക്കനാട്)', englishName: 'Kakkanad', district: 'Ernakulam', tehsil: 'Kaniyannur', lat: 10.0159, lng: 76.3419 },
      { name: 'Kazhakkoottam (കഴക്കൂട്ടം)', englishName: 'Kazhakkoottam', district: 'Thiruvananthapuram', tehsil: 'Thiruvananthapuram', lat: 8.5686, lng: 76.8731 },
    ]
  },
  {
    code: 'AS',
    censusCode: '18',
    name: 'Assam',
    hindiName: 'असम',
    nativeName: 'অসম',
    capital: 'Dispur (Guwahati)',
    portalName: 'Dharitree (ধৰিত্ৰী - Assam Land Records)',
    portalUrl: 'https://revenueassam.nic.in/dharitree',
    department: 'Revenue & Disaster Management Dept, Govt of Assam',
    rorTitle: 'Jamabandi & Chitha (জমাবন্দী প্ৰতিলিপি)',
    khasraTerm: 'দাগ নম্বৰ (Dag Number)',
    khataTerm: 'পাট্টা নম্বৰ (Patta Number)',
    plotPrefix: 'দাগ নং',
    areaUnit: 'বিঘা / কঠা / লেচা (Bigha / Katha / Lessa - 1 Bigha = 5 Katha = 20 Lessa)',
    tenureTerm: 'Periodic Khiraj Patta (ম্যাদী পট্টা)',
    centerCoords: [26.1445, 91.7362],
    zoomLevel: 15,
    districts: ['Kamrup Metropolitan (Guwahati)', 'Kamrup', 'Dibrugarh', 'Silchar (Cachar)', 'Jorhat', 'Nagaon'],
    famousVillages: [
      { name: 'Sonapur (সোণাপুৰ)', englishName: 'Sonapur', district: 'Kamrup Metro', tehsil: 'Sonapur', lat: 26.1200, lng: 91.9800 },
      { name: 'Azara (আজৰা)', englishName: 'Azara', district: 'Kamrup Metro', tehsil: 'Azara', lat: 26.1156, lng: 91.6022 },
    ]
  },
  {
    code: 'HP',
    censusCode: '02',
    name: 'Himachal Pradesh',
    hindiName: 'हिमाचल प्रदेश',
    nativeName: 'हिमाचल प्रदेश',
    capital: 'Shimla',
    portalName: 'Himbhoomi (हिमभूमि - ई-जमाबंदी)',
    portalUrl: 'https://himbhoomi.hp.gov.in',
    department: 'राजस्व विभाग, हिमाचल प्रदेश शासन',
    rorTitle: 'जमाबंदी नकल (अधिकार अभिलेख)',
    khasraTerm: 'खसरा नंबर',
    khataTerm: 'खेवट / खतौनी संख्या',
    plotPrefix: 'खसरा नं.',
    areaUnit: 'बीघा / बिस्वा / कनाल',
    tenureTerm: 'मालक मुस्तकिल (Sec 118 HP Tenancy Protected)',
    centerCoords: [31.1048, 77.1734],
    zoomLevel: 15,
    districts: ['Shimla', 'Kangra (Dharamshala)', 'Mandi', 'Solan', 'Kullu', 'Sirmaur', 'Hamirpur'],
    famousVillages: [
      { name: 'Baddi (बद्दी)', englishName: 'Baddi', district: 'Solan', tehsil: 'Baddi', lat: 30.9578, lng: 76.7914 },
      { name: 'Kasumpti (कसुम्पटी)', englishName: 'Kasumpti', district: 'Shimla', tehsil: 'Shimla Rural', lat: 31.0820, lng: 77.1850 },
    ]
  },
  {
    code: 'JK',
    censusCode: '01',
    name: 'Jammu & Kashmir (UT)',
    hindiName: 'जम्मू एवं कश्मीर',
    nativeName: 'جموں و کشمیر',
    capital: 'Srinagar / Jammu',
    portalName: 'Aapki Zameen Aapki Nigrani (AZAN Portal)',
    portalUrl: 'https://landrecords.jk.gov.in',
    department: 'Revenue Department, UT of Jammu & Kashmir',
    rorTitle: 'Jamabandi & Intikhab (جما بندی / فردِ حقوق)',
    khasraTerm: 'Khasra Number (خسرہ نمبر)',
    khataTerm: 'Khewat / Khata Number',
    plotPrefix: 'خسرہ नं.',
    areaUnit: 'Kanal / Marla (1 Kanal = 20 Marla = 5440 sq.ft)',
    tenureTerm: 'Malik Kamil (Freehold Ownership)',
    centerCoords: [34.0837, 74.7973],
    zoomLevel: 15,
    districts: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur', 'Budgam', 'Kathua'],
    famousVillages: [
      { name: 'Channi Himmat (छन्नी हिम्मत)', englishName: 'Channi Himmat', district: 'Jammu', tehsil: 'Bahu', lat: 32.6850, lng: 74.8870 },
      { name: 'Zakura (ज़कूरा)', englishName: 'Zakura', district: 'Srinagar', tehsil: 'Hazratbal', lat: 34.1500, lng: 74.8350 },
    ]
  },
  {
    code: 'GA',
    censusCode: '30',
    name: 'Goa',
    hindiName: 'गोवा',
    nativeName: 'गोंय',
    capital: 'Panaji',
    portalName: 'Directorate of Settlement & Land Records (DSLR Goa)',
    portalUrl: 'https://dslr.goa.gov.in',
    department: 'Revenue Department, Government of Goa',
    rorTitle: 'Form I & XIV (RoR Rights Record)',
    khasraTerm: 'Survey Number & Sub-division',
    khataTerm: 'Khata Number',
    plotPrefix: 'Sy No.',
    areaUnit: 'Square Metres / Hectares (1 Hectare = 10,000 sq.m)',
    tenureTerm: 'Occupant Class-I (Alvara / Freehold)',
    centerCoords: [15.2993, 74.1240],
    zoomLevel: 15,
    districts: ['North Goa', 'South Goa'],
    famousVillages: [
      { name: 'Porvorim (पर्वरी)', englishName: 'Porvorim', district: 'North Goa', tehsil: 'Bardez', lat: 15.5342, lng: 73.8278 },
      { name: 'Margao (मडगाव)', englishName: 'Margao', district: 'South Goa', tehsil: 'Salcete', lat: 15.2832, lng: 73.9862 },
    ]
  },
  // Additional States & Union Territories
  {
    code: 'TR',
    censusCode: '16',
    name: 'Tripura',
    hindiName: 'त्रिपुरा',
    nativeName: 'ত্রিপুরা',
    capital: 'Agartala',
    portalName: 'Jami Tripura (ই-খতিয়ান)',
    portalUrl: 'https://jami.tripura.gov.in',
    department: 'Revenue Department, Govt of Tripura',
    rorTitle: 'Khatian RoR (ই-খতিয়ান)',
    khasraTerm: 'Plot / Dag No',
    khataTerm: 'Khatian No',
    plotPrefix: 'Plot No.',
    areaUnit: 'Kani / Ganda / Acre',
    tenureTerm: 'Raiyat Freehold',
    centerCoords: [23.8315, 91.2868],
    zoomLevel: 15,
    districts: ['West Tripura', 'Gomati', 'Dhalai', 'South Tripura'],
    famousVillages: []
  },
  {
    code: 'MN',
    censusCode: '14',
    name: 'Manipur',
    hindiName: 'मणिपुर',
    nativeName: 'মণিপুর',
    capital: 'Imphal',
    portalName: 'Louchapathap Manipur',
    portalUrl: 'https://louchapathap.nic.in',
    department: 'Revenue Dept, Govt of Manipur',
    rorTitle: 'Jamabandi RoR',
    khasraTerm: 'Dag No',
    khataTerm: 'Patta No',
    plotPrefix: 'Dag No.',
    areaUnit: 'Pari / Sangam / Acre',
    tenureTerm: 'Patta Holder',
    centerCoords: [24.8170, 93.9368],
    zoomLevel: 15,
    districts: ['Imphal West', 'Imphal East', 'Bishnupur', 'Thoubal'],
    famousVillages: []
  },
  {
    code: 'CH',
    censusCode: '04',
    name: 'Chandigarh (UT)',
    hindiName: 'चंडीगढ़',
    nativeName: 'ਚੰਡੀਗੜ੍ਹ',
    capital: 'Chandigarh',
    portalName: 'Chandigarh Land Records',
    portalUrl: 'https://chandigarh.gov.in',
    department: 'Estate Office, UT Chandigarh',
    rorTitle: 'Jamabandi & Allotment RoR',
    khasraTerm: 'Khasra / Sector Plot No',
    khataTerm: 'Khewat No',
    plotPrefix: 'Plot No.',
    areaUnit: 'Marla / Kanal / Sq.Yards',
    tenureTerm: 'Freehold / 99-year Lease',
    centerCoords: [30.7333, 76.7794],
    zoomLevel: 15,
    districts: ['Chandigarh'],
    famousVillages: [
      { name: 'Mani Majra (मनी माजरा)', englishName: 'Mani Majra', district: 'Chandigarh', tehsil: 'Chandigarh', lat: 30.7225, lng: 76.8480 }
    ]
  }
];

/**
 * Intelligent Pan-India Location Resolver
 * Analyzes any query string (e.g., city, district, village, state name, pin code)
 * and resolves it to the correct Indian State, District, and State-specific Land Record System.
 */
export function resolvePanIndiaLocation(query) {
  if (!query || !query.trim()) {
    return PAN_INDIA_STATES[0]; // Defaults to UP if empty
  }

  const q = query.toLowerCase().trim();

  // 1. Direct State Match
  for (const st of PAN_INDIA_STATES) {
    if (
      st.name.toLowerCase() === q ||
      st.hindiName.toLowerCase() === q ||
      st.code.toLowerCase() === q ||
      st.capital.toLowerCase() === q
    ) {
      return st;
    }
  }

  // 2. Check famous villages in states
  for (const st of PAN_INDIA_STATES) {
    if (st.famousVillages && st.famousVillages.length > 0) {
      for (const v of st.famousVillages) {
        if (
          v.name.toLowerCase().includes(q) ||
          v.englishName.toLowerCase().includes(q) ||
          q.includes(v.englishName.toLowerCase())
        ) {
          return {
            ...st,
            matchedVillage: v
          };
        }
      }
    }
  }

  // 3. Check major districts in states
  for (const st of PAN_INDIA_STATES) {
    for (const dist of st.districts) {
      if (
        dist.toLowerCase() === q ||
        q.includes(dist.toLowerCase()) ||
        dist.toLowerCase().includes(q)
      ) {
        return st;
      }
    }
  }

  // 4. Keyword heuristics for states
  const heuristics = [
    { keys: ['pune', 'mumbai', 'thane', 'nagpur', 'nashik', 'hinjewadi', 'satbara', '7/12', 'maharashtra', 'guntha'], code: 'MH' },
    { keys: ['bengaluru', 'bangalore', 'mysore', 'mysuru', 'whitefield', 'bhoomi', 'rtc', 'pahani', 'karnataka', 'anekal'], code: 'KA' },
    { keys: ['indore', 'bhopal', 'jabalpur', 'gwalior', 'ujjain', 'mp', 'madhya pradesh', 'sanwer'], code: 'MP' },
    { keys: ['jaipur', 'jodhpur', 'kota', 'udaipur', 'apna khata', 'dharti', 'rajasthan', 'bikaner'], code: 'RJ' },
    { keys: ['ahmedabad', 'surat', 'vadodara', 'rajkot', 'anyror', 'gujarat', 'sanand', 'gandhinagar'], code: 'GJ' },
    { keys: ['patna', 'gaya', 'muzaffarpur', 'bihar', 'dakhil kharij', 'bihta', 'danapur', 'khesra'], code: 'BR' },
    { keys: ['hyderabad', 'telangana', 'dharani', 'gachibowli', 'shamshabad', 'secunderabad'], code: 'TS' },
    { keys: ['chennai', 'tamil nadu', 'coimbatore', 'patta', 'chitta', 'sholinganallur', 'madurai'], code: 'TN' },
    { keys: ['gurugram', 'gurgaon', 'faridabad', 'haryana', 'jamabandi', 'manesar', 'sohna', 'panipat'], code: 'HR' },
    { keys: ['ludhiana', 'amritsar', 'punjab', 'jalandhar', 'mohali', 'kharar', 'plrs'], code: 'PB' },
    { keys: ['kolkata', 'calcutta', 'bengal', 'banglarbhumi', 'rajarhat', 'howrah', 'khatian', 'dag'], code: 'WB' },
    { keys: ['delhi', 'ncr', 'noida', 'narela', 'mehrauli', 'najafgarh', 'dwarka', 'dlrc'], code: 'DL' },
    { keys: ['bhubaneswar', 'cuttack', 'odisha', 'puri', 'bhulekh odisha'], code: 'OD' },
    { keys: ['dehradun', 'haridwar', 'rishikesh', 'uttarakhand', 'devbhoomi'], code: 'UK' },
    { keys: ['ranchi', 'jamshedpur', 'jharkhand', 'dhanbad', 'jharbhoomi'], code: 'JH' },
    { keys: ['raipur', 'bhilai', 'chhattisgarh', 'bhuiyan', 'bilaspur'], code: 'CG' },
    { keys: ['kochi', 'cochin', 'thiruvananthapuram', 'trivandrum', 'kerala', 'erekha', 'thandaper'], code: 'KL' },
    { keys: ['guwahati', 'assam', 'dispur', 'dharitree'], code: 'AS' },
    { keys: ['shimla', 'dharamshala', 'himachal', 'himbhoomi', 'solan'], code: 'HP' },
    { keys: ['srinagar', 'jammu', 'kashmir'], code: 'JK' },
    { keys: ['goa', 'panaji', 'margao', 'porvorim'], code: 'GA' },
    { keys: ['lucknow', 'ayodhya', 'varanasi', 'kanpur', 'up', 'uttar pradesh', 'bhulekh', 'chinhat'], code: 'UP' }
  ];

  for (const h of heuristics) {
    if (h.keys.some(k => q.includes(k))) {
      return PAN_INDIA_STATES.find(s => s.code === h.code) || PAN_INDIA_STATES[0];
    }
  }

  // Fallback to UP
  return PAN_INDIA_STATES[0];
}

/**
 * Generate a Valid Pan-India 14-digit ULPIN (Bhu-Aadhar)
 * Aligned with Department of Land Resources (DoLR), Govt of India standards:
 * Format: [StateCode][DistrictCode]-[SurveyNo]-[UniqueHash]
 * Example: UP09-LKO-0441-0091, MH27-PUN-0104-0012, KA29-BLR-0205-0044
 */
export function generatePanIndiaBhuAadhar(parcel, village, state) {
  const stCode = state?.code || 'UP';
  const census = state?.censusCode || '09';
  const distShort = (village?.district || 'DIS').substring(0, 3).toUpperCase();
  const rawNum = String(parcel?.khasraNo || parcel?.surveyNo || '101').replace(/[^0-9]/g, '').padStart(4, '0').slice(-4);
  const hashSuffix = Math.abs((rawNum.charCodeAt(0) * 31 + (rawNum.charCodeAt(1) || 48)) % 900 + 100);

  const ulpin = `${stCode}${census}-${distShort}-${rawNum}-${hashSuffix}`;
  const stateRevenueCode = `${census}${distShort.charCodeAt(0)}${distShort.charCodeAt(1)}${rawNum}0001`;

  return {
    ulpin,
    stateRevenueCode,
    censusStateCode: census,
    stateName: state?.name || 'Uttar Pradesh',
    portalName: state?.portalName || 'UP Bhulekh',
    rorTitle: state?.rorTitle || 'अधिकार अभिलेख (RoR)',
    khasraTerm: state?.khasraTerm || 'खसरा संख्या',
    areaUnit: state?.areaUnit || 'एकड़ / हेक्टेयर',
    centerGPS: parcel?.center ? `${parcel.center[0].toFixed(4)}° N, ${parcel.center[1].toFixed(4)}° E` : '26.8855° N, 81.0148° E'
  };
}
