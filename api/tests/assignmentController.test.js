const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const {assignEventToVolunteer} = require('../controllers/assignmentController');

const app = express();
app.use(bodyParser.json());
app.post('/api/assignment', assignEventToVolunteer);

describe('Assignment API', () => {
    it('should assign event to volunteer and send notification', async () => {
      const assignmentData = {
        volunteerId: 3,
        eventId: 1,
      };
  
      const res = await request(app)
        .post('/api/assignment')
        .send(assignmentData);
  
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe('Event assigned to volunteer successfully');
    });
  
    it('should return 404 if volunteer or event not found', async () => {
      const assignmentData = {
        volunteerId: 999,
        eventId: 1,
      };
  
      const res = await request(app)
        .post('/api/assignment')
        .send(assignmentData);
  
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toContain('Volunteer or Event not found');
  
      const invalidAssignmentData = {
        volunteerId: 1,
        eventId: 999,
      };
  
      const res2 = await request(app)
        .post('/api/assignment')
        .send(invalidAssignmentData);
  
      expect(res2.statusCode).toEqual(404);
      expect(res2.body.message).toContain('Volunteer or Event not found');
    });
  
    it('should return 400 if volunteer is already assigned to the event', async () => {
      const assignmentData = {
        volunteerId: 1,
        eventId: 1,
      };
  
      const res = await request(app)
        .post('/api/assignment')
        .send(assignmentData);
  
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe('Event has been already assigned to volunteer');
    });
  });