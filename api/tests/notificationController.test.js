const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {
  notifyEventAssignment,
  notifyEventUpdate,
  notifyEventReminder,
  getNotifications,
  getNotificationsForUser,
  removeNotification,
} = require('../controllers/notificationController');
const Event = require('../models/EventModel');
const UserProfile = require('../models/UserProfileModel');
const Notification = require('../models/NotificationModel');

// Setup Express app
const app = express();
app.use(bodyParser.json());

app.get('/api/notifications', getNotifications);
app.get('/api/notifications/user/:volunteerId', getNotificationsForUser);
app.post('/api/notifications/assignment', notifyEventAssignment);
app.post('/api/notifications/update/:eventId', notifyEventUpdate);
app.post('/api/notifications/reminder/:volunteerId', notifyEventReminder);
app.delete('/api/notifications/delete/:notiId', removeNotification);

describe('Notification Controller', () => {
  it('should send assignment notifications', async () => {
    const event = new Event({
      eventName: 'Test Event',
      eventDescription: 'Test Description',
      location: {
        streetAddress: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
      },
      requiredSkills: ['Skill1'],
      urgency: 'High',
      date: new Date(),
      assignedVolunteers: [],
      active: true,
    });

    await event.save();

    const userProfile = new UserProfile({
      userId: '1',
      fullName: 'John Doe',
      location: {
        address1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
      },
      skills: ['Skill1', 'Skill2'],
      availability: 'Weekends',
      assignedEvents: [event._id],
      completedEvents: [],
      active: true,
    });

    await userProfile.save();

    const response = await request(app)
      .post('/api/notifications/assignment')
      .send({ eventId: event._id });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Assignment notification sent');

    const notifications = await Notification.find();
    expect(notifications.length).toBe(1);
    expect(notifications[0].message).toContain('You have been assigned to the event: Test Event');
  });

  it('should handle invalid event ID format in assignment notifications', async () => {
    const response = await request(app)
      .post('/api/notifications/assignment')
      .send({ eventId: 'invalidId' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid event ID format');
  });

  it('should handle event not found in assignment notifications', async () => {
    const eventId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .post('/api/notifications/assignment')
      .send({ eventId });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Event not found');
  });

  it('should send update notifications', async () => {
    const event = new Event({
      eventName: 'Test Event',
      eventDescription: 'Test Description',
      location: {
        streetAddress: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
      },
      requiredSkills: ['Skill1'],
      urgency: 'High',
      date: new Date(),
      assignedVolunteers: [],
      active: true,
    });

    await event.save();

    const userProfile = new UserProfile({
      userId: '1',
      fullName: 'John Doe',
      location: {
        address1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
      },
      skills: ['Skill1', 'Skill2'],
      availability: 'Weekends',
      assignedEvents: [event._id],
      completedEvents: [],
      active: true,
    });

    await userProfile.save();

    const response = await request(app)
      .post(`/api/notifications/update/${event._id}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Update notifications sent for cancelled event');

    const notifications = await Notification.find();
    expect(notifications.length).toBe(1);
    expect(notifications[0].message).toContain('Update: The event Test Event scheduled on');
  });

  it('should handle invalid event ID format in update notifications', async () => {
    const response = await request(app)
      .post('/api/notifications/update/invalidId')
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid event ID format');
  });

  it('should handle event not found in update notifications', async () => {
    const eventId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .post(`/api/notifications/update/${eventId}`)
      .send();

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Event not found');
  });

  it('should send event reminder notifications', async () => {
    const event = new Event({
      eventName: 'Test Event',
      eventDescription: 'Test Description',
      location: {
        streetAddress: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
      },
      requiredSkills: ['Skill1'],
      urgency: 'High',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      assignedVolunteers: [],
      active: true,
    });

    await event.save();

    const userProfile = new UserProfile({
      userId: '1',
      fullName: 'John Doe',
      location: {
        address1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
      },
      skills: ['Skill1', 'Skill2'],
      availability: 'Weekends',
      assignedEvents: [event._id],
      completedEvents: [],
      active: true,
    });

    await userProfile.save();

    const response = await request(app)
      .post(`/api/notifications/reminder/${userProfile.userId}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Event reminder notification sent');

    const notifications = await Notification.find();
    expect(notifications.length).toBe(1);
    expect(notifications[0].message).toContain('Reminder: The event Test Event is happening on');
  });

  it('should handle volunteer not found in reminder notifications', async () => {
    const response = await request(app)
      .post('/api/notifications/reminder/1')
      .send();

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Volunteer not found: 1');
  });

  it('should fetch all notifications', async () => {
    const notification = new Notification({
      volunteerId: '1',
      message: 'Test notification',
      type: 'assignment',
      date: new Date(),
    });

    await notification.save();

    const response = await request(app)
      .get('/api/notifications')
      .send();

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].message).toBe('Test notification');
  });

  it('should fetch notifications for a specific user', async () => {
    const notification = new Notification({
      volunteerId: '1',
      message: 'Test notification',
      type: 'assignment',
      date: new Date(),
    });

    await notification.save();

    const response = await request(app)
      .get('/api/notifications/user/1')
      .send();

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].message).toBe('Test notification');
  });

  it('should remove a notification', async () => {
    const notification = new Notification({
      volunteerId: '1',
      message: 'Test notification',
      type: 'assignment',
      date: new Date(),
    });

    await notification.save();

    const response = await request(app)
      .delete(`/api/notifications/delete/${notification._id}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Notification deleted successfully');

    const notifications = await Notification.find();
    expect(notifications.length).toBe(0);
  });

  it('should handle invalid notification ID format in remove notification', async () => {
    const response = await request(app)
      .delete('/api/notifications/delete/invalidId')
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid notification ID format');
  });

  it('should handle notification not found in remove notification', async () => {
    const notiId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .delete(`/api/notifications/delete/${notiId}`)
      .send();

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Notification not found');
  });
});
