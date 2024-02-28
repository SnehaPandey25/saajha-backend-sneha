const mongoose = require('mongoose');

const ngoSchema = mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
        ref: 'Admin'
    },
    name: {
        type: String,
        required:[true,'Please add all fields'],
    },
    location: {
        type: String,
        required:[true,'Please add all fields'],
    },
    image: {
        type: String,
    },
    employeeCount: {
        type: Number,
    },
    services: {
        type: String,
        required:[true,'Please add all fields'],
    },
    website: {
        type: String,
    },
    phoneNo: {
        type: Number,
        required:[true,'Please add all fields'],
    },
    emailNGO: {
        type: String,
    },
    
});

module.exports = mongoose.model('NGO', ngoSchema);