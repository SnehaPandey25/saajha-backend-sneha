const mongoose = require('mongoose')

const volunteerSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true,'Please add an email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
    },
    dob: {
        type: Date,
        required:[true, 'Please add your date of birth'],
    },

},
{
    timestamps: true,
})

module.exports = mongoose.model('Volunteer',volunteerSchema)