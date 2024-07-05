const request = require('supertest');
const app = require('../server');

describe('Event API', () => {
  it('should get all events', async () => {
    const res = await request(app).get('/api/events');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should create a new event', async () => {
    const newEvent = {
      name: 'Event Test',
      description: 'Test Description',
      location: 'Test Location',
      requirements: ['Leadership'],
      urgency: 'High',
      date: new Date().toISOString(),
    };
    const res = await request(app)
      .post('/api/events')
      .send(newEvent);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should fail to create event with invalid data', async () => {
    const newEvent = {
      name: '',
      description: '',
      location: '',
      requirements: [],
      urgency: '',
      date: '',
    };
    const res = await request(app)
      .post('/api/events')
      .send(newEvent);
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });
});
