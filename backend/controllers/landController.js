const Land = require('../models/Land');

// In-memory fallback if MongoDB is not active
let memoryLands = [
  {
    landId: 'LND-2024-001',
    id: 'LND-2024-001',
    surveyNo: 'SY-402/1A',
    owner: 'Rajesh Kumar Sharma',
    ownerAddress: '0x71C836049C240E9A68367F47E82312b98A288bA2',
    location: 'Sector 62, Noida, Uttar Pradesh',
    village: 'Mamura',
    district: 'Gautam Buddha Nagar',
    state: 'Uttar Pradesh',
    area: '2.4 acres',
    type: 'Commercial',
    value: '₹1,85,00,000',
    ipfsDocCID: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
    status: 'Approved',
    lastUpdated: '2024-03-12',
    history: [
      {
        from: '0x0000000000000000000000000000000000000000',
        to: '0x71C836049C240E9A68367F47E82312b98A288bA2',
        ownerName: 'Rajesh Kumar Sharma',
        date: '2024-03-12',
        txHash: '0x8f2a...3c91',
        reason: 'Initial Registration',
      }
    ]
  }
];

exports.getAllLands = async (req, res) => {
  try {
    const dbLands = await Land.find().sort({ createdAt: -1 });
    if (dbLands && dbLands.length > 0) {
      return res.json({ success: true, data: dbLands });
    }
  } catch {
    // fallback
  }
  res.json({ success: true, data: memoryLands });
};

exports.getLandById = async (req, res) => {
  const { id } = req.params;
  try {
    const land = await Land.findOne({ landId: id });
    if (land) return res.json({ success: true, data: land });
  } catch {}

  const found = memoryLands.find((l) => l.landId === id || l.id === id);
  if (found) return res.json({ success: true, data: found });

  res.status(404).json({ success: false, message: 'Land parcel not found' });
};

exports.createLand = async (req, res) => {
  const landData = req.body;
  const landId = landData.id || landData.landId || `LND-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  const formatted = {
    ...landData,
    landId,
    id: landId,
    status: landData.status || 'Pending',
    lastUpdated: new Date().toISOString().split('T')[0],
  };

  try {
    const newLand = await Land.create(formatted);
    return res.status(201).json({ success: true, data: newLand });
  } catch (err) {
    memoryLands.unshift(formatted);
    return res.status(201).json({ success: true, data: formatted, notice: 'Saved to memory' });
  }
};

exports.updateLandStatus = async (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body;

  try {
    const updated = await Land.findOneAndUpdate(
      { landId: id },
      { status, rejectionReason: reason || '', lastUpdated: new Date().toISOString().split('T')[0] },
      { new: true }
    );
    if (updated) return res.json({ success: true, data: updated });
  } catch {}

  const idx = memoryLands.findIndex((l) => l.landId === id || l.id === id);
  if (idx !== -1) {
    memoryLands[idx].status = status;
    memoryLands[idx].rejectionReason = reason;
    return res.json({ success: true, data: memoryLands[idx] });
  }

  res.status(404).json({ success: false, message: 'Land not found' });
};

exports.getLandHistory = async (req, res) => {
  const { id } = req.params;
  try {
    const land = await Land.findOne({ landId: id });
    if (land && land.history) return res.json({ success: true, data: land.history });
  } catch {}

  const found = memoryLands.find((l) => l.landId === id || l.id === id);
  return res.json({ success: true, data: found?.history || [] });
};
