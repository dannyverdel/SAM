const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');

const router = express.Router();

// router.post('/api/signup', async (req, res) => {
//     const { name, email, password } = req.body;
//     try {
//         const existingUser = await User.findOne({ name: name });
//         if (existingUser) {
//             return res.status(422).send('Gebruikersnaam is al in gebruik');
//         }

//         const user = new User({ name, email, password });
//         await user.save();

//         const token = jwt.sign({ userId: user._id, date: new Date() }, process.env.JWT_SECRET);
//         res.send({ token });
//     } catch (err) {
//         return res.status(422).send(err.message);
//     }
// });

router.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).send({ error: 'Gebruikersnaam en wachtwoord zijn verplicht' });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(422).send({ error: 'Ongeldige gebruikersnaam en wachtwoord' });
    }

    try {
        await user.comparePassword(password);
        const token = jwt.sign({ userId: user._id, date: new Date() }, process.env.JWT_SECRET);
        res.send({ token });
    } catch (err) {
        return res.status(422).send({ error: 'Ongeldige gebruikersnaam en wachtwoord' });
    }
});

module.exports = router;