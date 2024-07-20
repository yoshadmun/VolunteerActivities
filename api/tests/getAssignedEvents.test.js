const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const {getAssignedEvents} = require('../controllers/getAssignedEvents');

const app = express();
app.use(bodyParser.json());

app.get('/api/assigned-events/:volunteerId', getAssignedEvents);

describe('Assigned Events API', () => {
    it('should get assigned events for a volunteer', async () => {
      const res = await request(app).get('/api/assigned-events/1');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([1]);
    });
  
    it('should return an empty array if the volunteer has no assigned events', async () => {
      const res = await request(app).get('/api/assigned-events/5');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
    });
  
    it('should return a 404 if the volunteer does not exist', async () => {
      const res = await request(app).get('/api/assigned-events/100');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ message: 'Volunteer not found' });
    });
  });