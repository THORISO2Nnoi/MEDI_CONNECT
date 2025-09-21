const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');

// GET all doctors
router.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await Staff.find(
      { role: "Doctor" },
      'fullName specialization qualifications experience hpcsa location languages profilePic'
    );
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
