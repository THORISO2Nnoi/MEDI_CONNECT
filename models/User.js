const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    role: { type: String, required: true, enum: ["Doctor", "Nurse"] },
    specialization: { type: String },
    qualifications: { type: String },
    experience: { type: String },
    hpcsa: { type: String },
    location: { type: String },
    languages: { type: [String], default: [] },
    profilePic: { type: String },
  },
  {
    timestamps: true,
    collection: "staff",
  }
);

module.exports = mongoose.model("Staff", StaffSchema);
