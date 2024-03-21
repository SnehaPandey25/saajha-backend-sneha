const mongoose = require('mongoose');

//version 3
const caseSchema = mongoose.Schema({
    counsellor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
        ref: 'Counsellor'
    },
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    gender: {
        type: String,
        required: [true, 'Please add your gender']
    },
    dob: {
        type: Date,
        required:[true, 'Please add your date of birth'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    guardianName: {
        type: String,
        required: [true, 'Please add guardian name']
    },
    guardianPhone: {
        type: Number,
        required: [true, 'Please add guardian phone number']
    },
    previousDiagnosis: {
        type: String,
    },
    currentDiagnosis: {
        type: String,
    },
    clinicalObservation: {
        type: String,
    },
    developmentalHistory: {
        type: String,
    },
    suggestedInvestigationType: {
        type: String,
    },
    diagnosticTest: {
        type: String,
    },
    testResults: {
        type: String,
    },
    report: {
        type: String,
    },
    advice: {
        type: String,
    },
    presentComplaints: {
        type: String,
    },
    SuggestionsForFurtherInvestigation: {
        type: String,
    },
    
});

module.exports = mongoose.model('Case', caseSchema);