const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");

// POST /patients/:id/records
router.post("/:id/records", async (req, res) => {
  try {
    const patientId = req.params.id;
    const data = req.body;

    let patient = await Patient.findOne({ patientId });
    if (!patient) {
      patient = new Patient({
        patientId,
        patientName: data.patientName,
        appointments: []
      });
    }

    const appointment = {
      date: data.date,
      diagnosis: data.diagnosis || "",
      treatmentPlan: data.treatmentPlan || "",
      prescriptions: data.prescriptions || "",
      notes: data.notes || ""
    };

    patient.appointments.push(appointment);
    await patient.save();

    res.status(200).json({ message: "Record submitted successfully" });
  } catch (err) {
    console.error("patients route error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
