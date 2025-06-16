// backend/routes/users.js
const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const router  = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'changeThis';

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username||!email||!password)
    return res.status(400).json({ error: 'All fields required' });
  if (await User.findOne({ $or:[{email},{username}] }))
    return res.status(400).json({ error: 'Username or email taken' });

  const user = new User({ username, email });
  user.password = password;
  await user.save();
  res.status(201).json({ message: 'User registered' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.checkPassword(password)))
    return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  res.json({
    token,
    user: { _id: user._id, username: user.username, role: user.role }
  });
});

module.exports = router;
