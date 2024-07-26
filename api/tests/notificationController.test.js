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
  removeNotification 
} = require('../controllers/notificationController');
const UserProfile = require('../models/UserProfileModel');
const Event = require('../models/EventModel');
const Notification = require('../models/NotificationModel');

const app = express();
app.use(bodyParser.json());

app.get('/api/notifications', getNotifications);
app.get('/api/notifications/user/:volunteerId', getNotificationsForUser);
app.post('/api/notifications/assignment', notifyEventAssignment);
app.post('/api/notifications/update/:eventId', notifyEventUpdate);
app.post('/api/notifications/reminder/:volunteerId', notifyEventReminder);
app.delete('/api/notifications/delete/:notiId', removeNotification);

describe('Notification API', () => {
  let volunteer, event, notification;

  beforeEach(async () => {
    volunteer = new UserProfile({
      userId: 'auth0|668f110d027281244eb0b4db',
      fullName: 'Test Volunteer',
      location: {
        address1: 'Test Address',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345'
      },
      skills: ['Cleaning', 'Organizing'],
      availability: '2024-07-21',
      assignedEvents: [],
      completedEvents: [],
      active: true
    });
    await volunteer.save();

    event = new Event({
      eventName: 'Test Event',
      eventDescription: 'Event Description',
      location: {
        streetAddress: 'Event Address',
        city: 'Event City',
        state: 'ES',
        zipCode: '54321'
      },
      requiredSkills: ['Cleaning'],
      urgency: 'High',
      date: new Date(),
      assignedVolunteers: [volunteer._id],
      active: true
    });
    await event.save();

    notification = new Notification({
      volunteerId: volunteer.userId,
      message: 'Test Notification',
      type: 'reminder',
      date: new Date()
    });
    await notification.save();
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  it('should get all notifications', async () => {
    const res = await request(app).get('/api/notifications');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get notifications for a user', async () => {
    const res = await request(app).get(`/api/notifications/user/${volunteer.userId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
  });

  it('should send assignment notification', async () => {
    const newEvent = new Event({
      eventName: 'New Test Event',
      eventDescription: 'New Event Description',
      location: {
        streetAddress: 'New Event Address',
        city: 'New Event City',
        state: 'NE',
        zipCode: '54321'
      },
      requiredSkills: ['Cleaning'],
      urgency: 'Medium',
      date: new Date(),
      assignedVolunteers: [volunteer._id],
      active: true
    });
    await newEvent.save();

    const res = await request(app)
      .post('/api/notifications/assignment')
      .send({ eventId: newEvent._id.toString() });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Assignment notification sent');
  });

  it('should handle invalid event ID format in assignment notification', async () => {
    const res = await request(app)
      .post('/api/notifications/assignment')
      .send({ eventId: 'invalid_event_id' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Invalid event ID format');
  });

  it('should handle event not found in assignment notification', async () => {
    const res = await request(app)
      .post('/api/notifications/assignment')
      .send({ eventId: new mongoose.Types.ObjectId().toString() });
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe('Event not found');
  });

  it('should handle no volunteers assigned to an event', async () => {
    const newEvent = new Event({
      eventName: 'New Test Event',
      eventDescription: 'New Event Description',
      location: {
        streetAddress: 'New Event Address',
        city: 'New Event City',
        state: 'NE',
        zipCode: '54321'
      },
      requiredSkills: ['Cleaning'],
      urgency: 'Medium',
      date: new Date(),
      assignedVolunteers: [],
      active: true
    });
    await newEvent.save();

    const res = await request(app)
      .post('/api/notifications/assignment')
      .send({ eventId: newEvent._id.toString() });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Assignment notification sent');
  });

  it('should send update notification', async () => {
    const res = await request(app)
      .post(`/api/notifications/update/${event._id.toString()}`)
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Update notifications sent for cancelled event');
  });

  it('should handle invalid event ID format in update notification', async () => {
    const res = await request(app)
      .post('/api/notifications/update/invalid_event_id')
      .send();
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Invalid event ID format');
  });

  it('should handle event not found in update notification', async () => {
    const res = await request(app)
      .post(`/api/notifications/update/${new mongoose.Types.ObjectId().toString()}`)
      .send();
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe('Event not found');
  });

  it('should send reminder notification', async () => {
    const res = await request(app).post(`/api/notifications/reminder/${volunteer.userId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Event reminder notification sent');
  });

  it('should handle volunteer not found in reminder notification', async () => {
    const res = await request(app).post('/api/notifications/reminder/invalid_volunteer_id');
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe('Volunteer not found: invalid_volunteer_id');
  });

  it('should handle no events assigned to volunteer in reminder notification', async () => {
    volunteer.assignedEvents = [];
    await volunteer.save();

    const res = await request(app).post(`/api/notifications/reminder/${volunteer.userId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Event reminder notification sent');
    expect(res.body.reminder.length).toBe(0);
  });

  it('should delete a notification', async () => {
    const res = await request(app).delete(`/api/notifications/delete/${notification._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Notification deleted successfully');
  });

  it('should handle invalid notification ID format when deleting', async () => {
    const res = await request(app).delete('/api/notifications/delete/invalid_noti_id');
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Invalid notification ID format');
  });

  it('should return 404 when deleting a non-existing notification', async () => {
    const res = await request(app).delete(`/api/notifications/delete/${new mongoose.Types.ObjectId().toString()}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe('Notification not found');
  });



  it('should handle no notifications for a user', async () => {
    const res = await request(app).get(`/api/notifications/user/${new mongoose.Types.ObjectId()}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(0);
  });
});
