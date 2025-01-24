const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    street: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
})

const attachmentSchema = new mongoose.Schema({
    contentType: {
        type: String,
        required: true
    },
    content: {
        type: Buffer,
        required: true
    }
})

const incidentSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    timeAlerted: {
        type: Date,
        required: true
    },
    timeArrivedAtFireHouse: {
        type: Date,
        required: false // false because it is possible that I as a firefighter am already at the fire station when the alarm goes off or that I go to the location directly from home or work
    },
    timeArrivedAtLocation: {
        type: Date,
        required: true
    },
    timeDepartureFromLocation: {
        type: Date,
        required: true
    },
    location: locationSchema,
    source: {
        type: String,
        required: false
    },
    incidentType: {
        type: String,
        required: true,
        enum: ['Brandgerelateerd - Woningbrand', 'Brandgerelateerd - Voertuigbrand', 'Brandgerelateerd - Natuurbrand', 'Brandgerelateerd - Schoorsteenbrand', 'Brandgerelateerd - Afvalbrand', 'Ongevallen - Verkeersongeval (met slachtoffers)', 'Ongevallen - Treinongeval', 'Ongevallen - Val van hoogte', 'Technische Hulpverlening - Gaslek zonder ontbranding', 'Technische Hulpverlening - Wateroverlast', 'Technische Hulpverlening - Dierenredding', 'Medische Incidenten - Reanimatie', 'Medische Incidenten - CO-vergiftiging', 'Medische Incidenten - Verdrinking', 'Evacuaties - Evacuatie door brand', 'Evacuaties - Explosiegevaar evacuatie', 'Incidenten met gevaarlijke stoffen - Asbestincident', 'Incidenten met gevaarlijke stoffen - Gasexplosie', 'Overig - Stormschade', 'Overig - Oefenincident']
    },
    cause: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    deployedPersonel: [{
        person: {
            ref: 'Person',
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        capacity: {
            type: String,
            required: true
        }
    }],
    deployedResources: [{
        ref: 'Resource',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }],
    result: {
        description: {
            type: String,
            required: true
        },
        wounded: {
            type: Number,
            required: true
        },
        deceased: {
            type: Number,
            required: true
        },
        missing: {
            type: Number,
            required: false
        },
        evacuated: {
            type: Number,
            required: false
        },
        unharmed: {
            type: Number,
            required: false
        },
        success: {
            type: Boolean,
            required: true
        }
    },
    lessonsLearned: [{
        type: String,
        required: true
    }],
    followUpActions: [{
        type: String,
        required: true
    }],
    attachments: [attachmentSchema]
})

mongoose.model('Incident', incidentSchema);