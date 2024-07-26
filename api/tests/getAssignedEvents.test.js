const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { getAssignedEvents } = require('../controllers/getAssignedEvents');
const UserProfile = require('../models/UserProfileModel');

const app = express();
app.use(bodyParser.json());

app.get('/api/assigned-events/:volunteerId', getAssignedEvents);

describe('Assigned Events API', () => {
  let volunteerWithEvents;
  let volunteerWithoutEvents;

  beforeEach(async () => {
    volunteerWithEvents = new UserProfile({
      userId: '1',
      fullName: 'Test Volunteer',
      location: {
        address1: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
      },
      skills: ['Organizing'],
      availability: '2024-07-21',
      assignedEvents: [new mongoose.Types.ObjectId()],
      completedEvents: [],
      active: true,
    });
    await volunteerWithEvents.save();

    volunteerWithoutEvents = new UserProfile({
      userId: '5',
      fullName: 'No Event Volunteer',
      location: {
        address1: '456 Test Ave',
        city: 'Testville',
        state: 'TE',
        zipCode: '67890',
      },
      skills: ['Teaching'],
      availability: '2024-07-21',
      assignedEvents: [],
      completedEvents: [],
      active: true,
    });
    await volunteerWithoutEvents.save();
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  it('should get assigned events for a volunteer', async () => {
    const res = await request(app).get('/api/assigned-events/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(volunteerWithEvents.assignedEvents.map(eventId => eventId.toString()));
  });

  it('should return an empty array if the volunteer has no assigned events', async () => {
    const res = await request(app).get('/api/assigned-events/5');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it('should return a 404 if the volunteer does not exist', async () => {
    const res = await request(app).get('/api/assigned-events/100');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: 'Volunteer not found' });
  });
});
