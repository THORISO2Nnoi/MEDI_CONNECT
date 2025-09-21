const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  staffId: String,
  fullName: String,
  role: String,
  workEmail: String,
  personalEmail: String,
  password: String,
  specialization: [String],
  qualifications: [String],
  languages: [String],
  experience: String,
  hpcsa: String,
  location: String,
  profilePic: String,
  certificates: [String],
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
