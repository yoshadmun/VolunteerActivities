const express = require('express');
const {getEvents, createEvent} = require('../controllers/eventController');
const {eventValidation, validate} = require('../middleware/validation');

const router = express.Router();

router.get('/', getEvents);
router.post('/', eventValidation(), validate, createEvent);

module.exports = router;