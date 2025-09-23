const express = require("express");
const router = express.Router();
const Information = require("../models/Information"); // use Information, not User

// POST /patients/validate-id
router.post("/validate-id", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id || !/^\d{13}$/.test(id)) 
      return res.status(400).json({ message: "Invalid ID format" });

    const patient = await Information.findOne({ id });
    if (!patient) 
      return res.status(404).json({ message: "Patient not found" });

    res.json({ message: "Patient validated", patient });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /patients/verify-user
router.post("/verify-user", async (req, res) => {
  try {
    const { id, firstName, lastName, dob } = req.body;
    const user = await Information.findOne({ id });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure fields exist before comparing
    const firstMatches = user.firstName?.toLowerCase() === firstName?.toLowerCase();
    const lastMatches = user.lastName?.toLowerCase() === lastName?.toLowerCase();
    const dobMatches = user.dob === dob;

    if (firstMatches && lastMatches && dobMatches) {
      return res.json({ message: "User verified", user });
    } else {
      return res.status(400).json({ message: "Incorrect details" });
    }
  } catch (err) {
    console.error("Verify-user error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


module.exports = router;
