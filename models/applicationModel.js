const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema({
    status: {
        type: String,
        required: [true, 'Please add status'],
        enum: ['Approved','Rejected','Pending'],
    },
    description: {
        type: String,
        required: true,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Admin'
    },
    ngo: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
        ref: 'NGO'
    },
    volunteer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
        ref: 'Volunteer'
    },
    
    
});

module.exports = mongoose.model('application', applicationSchema);