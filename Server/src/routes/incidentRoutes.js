const express = require('express');
const mongoose = require('mongoose');
const Incident = mongoose.model('Incident');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.get('/api/incidents', requireAuth, async (req, res) => {
    const incidents = await Incident.find({}, 'date location incidentType description').sort({ date: -1 });
    res.send(incidents);
});

router.get('/api/incidents/:id', requireAuth, async (req, res) => {
    const incident = await Incident.findById(req.params.id).populate('deployedPersonel.person', "name").populate('deployedResources', "name");

    if (!incident) {
        return res.status(404).send('Incident niet gevonden');
    }

    res.send(incident);
})

router.post('/api/incidents', requireAuth, async (req, res) => {
    try {
        const incident = new Incident(req.body);
        await incident.save();
        res.send(incident);
    } catch (err) {
        return res.status(422).send(err.message);
    }
});

router.put('/api/incidents/:id', requireAuth, async (req, res) => {
    try {
        const incident = await Incident.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(incident);
    } catch (err) {
        return res.status(422).send(err.message);
    }
})

router.delete('/api/incidents/:id', requireAuth, async (req, res) => {
    try {
        const incident = await Incident.findByIdAndDelete(req.params.id);
        res.send(incident);
    } catch (err) {
        return res.status(422).send(err.message);
    }
})

module.exports = router;