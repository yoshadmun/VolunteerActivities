const express = require('express');
const {getVolunteers, removeVolunteer, getVolunteersByEvent} = require('../controllers/volunteerController');

const router = express.Router();

router.get('/', getVolunteers);
router.put('/remove/:volunteerId/active', removeVolunteer);
router.get('/getvolunteers', getVolunteersByEvent);

module.exports = router;