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
      name: 'Sample Event',
      description: 'This is a sample event',
      location: {
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipcode: '12345'
      },
      requirements: ['Leadership', 'Communication'],
      urgency: 'High',
      date: '2023-12-25'
    };
    const res = await request(app)
      .post('/api/events')
      .send(newEvent);
    if (res.statusCode !== 201) {
      console.error('Response body:', res.body);
    }
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should fail to create event with invalid data', async () => {
    const newEvent = {
      name: '',
      description: '',
      location: {
        address: '',
        city: '',
        state: '',
        zipcode: '',
      },
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
