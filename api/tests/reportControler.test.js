const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const {
  getVolunteersReport,
  getEventsReport,
  getVolunteersReportCSV,
  getVolunteersReportPDF,
  getEventsReportCSV,
  getEventsReportPDF,
} = require('../controllers/reportController');
const UserProfile = require('../models/UserProfileModel');
const Event = require('../models/EventModel');
const pdf = require('pdf-parse');



// Setup Express app
const app = express();
app.use(bodyParser.json());

app.get('/api/report/volunteers/csv', getVolunteersReportCSV);
app.get('/api/report/volunteers/pdf', getVolunteersReportPDF);
app.get('/api/report/events/csv', getEventsReportCSV);
app.get('/api/report/events/pdf', getEventsReportPDF);

async function extractTextFromPDF(pdfBytes) {
    const data = await pdf(Buffer.from(pdfBytes));
    return data.text;
  }

describe('Report Controller', () => {
    it('should generate volunteers report CSV', async () => {
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
  
      const response = await request(app).get('/api/report/volunteers/csv');
  
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('text/csv; charset=utf-8');
      expect(response.text).toContain('"Name","Skills","Assigned Events","Completed Events"');
      expect(response.text).toContain('"John Doe","Skill1, Skill2","",""');
    });
  
    it('should generate volunteers report PDF', async () => {
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
  
      const response = await request(app).get('/api/report/volunteers/pdf');
  
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('application/pdf');
  
      const text = await extractTextFromPDF(response.body);
  
      expect(text).toContain('Volunteer Report');
      expect(text).toContain('John Doe');
      expect(text).toContain('Skill1, Skill2');
    });
  
    it('should generate events report CSV', async () => {
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
  
      const event = new Event({
        eventName: 'Event 1',
        eventDescription: 'Description for event 1',
        location: {
          streetAddress: '456 Elm St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
        },
        requiredSkills: ['Skill1'],
        urgency: 'High',
        date: new Date(),
        assignedVolunteers: ['1'],
        active: true,
      });
  
      await event.save();
  
      const response = await request(app).get('/api/report/events/csv');
  
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('text/csv; charset=utf-8');
      expect(response.text).toContain('"Event Name","Location","Description","Date","Assigned Volunteers"');
      expect(response.text).toContain('"Event 1"');
      expect(response.text).toContain('"Description for event 1"');
      expect(response.text).toContain('"John Doe"');
    });
  
    it('should generate events report PDF', async () => {
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
  
      const event = new Event({
        eventName: 'Event 1',
        eventDescription: 'Description for event 1',
        location: {
          streetAddress: '456 Elm St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
        },
        requiredSkills: ['Skill1'],
        urgency: 'High',
        date: new Date(),
        assignedVolunteers: ['1'],
        active: true,
      });
  
      await event.save();
  
      const response = await request(app).get('/api/report/events/pdf');
  
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('application/pdf');
  
      const text = await extractTextFromPDF(Buffer.from(response.body));
  
      expect(text).toContain('Event Report');
      expect(text).toContain('Event 1');
      expect(text).toContain('456 Elm St');
      expect(text).toContain('Description for event 1');
      expect(text).toContain('John Doe');
    });
  });
