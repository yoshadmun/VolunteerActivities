// routes/volunteerHistoryRoutes.js

const express = require('express');
const { getVolunteerHistory, addVolunteerHistory, updateVolunteerHistory } = require('../controllers/volunteerHistoryController');

const router = express.Router();

router.get('/:volunteerId', getVolunteerHistory);
router.post('/', addVolunteerHistory); // POST to add new history
router.put('/:id', updateVolunteerHistory); // PUT to update existing history

module.exports = router;

