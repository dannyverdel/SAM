const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    discipline: {
        type: String,
        required: true,
        trim: true,
        enum: ['Brandweer', 'Politie', 'Ambulance', 'GHOR', 'Defensie', 'Overig']
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    }
})

mongoose.model('Resource', resourceSchema);