const notifications = require('../models/notification');
const volunteers = require('../data/volunteers');
const events = require('../data/events');

const sendNotification = (volunteerId, message, type) => {
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

const notifyEventAssignment = (req,res) =>{
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


const notifyEventUpdate = (req, res) => {
  const {eventId} = req.params;

  const event = events.find(e => e.id.toString() === eventId);
  if(!event){
    return res.status(404).json({message:'Event not found'});
  } 

  event.assignedVolunteers.forEach(volunteerId => {
    const volunteer = volunteers.find(v => v.userId === volunteerId);
    if(volunteer){
      const message = `Update: The event ${event.eventName} scheduled on ${event.date} has been cancelled`;
      sendNotification(volunteer.userId, message, 'update');
    }
  });
  res.status(200).json({message:'Update notifications sent for cancelled event'});
}

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


module.exports = {
  notifyEventAssignment,
  notifyEventUpdate,
  notifyEventReminder,
  getNotifications,
  getNotificationsForUser,
  removeNotification,
};