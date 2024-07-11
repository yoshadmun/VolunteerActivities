const express = require('express');
const {createUserProfile, getUserProfile} = require('../controllers/createUserProfileController')
const {profileValidation, validate} = require('../middleware/validation')

const router = express.Router();

router.post('/',profileValidation(),validate,createUserProfile);
router.get('/:userId',getUserProfile);

module.exports = router;