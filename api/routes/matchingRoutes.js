const express = require('express');
const {getMatchedEvents, getMatchedVolunteers} = require('../controllers/matchingController');

const router = express.Router();

router.get('/volunteer/:volunteerId', getMatchedEvents);
router.get('/event/:eventId',getMatchedVolunteers);

module.exports=router;