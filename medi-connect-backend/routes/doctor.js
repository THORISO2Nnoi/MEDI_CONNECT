const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { updateLabResult } = require('../controllers/doctorController');

// Update lab result (Doctor only)
router.post('/lab-result/:resultId/update', auth(['doctor']), updateLabResult);

module.exports = router;
