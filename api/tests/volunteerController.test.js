const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { getVolunteers, removeVolunteer, getVolunteersByEvent } = require('../controllers/volunteerController');
const UserProfile = require('../models/UserProfileModel');
const Event = require('../models/EventModel');

// Setup Express app
const app = express();
app.use(bodyParser.json());

app.get('/api/volunteers', getVolunteers);
app.put('/api/volunteers/:volunteerId', removeVolunteer);
app.get('/api/volunteers/event', getVolunteersByEvent);

describe('Volunteer Controller', () => {
  it('should fetch volunteers with pagination and search', async () => {
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
      assignedEvents: [],
      completedEvents: [],
      active: true,
    });

    await userProfile.save();

    const response = await request(app).get('/api/volunteers?search=John&page=1&pageSize=10');

    expect(response.status).toBe(200);
    expect(response.body.volunteers.length).toBe(1);
    expect(response.body.volunteers[0].fullName).toBe('John Doe');
    expect(response.body.total).toBe(1);
  });

  it('should handle errors when fetching volunteers', async () => {
    jest.spyOn(UserProfile, 'find').mockImplementationOnce(() => {
      throw new Error('Database error');
    });

    const response = await request(app).get('/api/volunteers');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal server error');
  });

  it('should remove a volunteer and update events', async () => {
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
      assignedEvents: [],
      completedEvents: [],
      active: true,
    });

    await userProfile.save();

    const response = await request(app)
      .put('/api/volunteers/1')
      .send({ active: false });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Volunteer status updated');
    expect(response.body.volunteer.active).toBe(false);
  });

  it('should return 404 if volunteer not found', async () => {
    const response = await request(app)
      .put('/api/volunteers/1')
      .send({ active: false });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Volunteer not found');
  });

  it('should fetch volunteers by event ID', async () => {
    const eventId = new mongoose.Types.ObjectId();
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
      assignedEvents: [eventId],
      completedEvents: [],
      active: true,
    });

    await userProfile.save();

    const response = await request(app).get(`/api/volunteers/event?eventId=${eventId}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].fullName).toBe('John Doe');
  });

  it('should return 400 if event ID is missing', async () => {
    const response = await request(app).get('/api/volunteers/event');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Event ID is required');
  });

  it('should return 404 if no volunteers found for event', async () => {
    const eventId = new mongoose.Types.ObjectId();

    const response = await request(app).get(`/api/volunteers/event?eventId=${eventId}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No volunteers found for this event');
  });

  it('should handle errors when fetching volunteers by event', async () => {
    jest.spyOn(UserProfile, 'find').mockImplementationOnce(() => {
      throw new Error('Database error');
    });

    const eventId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/api/volunteers/event?eventId=${eventId}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal server error');
  });
});
