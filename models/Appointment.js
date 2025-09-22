const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
    patientId: { type: String, required: true },
    doctorId: { type: String, required: true },
    nurseId: { type: String },
    dateTime: { type: Date, required: true },
    reason: { type: String, default: '' },
    status: { type: String, default: 'pending' }
  },
  { timestamps: true, collection: 'Appointments' }
);

module.exports = mongoose.model('Appointment', AppointmentSchema);
