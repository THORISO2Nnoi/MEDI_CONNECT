const LabResult = require('../models/LabResult');

exports.getLabResults = async (req, res) => {
    try {
        const results = await LabResult.find({ patientId: req.params.id });
        res.json(results);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.getLabResultDetail = async (req, res) => {
    try {
        const result = await LabResult.findById(req.params.resultId);
        if (!result) return res.status(404).send('Lab result not found');
        res.json(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
};
