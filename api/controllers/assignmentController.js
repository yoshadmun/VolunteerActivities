const volunteers = require ('../data/volunteers')
const events = require ('../data/events')
const notifications = require('../models/notification')
const Event = require('../models/EventModel');
const UserProfile = require('../models/UserProfileModel');
const Notification = require('../models/NotificationModel');

/*const sendNotification = (volunteerId, message, type) => {
    const volunteer = volunteers.find(v=>v.userId === volunteerId);
    if(volunteer){
      const newId = notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) + 1 : 1;
      const notification = {id: newId, volunteerId, message, type, date: new Date()};
      notifications.push(notification);
      console.log(`Notification sent to ${volunteer.fullName}: ${message}`);
    } else{
      console.log(`Volunteer with ID ${volunteerId} not found`);
    }
};

const assignEventToVolunteer = (req,res) => {
    const {volunteerId, eventId} = req.body;

    const volunteer = volunteers.find(v=>v.userId === volunteerId);
    const event = events.find(e=>e.id === eventId);

    if(!volunteer || !event){
        return res.status(404).json({message: `Volunteer or Event not found ${volunteerId} with ${eventId}`});
    }

    if(!event.assignedVolunteers.includes(volunteer.id)){
        event.assignedVolunteers.push(volunteer.id);
    } else{
        return res.status(400).json({message: 'Volunteer is already assigned to event'});
    }

    if(!volunteer.assignedEvents.includes(event.id)){
        volunteer.assignedEvents.push(event.id);
    } else{
        return res.status(400).json({message: 'Event has been already assigned to volunteer'})
    }
    const message = `You have been assigned to the event: ${event.eventName} on ${event.date}`;
    sendNotification(volunteerId,message,'assignment');

    res.status(200).json({message: 'Event assigned to volunteer successfully'});
};*/

const sendNotification = async (volunteerId, message, type) => {
    const volunteer = await UserProfile.findOne({userId: volunteerId});
    if (!volunteer){
        console.log(`Volunteer with ID ${volunteerId} not found`);
    }
    const newNotification = new Notification({
        volunteerId,
        message,
        type,
    });
    await newNotification.save();
    console.log(`Notification sent to ${volunteer.fullName}: ${message}`);
};

const assignEventToVolunteer = async (req,res) => {
    const {volunteerId, eventId} = req.body;

    try {
        const volunteer = await UserProfile.findOne({userId: volunteerId});
        const event = await Event.findById(eventId);

        if(!volunteer || !event){
            return res.status(404).json({message: 'Volunteer or Event not found'});
        }

        if(!event.assignedVolunteers.includes(volunteer.userId)){
            event.assignedVolunteers.push(volunteer.userId);
        } else {
            return res.status(400).json({message:'Volunteer is already assigned to event'});
        }

        if(!volunteer.assignedEvents.includes(event._id)){
            volunteer.assignedEvents.push(event._id);
        } else {
            return res.status(400).json({message:'Event has been already assigned to event'});
        }

        await event.save();
        await volunteer.save();

        const message = `You have been assigned to the event: ${event.eventName} on ${event.date}`;
        await sendNotification(volunteerId, message, 'assignment');

        res.status(200).json({message: 'Event assigned to volunteer successfully'});
    } catch (e) {
        console.error('Error assigning event to volunteer:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    assignEventToVolunteer,
}