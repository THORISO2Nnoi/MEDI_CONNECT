const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // (hash later for security)
  fullName: { type: String, required: true },
  role: { type: String, enum: ["Doctor", "Nurse", "Admin"], required: true },
  specialization: [String],
  qualifications: [String],
  experience: String,
  hpcsa: String,
  location: String,
  languages: [String],
  certificates: [String], // stored as file paths or URLs
  profilePic: String,     // stored as file path or URL
}, { timestamps: true });

module.exports = mongoose.model("Staff", staffSchema);
