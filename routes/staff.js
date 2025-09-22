const express = require("express");
const router = express.Router();
const Staff = require("../models/User");
const authenticateToken = require("../middleware/auth");

// GET /api/staff/doctors
router.get("/doctors", authenticateToken, async (req, res) => {
  try {
    const doctors = await Staff.find({ role: "Doctor" });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch doctors", error: err.message });
  }
});

// GET /api/staff/nurses
router.get("/nurses", authenticateToken, async (req, res) => {
  try {
    const nurses = await Staff.find({ role: "Nurse" });
    res.json(nurses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch nurses", error: err.message });
  }
});

module.exports = router;
