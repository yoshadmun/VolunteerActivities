const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { assignEventToVolunteer } = require('../controllers/assignmentController');
const UserProfile = require('../models/UserProfileModel');
const Event = require('../models/EventModel');

const app = express();
app.use(bodyParser.json());
app.post('/api/assignment', assignEventToVolunteer);

describe('Assignment API', () => {
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

  it('should assign event to volunteer and send notification', async () => {
    const assignmentData = {
      volunteerId: volunteer.userId,
      eventId: event._id.toString(),
    };

    const res = await request(app)
      .post('/api/assignment')
      .send(assignmentData);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Event assigned to volunteer successfully');
  });

  it('should return 404 if volunteer or event not found', async () => {
    const assignmentData = {
      volunteerId: 'nonexistent_volunteer',
      eventId: event._id.toString(),
    };

    const res = await request(app)
      .post('/api/assignment')
      .send(assignmentData);

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toContain('Volunteer or Event not found');

    const invalidAssignmentData = {
      volunteerId: volunteer.userId,
      eventId: 'nonexistent_event',
    };

    const res2 = await request(app)
      .post('/api/assignment')
      .send(invalidAssignmentData);

    expect(res2.statusCode).toEqual(404);
    expect(res2.body.message).toContain('Volunteer or Event not found');
  });

  it('should return 400 if volunteer is already assigned to the event', async () => {
    // First, assign the event to the volunteer
    volunteer.assignedEvents.push(event._id);
    await volunteer.save();
    event.assignedVolunteers.push(volunteer.userId);
    await event.save();

    const assignmentData = {
      volunteerId: volunteer.userId,
      eventId: event._id.toString(),
    };

    const res = await request(app)
      .post('/api/assignment')
      .send(assignmentData);

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Volunteer is already assigned to event');
  });
});
