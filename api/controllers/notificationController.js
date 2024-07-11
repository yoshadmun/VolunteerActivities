const notifications = require('../models/notification');
const volunteers = require('../data/volunteers');
const events = require('../data/events');

exports.sendNotification = (req, res) => {
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
};
