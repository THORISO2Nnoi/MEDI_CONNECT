const mongoose = require("mongoose");

const InformationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, match: [/^\d{13}$/, "ID must be 13 digits"] },
    firstName: { type: String, required: true, trim: true, set: v => (v || "").trim().toUpperCase() },
    lastName: { type: String, required: true, trim: true, set: v => (v || "").trim().toUpperCase() },
    dob: { type: Date, required: true },
  },
  {
    timestamps: true,
    collection: "INFORMATION",
  }
);

InformationSchema.index({ id: 1 }, { unique: true });

module.exports = mongoose.model("Information", InformationSchema);
