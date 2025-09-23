const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const Information = require("../models/Information"); // patients
const User = require("../models/User"); // staff (doctors/nurses)

// CREATE a new appointment
router.post("/", async (req, res) => {
  try {
    const { patientId, staffId, date, time, type } = req.body;

    if (!patientId || !staffId || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const appointment = new Appointment({
      patientId,
      staffId,
      date,
      time,
      type,
      status: "Pending", // default
    });

    await appointment.save();
    res.status(201).json({ message: "Appointment created", appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET appointments for a specific patient
router.get("/patient/:id", async (req, res) => {
  try {
    const patientId = req.params.id;
    const appointments = await Appointment.find({ patientId }).lean();

    // populate staff info (doctor/nurse name)
    const populatedAppointments = await Promise.all(
      appointments.map(async (appt) => {
        const staff = await User.findById(appt.staffId).lean();
        return {
          _id: appt._id,
          staffName: staff ? `${staff.firstName} ${staff.lastName}` : "Unknown",
          date: appt.date,
          time: appt.time,
          type: appt.type,
          status: appt.status,
        };
      })
    );

    res.json(populatedAppointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// UPDATE appointment status (e.g., Confirmed, Cancelled)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Status updated", appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
