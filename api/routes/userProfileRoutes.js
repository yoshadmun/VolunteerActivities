const express = require('express');
const {createUserProfile} = require('../controllers/userProfileController')
const {profileValidation, validate} = require('../middleware/validation')

const router = express.Router();

router.post('/',profileValidation(),validate,createUserProfile);

module.exports = router;