const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { createUserProfile, getUserProfile } = require('../controllers/createUserProfileController');
const UserProfile = require('../models/UserProfileModel');

const app = express();
app.use(bodyParser.json());
app.get('/api/user-profile/:userId', getUserProfile);
app.post('/api/user-profile', createUserProfile);

describe('User Profile API', () => {

  it('should create a new user profile', async () => {
    const newProfile = {
      userId: '31',
      profileData: {
        fullName: 'Thinh Pham',
        location: {
          address1: '19000 Hawaii St',
          city: 'Sugarland',
          state: 'NY',
          zipCode: '54321',
        },
        skills: ['Organizing', 'Teaching'],
        availability: '2024-08-01',
      },
    };
    const res = await request(app).post('/api/user-profile').send(newProfile);
    expect(res.statusCode).toEqual(201);
    expect(res.body.profileData).toHaveProperty('fullName', 'Thinh Pham');
  });

  it('should update an existing user profile', async () => {
    // First, create the profile
    const newProfile = {
      userId: '31',
      profileData: {
        fullName: 'Thinh Pham',
        location: {
          address1: '19000 Hawaii St',
          city: 'Sugarland',
          state: 'NY',
          zipCode: '54321',
        },
        skills: ['Organizing', 'Teaching'],
        availability: '2024-08-01',
      },
    };
    await request(app).post('/api/user-profile').send(newProfile);

    // Then, update the profile
    const updateProfile = {
      userId: '31',
      profileData: {
        fullName: 'John Updated',
        location: {
          address1: '123 Updated St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
        },
        skills: ['Leadership', 'Communication', 'Organizing'],
        availability: '2024-07-21',
      },
    };
    const res = await request(app).post('/api/user-profile').send(updateProfile);
    expect(res.statusCode).toEqual(200);
    expect(res.body.profileData).toHaveProperty('fullName', 'John Updated');
  });

  it('should get user profile by ID', async () => {
    const newProfile = {
      userId: '1',
      profileData: {
        fullName: 'Thinh Pham',
        location: {
          address1: '19000 Hawaii St',
          city: 'Sugarland',
          state: 'NY',
          zipCode: '54321',
        },
        skills: ['Organizing', 'Teaching'],
        availability: '2024-08-01',
      },
    };
    await request(app).post('/api/user-profile').send(newProfile);

    const res = await request(app).get('/api/user-profile/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('userId', '1');
  });

  it('should return 404 if user profile not found', async () => {
    const res = await request(app).get('/api/user-profile/999');
    expect(res.statusCode).toEqual(404);
  });
});
