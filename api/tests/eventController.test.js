const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { getEvents, createEvent, getAssignedEvents, getEventById, completeEvent, getCompletedEventById, getCompletedEvents, removeEvent } = require('../controllers/eventController');
const Event = require('../models/EventModel');
const UserProfile = require('../models/UserProfileModel');

const app = express();
app.use(bodyParser.json());
app.get('/api/events', getEvents);
app.post('/api/events', createEvent);
app.get('/api/events/getevents/:volunteerId', getAssignedEvents);
app.get('/api/events/geteventbyid/:eventId', getEventById);
app.post('/api/events/complete', completeEvent);
app.get('/api/events/getcompletedevents/:volunteerId', getCompletedEvents);
app.put('/api/events/remove/:eventId/active', removeEvent);

describe('Event Controller', () => {
  let volunteer;
  let event;

  beforeEach(async () => {
    volunteer = new UserProfile({
      userId: 'volunteer1',
      fullName: 'Test Volunteer',
      location: {
        address1: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
      },
      skills: ['Organizing'],
      availability: '2024-07-21',
      assignedEvents: [],
      completedEvents: [],
      active: true,
    });
    await volunteer.save();

    event = new Event({
      eventName: 'Test Event',
      eventDescription: 'Event Description',
      location: {
        streetAddress: '123 Event St',
        city: 'Event City',
        state: 'EV',
        zipCode: '54321',
      },
      requiredSkills: ['Organizing'],
      urgency: 'High',
      date: new Date(),
      assignedVolunteers: [],
      active: true,
    });
    await event.save();
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  it('should get a list of events', async () => {
    const res = await request(app).get('/api/events');
    expect(res.statusCode).toEqual(200);
    expect(res.body.events).toBeDefined();
    expect(res.body.total).toBeDefined();
  });

  it('should create a new event', async () => {
    const newEvent = {
      eventName: 'New Test Event',
      eventDescription: 'New Description',
      location: {
        streetAddress: '987 Test Cir',
        city: 'New Test City',
        state: 'NT',
        zipCode: '67890',
      },
      requiredSkills: ['skill5'],
      urgency: 'Medium',
      date: '2024-08-01',
    };
    const res = await request(app).post('/api/events').send(newEvent);
    expect(res.statusCode).toEqual(201);
    expect(res.body.eventName).toEqual(newEvent.eventName);
  });

  it('should get assigned events for a volunteer', async () => {
    volunteer.assignedEvents.push(event._id);
    await volunteer.save();

    const res = await request(app).get(`/api/events/getevents/${volunteer.userId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([event._id.toString()]);
  });

  it('should get an event by ID', async () => {
    const res = await request(app).get(`/api/events/geteventbyid/${event._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.eventName).toEqual(event.eventName);
  });

  it('should mark an event as completed for a volunteer', async () => {
    volunteer.assignedEvents.push(event._id);
    await volunteer.save();

    const res = await request(app).post('/api/events/complete').send({ userId: volunteer.userId, eventId: event._id.toString() });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Event marked as completed');
  });

  it('should get completed events for a volunteer', async () => {
    volunteer.completedEvents.push(event._id);
    await volunteer.save();

    const res = await request(app).get(`/api/events/getcompletedevents/${volunteer.userId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([event._id.toString()]);
  });

  it('should remove an event', async () => {
    const res = await request(app).put(`/api/events/remove/${event._id}/active`).send({ active: false });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Event status updated');
  });
});
