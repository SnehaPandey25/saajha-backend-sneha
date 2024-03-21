const mongoose = require('mongoose');

const counsellorSchema = mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
        ref: 'Admin'
    },
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    certification: {
        type: String,
        required: [true, 'Please add your certifications']
    },
    dob: {
        type: Date,
        required:[true, 'Please add your date of birth'],
    },
    specialisation: {
        type: String,
        required: [true, 'Please add your specialisation']
    },
    gender: {
        type: String,
        required: [true, 'Please add your gender']
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
    
});

module.exports = mongoose.model('Counsellor', counsellorSchema);