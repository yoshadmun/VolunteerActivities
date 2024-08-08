const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { getEventsMatchingSkills, assignVolunteerToEvent } = require('../controllers/findEventsForUser');
const Event = require('../models/EventModel');
const UserProfile = require('../models/UserProfileModel');

const app = express();
app.use(bodyParser.json());

app.get('/api/eventsforuser/matching/:volunteerId', getEventsMatchingSkills);
app.post('/api/eventsforuser/assign', assignVolunteerToEvent);

describe('Find Events For User API', () => {
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
      eventName: 'Community Cleanup Drive',
      eventDescription: 'Help clean up the community',
      location: {
        streetAddress: '456 Event St',
        city: 'Event City',
        state: 'EV',
        zipCode: '67890',
      },
      requiredSkills: ['Organizing'],
      urgency: 'High',
      date: new Date('2024-08-10'),
      assignedVolunteers: [],
      active: true,
    });
    await event.save();
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  it('should get events matching volunteer skills', async () => {
    const res = await request(app).get(`/api/eventsforuser/matching/${volunteer.userId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].eventName).toBe('Community Cleanup Drive');
  });

  it('should assign volunteer to event', async () => {
    const res = await request(app)
      .post('/api/eventsforuser/assign')
      .send({ volunteerId: volunteer.userId, eventId: event._id.toString() });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Volunteer assigned to event successfully');
  });

  it('should return 404 if volunteer or event not found', async () => {
    const res = await request(app)
      .post('/api/eventsforuser/assign')
      .send({ volunteerId: 'nonexistent_volunteer', eventId: event._id.toString() });

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe('Event or Volunteer not found');

    const res2 = await request(app)
      .post('/api/eventsforuser/assign')
      .send({ volunteerId: volunteer.userId, eventId: 'nonexistent_event' });

    expect(res2.statusCode).toEqual(404);
    expect(res2.body.message).toBe('Event or Volunteer not found');
  });

  it('should return 400 if volunteer is already assigned to the event', async () => {
    volunteer.assignedEvents.push(event._id);
    event.assignedVolunteers.push(volunteer.userId);
    await volunteer.save();
    await event.save();

    const res = await request(app)
      .post('/api/eventsforuser/assign')
      .send({ volunteerId: volunteer.userId, eventId: event._id.toString() });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Volunteer is already assigned to event');
  });
});
