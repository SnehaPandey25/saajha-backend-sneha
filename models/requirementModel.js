const mongoose = require('mongoose');

const requirementSchema = mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
        ref: 'Admin'
    },
    requirements: {
        type: String,
        required:[true,'Please add requirements'],
    },
    
});

module.exports = mongoose.model('Requirement', requirementSchema);