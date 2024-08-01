const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventName: {type: String, required: true, maxlength: 100},
    eventDescription: {type: String, required:true},
    location:{
        streetAddress: {type: String, required: true},
        city: {type: String, required: true},
        state: {type: String, require: true},
        zipCode: {type: String, required: true},
    },
    requiredSkills: {type: [String], required: true},
    urgency: {type: String, required: true},
    date: {type: Date, required: true},
    assignedVolunteers: {type: [String], default: []},
    active: {type: Boolean, default: true},
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;