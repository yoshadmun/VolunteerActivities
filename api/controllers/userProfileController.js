const volunteers = require('../data/volunteers'); // Assume this is an array of volunteer objects

const createUserProfile = (req,res) => {
    const newVolunteer = {...req.body, id: volunteers.length+1};
    volunteers.push(newVolunteer);
    res.status(201).json(newVolunteer);
  }

module.exports={
    createUserProfile,
}