// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- DB Connect ---
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME || undefined, // optional; you can also specify in the URI
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ DB Error:', err));

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// --- Helpers ---
const is13Digits = (s) => /^\d{13}$/.test(s);
const parseDob = (dobStr) => {
  // Expect "YYYY-MM-DD"
  const d = new Date(dobStr);
  if (Number.isNaN(d.getTime())) return null;
  // keep only date part
  return new Date(d.toISOString().substring(0, 10));
};

// --- Routes ---

// Validate ID exists in DB
app.post('/api/validate-id', async (req, res) => {
  try {
    const { id } = req.body;

    if (!is13Digits(id)) {
      return res.status(400).json({ message: 'ID must be 13 digits only.' });
    }

    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).json({ message: 'ID not found in system.' });
    }

    res.status(200).json({ message: 'ID verified', user });
  } catch (err) {
    console.error('validate-id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add user (firstName/lastName uppercased & trimmed via schema setters)
app.post('/api/add-user', async (req, res) => {
  try {
    let { id, firstName, lastName, dob } = req.body;

    if (!is13Digits(id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const existing = await User.findOne({ id });
    if (existing) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const dobDate = parseDob(dob);
    if (!dobDate) {
      return res.status(400).json({ message: 'Invalid DOB format. Use YYYY-MM-DD.' });
    }

    const user = new User({ id, firstName, lastName, dob: dobDate });
    await user.save();
    res.status(201).json({ message: 'User added', user });
  } catch (err) {
    console.error('add-user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get ALL users (for Postman testing)
app.get('/api/users', async (req, res) => {
  try {
    const { q } = req.query; // optional filter by name
    const filter = q
      ? {
          $or: [
            { firstName: new RegExp(q.trim(), 'i') },
            { lastName: new RegExp(q.trim(), 'i') },
            { id: new RegExp(q.trim(), 'i') },
          ],
        }
      : {};
    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('get users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get ONE user by 13-digit id
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!is13Digits(id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }
    const user = await User.findOne({ id });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    console.error('get user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user by 13-digit id (firstName/lastName auto-uppercase via schema)
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!is13Digits(id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const update = {};
    if (typeof req.body.firstName === 'string') update.firstName = req.body.firstName;
    if (typeof req.body.lastName === 'string') update.lastName = req.body.lastName;
    if (typeof req.body.dob === 'string') {
      const dobDate = parseDob(req.body.dob);
      if (!dobDate) {
        return res.status(400).json({ message: 'Invalid DOB format. Use YYYY-MM-DD.' });
      }
      update.dob = dobDate;
    }

    const user = await User.findOneAndUpdate({ id }, update, {
      new: true,
      runValidators: true,
    });

    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User updated', user });
  } catch (err) {
    console.error('update user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user by 13-digit id
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!is13Digits(id)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }
    const deleted = await User.findOneAndDelete({ id });
    if (!deleted) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('delete user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Global error handler (last) ---
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Unexpected server error' });
});

// --- Start server ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
