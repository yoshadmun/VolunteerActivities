const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { getEvents, createEvent, getAssignedEvents, getEventById, completeEvent, getCompletedEventById, getCompletedEvents, removeEvent } = require('../controllers/eventController');

const app = express();
app.use(bodyParser.json());
app.get('/api/events', getEvents);
app.post('/api/events', createEvent);
app.get('/api/events/getevents/:volunteerId', getAssignedEvents);
app.get('/api/events/geteventbyid/:eventId', getEventById);
app.post('/api/events/complete', completeEvent);
app.get('/api/events/getcompletedevents/:volunteerId', getCompletedEvents);
app.delete('/api/events/remove/:eventId/active', removeEvent);


describe('Event Controller', () => {
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
    const res = await request(app).get('/api/events/getevents/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([1]);
  });

  it('should get an event by ID', async () => {
    const res = await request(app).get('/api/events/geteventbyid/4');
    expect(res.statusCode).toEqual(200);
    expect(res.body.eventName).toEqual('Environmental Awareness Campaign');
  });

  it('should mark an event as completed for a volunteer', async () => {
    const res = await request(app).post('/api/events/complete').send({ userId: '1', eventId: 1 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Event marked as completed');
  });

  it('should get completed events for a volunteer', async () => {
    const res = await request(app).get('/api/events/getcompletedevents/2');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([2]);
  });

  it('should remove an event', async () => {
    const res = await request(app).delete('/api/events/remove/1/active').send({ active: false });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Event status updated');
  });
});
