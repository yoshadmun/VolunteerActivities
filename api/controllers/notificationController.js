const notifications = require('../models/notification');
const volunteers = require('../data/volunteers');
const events = require('../data/events');

/*exports.sendNotification = (req, res) => {
  const { volunteerId, eventId, message } = req.body;
  const notification = {
    id: notifications.length + 1,
    volunteerId,
    eventId,
    message,
    read: false,
    date: new Date()
  };
  notifications.push(notification);
  console.log('Notification sent:', message);
  res.status(201).json(notification); // Respond with the created notification
};

exports.getNotifications = (req, res) => {
  const volunteerNotifications = notifications.filter(n => n.volunteerId === parseInt(req.params.volunteerId));
  res.json(volunteerNotifications);
};

exports.markAsRead = (req, res) => {
  const notification = notifications.find(n => n.id === parseInt(req.params.id));
  if (notification) {
    notification.read = true;
    res.json({ message: 'Notification marked as read' });
  } else {
    res.status(404).json({ error: 'Notification not found' });
  }
};*/

const sendNotification = (volunteerId, message, type) => {
  const volunteer = volunteers.find(v=>v.id === volunteerId);
  if(volunteer){
    const notification = {volunteerId, message, type, date: new Date()};
    notifications.push(notification);
    console.log(`Notification sent to ${volunteer.fullName}: ${message}`);
  } else{
    console.log(`Volunteer with ID ${volunteerId} not found`);
  }
};

const notifyEventAssignment = (req,res) =>{
  const {eventId} = req.params;
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

const notifyEventUpdate = (req,res) => {
  const {eventId} = req.params;
  const event = events.find(e=>e.id === eventId);
  if(event){
    event.assignedVolunteers.forEach(volunteerId => {
      const message = `The event ${event.eventName} has been updated. The new date is ${event.date}`;
      sendNotification(volunteerId, message, 'update');
    });
    res.status(200).json({message:'Event update notification sent'}); 
  } else{
    res.status(404).json({message:'Event not found'});
  }
};

const notifyEventReminder = (req,res) => {
  const {eventId} = req.params;
  const event = events.find(e=>e.id === eventId);
  if(event){
    event.assignedVolunteers.forEach(volunteerId => {
      const message = `Reminder: The event ${event.eventName} is happening on ${event.date}`;
      sendNotification(volunteerId, message, 'reminder');
    });
    res.status(200).json({message: 'Reminder notification sent'});
  } else{
    res.status(404).json({message:'Event not found'});
  }
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
};