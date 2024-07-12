const express = require('express');
const {assignEventToVolunteer} = require('../controllers/assignmentController');

const router = express.Router();

router.post('/',assignEventToVolunteer);

module.exports = router;