const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  fullName: { type: String, required: true },
  patientId: { type: String, required: true },
  contactType: { type: String, enum: ['Phone', 'Email'], required: true },
  contactDetail: { type: String, required: true },
  reason: { type: String, required: true },
  consultationType: { type: String, enum: ['In-person', 'Telehealth'], required: true },
  documentUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
