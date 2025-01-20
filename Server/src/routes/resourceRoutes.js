const express = require('express');
const mongoose = require('mongoose');
const Resource = mongoose.model('Resource');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.get('/api/resources', requireAuth, async (req, res) => {
    const resources = await Resource.find({ active: true }).sort({ name: 1 });
    res.send(resources);
});

router.get('/api/resources/:id', requireAuth, async (req, res) => {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
        return res.status(404).send('Resource niet gevonden');
    }

    res.send(resource);
})

router.post('/api/resources', requireAuth, async (req, res) => {
    const { name, discipline, type, description } = req.body;

    if (!name || !discipline || !type || !description) {
        return res.status(422).send('Naam, discipline, type en omschrijving zijn verplicht');
    }

    try {
        const resource = new Resource({ name, discipline, type, description });
        await resource.save();
        res.send(resource);
    } catch (err) {
        return res.status(422).send(err.message);
    }
});

router.put('/api/resources/:id', requireAuth, async (req, res) => {
    const { name, discipline, type, description, active } = req.body;

    if (!name || !discipline || !type || !description || active === undefined) {
        return res.status(422).send('Naam, discipline, type, omschrijving en actief zijn verplicht');
    }

    try {
        const resource = await Resource.findByIdAndUpdate(req.params.id, { name, discipline, type, description, active }, { new: true });
        res.send(resource);
    } catch (err) {
        return res.status(422).send(err.message);
    }
});

module.exports = router;