const Staff = require("../models/staff");

// CREATE staff
exports.addStaff = async (req, res) => {
  try {
    const { email, password, fullName, role, specialization, qualifications,
            experience, hpcsa, location, languages } = req.body;

    const newStaff = new Staff({
      email,
      password,
      fullName,
      role,
      specialization: specialization ? specialization.split(",") : [],
      qualifications: qualifications ? qualifications.split(",") : [],
      experience,
      hpcsa,
      location,
      languages: languages ? languages.split(",") : [],
      certificates: req.files?.certificates?.map(file => file.path) || [],
      profilePic: req.files?.profilePic ? req.files.profilePic[0].path : null
    });

    await newStaff.save();
    res.status(201).json(newStaff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET all staff
exports.getStaff = async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE staff
exports.updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json(staff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE staff
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json({ message: "Staff deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
