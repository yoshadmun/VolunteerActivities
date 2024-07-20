const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const {
    notifyEventAssignment,
    notifyEventUpdate,
    notifyEventReminder,
    getNotifications,
    getNotificationsForUser,
    removeNotification
} = require('../controllers/notificationController');
const notifications = require('../models/notification');
const volunteers = require('../data/volunteers');
const events = require('../data/events');

const app = express();
app.use(bodyParser.json());

app.get('/api/notifications', getNotifications);
app.get('/api/notifications/user/:volunteerId', getNotificationsForUser);
app.post('/api/notifications/assignment/', notifyEventAssignment);
app.post('/api/notifications/update/:eventId', notifyEventUpdate);
app.post('/api/notifications/reminder/:volunteerId', notifyEventReminder);
app.delete('/api/notifications/delete/:notiId', removeNotification);

describe('Notification API', () => {
    it('should get all notifications', async () => {
        const res = await request(app).get('/api/notifications');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(notifications);
    });

    it('should get notifications for a user', async () => {
        const res = await request(app).get('/api/notifications/user/10');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(3);
    });

    it('should send assignment notification', async () => {
        const res = await request(app)
            .post('/api/notifications/assignment')
            .send({ eventId: 1 });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Assignment notification sent');
    });

    it('should handle event not found in assignment notification', async () => {
        const res = await request(app)
            .post('/api/notifications/assignment')
            .send({ eventId: 999 });
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toBe('Event not found');
    });

    it('should send update notification', async () => {
        const res = await request(app)
            .post('/api/notifications/update/1')
            .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Update notifications sent for cancelled event');
    });

    it('should handle event not found in update notification', async () => {
        const res = await request(app)
            .post('/api/notifications/update/999')
            .send();
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toBe('Event not found');
    });

    it('should send reminder notification', async () => {
        const res = await request(app).post('/api/notifications/reminder/10');
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Event reminder notification sent');
    });

    it('should handle volunteer not found in reminder notification', async () => {
        const res = await request(app).post('/api/notifications/reminder/999');
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toBe('Volunteer not found: 999');
    });

    it('should delete a notification', async () => {
        const res = await request(app).delete('/api/notifications/delete/1');
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Notification deleted successfully');
    });

    it('should return 404 when deleting a non-existing notification', async () => {
        const res = await request(app).delete('/api/notifications/delete/999');
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toBe('Notification not found');
    });
});
