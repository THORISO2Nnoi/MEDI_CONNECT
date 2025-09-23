const express = require("express");
const router = express.Router();
const Information = require("../models/Information"); // Your collection

// Validate ID
router.post("/validate-id", async (req, res) => {
  const { id } = req.body;
  if (!id || !/^\d{13}$/.test(id))
    return res.status(400).json({ message: "Enter a valid 13-digit ID" });

  try {
    const user = await Information.findOne({ id });
    if (!user) return res.status(404).json({ message: "ID not found" });
    res.json({ message: "ID validated", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Verify user details
router.post("/verify-user", async (req, res) => {
  const { id, firstName, lastName, dob } = req.body;
  if (!id || !firstName || !lastName || !dob)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const user = await Information.findOne({ id });
    if (!user) return res.status(404).json({ message: "User not found" });

    const firstMatches = user.firstName?.trim().toLowerCase() === firstName.trim().toLowerCase();
    const lastMatches = user.lastName?.trim().toLowerCase() === lastName.trim().toLowerCase();
    const dobMatches = new Date(user.dob).toISOString().split("T")[0] === dob.trim();

    if (firstMatches && lastMatches && dobMatches) {
      res.json({ message: "User verified", user });
    } else {
      res.status(400).json({
        message: "Incorrect details",
        expected: { firstName: user.firstName, lastName: user.lastName, dob: user.dob.toISOString().split("T")[0] },
        received: { firstName, lastName, dob },
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


module.exports = router;
