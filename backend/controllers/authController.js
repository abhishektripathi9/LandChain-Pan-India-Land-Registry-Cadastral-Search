const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'landchain_super_secret_jwt_key_2024';

exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && user.password === password) {
      const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        success: true,
        token,
        user: { name: user.name, email: user.email, role: user.role, walletAddress: user.walletAddress },
      });
    }
  } catch {}

  // Fallback demo auth
  const token = jwt.sign({ email, role: role || 'user' }, JWT_SECRET, { expiresIn: '7d' });
  return res.json({
    success: true,
    token,
    user: {
      name: email ? email.split('@')[0] : 'User',
      email: email || 'user@landchain.eth',
      role: role || 'user',
      walletAddress: '0x71C836049C240E9A68367F47E82312b98A288bA2',
    },
  });
};

exports.register = async (req, res) => {
  const { name, email, password, role, walletAddress } = req.body;
  try {
    const newUser = await User.create({ name, email, password, role: role || 'user', walletAddress });
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({ success: true, token, user: newUser });
  } catch (err) {
    const token = jwt.sign({ email, role: role || 'user' }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({
      success: true,
      token,
      user: { name, email, role: role || 'user', walletAddress },
    });
  }
};
