const express = require("express");
const router = express.Router();
const Information = require("../models/Information");

// POST /patients/validate-id
router.post("/validate-id", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id || !/^\d{13}$/.test(id)) return res.status(400).json({ message: "Invalid ID format" });

    const patient = await Information.findOne({ id });
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    res.json({ message: "Patient validated", patient });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
