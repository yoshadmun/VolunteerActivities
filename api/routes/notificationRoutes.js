const express = require('express');
const { getNotifications, markAsRead, sendNotification } = require('../controllers/notificationController');

const router = express.Router();

router.get('/:volunteerId', getNotifications);
router.patch('/:id', markAsRead);
router.post('/', sendNotification); // Add this line for POST requests

module.exports = router;
