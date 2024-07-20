const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const {getVolunteerHistory} = require('../controllers/volunteerHistoryController');

const app = express();
app.use(bodyParser.json());

app.get('/api/volunteerHistory/user/:volunteerId', getVolunteerHistory);

describe('Volunteer History API', () => {
    it('should return the completed events for a volunteer', async () => {
      const res = await request(app).get('/api/volunteerHistory/user/7');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([
        {
          eventName: 'Food Drive for Homeless Shelter',
          location: {
            streetAddress: '456 Elm Avenue',
            city: 'Smalltown',
            state: 'NY',
            zipCode: '12345'
          },
          date: '2024-08-20',
          status: 'Completed'
        }
      ]);
    });
  
    it('should return 404 if the volunteer is not found', async () => {
      const res = await request(app).get('/api/volunteerHistory/user/100');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ message: 'Volunteer not found' });
    });
  });