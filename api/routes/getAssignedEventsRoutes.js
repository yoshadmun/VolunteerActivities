const express = require('express');
const { getAssignedEvents } = require('../controllers/getAssignedEvents');

const router = express.Router();

router.get('/:volunteerId', getAssignedEvents);

module.exports = router;