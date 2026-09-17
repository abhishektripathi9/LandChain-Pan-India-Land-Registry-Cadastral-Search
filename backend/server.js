const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/lands', require('./routes/landRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/ipfs', require('./routes/ipfsRoutes'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    project: 'LandChain Land Registry DApp',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 LandChain Backend Server running on port ${PORT}`);
  console.log(`🌐 Health endpoint: http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});
