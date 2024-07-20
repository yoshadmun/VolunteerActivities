const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const {getEventsMatchingSkills, assignVolunteerToEvent} = require('../controllers/findEventsForUser');

const app = express();
app.use(bodyParser.json());

app.get('/api/eventsforuser/matching/:volunteerId', getEventsMatchingSkills);
app.post('/api/eventsforuser/assign', assignVolunteerToEvent);

describe('Find Events For User API', () => {
    it('should get events matching volunteer skills', async () => {
      const res = await request(app).get('/api/eventsforuser/matching/3');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].eventName).toBe('Community Cleanup Drive');
    });
  
    it('should assign volunteer to event', async () => {
      const res = await request(app)
        .post('/api/eventsforuser/assign')
        .send({ volunteerId: '3', eventId: 1 });
  
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe('Volunteer assigned to event successfully');

    });
  
    it('should return 404 if volunteer or event not found', async () => {
      const res = await request(app)
        .post('/api/eventsforuser/assign')
        .send({ volunteerId: '999', eventId: 1 });
  
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toBe('Volunteer or Event not found');
  
      const res2 = await request(app)
        .post('/api/eventsforuser/assign')
        .send({ volunteerId: '1', eventId: 999 });
  
      expect(res2.statusCode).toEqual(404);
      expect(res2.body.message).toBe('Volunteer or Event not found');
    });
  
    it('should return 400 if volunteer is already assigned to the event', async () => {
  
      const res = await request(app)
        .post('/api/eventsforuser/assign')
        .send({ volunteerId: '1', eventId: 1 });
  
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe('Event has been already assigned to volunteer');
    });
  });