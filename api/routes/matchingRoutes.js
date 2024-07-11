const express = require('express');
const {getMatchedEvents, getMatchedVolunteers} = require('../controllers/matchingController');

const router = express.Router();

router.get('/:volunteerId', getMatchedEvents);
router.get('/:eventId',getMatchedVolunteers);

module.exports=router;