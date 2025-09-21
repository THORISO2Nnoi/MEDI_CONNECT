require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const axios = require('axios'); // only once

const User = require('./models/User');
const Appointment = require('./models/Appointment');

const authenticateToken = require('./middleware/auth');

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Ensure uploads folder exists ---
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

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
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ DB Error:', err));

// --- Helpers ---
const is13Digits = (s) => /^\d{13}$/.test(s);
const parseDob = (dobStr) => {
  const d = new Date(dobStr);
  if (Number.isNaN(d.getTime())) return null;
  return new Date(d.toISOString().substring(0, 10));
};

// --- Routes ---
const patientRoutes = require("./routes/patients");
app.use("/patients", patientRoutes);

const appointmentRoutes = require('./routes/appointments');
app.use('/api/appointments', appointmentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// --- Doctors Route (JWT protected) ---
app.get('/api/doctors', authenticateToken, async (req, res) => {
  try {
    const response = await axios.get('https://medi-staff.onrender.com/api/staff');
    const staff = response.data;

    const doctors = staff.filter(member => member.role === 'Doctor');

    const formattedDoctors = doctors.map(doc => ({
      fullName: doc.fullName,
      specialization: doc.specialization || [],
      qualifications: doc.qualifications || [],
      experience: doc.experience || "",
      hpcsa: doc.hpcsa || "",
      location: doc.location || "",
      languages: doc.languages || [],
      profilePic: doc.profilePic || ""
    }));

    res.json(formattedDoctors);
  } catch (err) {
    console.error('Error fetching doctors from Medi Staff:', err.message);
    res.status(500).json({ message: 'Failed to fetch doctors', error: err.message });
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
