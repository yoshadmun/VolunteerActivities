const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {
  getEvents,
  createEvent,
  getAssignedEvents,
  getEventById,
  completeEvent,
  getCompletedEvents,
  removeEvent,
  getMatchedEvents,
  cancelEvent
} = require('../controllers/eventController');
const Event = require('../models/EventModel');
const UserProfile = require('../models/UserProfileModel');

// Setup Express app
const app = express();
app.use(bodyParser.json());

app.get('/api/events', getEvents);
app.post('/api/events', createEvent);
app.get('/api/events/getevents/:volunteerId', getAssignedEvents);
app.get('/api/events/geteventbyid/:eventId', getEventById);
app.post('/api/events/complete', completeEvent);
app.get('/api/events/getcompletedevents/:volunteerId', getCompletedEvents);
app.put('/api/events/remove/:eventId/active', removeEvent);
app.get('/api/events/getmatchedevents', getMatchedEvents);  // Update this route
app.post('/api/events/cancelevent', cancelEvent);

describe('Event Controller', () => {
  it('should fetch events with pagination and search', async () => {
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

    const response = await request(app).get('/api/events?search=Test&page=1&pageSize=10');

    expect(response.status).toBe(200);
    expect(response.body.events.length).toBe(1);
    expect(response.body.events[0].eventName).toBe('Test Event');
    expect(response.body.total).toBe(1);
  });

  it('should create a new event', async () => {
    const newEvent = {
      eventName: 'New Event',
      eventDescription: 'New Event Description',
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
    };

    const response = await request(app)
      .post('/api/events')
      .send(newEvent);

    expect(response.status).toBe(201);
    expect(response.body.eventName).toBe('New Event');
  });

  it('should get assigned events for a volunteer', async () => {
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
      .get(`/api/events/getevents/${userProfile.userId}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].toString()).toBe(event._id.toString());
  });

  it('should return 404 if volunteer not found when getting assigned events', async () => {
    const response = await request(app)
      .get('/api/events/getevents/2')
      .send();

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Volunteer not found');
  });

  it('should get completed events for a volunteer', async () => {
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
      assignedEvents: [],
      completedEvents: [event._id],
      active: true,
    });

    await userProfile.save();

    const response = await request(app)
      .get(`/api/events/getcompletedevents/${userProfile.userId}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].toString()).toBe(event._id.toString());
  });

  it('should return 404 if volunteer not found when getting completed events', async () => {
    const response = await request(app)
      .get('/api/events/getcompletedevents/1')
      .send();

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Volunteer not found');
  });

  it('should get event by ID', async () => {
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

    const response = await request(app)
      .get(`/api/events/geteventbyid/${event._id}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.eventName).toBe('Test Event');
  });

  it('should return 404 if event not found by ID', async () => {
    const eventId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .get(`/api/events/geteventbyid/${eventId}`)
      .send();

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Event not found');
  });

  it('should mark event as completed for a volunteer', async () => {
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
      .post('/api/events/complete')
      .send({ userId: userProfile.userId, eventId: event._id });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Event marked as completed');
    expect(response.body.assignedEvents.length).toBe(0);
    expect(response.body.completedEvents.length).toBe(1);
    expect(response.body.completedEvents[0].toString()).toBe(event._id.toString());
  });

  it('should return 404 if volunteer not found when marking event as completed', async () => {
    const eventId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .post('/api/events/complete')
      .send({ userId: '1', eventId });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Volunteer not found');
  });

  it('should return 400 if event not found in assigned events when marking as completed', async () => {
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
      assignedEvents: [],
      completedEvents: [],
      active: true,
    });

    await userProfile.save();

    const response = await request(app)
      .post('/api/events/complete')
      .send({ userId: userProfile.userId, eventId: event._id });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Event not found in assigned events');
  });

  it('should remove an event and update user profiles', async () => {
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
      .put(`/api/events/remove/${event._id}/active`)
      .send({ active: false });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Event status updated');
    expect(response.body.event.active).toBe(false);

    const updatedUserProfile = await UserProfile.findOne({ userId: '1' });
    expect(updatedUserProfile.assignedEvents.length).toBe(0);
  });

  it('should return 404 if event not found when removing', async () => {
    const eventId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .put(`/api/events/remove/${eventId}/active`)
      .send({ active: false });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Event not found');
  });

  it('should get matched events for a volunteer', async () => {
    const volunteer = new UserProfile({
      userId: 'volunteer1',
      fullName: 'Test Volunteer',
      location: {
        address1: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
      },
      skills: ['Organizing'],
      availability: new Date(),
      assignedEvents: [],
      completedEvents: [],
      active: true,
    });
    await volunteer.save();

    const event = new Event({
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
      date: new Date(new Date().setDate(new Date().getDate() + 1)), // Set date to tomorrow
      assignedVolunteers: [],
      active: true,
    });
    await event.save();

    const response = await request(app).get(`/api/events/getmatchedevents`);
    expect(response.status).toBe(200);
    expect(response.body.events.length).toBe(1); // Access the events array from the response body
    expect(response.body.events[0].eventName).toBe('Community Cleanup Drive');
  });

  it('should cancel event for a volunteer', async () => {
    const volunteer = new UserProfile({
      userId: 'volunteer1',
      fullName: 'Test Volunteer',
      location: {
        address1: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
      },
      skills: ['Organizing'],
      availability: new Date(),
      assignedEvents: [],
      completedEvents: [],
      active: true,
    });
    await volunteer.save();

    const event = new Event({
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
      date: new Date(new Date().setDate(new Date().getDate() + 1)), // Set date to tomorrow
      assignedVolunteers: [volunteer.userId],
      active: true,
    });
    await event.save();

    volunteer.assignedEvents.push(event._id);
    await volunteer.save();

    const response = await request(app)
      .post('/api/events/cancelevent')
      .send({ userId: volunteer.userId, eventId: event._id.toString() });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Cancel event for user successfully, ');
    const updatedVolunteer = await UserProfile.findById(volunteer._id);
    const updatedEvent = await Event.findById(event._id);
    expect(updatedVolunteer.assignedEvents.length).toBe(0);
    expect(updatedEvent.assignedVolunteers.length).toBe(0);
  });
});
