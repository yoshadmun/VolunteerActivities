const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    userId: {type: String, required: true, unique: true},
    fullName: {type: String, required: true},
    location:{
        address1: {type: String, required: true},
        city: {type: String, required: true},
        state: {type: String, required: true},
        zipCode: {type: String, required:true}
    },
    skills: {type: [String], required:true},
    availability: {type: String, required:true},
    assignedEvents: {type: [mongoose.Schema.Types.ObjectId], ref:'Event', default:[]},
    completedEvents: {type: [mongoose.Schema.Types.ObjectId],ref:'Event', default:[]},
    active: {type: Boolean, default:true}
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;