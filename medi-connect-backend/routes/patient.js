const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getLabResults, getLabResultDetail } = require('../controllers/patientController');

// Get all lab results for a patient (Patient only)
router.get('/:id/lab-results', auth(['patient', 'doctor']), getLabResults);

// Get one lab result detail (Patient only)
router.get('/:id/lab-results/:resultId', auth(['patient', 'doctor']), getLabResultDetail);

module.exports = router;
