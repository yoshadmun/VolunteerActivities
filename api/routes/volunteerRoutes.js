const express = require('express');
const {getVolunteers, removeVolunteer} = require('../controllers/volunteerController');

const router = express.Router();

router.get('/', getVolunteers);
router.put('/remove/:volunteerId/active', removeVolunteer);

module.exports = router;