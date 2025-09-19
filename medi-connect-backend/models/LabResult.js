const mongoose = require('mongoose');

const labResultSchema = new mongoose.Schema({
    patientId: { type: String, required: true },
    testName: { type: String, required: true },
    status: { type: String, required: true, enum: ['Pending', 'In Process', 'Completed', 'Abnormal'] },
    result: { type: String, default: 'N/A' },
    reference: { type: String },
    date: { type: String },
    doctorNotes: { type: String, default: '' }
});

module.exports = mongoose.model('LabResult', labResultSchema);
