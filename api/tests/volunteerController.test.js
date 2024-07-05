const request = require('supertest');
const app = require('../server');

describe('Volunteer API', () => {
  it('should get all volunteers', async () => {
    const res = await request(app).get('/api/volunteers');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
