const mongoose = require('mongoose');
const Event = require('../models/EventModel');
const UserProfile = require('../models/UserProfileModel');
const Notification = require('../models/NotificationModel');
const { isValidObjectId } = mongoose;

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
  if (eventDay < today) {
    return false;
  }
  const diffTime = Math.abs(eventDay - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 3;
};

const notifyEventAssignment = async (req, res) => {
  const { eventId } = req.body;

  if (!isValidObjectId(eventId)) {
    return res.status(400).json({ message: 'Invalid event ID format' });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const volunteers = await UserProfile.find({ assignedEvents: eventId });
    for (const volunteer of volunteers) {
      const message = `You have been assigned to the event: ${event.eventName} on ${event.date}`;
      await sendNotification(volunteer.userId, message, 'assignment');
    }
    res.status(200).json({ message: 'Assignment notification sent' });
  } catch (error) {
    console.error('Error sending assignment notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const notifyEventUpdate = async (req, res) => {
  const { eventId } = req.params;

  if (!isValidObjectId(eventId)) {
    return res.status(400).json({ message: 'Invalid event ID format' });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const volunteers = await UserProfile.find({ assignedEvents: eventId });
    for (const volunteer of volunteers) {
      const message = `Update: The event ${event.eventName} scheduled on ${event.date} has been cancelled`;
      await sendNotification(volunteer.userId, message, 'update');
    }
    res.status(200).json({ message: 'Update notifications sent for cancelled event' });
  } catch (error) {
    console.error('Error sending update notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const notifyEventReminder = async (req, res) => {
  const { volunteerId } = req.params;

  try {
    const volunteer = await UserProfile.findOne({ userId: volunteerId });
    if (!volunteer) {
      return res.status(404).json({ message: `Volunteer not found: ${volunteerId}` });
    }
    const reminder = [];
    for (const eventId of volunteer.assignedEvents) {
      const event = await Event.findById(eventId);
      if (event && isEventInNextThreeDays(event.date)) {
        const existingReminder = await Notification.findOne({
          volunteerId,
          type: 'reminder',
          message: { $regex: event.eventName },
        });
        if (!existingReminder) {
          const message = `Reminder: The event ${event.eventName} is happening on ${event.date}`;
          await sendNotification(volunteerId, message, 'reminder');
          reminder.push({ eventId: event._id, message });
        }
      }
    }
    res.status(200).json({ message: 'Event reminder notification sent', reminder });
  } catch (error) {
    console.error('Error sending reminder notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const removeNotification = async (req, res) => {
  const { notiId } = req.params;

  if (!isValidObjectId(notiId)) {
    return res.status(400).json({ message: 'Invalid notification ID format' });
  }

  try {
    const result = await Notification.findByIdAndDelete(notiId);
    if (!result) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification deleted successfully' });
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

const getNotificationsForUser = async (req, res) => {
  const { volunteerId } = req.params;
  try {
    const userNotifications = await Notification.find({ volunteerId });
    res.json(userNotifications);
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  notifyEventAssignment,
  notifyEventUpdate,
  notifyEventReminder,
  getNotifications,
  getNotificationsForUser,
  removeNotification,
};
