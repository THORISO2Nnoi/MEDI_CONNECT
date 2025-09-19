const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  date: { type: String, required: true },
  diagnosis: String,
  treatmentPlan: String,
  prescriptions: String,
  notes: String
});

const PatientSchema = new mongoose.Schema({
  patientId: { type: String, required: true, unique: true },
  patientName: { type: String, required: true },
  appointments: [AppointmentSchema]
});

module.exports = mongoose.model("Patient", PatientSchema);
