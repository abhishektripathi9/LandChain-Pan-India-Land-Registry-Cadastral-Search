const mongoose = require('mongoose');

const OwnershipRecordSchema = new mongoose.Schema({
  from: { type: String, default: '0x0000000000000000000000000000000000000000' },
  to: { type: String, required: true },
  ownerName: { type: String, required: true },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  txHash: { type: String },
  priceEth: { type: String, default: '0' },
  reason: { type: String, default: 'Initial Land Registration' },
});

const LandSchema = new mongoose.Schema({
  landId: { type: String, required: true, unique: true },
  surveyNo: { type: String, required: true },
  owner: { type: String, required: true },
  ownerAddress: { type: String, required: true },
  location: { type: String, required: true },
  village: { type: String },
  district: { type: String },
  state: { type: String },
  area: { type: String, required: true },
  type: { type: String, enum: ['Residential', 'Agricultural', 'Commercial', 'Industrial'], default: 'Residential' },
  value: { type: String, required: true },
  ipfsDocCID: { type: String, required: true },
  docFileName: { type: String },
  docSHA256: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  registrationTx: { type: String },
  rejectionReason: { type: String, default: '' },
  lastUpdated: { type: String, default: () => new Date().toISOString().split('T')[0] },
  history: [OwnershipRecordSchema],
}, { timestamps: true });

module.exports = mongoose.model('Land', LandSchema);
