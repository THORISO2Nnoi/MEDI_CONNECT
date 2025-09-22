const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Information = require("../models/Information");

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id || !/^\d{13}$/.test(id)) return res.status(400).json({ message: "Invalid ID format" });

    const user = await Information.findOne({ id });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign(
      { id: user.id, firstName: user.firstName, lastName: user.lastName },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
