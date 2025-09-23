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
    const user = await Information.findOne({ id }); // use Information

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check details
    if (
      user.firstName.toLowerCase() === firstName.toLowerCase() &&
      user.lastName.toLowerCase() === lastName.toLowerCase() &&
      user.dob === dob
    ) {
      return res.json({ message: "User verified", user });
    } else {
      return res.status(400).json({ message: "Incorrect details" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
