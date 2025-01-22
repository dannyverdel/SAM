const express = require('express');
const mongoose = require('mongoose');
const Person = mongoose.model('Person');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.get('/api/persons', requireAuth, async (req, res) => {
    const persons = await Person.find({}).sort({ name: 1 });
    res.send(persons);
});

router.get('/api/persons/:id', requireAuth, async (req, res) => {
    try {
        const person = await Person.findById(req.params.id);

        if (!person) {
            return res.status(404).send('Persoon niet gevonden');
        }

        res.send(person);
    } catch (err) {
        return res.status(404).send('Persoon niet gevonden');
    }
})

router.post('/api/persons', requireAuth, async (req, res) => {
    const { name, position } = req.body;

    if (!name || !position) {
        return res.status(422).send('Naam en functie zijn verplicht');
    }

    try {
        const person = new Person({ name, position });
        await person.save();
        res.send(person);
    } catch (err) {
        return res.status(422).send(err.message);
    }
});

router.put('/api/persons/:id', requireAuth, async (req, res) => {
    const { name, position, active } = req.body;

    if (!name || !position || active === undefined) {
        return res.status(422).send('Naam, functie en actief zijn verplicht');
    }

    try {
        const person = await Person.findByIdAndUpdate(req.params.id, { name, position, active }, { new: true });
        res.send(person);
    } catch (err) {
        return res.status(422).send(err.message);
    }
});

module.exports = router;