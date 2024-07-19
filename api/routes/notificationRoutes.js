const express = require('express');
/*const { getNotifications, markAsRead, sendNotification } = require('../controllers/notificationController');

const router = express.Router();

router.get('/:volunteerId', getNotifications);
router.patch('/:id', markAsRead);
router.post('/', sendNotification); // Add this line for POST requests

module.exports = router;*/

const {
    notifyEventAssignment,
    notifyEventUpdate,
    notifyEventReminder,
    getNotifications,
    getNotificationsForUser,
    removeNotification
} = require('../controllers/notificationController');

const router = express.Router();

router.get('/',getNotifications);
router.get('/user/:volunteerId', getNotificationsForUser);
router.post('/assignment/',notifyEventAssignment);
router.post('/update/:eventId', notifyEventUpdate);
router.post('/reminder/:volunteerId', notifyEventReminder);
router.delete('/delete/:notiId',removeNotification);

module.exports = router;
