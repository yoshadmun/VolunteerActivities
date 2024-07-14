// routes/volunteerHistoryRoutes.js

const express = require('express');
const { getVolunteerHistory} = require('../controllers/volunteerHistoryController');

const router = express.Router();

router.get('/user/:volunteerId', getVolunteerHistory);


module.exports = router;

