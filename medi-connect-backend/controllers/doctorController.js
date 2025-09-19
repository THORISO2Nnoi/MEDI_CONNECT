const LabResult = require('../models/LabResult');

exports.updateLabResult = async (req, res) => {
    try {
        const { status, result, doctorNotes } = req.body;
        const updated = await LabResult.findByIdAndUpdate(req.params.resultId, {
            status, result, doctorNotes
        }, { new: true });
        if (!updated) return res.status(404).send('Lab result not found');
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
};
