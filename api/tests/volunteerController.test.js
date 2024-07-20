const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const {getVolunteers, removeVolunteer} = require('../controllers/volunteerController');

const app = express();
app.use(bodyParser.json());
app.get('/api/volunteers', getVolunteers);
app.put('/api/volunteers/remove/:volunteerId/active', removeVolunteer);

describe('Volunteer API', () => {
  it('should get all volunteers', async () => {
    const res = await request(app).get('/api/volunteers');
    expect(res.statusCode).toEqual(200);
    expect(res.body.volunteers).toBeDefined();
    expect(res.body.total).toBeDefined();
  });

  it('should remove a volunteer and update assigned events', async () => {
    const res = await request(app).put('/api/volunteers/remove/30/active').send({ active: false });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Volunteer status updated');
  });
});
