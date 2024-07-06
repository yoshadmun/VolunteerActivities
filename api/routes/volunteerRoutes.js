const express = require('express');
const {getVolunteers} = require('../controllers/volunteerController');

const router = express.Router();

router.get('/', getVolunteers);

module.exports = router;