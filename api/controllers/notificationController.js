const notifications = require('../models/notification');
const volunteers = require('../data/volunteers');
const events = require('../data/events');
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

const isEventInNextThreeDays = (eventDate) => {
  const today = new Date();
  const eventDay = new Date(eventDate);
  if(eventDay < today){
    return false;
  }
  const diffTime = Math.abs(eventDay - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 3;
};

/*const notifyEventAssignment = (req,res) =>{
  const {eventId} = req.body;
  const event = events.find(e => e.id === eventId);
  if(event){
    event.assignedVolunteers.forEach(volunteerId => {
      const message = `You have been assigned to the event: ${event.eventName} on ${event.date}`;
      sendNotification(volunteerId, message, 'assignment');
    });
    res.status(200).json({message:`Assignment notification sent`});
  } else{
    res.status(404).json({message:`Event not found`});
  }
};

const notifyEventUpdate = async (req, res) => {
  const {eventId} = req.params;

  try {

    // Find the event by ID
    const event = await Event.findById(eventId);

    // If the event is not found, return a 404 error
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Find all volunteers assigned to the event
    const volunteers = await UserProfile.find({ assignedEvents: eventId });

    // Send update notifications to assigned volunteers
    for (const volunteer of volunteers) {
      const message = `Update: The event ${event.eventName} scheduled on ${event.date} has been cancelled`;
      sendNotification(volunteer.userId, message, 'update');
    }

    // Respond with a success message
    res.status(200).json({ message: 'Update notifications sent for cancelled event' });
  } catch (e) {
    console.error('Error sending update notification:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const notifyEventReminder = (req, res) => {
  const { volunteerId } = req.params;
  const volunteer = volunteers.find(v => v.userId.toString() === volunteerId);
  if (!volunteer) {
    return res.status(404).json({ message: `Volunteer not found: ${volunteerId}` });
  }

  const reminders = [];
  volunteer.assignedEvents.forEach(eventId => {
    const event = events.find(e => e.id === eventId);
    if (event && isEventInNextThreeDays(event.date)) {
      const existingReminder = notifications.find(n => n.volunteerId === volunteerId && n.type === 'reminder' && n.message.includes(event.eventName));
      if (!existingReminder) {
        const message = `Reminder: The event ${event.eventName} is happening on ${event.date}`;
        sendNotification(volunteerId, message, 'reminder');
        reminders.push({ eventId: event.id, message });
      }
    }
  });

  res.status(200).json({ message: 'Event reminder notification sent', reminders });
};

const removeNotification = (req, res) => {
  const {notiId} = req.params;
  const index = notifications.findIndex(n => n.id.toString() === notiId);

  if(index === -1){
    return res.status(404).json({message:'Notification not found'});
  } 
  notifications.splice(index,1);
  res.status(200).json({message:'Notification deleted successfully'});
};

const getNotifications = (req,res) =>{
  res.json(notifications);
}

const getNotificationsForUser = (req, res) => {
  const { volunteerId } = req.params;
  const userNotifications = notifications.filter(notification => notification.volunteerId === volunteerId);
  res.json(userNotifications);
};
*/

const sendNotification = async (volunteerId, message, type) => {
  try {
    const volunteer = await UserProfile.findOne({ userId: volunteerId });
    if (volunteer) {
      const newNotification = new Notification({
        volunteerId,
        message,
        type,
        date: new Date(),
      });
      await newNotification.save();
      console.log(`Notification sent to ${volunteer.fullName}: ${message}`);
    } else {
      console.log(`Volunteer with ID ${volunteerId} not found`);
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

const isEventInNextThreeDays = (eventDate) => {
  const today = new Date();
  const eventDay = new Date(eventDate);
  console.log(eventDate);
  console.log(today);
  if (eventDay < today) {
    return false;
  }
  const diffTime = Math.abs(eventDay - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 3;
};


const notifyEventAssignment = async (req,res) => {
  const {eventId} = req.body;
  try{
    const event = await Event.findById(eventId);
    console.log(event);
    if(!event){
      res.status(404).json({message:'Event not found'});
    }
    const volunteers = await UserProfile.find({assignedEvents: eventId});
    for (const volunteer of volunteers){
      const message = `You have been assigned to the event: ${event.eventName} on ${event.date}`;
      await sendNotification(volunteer.userId, message, 'assignment');
    }
    res.status(200).json({message:'Assignment notification sent'});
  } catch (e) {
    console.error('Error sending assignment notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const notifyEventUpdate = async (req, res) => {
  const {eventId} = req.params;

  try {

    // Find the event by ID
    const event = await Event.findById(eventId);

    // If the event is not found, return a 404 error
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Find all volunteers assigned to the event
    const volunteers = await UserProfile.find({ assignedEvents: eventId });

    // Send update notifications to assigned volunteers
    for (const volunteer of volunteers) {
      const message = `Update: The event ${event.eventName} scheduled on ${event.date} has been cancelled`;
      sendNotification(volunteer.userId, message, 'update');
    }

    // Respond with a success message
    res.status(200).json({ message: 'Update notifications sent for cancelled event' });
  } catch (e) {
    console.error('Error sending update notification:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const notifyEventReminder = async (req,res) => {
  const {volunteerId} = req.params;
  try{
    const volunteer = await UserProfile.findOne({userId: volunteerId});
    if(!volunteer){
      return res.status(404).json({message:`Volunteer not found: ${volunteerId}`});
    }
    const reminder = [];
    for (const eventId of volunteer.assignedEvents){
      const event = await Event.findById(eventId);
      if (event && isEventInNextThreeDays(event.date)){
        console.log(event);
        const existingReminder = await Notification.findOne({
          volunteerId,
          type: 'reminder',
          message: {$regex: event.eventName},
        });
        if (!existingReminder){
          const message = `Reminder: The event ${event.eventName} is happening on ${event.date}`;
          await sendNotification(volunteerId, message, 'reminder');
          reminder.push({eventId: event._id, message});
        }
      }
    }
    res.status(200).json({message:'Event reminder notification sent', reminder});
  } catch (error) {
    console.error('Error sending reminder notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const removeNotification = async (req,res) => {
  const {notiId} = req.params;
  try {
    const result = await Notification.findByIdAndDelete(notiId);
    if(!result) {
      return res.status(404).json({message:'Notification not found'});
    }
    res.status(200).json({message: 'Notification deleted successully'});
  } catch (error) {
    console.error('Error removing notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getNotificationsForUser = async (req,res) =>{
  const {volunteerId} = req.params;
  try {
    const userNotifications = await Notification.find({ volunteerId });
    res.json(userNotifications);
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


module.exports = {
  notifyEventAssignment,
  notifyEventUpdate,
  notifyEventReminder,
  getNotifications,
  getNotificationsForUser,
  removeNotification,
};