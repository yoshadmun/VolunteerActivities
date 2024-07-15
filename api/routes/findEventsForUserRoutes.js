const express = require('express');
const { getEventsMatchingSkills, assignVolunteerToEvent } = require('../controllers/findEventsForUser');

const router = express.Router();

router.get('/matching/:volunteerId', getEventsMatchingSkills);
router.post('/assign', assignVolunteerToEvent);

module.exports = router;
