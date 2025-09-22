const express = require('express');
const router = express.Router();
const { getAppointments, addAppointment, updateAppointment, deleteAppointment } = require('../controllers/appointmentController');
const authenticateToken = require('../middleware/auth');

router.get('/:patientId', authenticateToken, getAppointments);
router.post('/', authenticateToken, addAppointment);
router.put('/:id', authenticateToken, updateAppointment);
router.delete('/:id', authenticateToken, deleteAppointment);

module.exports = router;
