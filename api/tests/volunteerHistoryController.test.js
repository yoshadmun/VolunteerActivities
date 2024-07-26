const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { getVolunteerHistory } = require('../controllers/volunteerHistoryController');
const UserProfile = require('../models/UserProfileModel');
const Event = require('../models/EventModel');

const app = express();
app.use(bodyParser.json());
app.get('/api/volunteerHistory/user/:volunteerId', getVolunteerHistory);

describe('Volunteer History API', () => {
  beforeEach(async () => {
    const volunteer = new UserProfile({
      userId: '7',
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
      completedEvents: []
    });
    await volunteer.save();

    const event = new Event({
      eventName: 'Food Drive for Homeless Shelter',
      eventDescription: 'Event Description',
      location: {
        streetAddress: '456 Elm Avenue',
        city: 'Smalltown',
        state: 'NY',
        zipCode: '12345'
      },
      requiredSkills: ['Cleaning'],
      urgency: 'High',
      date: '2024-08-20',
      assignedVolunteers: [],
      active: true
    });
    await event.save();

    volunteer.completedEvents.push(event._id);
    await volunteer.save();
  });

  afterEach(async () => {
    await UserProfile.deleteMany({});
    await Event.deleteMany({});
  });

  it('should return the completed events for a volunteer', async () => {
    const res = await request(app).get('/api/volunteerHistory/user/7');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      {
        eventName: 'Food Drive for Homeless Shelter',
        location: {
          streetAddress: '456 Elm Avenue',
          city: 'Smalltown',
          state: 'NY',
          zipCode: '12345'
        },
        date: '2024-08-20T00:00:00.000Z', // Adjust this if necessary
        status: 'Completed'
      }
    ]);
  });

  it('should return 404 if the volunteer is not found', async () => {
    const res = await request(app).get('/api/volunteerHistory/user/100');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: 'Volunteer not found' });
  });
});
