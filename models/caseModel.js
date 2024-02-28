const mongoose = require('mongoose');

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
    disability: {
        type: String,
    },
    guardianName: {
        type: String,
        required: [true, 'Please add guardian name']
    },
    guardianPhone: {
        type: Number,
        required: [true, 'Please add guardian phone number']
    },
    developmentalMilestone: {
        type: String,
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
    remarks: {
        type: String,
    },
    presentComplaints: {
        type: String,
    },
    
});

module.exports = mongoose.model('Case', caseSchema);