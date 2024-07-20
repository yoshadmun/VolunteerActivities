const express = require('express');

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
