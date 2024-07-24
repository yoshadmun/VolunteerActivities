const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    volunteerId: {type: String, required: true},
    message: {type: String, required: true},
    type: {type: String, required: true},
    date: {type: Date, default: Date.now},
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;