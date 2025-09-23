const User = require('../models/User');

// Validate ID
const validateId = async (req, res) => {
  const { id } = req.body;
  if (!id || !/^\d{13}$/.test(id)) {
    return res.status(400).json({ message: 'Enter a valid 13-digit ID' });
  }

  try {
    const user = await User.findOne({ id });
    if (!user) return res.status(404).json({ message: 'ID not found' });
    
    res.json({ message: 'ID validated', user });
  } catch (err) {
    console.error("Validate ID error:", err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Add new patient
const addPatient = async (req, res) => {
  let { id, firstName, lastName, dob } = req.body;

  // Ensure all fields are provided and trim strings
  id = id?.trim();
  firstName = firstName?.trim();
  lastName = lastName?.trim();
  dob = dob?.trim();

  if (!id || !firstName || !lastName || !dob) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const existing = await User.findOne({ id });
    if (existing) return res.status(409).json({ message: 'Patient already exists' });

    const user = await User.create({ id, firstName, lastName, dob });
    res.json({ message: 'Patient added', user });
  } catch (err) {
    console.error("Add patient error:", err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { validateId, addPatient };
