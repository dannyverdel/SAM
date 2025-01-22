require('dotenv').config();

require('./models/User')
require('./models/Person')
require('./models/Resource')
require('./models/Incident')

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(express.json())

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(require('./routes/authRoutes'));
app.use(require('./routes/personRoutes'));
app.use(require('./routes/resourceRoutes'));
app.use(require('./routes/incidentRoutes'));

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
})

mongoose.connection.on('error', (err) => {
    console.log('Error connecting to MongoDB', err);
});

app.get('/', (req, res) => {
    res.send('IRS SAM API');
});

app.listen(process.env.PORT, () => {
    console.log(`IRS SAM API listening at http://localhost:${process.env.PORT}`);
});

module.exports = app;