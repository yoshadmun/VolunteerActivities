const express = require('express');
const { getEvents, 
        createEvent, 
        getAssignedEvents, 
        getEventById,
        completeEvent,
        getCompletedEvents,
        removeEvent} = require('../controllers/eventController');
const {eventValidation, validate} = require('../middleware/validation');

const router = express.Router();

router.get('/', getEvents);
router.post('/', eventValidation(), validate, createEvent);
router.get('/getevents/:volunteerId', getAssignedEvents);
router.get('/geteventbyid/:eventId', getEventById);
router.post('/complete', completeEvent);
router.get('/getcompletedevents/:volunteerId', getCompletedEvents);
router.put('/remove/:eventId/active', removeEvent);

module.exports = router;