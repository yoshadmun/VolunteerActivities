const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { getVolunteers, removeVolunteer } = require('../controllers/volunteerController');
const UserProfile = require('../models/UserProfileModel');
const Event = require('../models/EventModel');

const app = express();
app.use(bodyParser.json());
app.get('/api/volunteers', getVolunteers);
app.put('/api/volunteers/remove/:volunteerId/active', removeVolunteer);

describe('Volunteer API', () => {
  let volunteer, event;

  beforeEach(async () => {
    volunteer = new UserProfile({
      userId: '30',
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
  });

  afterEach(async () => {
    await UserProfile.deleteMany({});
    await Event.deleteMany({});
  });

  it('should get all volunteers', async () => {
    const res = await request(app).get('/api/volunteers');
    expect(res.statusCode).toEqual(200);
    expect(res.body.volunteers).toBeDefined();
    expect(res.body.total).toBeDefined();
  });

  it('should remove a volunteer and update assigned events', async () => {
    const res = await request(app)
      .put(`/api/volunteers/remove/${volunteer.userId}/active`)
      .send({ active: false });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Volunteer status updated');
  });
});
