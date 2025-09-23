const express = require("express");
const router = express.Router();
const Information = require("../models/Information"); // Use Information collection

// POST /patients/validate-id
router.post("/validate-id", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id || !/^\d{13}$/.test(id))
      return res.status(400).json({ message: "Invalid ID format" });

    const patient = await Information.findOne({ id });
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    res.json({ message: "Patient validated", patient });
  } catch (err) {
    console.error("Validate ID error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /patients/verify-user
router.post("/verify-user", async (req, res) => {
  try {
    const { id, firstName, lastName, dob } = req.body;

    const user = await Information.findOne({ id });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Debug log
    console.log("DB values:", {
      firstName: user.firstName,
      lastName: user.lastName,
      dob: user.dob,
    });
    console.log("Request values:", { firstName, lastName, dob });

    // Safe comparison for possibly null or undefined values
    const firstMatches = (user.firstName || "").trim().toLowerCase() === (firstName || "").trim().toLowerCase();
    const lastMatches  = (user.lastName  || "").trim().toLowerCase() === (lastName  || "").trim().toLowerCase();
    const dobMatches   = (user.dob       || "").trim() === (dob       || "").trim();

    if (firstMatches && lastMatches && dobMatches) {
      return res.json({ message: "User verified", user });
    } else {
      return res.status(400).json({ 
        message: "Incorrect details", 
        expected: { firstName: user.firstName, lastName: user.lastName, dob: user.dob },
        received: { firstName, lastName, dob }
      });
    }
  } catch (err) {
    console.error("Verify user error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
