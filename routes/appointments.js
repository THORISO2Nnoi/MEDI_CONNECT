const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- Ensure uploads folder exists ---
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// --- Multer setup ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// --------------------
// Routes
// --------------------

// 1️⃣ Create a new appointment
router.post('/', async (req, res) => {
  try {
    const appointment = new Appointment({
      ...req.body,
      status: 'Pending' // default status
    });
    await appointment.save();
    res.status(201).json({ message: 'Appointment created', appointment });
  } catch (err) {
    console.error('create appointment error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 2️⃣ Get all appointments (optionally filtered by doctor/nurse/patient)
router.get('/', async (req, res) => {
  try {
    const { patientId, status } = req.query;
    const filter = {};
    if (patientId) filter.patientId = patientId;
    if (status) filter.status = status;

    const appointments = await Appointment.find(filter).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    console.error('get appointments error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 3️⃣ Update appointment status (Accept / Decline)
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Accepted', 'Declined'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    res.json({ message: `Appointment ${status}`, appointment });
  } catch (err) {
    console.error('update status error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 4️⃣ Reschedule appointment (update date/time)
router.put('/:id/reschedule', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { date, time, status: 'Pending' }, // reset status to Pending after reschedule
      { new: true }
    );

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    res.json({ message: 'Appointment rescheduled', appointment });
  } catch (err) {
    console.error('reschedule error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 5️⃣ Upload document for appointment
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ message: 'File uploaded', url });
  } catch (err) {
    console.error('upload error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
