require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const User = require('./models/User');
const Appointment = require('./models/Appointment');

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Ensure uploads folder exists ---
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// --- Multer storage ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// --- Serve uploaded files statically ---
app.use('/uploads', express.static(uploadsDir));

// --- DB Connect ---
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ DB Error:', err));

// --- Helpers ---
const is13Digits = (s) => /^\d{13}$/.test(s);
const parseDob = (dobStr) => {
  const d = new Date(dobStr);
  if (Number.isNaN(d.getTime())) return null;
  return new Date(d.toISOString().substring(0, 10));
};

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// --- Appointment Routes ---
const appointmentRoutes = require('./routes/appointments');
app.use('/api/appointments', appointmentRoutes);

// --- User Routes ---

// Validate ID exists
app.post('/api/validate-id', async (req, res) => {
  try {
    const { id } = req.body;
    if (!is13Digits(id)) return res.status(400).json({ message: 'ID must be 13 digits only.' });

    const user = await User.findOne({ id });
    if (!user) return res.status(404).json({ message: 'ID not found in system.' });

    res.status(200).json({ message: 'ID verified', user });
  } catch (err) {
    console.error('validate-id error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Verify user details
app.post('/api/verify-user', async (req, res) => {
  try {
    const { id, firstName, lastName, dob } = req.body;

    if (!is13Digits(id)) return res.status(400).json({ message: 'Invalid ID format.' });

    const user = await User.findOne({ id });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const dobDate = parseDob(dob);
    if (!dobDate) return res.status(400).json({ message: 'Invalid DOB format.' });

    if (
      user.firstName.toUpperCase() !== firstName.toUpperCase() ||
      user.lastName.toUpperCase() !== lastName.toUpperCase() ||
      user.dob.toISOString().substring(0, 10) !== dobDate.toISOString().substring(0, 10)
    ) {
      return res.status(400).json({ message: 'Incorrect details provided.' });
    }

    res.json({ message: 'Details verified', user });
  } catch (err) {
    console.error('verify-user error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add user
app.post('/api/add-user', async (req, res) => {
  try {
    const { id, firstName, lastName, dob } = req.body;

    if (!is13Digits(id)) return res.status(400).json({ message: 'Invalid ID format.' });

    const existing = await User.findOne({ id });
    if (existing) return res.status(400).json({ message: 'User already exists.' });

    const dobDate = parseDob(dob);
    if (!dobDate) return res.status(400).json({ message: 'Invalid DOB format. Use YYYY-MM-DD.' });

    const user = new User({ id, firstName, lastName, dob: dobDate });
    await user.save();

    res.status(201).json({ message: 'User added', user });
  } catch (err) {
    console.error('add-user error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const { q } = req.query;
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
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get one user
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!is13Digits(id)) return res.status(400).json({ message: 'Invalid ID format.' });

    const user = await User.findOne({ id });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.json(user);
  } catch (err) {
    console.error('get user error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!is13Digits(id)) return res.status(400).json({ message: 'Invalid ID format.' });

    const update = {};
    if (req.body.firstName) update.firstName = req.body.firstName;
    if (req.body.lastName) update.lastName = req.body.lastName;
    if (req.body.dob) {
      const dobDate = parseDob(req.body.dob);
      if (!dobDate) return res.status(400).json({ message: 'Invalid DOB format. Use YYYY-MM-DD.' });
      update.dob = dobDate;
    }

    const user = await User.findOneAndUpdate({ id }, update, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.json({ message: 'User updated', user });
  } catch (err) {
    console.error('update user error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!is13Digits(id)) return res.status(400).json({ message: 'Invalid ID format.' });

    const deleted = await User.findOneAndDelete({ id });
    if (!deleted) return res.status(404).json({ message: 'User not found.' });

    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('delete user error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Unexpected server error', error: err.message });
});

// --- Start server ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
